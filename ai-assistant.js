(function () {
  'use strict';

  // ==================== Configuration ====================
  // 纯静态模式下直接使用本地知识库，无需API调用
  const IS_STATIC_MODE = !window.API_BASE_URL;
  const AI_API_URL = IS_STATIC_MODE ? null : (window.API_BASE_URL + '/ai/chat');
  const CHAT_API_URL = IS_STATIC_MODE ? null : (window.API_BASE_URL + '/chat');

  let currentSessionId = null;

  function getDeviceId() {
    var id = localStorage.getItem('yikao_device_id');
    if (!id) {
      id = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('yikao_device_id', id);
    }
    return id;
  }

  function getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // ==================== Module Definitions ====================
  const MODULE_KEYWORDS = {
    '健康评估': ['体质评估', '体质测评', '九种体质', '雷达图', '体质分数', '平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特禀质'],
    'AI舌诊': ['舌诊', '舌象', '舌苔', '舌色', '拍照分析'],
    '急救指南': ['急救', '急救方案', '突发', '应急'],
    '健康养生': ['轻养生', '养生库', '冲刺计划', '养生水', '养生操'],
    '饮食指南': ['饮食原则', '食疗', '忌口', '宜吃', '食堂搭配'],
    '穴位按摩': ['穴位', '按摩', '按压', '三阴交', '足三里', '合谷'],
    '情绪疗愈': ['情绪疗愈', '冥想', '呼吸调节', '情绪管理', '正念'],
    '个人中心': ['个人中心', '打卡记录', '测评报告', '我的']
  };

  const MODULE_PROMPTS = {
    '首页': '你是"医靠"健康助手的AI顾问，专门为脆皮大学生提供中医健康建议。你的角色是友好、专业的大学生健康伙伴。请用轻松易懂的语言回答问题，适当使用emoji。当用户描述具体症状时，给出实用的建议，但严重情况要提醒就医。',
    '健康评估': '你是"医靠"的中医体质评估专家。你精通中医九种体质（平和质、气虚质、阳虚质、阴虚质、痰湿质、湿热质、血瘀质、气郁质、特禀质）的判定和调理。请根据用户的问题，提供专业的体质分析和调理建议。用大学生能理解的语言解释中医概念。',
    'AI舌诊': '你是"医靠"的AI舌诊分析专家。你精通中医舌诊理论，能通过舌色、舌苔、舌形等特征分析健康状况。请用专业但易懂的语言解释舌诊相关概念，给出针对性的调理建议。提醒用户：AI舌诊仅供参考，如有不适请就医。',
    '急救指南': '你是"医靠"的急救顾问，专门处理大学生常见的突发健康问题（如胃痛、头痛、失眠、痛经、中暑、低血糖等）。请给出实用、安全的急救建议，步骤清晰。重要提醒：严重情况必须立即就医，不要自行处理。',
    '健康养生': '你是"医靠"的养生专家，专注于适合大学生的轻养生方案。你了解考前冲刺养生、养生茶饮、宿舍养生操等。请给出切实可行、低成本、适合学生群体的养生建议。',
    '饮食指南': '你是"医靠"的饮食营养师，擅长根据不同中医体质提供饮食建议。你了解大学生食堂饮食的局限性，能给出平价、易得的饮食搭配方案。请根据用户体质推荐宜吃和忌口的食物。',
    '穴位按摩': '你是"医靠"的穴位按摩专家。你精通常用穴位的定位和按摩手法，能根据症状推荐对应的穴位。请详细说明穴位位置、按摩手法、时间和频率。提醒：穴位按摩为辅助调理，严重不适请就医。',
    '情绪疗愈': '你是"医靠"的情绪疗愈顾问，一位温暖、理解大学生的心理咨询伙伴。你擅长情绪管理、正念冥想、呼吸调节等技巧。请用共情的语言回应，给出实用的情绪调节方法。如果用户情绪持续低落，温柔地建议寻求专业帮助。',
    '个人中心': '你是"医靠"的健康管理助手，帮助用户查看和解读健康记录、体质报告、打卡数据等。请用鼓励的语气帮助用户坚持健康管理，解读他们的健康数据。'
  };

  const QUICK_QUESTIONS = {
    '首页': ['你能帮我做什么？', '大学生常见健康问题', '如何改善睡眠？'],
    '健康评估': ['什么是九种体质？', '总是怕冷是什么体质？', '气虚怎么调理？'],
    'AI舌诊': ['舌诊怎么看？', '舌苔厚白什么原因？', '舌边有齿痕怎么办？'],
    '急救指南': ['突然胃痛怎么办？', '失眠怎么快速入睡？', '痛经怎么缓解？'],
    '健康养生': ['考前怎么养生？', '有什么养生茶推荐？', '宿舍能做什么运动？'],
    '饮食指南': ['阳虚体质吃什么好？', '食堂怎么搭配最健康？', '湿热体质忌口什么？'],
    '穴位按摩': ['头痛按什么穴位？', '三阴交在哪里？', '失眠按什么穴位？'],
    '情绪疗愈': ['怎么缓解考前焦虑？', '冥想怎么做？', '心情低落怎么办？'],
    '个人中心': ['我的体质怎么调理？', '如何坚持健康打卡？', '测评结果怎么看？']
  };

  const WELCOME_MESSAGES = {
    '首页': '你好！我是医靠AI助手 🌿 你的大学生健康伙伴～有什么健康问题都可以问我哦！',
    '健康评估': '你好！我是体质评估专家 🔍 想了解你的中医体质类型吗？随时问我！',
    'AI舌诊': '你好！我是舌诊分析专家 👅 对舌象有疑问？我来帮你解读！',
    '急救指南': '你好！我是急救顾问 🏥 遇到突发不适？告诉我症状，我来帮你！',
    '健康养生': '你好！我是养生专家 🍵 想要轻松养生？我有适合大学生的方案！',
    '饮食指南': '你好！我是饮食营养师 🥗 想知道吃什么更健康？问我吧！',
    '穴位按摩': '你好！我是穴位按摩专家 💆 哪里不舒服？我来告诉你按哪个穴位！',
    '情绪疗愈': '你好！我是情绪疗愈伙伴 🌈 心情不好？我来陪你聊聊～',
    '个人中心': '你好！我是健康管理助手 📊 想了解你的健康数据？我来帮你解读！'
  };

  // ==================== State ====================
  let isOpen = false;
  let isDragging = false;
  let hasMoved = false;
  let currentModule = '首页';
  let chatHistory = [];
  let isStreaming = false;

  // ==================== DOM References ====================
  let btn, panel, messagesArea, inputEl, sendBtn, closeBtn, moduleLabel, quickArea;

  // ==================== Inject CSS ====================
  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'yikao-ai-styles';
    style.textContent = `
/* ===== Medicine Box Button ===== */
.yikao-ai-btn {
  position: fixed;
  z-index: 999999;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  bottom: 30px;
  right: 30px;
  transition: transform 0.2s ease, filter 0.2s ease;
}
.yikao-ai-btn:active { cursor: grabbing; }
.yikao-ai-btn.dragging { transition: none; }

.yikao-ai-btn-handle {
  width: 24px;
  height: 7px;
  background: linear-gradient(180deg, #d63031, #b71c1c);
  border-radius: 4px 4px 0 0;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
}

.yikao-ai-btn-body {
  width: 60px;
  height: 50px;
  background: linear-gradient(145deg, #ff6b6b, #e74c3c);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.35), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2);
  position: relative;
  margin-top: -1px;
}

.yikao-ai-btn-cross {
  position: relative;
  width: 20px;
  height: 20px;
}
.yikao-ai-btn-cross-h,
.yikao-ai-btn-cross-v {
  position: absolute;
  background: rgba(255,255,255,0.95);
  border-radius: 2px;
}
.yikao-ai-btn-cross-h {
  width: 20px;
  height: 6px;
  top: 7px;
  left: 0;
}
.yikao-ai-btn-cross-v {
  width: 6px;
  height: 20px;
  top: 0;
  left: 7px;
}

/* Pulse */
@keyframes yikao-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}
.yikao-ai-btn:not(.dragging):not(.open) .yikao-ai-btn-body {
  animation: yikao-pulse 2.5s ease-in-out infinite;
}
.yikao-ai-btn:hover .yikao-ai-btn-body {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.45), 0 3px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2);
}

/* Tooltip */
.yikao-ai-btn-tip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: rgba(0,0,0,0.75);
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.yikao-ai-btn:hover .yikao-ai-btn-tip {
  opacity: 1;
}

/* ===== Chat Panel ===== */
.yikao-ai-panel {
  position: fixed;
  z-index: 999998;
  width: 380px;
  height: 530px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.85) translateY(15px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.yikao-ai-panel.show {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}

/* Header */
.yikao-ai-header {
  background: linear-gradient(135deg, #ff6b6b, #e74c3c);
  color: #fff;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.yikao-ai-header-icon {
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.yikao-ai-header-info { flex: 1; min-width: 0; }
.yikao-ai-header-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
}
.yikao-ai-header-sub {
  font-size: 11px;
  opacity: 0.8;
  line-height: 1.3;
}
.yikao-ai-header-actions { display: flex; gap: 6px; }
.yikao-ai-header-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}
.yikao-ai-header-btn:hover { background: rgba(255,255,255,0.35); }

/* Messages */
.yikao-ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8f9fa;
}
.yikao-ai-messages::-webkit-scrollbar { width: 5px; }
.yikao-ai-messages::-webkit-scrollbar-track { background: transparent; }
.yikao-ai-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }

.yikao-ai-msg {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.yikao-ai-msg-ai {
  align-self: flex-start;
  background: #fff;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.yikao-ai-msg-user {
  align-self: flex-end;
  background: linear-gradient(135deg, #ff6b6b, #e74c3c);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.yikao-ai-msg-ai strong { color: #e74c3c; }
.yikao-ai-msg-ai code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
}
.yikao-ai-msg-ai ul, .yikao-ai-msg-ai ol {
  margin: 4px 0;
  padding-left: 18px;
}
.yikao-ai-msg-ai li { margin: 2px 0; }

/* Typing Indicator */
.yikao-ai-typing {
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  align-self: flex-start;
  background: #fff;
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.yikao-ai-typing span {
  width: 7px;
  height: 7px;
  background: #bbb;
  border-radius: 50%;
  animation: yikao-bounce 1.2s infinite;
}
.yikao-ai-typing span:nth-child(2) { animation-delay: 0.2s; }
.yikao-ai-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes yikao-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Quick Questions */
.yikao-ai-quick {
  padding: 8px 16px 6px;
  flex-shrink: 0;
}
.yikao-ai-quick-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 6px;
}
.yikao-ai-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.yikao-ai-chip {
  padding: 5px 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.yikao-ai-chip:hover {
  border-color: #e74c3c;
  color: #e74c3c;
  background: #fff5f5;
}

/* Input Area */
.yikao-ai-input-area {
  padding: 10px 16px 14px;
  display: flex;
  gap: 8px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.yikao-ai-input {
  flex: 1;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  background: #fafafa;
}
.yikao-ai-input:focus {
  border-color: #e74c3c;
  background: #fff;
}
.yikao-ai-input:disabled {
  opacity: 0.5;
}
.yikao-ai-send {
  width: 38px;
  height: 38px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #e74c3c);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}
.yikao-ai-send:hover {
  transform: scale(1.08);
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
}
.yikao-ai-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Error message */
.yikao-ai-error {
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  padding: 8px;
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .yikao-ai-panel {
    width: calc(100vw - 20px);
    height: calc(100vh - 80px);
    border-radius: 12px;
  }
  .yikao-ai-btn-tip { display: none; }
}
    `;
    document.head.appendChild(style);
  }

  // ==================== Create DOM ====================
  function createDOM() {
    // Medicine Box Button
    btn = document.createElement('div');
    btn.className = 'yikao-ai-btn';
    btn.innerHTML = `
      <div class="yikao-ai-btn-tip">医靠AI助手</div>
      <div class="yikao-ai-btn-handle"></div>
      <div class="yikao-ai-btn-body">
        <div class="yikao-ai-btn-cross">
          <span class="yikao-ai-btn-cross-h"></span>
          <span class="yikao-ai-btn-cross-v"></span>
        </div>
      </div>
    `;

    // Chat Panel
    panel = document.createElement('div');
    panel.className = 'yikao-ai-panel';
    panel.innerHTML = `
      <div class="yikao-ai-header">
        <div class="yikao-ai-header-icon">🩺</div>
        <div class="yikao-ai-header-info">
          <div class="yikao-ai-header-title">医靠AI助手</div>
          <div class="yikao-ai-header-sub" id="yikaoAiModule">当前：首页</div>
        </div>
        <div class="yikao-ai-header-actions">
          <button class="yikao-ai-header-btn" id="yikaoAiClear" title="清空对话">↻</button>
          <button class="yikao-ai-header-btn" id="yikaoAiClose" title="关闭">✕</button>
        </div>
      </div>
      <div class="yikao-ai-messages" id="yikaoAiMessages"></div>
      <div class="yikao-ai-quick" id="yikaoAiQuick" style="display:none">
        <div class="yikao-ai-quick-label">快捷提问</div>
        <div class="yikao-ai-chips" id="yikaoAiChips"></div>
      </div>
      <div class="yikao-ai-input-area">
        <input type="text" class="yikao-ai-input" id="yikaoAiInput" placeholder="问问医靠AI..." autocomplete="off" />
        <button class="yikao-ai-send" id="yikaoAiSend">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    // Cache references
    messagesArea = document.getElementById('yikaoAiMessages');
    inputEl = document.getElementById('yikaoAiInput');
    sendBtn = document.getElementById('yikaoAiSend');
    closeBtn = document.getElementById('yikaoAiClose');
    moduleLabel = document.getElementById('yikaoAiModule');
    quickArea = document.getElementById('yikaoAiQuick');

    // Event listeners
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePanel(false);
    });

    document.getElementById('yikaoAiClear').addEventListener('click', function (e) {
      e.stopPropagation();
      clearChat();
    });

    sendBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      sendMessage();
    });

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    inputEl.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  // ==================== Position ====================
  function initPosition() {
    var rect = btn.getBoundingClientRect();
    btn.style.left = rect.left + 'px';
    btn.style.top = rect.top + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
  }

  function updatePanelPosition() {
    var btnRect = btn.getBoundingClientRect();
    var pw = 380, ph = 530;
    var gap = 12;

    // Prefer: above the button, right-aligned
    var left = btnRect.right - pw;
    var top = btnRect.top - ph - gap;

    // If not enough space above, place below
    if (top < 10) {
      top = btnRect.bottom + gap;
    }
    // If still off-screen bottom, just clamp
    if (top + ph > window.innerHeight - 10) {
      top = window.innerHeight - ph - 10;
    }
    // Clamp horizontal
    if (left < 10) left = 10;
    if (left + pw > window.innerWidth - 10) left = window.innerWidth - pw - 10;
    // Clamp vertical
    if (top < 10) top = 10;

    panel.style.left = left + 'px';
    panel.style.top = top + 'px';

    // Set transform-origin near button position for animation
    var originX = btnRect.left + btnRect.width / 2 - left;
    var originY = top < btnRect.top ? ph : 0;
    panel.style.transformOrigin = originX + 'px ' + originY + 'px';
  }

  // ==================== Draggable ====================
  function initDraggable() {
    var startX, startY, startLeft, startTop;
    var totalMove = 0;
    var THRESHOLD = 5;

    function onStart(e) {
      if (e.target.closest('.yikao-ai-btn-handle') || e.target.closest('.yikao-ai-btn-body') || e.target === btn || e.target.parentElement === btn) {
        // ok, on the button
      } else {
        return;
      }
      e.preventDefault();
      var pt = e.touches ? e.touches[0] : e;
      startX = pt.clientX;
      startY = pt.clientY;
      var rect = btn.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      totalMove = 0;
      isDragging = false;

      document.addEventListener('mousemove', onMove, { passive: false });
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
      e.preventDefault();
      var pt = e.touches ? e.touches[0] : e;
      var dx = pt.clientX - startX;
      var dy = pt.clientY - startY;
      totalMove += Math.abs(dx) + Math.abs(dy);

      if (totalMove > THRESHOLD) {
        isDragging = true;
        btn.classList.add('dragging');
      }

      var newLeft = startLeft + dx;
      var newTop = startTop + dy;

      // Constrain
      var maxL = window.innerWidth - btn.offsetWidth;
      var maxT = window.innerHeight - btn.offsetHeight;
      newLeft = Math.max(0, Math.min(newLeft, maxL));
      newTop = Math.max(0, Math.min(newTop, maxT));

      btn.style.left = newLeft + 'px';
      btn.style.top = newTop + 'px';

      if (isOpen) updatePanelPosition();
    }

    function onEnd() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);

      btn.classList.remove('dragging');

      if (!isDragging) {
        togglePanel();
      }
      isDragging = false;
    }

    btn.addEventListener('mousedown', onStart);
    btn.addEventListener('touchstart', onStart, { passive: false });
  }

  // ==================== Toggle Panel ====================
  function togglePanel(forceState) {
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

    if (isOpen) {
      updatePanelPosition();
      panel.classList.add('show');
      btn.classList.add('open');
      inputEl.focus();
    } else {
      panel.classList.remove('show');
      btn.classList.remove('open');
    }
  }

  // ==================== Module Detection ====================
  function detectModule() {
    var bodyText = (document.body.innerText || '').substring(0, 5000);
    var scores = {};

    for (var mod in MODULE_KEYWORDS) {
      scores[mod] = 0;
      var kws = MODULE_KEYWORDS[mod];
      for (var i = 0; i < kws.length; i++) {
        var idx = 0, count = 0;
        while ((idx = bodyText.indexOf(kws[i], idx)) > -1 && count < 3) {
          count++;
          idx += kws[i].length;
        }
        scores[mod] += count;
      }
    }

    // Check navigation elements for active state
    var navElements = document.querySelectorAll('nav *, [class*="nav"] *, [class*="tab"] *');
    var priorityModules = ['AI舌诊', '急救指南', '穴位按摩', '情绪疗愈', '健康评估', '饮食指南', '健康养生', '个人中心'];
    for (var n = 0; n < navElements.length; n++) {
      var el = navElements[n];
      var txt = (el.textContent || '').trim();
      for (var p = 0; p < priorityModules.length; p++) {
        if (txt === priorityModules[p]) {
          var isActive = el.classList.contains('active') || el.classList.contains('selected') ||
            el.classList.contains('current') || el.getAttribute('aria-selected') === 'true' ||
            (el.parentElement && (el.parentElement.classList.contains('active') || el.parentElement.classList.contains('selected')));
          if (isActive) {
            scores[priorityModules[p]] += 10;
          }
        }
      }
    }

    var maxScore = 0;
    var detected = '首页';
    for (var m in scores) {
      if (scores[m] > maxScore) {
        maxScore = scores[m];
        detected = m;
      }
    }

    if (detected !== currentModule) {
      currentModule = detected;
      onModuleChange();
    }
  }

  function onModuleChange() {
    if (moduleLabel) {
      moduleLabel.textContent = '当前：' + currentModule;
    }
    // Update quick questions
    showQuickQuestions();
  }

  function startModuleObserver() {
    var observer = new MutationObserver(function () {
      detectModule();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    // Also check on hash change
    window.addEventListener('hashchange', detectModule);
  }

  // ==================== Chat Logic ====================
  function addMessage(text, type) {
    var div = document.createElement('div');
    div.className = 'yikao-ai-msg yikao-ai-msg-' + type;
    if (type === 'ai') {
      div.innerHTML = renderMarkdown(text);
    } else {
      div.textContent = text;
    }
    messagesArea.appendChild(div);
    scrollToBottom();
    return div;
  }

  function addTypingIndicator() {
    var div = document.createElement('div');
    div.className = 'yikao-ai-typing';
    div.id = 'yikaoAiTyping';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesArea.appendChild(div);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    var el = document.getElementById('yikaoAiTyping');
    if (el) el.remove();
  }

  function showWelcome() {
    if (chatHistory.length > 0) return;
    var msg = WELCOME_MESSAGES[currentModule] || WELCOME_MESSAGES['首页'];
    addMessage(msg, 'ai');
  }

  function showQuickQuestions() {
    var chips = document.getElementById('yikaoAiChips');
    if (!chips) return;
    chips.innerHTML = '';
    var questions = QUICK_QUESTIONS[currentModule] || QUICK_QUESTIONS['首页'];
    for (var i = 0; i < questions.length; i++) {
      var chip = document.createElement('button');
      chip.className = 'yikao-ai-chip';
      chip.textContent = questions[i];
      chip.setAttribute('data-question', questions[i]);
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        var q = this.getAttribute('data-question');
        inputEl.value = q;
        sendMessage();
      });
      chips.appendChild(chip);
    }
    quickArea.style.display = 'block';
  }

  function hideQuickQuestions() {
    if (quickArea) quickArea.style.display = 'none';
  }

  function clearChat() {
    createNewSession();
  }

  function sendMessage() {
    if (isStreaming) return;
    var text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    hideQuickQuestions();

    addMessage(text, 'user');
    chatHistory.push({ role: 'user', content: text });
    saveMessageToBackend('user', text);

    callAPI();
  }

  async function callAPI() {
    isStreaming = true;
    sendBtn.disabled = true;
    inputEl.disabled = true;
    addTypingIndicator();

    var systemPrompt = '你是"医靠"健康助手的AI顾问，专门为脆皮大学生提供中医健康建议。\n\n' +
      '当前模块：' + currentModule + '\n' +
      '模块专家身份：' + (MODULE_PROMPTS[currentModule] || MODULE_PROMPTS['首页']) + '\n\n' +
      '行为准则：\n1. 用轻松、友好、大学生能理解的语言回答\n2. 适当使用emoji增加亲和力\n3. 给出实用、可行的建议\n4. 回答要简洁，不要过长\n5. 严重健康问题必须提醒就医\n6. 中医建议仅供参考，不能替代专业医疗';

    var messages = [{ role: 'system', content: systemPrompt }].concat(chatHistory.slice(-10));

    // 纯静态模式：跳过API调用，直接使用本地知识库
    if (IS_STATIC_MODE) {
      removeTypingIndicator();
      var staticReply = generateLocalResponse(chatHistory[chatHistory.length - 1].content, currentModule);
      addMessage(staticReply, 'ai');
      chatHistory.push({ role: 'assistant', content: staticReply });
      saveMessageToBackend('assistant', staticReply);
      isStreaming = false;
      sendBtn.disabled = false;
      inputEl.disabled = false;
      inputEl.focus();
      return;
    }

    try {
      var response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        var errData = null;
        try { errData = await response.json(); } catch (e) { }
        throw new Error(errData && errData.error && errData.error.message ? errData.error.message : 'API请求失败 (' + response.status + ')');
      }

      removeTypingIndicator();

      // Streaming
      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';
      var fullContent = '';
      var msgEl = addMessage('', 'ai');
      msgEl.id = 'yikaoAiStreamMsg';

      while (true) {
        var result = await reader.read();
        if (result.done) break;

        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line || !line.startsWith('data: ')) continue;
          var data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            var json = JSON.parse(data);
            var delta = json.choices && json.choices[0] && json.choices[0].delta;
            if (delta && delta.content) {
              fullContent += delta.content;
              msgEl.innerHTML = renderMarkdown(fullContent);
              scrollToBottom();
            }
          } catch (e) {
            // skip
          }
        }
      }

      chatHistory.push({ role: 'assistant', content: fullContent });
      saveMessageToBackend('assistant', fullContent);

    } catch (err) {
      removeTypingIndicator();
      // 尝试本地回退：使用内置的知识库生成回答
      try {
        var fallbackResponse = generateLocalResponse(chatHistory[chatHistory.length - 1].content, currentModule);
        addMessage(fallbackResponse, 'ai');
        chatHistory.push({ role: 'assistant', content: fallbackResponse });
        saveMessageToBackend('assistant', fallbackResponse);
        // 如果是因为API Key未配置，添加提示
        if (err.message && err.message.indexOf('API Key') > -1) {
          var tipDiv = document.createElement('div');
          tipDiv.className = 'yikao-ai-msg yikao-ai-msg-ai';
          tipDiv.style.cssText = 'font-size:12px;color:#999;align-self:flex-start;background:#fff5f5;padding:6px 12px;border-radius:8px;';
          tipDiv.textContent = '💡 提示：配置DeepSeek API Key可获得更智能的回答。联系开发者在server.js中设置DEEPSEEK_API_KEY环境变量。';
          messagesArea.appendChild(tipDiv);
          scrollToBottom();
        }
      } catch (e2) {
        var errorDiv = document.createElement('div');
        errorDiv.className = 'yikao-ai-error';
        errorDiv.textContent = '出错了：' + err.message;
        messagesArea.appendChild(errorDiv);
        scrollToBottom();
      }
    }

    isStreaming = false;
    sendBtn.disabled = false;
    inputEl.disabled = false;
    inputEl.focus();
  }

  // ==================== Local Fallback Responses ====================
  var LOCAL_RESPONSES = {
    '首页': [
      '你好呀！我是医靠AI助手 🌿 我可以帮你做这些事：\n\n🏠 **首页** - 查看所有功能模块\n🔍 **健康评估** - 了解你的中医体质\n👅 **AI舌诊** - 拍照分析舌象\n🏥 **急救指南** - 突发不适应急处理\n🍵 **健康养生** - 轻养生方案\n🥗 **饮食指南** - 根据体质推荐饮食\n💆 **穴位按摩** - 常用穴位指导\n🌈 **情绪疗愈** - 冥想和情绪管理\n\n有什么想了解的吗？',
      '大学生常见健康问题有：\n\n1. **熬夜失眠** - 建议固定作息，睡前远离手机\n2. **颈椎酸痛** - 每45分钟站起来活动一下\n3. **肠胃不适** - 规律饮食，少吃外卖\n4. **精神压力** - 适当运动，找人倾诉\n5. **免疫力下降** - 保证睡眠，均衡营养\n\n需要我详细说说哪个问题吗？😊',
      '改善睡眠的小技巧 💤\n\n1. **固定时间** - 每天同一时间睡觉和起床\n2. **睡前仪式** - 提前1小时放下手机，可以看看书\n3. **478呼吸法** - 吸气4秒→屏气7秒→呼气8秒\n4. **环境优化** - 保持卧室黑暗、安静、凉爽\n5. **避免刺激** - 下午4点后不喝咖啡浓茶\n\n今晚就试试吧！'
    ],
    '健康评估': [
      '中医九种体质分别是：\n\n🌿 **平和质** - 健康平衡型\n💪 **气虚质** - 容易疲乏\n❄️ **阳虚质** - 怕冷手脚凉\n🔥 **阴虚质** - 手心发热口干\n💧 **痰湿质** - 体型偏胖易困\n🌧️ **湿热质** - 爱出油长痘\n🩸 **血瘀质** - 易出瘀青\n😔 **气郁质** - 容易郁闷\n⚠️ **特禀质** - 容易过敏\n\n每种体质都有对应的调理方法哦！',
      '总是怕冷通常是**阳虚质**的表现 🥶\n\n**特点：** 手脚冰凉、怕吹空调、喜欢喝热水\n\n**调理建议：**\n1. 多吃温热食物：羊肉、韭菜、核桃、生姜\n2. 少吃生冷：冰饮料、西瓜、苦瓜\n3. 多晒太阳，尤其是晒后背\n4. 睡前热水泡脚\n5. 适当运动，微微出汗为佳\n\n试试这些方法，慢慢改善～',
      '**气虚质**的调理方法 💪\n\n**典型表现：** 容易累、说话没力气、容易感冒\n\n**饮食调理：**\n✅ 宜吃：山药、红枣、黄芪、鸡肉、牛肉、糯米\n❌ 少吃：生冷食物、油腻、辛辣\n\n**生活建议：**\n1. 不要过度劳累，保证充足休息\n2. 适当运动但不要大汗淋漓\n3. 保持心情舒畅\n4. 可以喝黄芪红枣茶补气'
    ],
    'AI舌诊': [
      'AI舌诊是中医诊断的重要方法之一 👅\n\n中医认为舌象能反映内脏的健康状况：\n\n👅 **舌色**：淡红为正常，过红有热，发白可能气血不足\n👅 **舌苔**：薄白为正常，厚腻可能是湿气重\n👅 **舌形**：齿痕舌可能脾虚，裂纹舌可能阴虚\n\n**注意：** AI舌诊仅供参考，如有不适请及时就医哦！',
      '**舌苔厚白**常见原因：\n\n1. **湿气重** - 脾胃运化功能减弱\n2. **消化不良** - 饮食过于油腻\n3. **感受寒湿** - 着凉或环境潮湿\n\n**改善建议：**\n✅ 饮食清淡，少吃油腻甜食\n✅ 可以喝薏米赤小豆汤祛湿\n✅ 适当运动促进代谢\n✅ 保持居住环境通风干燥\n\n如果持续不适，建议就医检查。'
    ],
    '急救指南': [
      '**突然胃痛怎么办？** 🏥\n\n**应急措施：**\n1. 停止进食，喝少量温水\n2. 坐下或侧卧休息，避免平躺\n3. 用热水袋敷胃部（如果是冷痛）\n4. 避免服用止痛药（可能加重刺激）\n\n**需要就医的信号：**\n⚠️ 疼痛剧烈且持续不缓解\n⚠️ 伴有发烧、呕吐、便血\n⚠️ 疼痛放射到背部\n\n严重情况请立即就医！',
      '**失眠快速入睡方法** 😴\n\n**4-7-8呼吸法：**\n1. 用鼻子吸气4秒\n2. 屏住呼吸7秒\n3. 用嘴巴缓缓呼气8秒\n4. 重复4-6次\n\n**其他助眠技巧：**\n✅ 喝杯温牛奶或洋甘菊茶\n✅ 听轻音乐或白噪音\n✅ 做5分钟渐进式肌肉放松\n✅ 关掉所有电子产品\n\n好睡眠从今晚开始～',
      '**痛经怎么缓解？** 🩸\n\n**快速缓解方法：**\n1. 热水袋敷下腹部\n2. 喝红糖姜茶或热牛奶\n3. 按揉三阴交穴位（脚踝内侧上方3寸）\n4. 轻度拉伸舒缓\n\n**日常调理：**\n✅ 经期前一周少吃生冷\n✅ 平时适量运动促进血液循环\n✅ 保持心情愉快\n\n如果痛经严重，建议咨询医生。'
    ],
    '健康养生': [
      '**考前冲刺养生指南** 📚\n\n**1. 饮食篇**\n✅ 多吃核桃、鱼类、鸡蛋补脑\n✅ 喝菊花枸杞茶明目\n❌ 避免高糖食物（会犯困）\n\n**2. 作息篇**\n✅ 每学习45分钟休息5分钟\n✅ 午休20-30分钟\n✅ 晚上11点前尽量入睡\n\n**3. 运动篇**\n✅ 做5分钟颈椎拉伸\n✅ 站起来走动一下\n✅ 深呼吸调节\n\n考前也要照顾好自己！',
      '**适合宿舍的养生茶** 🍵\n\n1. **菊花枸杞茶** - 明目，适合经常看手机电脑\n2. **红枣桂圆茶** - 补气血，适合手脚冰凉\n3. **玫瑰花茶** - 疏肝解郁，适合压力大\n4. **陈皮普洱茶** - 助消化，适合吃油腻后\n5. **生姜红糖水** - 暖身，适合受寒或经期\n\n都是平价材料，在宿舍就能泡～'
    ],
    '饮食指南': [
      '**阳虚体质饮食指南** ❄️\n\n**特点：** 怕冷、手脚冰凉、喜欢热饮\n\n**宜吃（温性食物）：**\n✅ 羊肉、牛肉、鸡肉\n✅ 韭菜、生姜、大蒜、葱\n✅ 核桃、桂圆、红枣\n✅ 小米、糯米\n\n**少吃（寒凉食物）：**\n❌ 西瓜、梨、柿子\n❌ 苦瓜、冬瓜\n❌ 冰饮料、冰淇淋\n\n**推荐食谱：** 当归生姜羊肉汤、韭菜炒鸡蛋',
      '**食堂怎么搭配最健康？** 🍱\n\n**午餐搭配公式：**\n1份主食 + 1份蛋白质 + 1-2份蔬菜\n\n**推荐搭配：**\n✅ 米饭/馒头 + 鸡腿/鱼 + 青菜\n✅ 杂粮饭 + 鸡蛋/豆腐 + 时蔬\n✅ 面条 + 牛肉/虾 + 蔬菜\n\n**避坑指南：**\n❌ 不要只吃主食（会犯困）\n❌ 少打油炸和重油重盐的菜\n❌ 不要用饮料代替汤\n\n记住：颜色越丰富，营养越均衡！'
    ],
    '穴位按摩': [
      '**头痛按什么穴位？** 💆\n\n**1. 太阳穴**\n位置：眉梢和外眼角中间向后一横指凹陷处\n按法：用食指和中指按揉，力度适中\n时间：按揉2-3分钟\n\n**2. 风池穴**\n位置：后颈部，发际两侧凹陷处\n按法：双手拇指按揉，可稍用力\n时间：按揉3-5分钟\n\n**3. 合谷穴**\n位置：手背，大拇指和食指并拢时肌肉隆起最高点\n按法：用另一只手拇指按压\n\n对缓解紧张性头痛很有效！',
      '**三阴交穴位** 📍\n\n**位置：** 脚踝内侧，从内踝尖向上量4指宽（约3寸），在胫骨后缘\n\n**功效：**\n✅ 调理月经不调、痛经\n✅ 改善脾胃虚弱\n✅ 缓解失眠多梦\n✅ 美容养颜\n\n**按法：** 用拇指按揉，每次3-5分钟，每天2-3次\n**注意：** 孕妇禁用此穴！'
    ],
    '情绪疗愈': [
      '**缓解考前焦虑的方法** 🌈\n\n**1. 478呼吸法**\n吸气4秒→屏气7秒→呼气8秒，重复5次\n\n**2. 5-4-3-2-1感官法**\n看5样东西→摸4样→听3种声音→闻2种气味→尝1种味道\n\n**3. 正向自我暗示**\n"我已经准备好了"、"尽力就好"\n\n**4. 身体放松**\n耸耸肩→转转脖子→伸个懒腰\n\n别给自己太大压力，你已经很棒了！',
      '**正念冥想入门** 🧘\n\n**步骤：**\n1. 找一个安静的地方坐下\n2. 闭上眼睛，专注于呼吸\n3. 感受空气进出鼻腔\n4. 当思绪飘走，温柔地把注意力拉回呼吸\n5. 从3分钟开始，慢慢延长时间\n\n**小技巧：**\n✅ 可以听引导冥想的音频\n✅ 不用追求"不想事情"，察觉到了就好\n✅ 每天固定时间练习更容易坚持\n\n冥想就像给大脑做SPA，试试吧～'
    ],
    '个人中心': [
      '欢迎来到个人中心 👤\n\n在这里你可以：\n📊 **查看健康数据** - 测评记录、打卡情况\n🏷️ **我的收藏** - 收藏的健康内容\n⚙️ **设置** - 深色模式、健康提醒\n\n建议定期做体质评估，关注自己的健康变化哦！',
      '**如何坚持健康打卡？** ✅\n\n**小技巧：**\n1. **固定时间** - 每天同一时间打卡\n2. **设置提醒** - 在手机设个闹钟\n3. **从简单开始** - 先定小目标，比如每天喝8杯水\n4. **找伙伴一起** - 叫上室友一起打卡\n5. **奖励自己** - 连续打卡7天给自己一个小奖励\n\n坚持21天就能养成好习惯，加油！'
    ]
  };

  function generateLocalResponse(userMessage, moduleName) {
    var responses = LOCAL_RESPONSES[moduleName] || LOCAL_RESPONSES['首页'];
    // Simple keyword-based matching
    var userMsg = userMessage.toLowerCase();
    var bestIdx = 0;

    // Try to match the best response based on simple keyword matching
    if (userMsg.indexOf('失眠') > -1 || userMsg.indexOf('睡觉') > -1 || userMsg.indexOf('睡眠') > -1) {
      return LOCAL_RESPONSES['急救指南'][1]; // 失眠快速入睡
    }
    if (userMsg.indexOf('胃痛') > -1 || userMsg.indexOf('肚子') > -1 || userMsg.indexOf('胃') > -1) {
      return LOCAL_RESPONSES['急救指南'][0]; // 胃痛
    }
    if (userMsg.indexOf('痛经') > -1 || userMsg.indexOf('姨妈') > -1) {
      return LOCAL_RESPONSES['急救指南'][2]; // 痛经
    }
    if (userMsg.indexOf('头痛') > -1 || userMsg.indexOf('头疼') > -1) {
      return LOCAL_RESPONSES['穴位按摩'][0]; // 头痛
    }
    if (userMsg.indexOf('焦虑') > -1 || userMsg.indexOf('压力') > -1 || userMsg.indexOf('紧张') > -1) {
      return LOCAL_RESPONSES['情绪疗愈'][0]; // 焦虑
    }
    if (userMsg.indexOf('冥想') > -1 || userMsg.indexOf('正念') > -1) {
      return LOCAL_RESPONSES['情绪疗愈'][1]; // 冥想
    }
    if (userMsg.indexOf('体质') > -1 || userMsg.indexOf('测评') > -1 || userMsg.indexOf('评估') > -1) {
      return LOCAL_RESPONSES['健康评估'][0]; // 九种体质
    }
    if (userMsg.indexOf('怕冷') > -1 || userMsg.indexOf('阳虚') > -1) {
      return LOCAL_RESPONSES['健康评估'][1]; // 怕冷
    }
    if (userMsg.indexOf('气虚') > -1 || userMsg.indexOf('没力气') > -1 || userMsg.indexOf('容易累') > -1) {
      return LOCAL_RESPONSES['健康评估'][2]; // 气虚
    }
    if (userMsg.indexOf('舌苔') > -1 || userMsg.indexOf('舌') > -1) {
      return LOCAL_RESPONSES['AI舌诊'][1]; // 舌苔厚白
    }
    if (userMsg.indexOf('养生') > -1 || userMsg.indexOf('考前') > -1) {
      return LOCAL_RESPONSES['健康养生'][0]; // 考前养生
    }
    if (userMsg.indexOf('茶') > -1) {
      return LOCAL_RESPONSES['健康养生'][1]; // 养生茶
    }
    if (userMsg.indexOf('食堂') > -1 || userMsg.indexOf('吃') > -1 || userMsg.indexOf('饮食') > -1) {
      return LOCAL_RESPONSES['饮食指南'][1]; // 食堂搭配
    }
    if (userMsg.indexOf('穴位') > -1 || userMsg.indexOf('三阴交') > -1) {
      return LOCAL_RESPONSES['穴位按摩'][1]; // 三阴交
    }
    if (userMsg.indexOf('打卡') > -1 || userMsg.indexOf('坚持') > -1) {
      return LOCAL_RESPONSES['个人中心'][1]; // 坚持打卡
    }

    // Default: use the first response for the current module, or cycle through
    var lastResponse = localStorage.getItem('yikao_last_response_idx_' + moduleName);
    var idx = lastResponse ? (parseInt(lastResponse) + 1) % responses.length : 0;
    localStorage.setItem('yikao_last_response_idx_' + moduleName, idx.toString());
    return responses[idx];
  }

  // ==================== Markdown Rendering ====================
  function renderMarkdown(text) {
    if (!text) return '';
    var html = text;

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function (m, lang, code) {
      return '<pre style="background:#f5f5f5;padding:8px 10px;border-radius:6px;overflow-x:auto;font-size:13px;margin:6px 0"><code>' + code.trim() + '</code></pre>';
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<div style="font-weight:600;font-size:14px;margin:6px 0 2px">$1</div>');
    html = html.replace(/^## (.+)$/gm, '<div style="font-weight:700;font-size:15px;margin:8px 0 3px">$1</div>');

    // Unordered lists
    html = html.replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>');

    // Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, function (match) {
      return '<ul style="margin:4px 0;padding-left:18px">' + match + '</ul>';
    });

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Clean up extra <br> around block elements
    html = html.replace(/<br><(ul|pre|div)/g, '<$1');
    html = html.replace(/<\/(ul|pre|div)><br>/g, '</$1>');

    return html;
  }

  // ==================== Utilities ====================
  function scrollToBottom() {
    requestAnimationFrame(function () {
      messagesArea.scrollTop = messagesArea.scrollHeight;
    });
  }

  // ==================== 聊天记录持久化 ====================

  async function loadChatHistory() {
    // 纯静态模式：直接使用 localStorage
    if (IS_STATIC_MODE) {
      try {
        var saved = localStorage.getItem('yikao_chat_messages');
        if (saved) {
          var msgs = JSON.parse(saved);
          if (msgs.length > 0) {
            messagesArea.innerHTML = '';
            chatHistory = [];
            for (var i = 0; i < msgs.length; i++) {
              addMessage(msgs[i].content, msgs[i].role);
              chatHistory.push(msgs[i]);
            }
            return;
          }
        }
      } catch (e2) {}
      showWelcome();
      return;
    }

    try {
      var token = getAuthToken();
      var deviceId = getDeviceId();
      var url = CHAT_API_URL + '/sessions?deviceId=' + encodeURIComponent(deviceId);
      if (token) url += '&token=' + encodeURIComponent(token);

      var resp = await fetch(url);
      var data = await resp.json();

      if (data.success && data.sessions && data.sessions.length > 0) {
        var sessionId = data.sessions[0].id;
        currentSessionId = sessionId;

        var msgResp = await fetch(CHAT_API_URL + '/session/' + sessionId + '/messages?deviceId=' + encodeURIComponent(deviceId) + (token ? '&token=' + encodeURIComponent(token) : ''));
        var msgData = await msgResp.json();

        if (msgData.success && msgData.messages && msgData.messages.length > 0) {
          messagesArea.innerHTML = '';
          chatHistory = [];
          for (var i = 0; i < msgData.messages.length; i++) {
            var m = msgData.messages[i];
            addMessage(m.content, m.role);
            chatHistory.push({ role: m.role, content: m.content });
          }
          return;
        }
      }
    } catch (e) {
      // 后端不可用，尝试 localStorage
      try {
        var saved = localStorage.getItem('yikao_chat_messages');
        if (saved) {
          var msgs = JSON.parse(saved);
          if (msgs.length > 0) {
            messagesArea.innerHTML = '';
            chatHistory = [];
            for (var i = 0; i < msgs.length; i++) {
              addMessage(msgs[i].content, msgs[i].role);
              chatHistory.push(msgs[i]);
            }
            return;
          }
        }
      } catch (e2) { /* ignore */ }
    }
    // 没有历史记录，显示欢迎语
    showWelcome();
  }

  async function createNewSession() {
    chatHistory = [];
    messagesArea.innerHTML = '';
    try {
      var token = getAuthToken();
      var deviceId = getDeviceId();
      var resp = await fetch(CHAT_API_URL + '/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: deviceId, token: token, title: '新对话' })
      });
      var data = await resp.json();
      if (data.success && data.session) {
        currentSessionId = data.session.id;
      }
    } catch (e) {
      currentSessionId = null;
    }
    showWelcome();
    showQuickQuestions();
  }

  async function saveMessageToBackend(role, content) {
    // 如果有后端 session，保存到后端
    if (currentSessionId) {
      try {
        await fetch(CHAT_API_URL + '/session/' + currentSessionId + '/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: role, content: content })
        });
        return;
      } catch (e) {
        // 后端不可用，降级
      }
    }
    // 降级：保存到 localStorage
    try {
      var saved = localStorage.getItem('yikao_chat_messages');
      var msgs = saved ? JSON.parse(saved) : [];
      msgs.push({ role: role, content: content });
      if (msgs.length > 100) msgs = msgs.slice(-100);
      localStorage.setItem('yikao_chat_messages', JSON.stringify(msgs));
    } catch (e) { /* ignore */ }
  }

  // ==================== Initialize ====================
  function init() {
    injectCSS();
    createDOM();
    initPosition();
    initDraggable();
    detectModule();

    // Delayed start for module observer (let React render first)
    setTimeout(function () {
      startModuleObserver();
      loadChatHistory();
      showQuickQuestions();
    }, 800);
  }

  // ==================== Bootstrap ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
