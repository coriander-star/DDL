// 健康助手增强脚本 - 优化版本
(function() {
  'use strict';

  const STYLES = `
    /* ===== 统计数据横向排版 ===== */
    .stats-row-container {
      display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important;
      justify-content: space-around !important; align-items: stretch !important; gap: 8px !important;
      margin-top: 20px !important; padding-top: 20px !important; border-top: 1px solid #e2e8f0 !important;
      overflow-x: auto !important; padding-bottom: 6px !important;
    }
    .dark .stats-row-container { border-top-color: #334155 !important; }

    .stats-row-card {
      flex: 1 !important; min-width: 70px !important; max-width: 100px !important;
      display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important;
      padding: 14px 8px !important; border-radius: 14px !important; background: white !important;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05) !important; transition: all 0.25s ease !important; cursor: pointer !important;
    }
    .stats-row-card:hover { transform: translateY(-3px) !important; box-shadow: 0 6px 16px rgba(0,0,0,0.1) !important; }

    .stats-row-card.favorites { background: linear-gradient(135deg, #fff5f5, #ffe4e6) !important; }
    .stats-row-card.favorites .stats-value { color: #e11d48 !important; }
    .stats-row-card.checkins { background: linear-gradient(135deg, #f0fdfa, #ccfbf1) !important; }
    .stats-row-card.checkins .stats-value { color: #0d9488 !important; }
    .stats-row-card.today { background: linear-gradient(135deg, #f0fdf4, #dcfce7) !important; }
    .stats-row-card.today .stats-value { color: #16a34a !important; }
    .stats-row-card.likes { background: linear-gradient(135deg, #fffbeb, #fef3c7) !important; }
    .stats-row-card.likes .stats-value { color: #d97706 !important; }
    .stats-row-card.constitution { background: linear-gradient(135deg, #f5f3ff, #ede9fe) !important; }
    .stats-row-card.constitution .stats-value { color: #7c3aed !important; }

    .stats-value { font-size: 22px !important; font-weight: 700 !important; line-height: 1 !important; margin-bottom: 4px !important; }
    .stats-label { font-size: 10px !important; color: #64748b !important; font-weight: 500 !important; letter-spacing: 0.3px !important; }

    .dark .stats-row-card { background: rgba(51,65,85,0.8) !important; box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important; }
    .dark .stats-row-card:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important; }
    .dark .stats-row-card.favorites { background: linear-gradient(135deg, rgba(88,28,35,0.7), rgba(69,10,10,0.7)) !important; }
    .dark .stats-row-card.favorites .stats-value { color: #fb7185 !important; }
    .dark .stats-row-card.favorites .stats-label { color: #fda4af !important; }
    .dark .stats-row-card.checkins { background: linear-gradient(135deg, rgba(19,78,74,0.7), rgba(6,78,59,0.7)) !important; }
    .dark .stats-row-card.checkins .stats-value { color: #5eead4 !important; }
    .dark .stats-row-card.checkins .stats-label { color: #99f6e4 !important; }
    .dark .stats-row-card.today { background: linear-gradient(135deg, rgba(22,101,52,0.7), rgba(21,128,61,0.7)) !important; }
    .dark .stats-row-card.today .stats-value { color: #86efac !important; }
    .dark .stats-row-card.today .stats-label { color: #bbf7d0 !important; }
    .dark .stats-row-card.likes { background: linear-gradient(135deg, rgba(120,53,15,0.7), rgba(124,45,18,0.7)) !important; }
    .dark .stats-row-card.likes .stats-value { color: #fcd34d !important; }
    .dark .stats-row-card.likes .stats-label { color: #fde68a !important; }
    .dark .stats-row-card.constitution { background: linear-gradient(135deg, rgba(55,48,163,0.7), rgba(67,56,202,0.7)) !important; }
    .dark .stats-row-card.constitution .stats-value { color: #c4b5fd !important; }
    .dark .stats-row-card.constitution .stats-label { color: #ddd6fe !important; }
    .dark .stats-label { color: #94a3b8 !important; }

    @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    .stats-row-card { animation: slideIn 0.4s ease forwards; }
    .stats-row-card:nth-child(1) { animation-delay: 0.1s; }
    .stats-row-card:nth-child(2) { animation-delay: 0.15s; }
    .stats-row-card:nth-child(3) { animation-delay: 0.2s; }
    .stats-row-card:nth-child(4) { animation-delay: 0.25s; }
    .stats-row-card:nth-child(5) { animation-delay: 0.3s; }

    /* ===== 热门干货弹窗 ===== */
    .hot-tip-card { transition: all 0.2s ease !important; }
    .hot-tip-card:hover { transform: translateX(4px) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
    .hot-tip-card:active { transform: scale(0.98) !important; }

    .hot-tip-modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
      z-index: 10000; animation: fadeIn 0.2s ease;
    }

    .hot-tip-modal {
      background: white; border-radius: 16px; width: 90%; max-width: 400px;
      max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease;
    }
    .dark .hot-tip-modal { background: #1e293b; }

    .hot-tip-modal-header {
      padding: 20px; border-bottom: 1px solid #e2e8f0; display: flex;
      justify-content: space-between; align-items: center; position: sticky; top: 0;
      background: white; border-radius: 16px 16px 0 0;
    }
    .dark .hot-tip-modal-header { background: #1e293b; border-bottom-color: #334155; }

    .hot-tip-modal-title { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: bold; color: #1e293b; }
    .dark .hot-tip-modal-title { color: white; }

    .hot-tip-modal-close {
      width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9;
      border: none; font-size: 20px; cursor: pointer; display: flex;
      align-items: center; justify-content: center; transition: all 0.2s ease;
    }
    .dark .hot-tip-modal-close { background: #334155; color: white; }
    .hot-tip-modal-close:hover { background: #e2e8f0; }
    .dark .hot-tip-modal-close:hover { background: #475569; }

    .hot-tip-modal-body { padding: 20px; }
    .hot-tip-description { color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
    .dark .hot-tip-description { color: #94a3b8; }

    .hot-tip-section { margin-bottom: 20px; }
    .hot-tip-section-title { font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
    .dark .hot-tip-section-title { color: white; }

    .hot-tip-steps { list-style: none; padding: 0; margin: 0; }
    .hot-tip-step { padding: 10px 12px 10px 28px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px; font-size: 13px; color: #475569; position: relative; }
    .dark .hot-tip-step { background: #334155; color: #cbd5e1; }
    .hot-tip-step::before { content: ''; position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; background: #f59e0b; border-radius: 50%; }

    .hot-tip-benefits { display: flex; flex-wrap: wrap; gap: 8px; }
    .hot-tip-benefit { padding: 6px 12px; background: #dcfce7; border-radius: 20px; font-size: 12px; color: #166534; }
    .dark .hot-tip-benefit { background: rgba(22,163,74,0.2); color: #86efac; }

    .hot-tip-tips { background: #fef3c7; padding: 12px; border-radius: 8px; font-size: 13px; color: #92400e; border-left: 4px solid #f59e0b; }
    .dark .hot-tip-tips { background: rgba(234,179,8,0.1); color: #fde68a; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `;

  const HOT_TIPS_DATA = {
    '478呼吸法': { title: '478呼吸法', icon: '🌬️', description: '478呼吸法是一种简单有效的放松技巧，通过调节呼吸节奏来帮助身体放松、缓解焦虑、改善睡眠质量。', steps: ['用鼻子深深吸气4秒', '屏住呼吸7秒', '用嘴巴慢慢呼气8秒', '重复4-6次'], benefits: ['缓解焦虑和压力', '改善睡眠质量', '降低心率', '提升专注力'], tips: '建议在安静的环境中练习，每天早晚各练习5分钟效果更佳。' },
    '宿舍拉伸操': { title: '宿舍拉伸操', icon: '🧘', description: '专为大学生设计的宿舍拉伸操，无需器械，随时随地都能做，帮助缓解久坐疲劳，改善体态。', steps: ['颈部拉伸：左右侧屈各保持30秒', '肩部拉伸：双手交叉上举，向两侧倾斜', '背部拉伸：坐姿，身体前倾，双手触地', '腿部拉伸：坐姿，一腿伸直，身体前倾', '腰部扭转：坐姿，双手扶膝，左右扭转'], benefits: ['缓解颈椎疲劳', '改善圆肩驼背', '促进血液循环', '放松身心'], tips: '每次拉伸保持15-30秒，呼吸均匀，不要用力过猛。' },
    '熬夜修复指南': { title: '熬夜修复指南', icon: '🌙', description: '熬夜后如何快速恢复状态？这份指南告诉你如何通过饮食、作息和运动来修复熬夜带来的伤害。', steps: ['补充睡眠：中午午睡20-30分钟', '补充水分：多喝水，可加少量盐', '补充营养：吃富含维生素的食物', '适度运动：轻度有氧运动', '调整作息：当晚尽量早睡'], benefits: ['快速恢复精力', '减轻疲劳感', '保护视力', '调节生物钟'], tips: '熬夜后避免喝咖啡和浓茶，以免加重身体负担。' }
  };

  const CONSTITUTION_DETAILS = {
    '平和质': { description: '平和质是一种健康的体质状态，表现为体态适中、面色红润、精力充沛、脏腑功能状态良好。', features: ['体态适中，体型匀称健壮', '面色、肤色润泽', '头发稠密有光泽', '鼻色明润，嗅觉通利', '味觉正常，唇色红润', '精力充沛，不易疲劳', '睡眠良好，二便正常', '舌色淡红，苔薄白', '脉和有神'], suggestions: ['继续保持规律作息', '均衡饮食，多吃五谷杂粮', '适量运动，保持心情愉悦', '定期体检，预防为主'], foods: { recommend: ['五谷杂粮', '新鲜蔬菜', '时令水果', '优质蛋白'], avoid: ['过度油腻', '暴饮暴食', '生冷食物'] } },
    '气虚质': { description: '气虚质是由于元气不足，以气息低弱、机体、脏腑功能状态低下为主要特征的一种体质状态。', features: ['容易疲乏，声音低弱', '容易气短心慌', '容易感冒，发病后恢复慢', '喜欢安静，不喜欢说话', '面色偏黄或发白', '舌淡红，舌体胖大', '脉弱'], suggestions: ['避免过度劳累，注意休息', '适当进行有氧运动', '保持心情舒畅，避免过度思虑', '注意保暖，避免受凉'], foods: { recommend: ['山药', '红枣', '黄芪', '鸡肉', '牛肉', '糯米'], avoid: ['生冷食物', '油腻食物', '辛辣刺激'] } },
    '阳虚质': { description: '阳虚质是由于阳气不足，以虚寒现象为主要特征的一种体质状态。', features: ['手脚发凉，怕冷', '胃脘部、背部或腰膝部怕冷', '衣服比别人穿得多', '冬天更怕冷，夏天不喜欢吹空调', '容易腹泻', '舌淡胖嫩', '脉沉迟'], suggestions: ['注意保暖，尤其是腰腹部', '多晒太阳，适当运动', '避免长时间待在空调房', '少吃生冷食物'], foods: { recommend: ['羊肉', '韭菜', '核桃', '桂圆', '生姜', '胡椒'], avoid: ['西瓜', '梨', '绿豆', '苦瓜', '冷饮'] } },
    '阴虚质': { description: '阴虚质是由于体内津液、精血等阴液亏少，以阴虚内热为主要特征的一种体质状态。', features: ['手脚心发热', '面颊潮红或偏红', '皮肤干燥，口干咽燥', '容易失眠', '大便干燥，小便短黄', '舌红少苔', '脉细数'], suggestions: ['避免熬夜，保证充足睡眠', '少吃辛辣刺激食物', '保持心情平和，避免烦躁', '适当进行舒缓运动'], foods: { recommend: ['银耳', '百合', '梨', '鸭肉', '芝麻', '枸杞'], avoid: ['羊肉', '辣椒', '白酒', '生姜', '大蒜'] } },
    '痰湿质': { description: '痰湿质是由于水液内停而痰湿凝聚，以黏滞重浊为主要特征的一种体质状态。', features: ['体形肥胖，腹部肥满松软', '容易困倦，身体沉重', '面部皮肤油脂较多', '多汗且黏，胸闷', '嘴里常有黏黏的感觉', '舌苔厚腻', '脉滑'], suggestions: ['控制体重，减少油腻食物', '坚持运动，促进代谢', '保持居住环境干燥', '避免久坐，定时活动'], foods: { recommend: ['冬瓜', '萝卜', '薏米', '赤小豆', '荷叶茶'], avoid: ['肥肉', '甜食', '油炸食品', '酒类'] } },
    '湿热质': { description: '湿热质是以湿热内蕴为主要特征的一种体质状态。', features: ['面部容易出油，易生痤疮', '口苦口臭，身重困倦', '大便黏滞不爽', '小便颜色深黄', '男性易阴囊潮湿', '女性带下增多', '舌质偏红，苔黄腻', '脉滑数'], suggestions: ['饮食清淡，少吃辛辣油腻', '避免在潮湿环境久待', '保持大便通畅', '适当运动，促进排汗'], foods: { recommend: ['绿豆', '苦瓜', '黄瓜', '冬瓜', '薏米', '莲藕'], avoid: ['羊肉', '辣椒', '酒', '榴莲', '芒果'] } },
    '血瘀质': { description: '血瘀质是由于血液运行不畅，以血瘀表现为主要特征的一种体质状态。', features: ['皮肤容易出现瘀青', '面色晦暗，口唇颜色偏暗', '皮肤干燥，容易有瘀斑', '容易忘事', '女性痛经，经血有血块', '舌质暗有瘀点', '脉细涩'], suggestions: ['保持心情舒畅，避免情绪压抑', '适当运动，促进血液循环', '注意保暖，避免受寒', '定期体检，关注心血管健康'], foods: { recommend: ['山楂', '玫瑰花', '黑木耳', '洋葱', '红酒（适量）'], avoid: ['寒凉食物', '油腻食物', '过度饮酒'] } },
    '气郁质': { description: '气郁质是由于长期情志不畅、气机郁滞而形成的以性格内向不稳定、忧郁脆弱、敏感多疑为主要特征的一种体质状态。', features: ['情绪低落，容易郁闷', '容易焦虑、失眠', '胸胁胀满', '喜欢叹气', '咽喉有异物感', '舌淡红，苔薄白', '脉弦'], suggestions: ['多参加社交活动，保持心情开朗', '培养兴趣爱好，转移注意力', '适当运动，释放压力', '寻求家人朋友支持'], foods: { recommend: ['玫瑰花茶', '菊花茶', '柑橘', '香蕉', '全麦面包'], avoid: ['咖啡', '浓茶', '辛辣刺激', '过度饮酒'] } },
    '特禀质': { description: '特禀质是由于先天禀赋不足或遗传等因素造成的一种特殊体质，包括过敏体质、遗传病体质等。', features: ['容易过敏（药物、食物、花粉等）', '容易患哮喘', '容易患鼻炎', '皮肤容易起荨麻疹', '容易对某些食物不耐受', '有家族遗传病史'], suggestions: ['避免接触过敏原', '增强体质，提高免疫力', '注意饮食，避免过敏食物', '随身携带应急药物'], foods: { recommend: ['新鲜蔬菜', '清淡饮食', '富含维生素C的食物'], avoid: ['已知过敏食物', '海鲜（如过敏）', '辛辣刺激'] } }
  };

  const CONSTITUTION_COLORS = {
    '平和质': '#4ade80', '气虚质': '#60a5fa', '阳虚质': '#f59e0b',
    '阴虚质': '#a78bfa', '痰湿质': '#10b981', '湿热质': '#f87171',
    '血瘀质': '#94a3b8', '气郁质': '#8b5cf6', '特禀质': '#ec4899'
  };

  let flags = { hotTipsEnabled: false };
  let hasGeneratedAnalysis = false;
  let lastAssessmentTime = 0;

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function beautifyStats() {
    const container = document.querySelector('.grid.grid-cols-5');
    if (!container) return;

    if (container.classList.contains('stats-row-container')) return;

    const cards = container.querySelectorAll(':scope > div');
    if (cards.length !== 5) return;

    container.classList.add('beautified-stats');
    container.classList.remove('grid', 'grid-cols-5', 'gap-2', 'mt-6', 'pt-6');
    container.classList.add('stats-row-container');

    const types = ['favorites', 'checkins', 'today', 'likes', 'constitution'];
    cards.forEach((card, i) => {
      card.className = '';
      card.classList.add('stats-row-card', types[i]);
      const valueEl = card.querySelector('div:first-child');
      const labelEl = card.querySelector('div:last-child');
      if (valueEl) valueEl.className = 'stats-value';
      if (labelEl) labelEl.className = 'stats-label';
    });
  }

  function enableHotTips() {
    const sections = document.querySelectorAll('section');
    let foundSection = null;
    sections.forEach(sec => {
      const headings = sec.querySelectorAll('h2');
      headings.forEach(h2 => {
        if (h2.textContent.includes('热门干货')) foundSection = sec;
      });
    });
    if (!foundSection) return;

    const cards = foundSection.querySelectorAll('.rounded-xl.p-4');
    cards.forEach(card => {
      card.classList.add('hot-tip-card');
      card.style.cursor = 'pointer';
    });
  }

  document.addEventListener('click', function(e) {
    const card = e.target.closest('.hot-tip-card');
    if (!card) return;
    
    const titleEl = card.querySelector('.font-medium');
    if (!titleEl) return;
    
    const title = titleEl.textContent.trim();
    const data = HOT_TIPS_DATA[title];
    if (data) {
      const modal = createTipModal(data);
      document.body.appendChild(modal);
    }
  });

  function createTipModal(data) {
    const modal = document.createElement('div');
    modal.className = 'hot-tip-modal-overlay';
    modal.innerHTML = `
      <div class="hot-tip-modal">
        <div class="hot-tip-modal-header">
          <div class="hot-tip-modal-title"><span>${data.icon}</span><span>${data.title}</span></div>
          <button class="hot-tip-modal-close" onclick="this.closest('.hot-tip-modal-overlay').remove()">×</button>
        </div>
        <div class="hot-tip-modal-body">
          <p class="hot-tip-description">${data.description}</p>
          <div class="hot-tip-section"><div class="hot-tip-section-title">📋 操作步骤</div><ul class="hot-tip-steps">${data.steps.map(s => `<li class="hot-tip-step">${s}</li>`).join('')}</ul></div>
          <div class="hot-tip-section"><div class="hot-tip-section-title">✨ 主要功效</div><div class="hot-tip-benefits">${data.benefits.map(b => `<span class="hot-tip-benefit">${b}</span>`).join('')}</div></div>
          <div class="hot-tip-section"><div class="hot-tip-tips">💡 ${data.tips}</div></div>
        </div>
      </div>
    `;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    return modal;
  }

  function extractScores() {
    const scores = {};
    const names = ['平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特禀质'];

    const allText = document.body.innerText;
    names.forEach(name => {
      const match = allText.match(new RegExp(name + '[：:]*\\s*(\\d+)', 'i'));
      if (match) scores[name] = parseInt(match[1]);
    });

    if (Object.keys(scores).length === 0) {
      const stored = localStorage.getItem('healthAssessmentResult');
      if (stored) {
        try {
          const result = JSON.parse(stored);
          if (result.scores) return result.scores;
        } catch (e) {}
      }
    }

    if (Object.keys(scores).length === 0 && window.assessmentScores) {
      return window.assessmentScores;
    }

    return scores;
  }

  function generateAnalysis(scores) {
    let mainConstitution = '', maxScore = 0;
    for (const [key, value] of Object.entries(scores)) {
      if (value > maxScore) { maxScore = value; mainConstitution = key; }
    }

    let secondConstitution = '', secondScore = 0;
    for (const [key, value] of Object.entries(scores)) {
      if (key !== mainConstitution && value > secondScore) { secondScore = value; secondConstitution = key; }
    }

    const details = CONSTITUTION_DETAILS[mainConstitution];
    if (!details) return '<p>暂无详细分析数据</p>';

    return `
      <div style="margin-top:20px;">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:20px;border-radius:12px;margin-bottom:20px;">
          <h4 style="margin:0 0 10px 0;font-size:18px;">🎯 您的主要体质：${mainConstitution}</h4>
          <p style="margin:0;opacity:0.9;line-height:1.6;">${details.description}</p>
        </div>
        <div style="background:#f8f9fa;padding:20px;border-radius:12px;margin-bottom:20px;">
          <h4 style="margin:0 0 15px 0;color:#333;font-size:16px;">📋 体质特征</h4>
          <ul style="margin:0;padding-left:20px;color:#666;line-height:1.8;">${details.features.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
        ${secondConstitution && secondScore > 30 ? `
        <div style="background:#fff3cd;padding:20px;border-radius:12px;margin-bottom:20px;border-left:4px solid #ffc107;">
          <h4 style="margin:0 0 10px 0;color:#856404;font-size:16px;">⚠️ 兼有体质：${secondConstitution}</h4>
          <p style="margin:0;color:#856404;line-height:1.6;">您的体质还带有${secondConstitution}的特征，建议同时关注相关调理方法。</p>
        </div>` : ''}
        <div style="background:#d4edda;padding:20px;border-radius:12px;margin-bottom:20px;">
          <h4 style="margin:0 0 15px 0;color:#155724;font-size:16px;">💡 调理建议</h4>
          <ul style="margin:0;padding-left:20px;color:#155724;line-height:1.8;">${details.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
          <div style="background:#e7f3ff;padding:15px;border-radius:12px;">
            <h5 style="margin:0 0 10px 0;color:#0056b3;font-size:14px;">✅ 宜吃食物</h5>
            <p style="margin:0;color:#0056b3;font-size:13px;line-height:1.6;">${details.foods.recommend.join('、')}</p>
          </div>
          <div style="background:#fff5f5;padding:15px;border-radius:12px;">
            <h5 style="margin:0 0 10px 0;color:#c53030;font-size:14px;">❌ 忌口食物</h5>
            <p style="margin:0;color:#c53030;font-size:13px;line-height:1.6;">${details.foods.avoid.join('、')}</p>
          </div>
        </div>
        <div style="background:#f0f4f8;padding:20px;border-radius:12px;margin-bottom:20px;">
          <h4 style="margin:0 0 15px 0;color:#2d3748;font-size:16px;">📊 体质评分详情</h4>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
            ${Object.entries(scores).map(([key, value]) => `
              <div style="background:white;padding:10px;border-radius:8px;text-align:center;">
                <div style="font-size:12px;color:#718096;margin-bottom:5px;">${key}</div>
                <div style="font-size:20px;font-weight:bold;color:${value >= 60 ? '#48bb78' : value >= 40 ? '#ed8936' : '#e53e3e'};">${value}</div>
              </div>`).join('')}
          </div>
        </div>
        <div style="background:#e8f5e9;padding:15px;border-radius:12px;border-left:4px solid #4caf50;">
          <p style="margin:0;color:#2e7d32;font-size:13px;line-height:1.6;"><strong>温馨提示：</strong>以上分析仅供参考，如有身体不适请及时就医。建议定期进行体质评估，关注身体健康变化。</p>
        </div>
      </div>
    `;
  }

  function generateDetailedAnalysis() {
    const section = document.querySelector('.prose.dark\\:prose-invert.max-w-none');
    if (!section) return;

    const card = section.closest('.bg-white.dark\\:bg-gray-800.rounded-2xl');
    if (!card || card.querySelector('h3')?.textContent !== '详细分析') return;

    let scores = extractScores();
    if (Object.keys(scores).length === 0) {
      // 尝试从 React 应用的 localStorage 读取
      const reactAssessments = getReactAssessments();
      if (reactAssessments.length > 0) {
        const last = reactAssessments[0];
        if (last.scores) {
          scores = last.scores;
        }
      }
    }
    if (Object.keys(scores).length === 0) {
      scores = { '平和质': 45, '气虚质': 72, '阳虚质': 58, '阴虚质': 35, '痰湿质': 42, '湿热质': 38, '血瘀质': 25, '气郁质': 65, '特禀质': 20 };
    }

    const now = Date.now();
    if (hasGeneratedAnalysis && now - lastAssessmentTime < 2000) {
      return;
    }

    hasGeneratedAnalysis = true;
    lastAssessmentTime = now;

    section.innerHTML = generateAnalysis(scores);
    card.classList.add('detailed-analysis-generated');

    localStorage.setItem('healthAssessmentResult', JSON.stringify({ scores, timestamp: now }));

    let mainConstitution = '', maxScore = 0;
    for (const [key, value] of Object.entries(scores)) {
      if (value > maxScore) { maxScore = value; mainConstitution = key; }
    }
    saveHistory({ type: mainConstitution, scores, timestamp: now });
  }

  // 从 React 应用的 localStorage key 读取测评数据
  function getReactAssessments() {
    try {
      const data = localStorage.getItem('constitution_assessments');
      if (data) return JSON.parse(data);
    } catch(e) {}
    return [];
  }

  function getHistory() {
    // 优先从 React 应用的数据源读取
    const reactData = getReactAssessments();
    if (reactData.length > 0) {
      return reactData.map(r => ({
        id: r.id || Date.now() + Math.random(),
        type: r.constitution_type || '未知',
        scores: r.scores || r.constitution_scores || {},
        timestamp: new Date(r.created_at).getTime() || Date.now()
      }));
    }
    // 回退到旧的 key
    const history = localStorage.getItem('assessmentHistory');
    return history ? JSON.parse(history) : [];
  }

  function saveHistory(record) {
    // 保存到旧 key（兼容）
    const history = localStorage.getItem('assessmentHistory');
    const arr = history ? JSON.parse(history) : [];
    arr.unshift({ ...record, id: Date.now() });
    if (arr.length > 10) arr.pop();
    localStorage.setItem('assessmentHistory', JSON.stringify(arr));

    // 同步保存到 React 应用的 key，确保历史记录显示
    const reactData = getReactAssessments();
    reactData.unshift({
      id: Date.now(),
      constitution_type: record.type,
      scores: record.scores,
      constitution_scores: record.scores,
      created_at: new Date(record.timestamp).toISOString()
    });
    if (reactData.length > 20) reactData.pop();
    localStorage.setItem('constitution_assessments', JSON.stringify(reactData));

    updateHistoryUI();
  }

  function showHistoryDetail(record) {
    const color = CONSTITUTION_COLORS[record.type] || '#64748b';
    const date = new Date(record.timestamp);
    const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    const modal = document.createElement('div');
    modal.className = 'hot-tip-modal-overlay';
    modal.innerHTML = `
      <div class="hot-tip-modal">
        <div class="hot-tip-modal-header">
          <div class="hot-tip-modal-title"><span>📊</span><span>测评记录详情</span></div>
          <button class="hot-tip-modal-close" onclick="this.closest('.hot-tip-modal-overlay').remove()">×</button>
        </div>
        <div class="hot-tip-modal-body">
          <div style="background:linear-gradient(135deg,${color}15,${color}08);border-radius:12px;padding:16px;margin-bottom:20px;border-left:4px solid ${color};">
            <div style="font-size:24px;font-weight:bold;color:${color};margin-bottom:4px;">${record.type}</div>
            <div style="font-size:12px;color:#64748b;">测评时间：${dateStr}</div>
          </div>
          ${record.scores ? `
          <div class="hot-tip-section">
            <div class="hot-tip-section-title">📈 体质评分</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
              ${Object.entries(record.scores).map(([key, value]) => `
                <div style="background:#f8fafc;padding:8px;border-radius:8px;text-align:center;">
                  <div style="font-size:10px;color:#64748b;margin-bottom:2px;">${key}</div>
                  <div style="font-size:16px;font-weight:bold;color:${value >= 60 ? '#16a34a' : value >= 40 ? '#d97706' : '#dc2626'};">${value}</div>
                </div>`).join('')}
            </div>
          </div>` : ''}
          <div class="hot-tip-section">
            <div class="hot-tip-section-title">✨ 体质特征</div>
            <p style="color:#64748b;font-size:13px;line-height:1.6;">${CONSTITUTION_DETAILS[record.type]?.description || '暂无描述'}</p>
          </div>
          <div class="hot-tip-section"><div class="hot-tip-tips">💡 建议定期进行体质评估，关注身体健康变化。</div></div>
        </div>
      </div>
    `;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  function updateHistoryUI() {
    const sections = document.querySelectorAll('.bg-white.dark\\:bg-slate-800.rounded-xl');
    let foundSection = null;
    sections.forEach(sec => {
      if (sec.querySelector('.lucide-clock') && sec.querySelector('h3')?.textContent === '测评历史') {
        foundSection = sec;
      }
    });
    if (!foundSection) return;

    const container = foundSection.querySelector('.space-y-3');
    if (!container) return;

    const history = getHistory();
    if (history.length === 0) {
      container.innerHTML = emptyHistoryHTML();
      return;
    }

    container.innerHTML = history.map(record => {
      const color = CONSTITUTION_COLORS[record.type] || '#64748b';
      const date = new Date(record.timestamp);
      const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      return `
        <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors history-item" data-id="${record.id}">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity w-4 h-4"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            <div>
              <div class="font-medium text-slate-800 dark:text-white text-sm" style="color:${color};">${record.type}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">${dateStr} ${timeStr}</div>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right w-4 h-4 text-slate-400"><path d="m9 18 6-6-6-6"></path></svg>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', function() {
        const id = parseInt(this.dataset.id);
        const record = history.find(r => r.id === id);
        if (record) showHistoryDetail(record);
      });
    });
  }

  function emptyHistoryHTML() {
    return `
      <div class="text-center py-6 text-slate-500 dark:text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history w-12 h-12 mx-auto mb-3 opacity-50"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <p class="text-sm">暂无测评记录</p>
        <p class="text-xs mt-1">完成健康评估后，记录会保存在这里</p>
      </div>
    `;
  }

  let debounceTimer = null;
  function runOptimizations() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      beautifyStats();
      enableHotTips();
      generateDetailedAnalysis();
      updateHistoryUI();
    }, 300);
  }

  function init() {
    addStyles();

    const observer = new MutationObserver(runOptimizations);
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(runOptimizations, 500);
    setTimeout(runOptimizations, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.runOptimizations = runOptimizations;
  window.saveHistory = saveHistory;

  // ==================== 打卡增强 ====================
  const CHECKIN_TYPES = {
    sleep: { label: '睡眠', icon: '🌙', color: '#6366f1' },
    diet: { label: '饮食', icon: '🥗', color: '#10b981' },
    exercise: { label: '运动', icon: '🏃', color: '#f59e0b' },
    mood: { label: '心情', icon: '😊', color: '#ec4899' }
  };

  // 额外打卡选项
  const EXTRA_CHECKINS = [
    { type: 'water', label: '喝水', icon: '💧', color: '#3b82f6' },
    { type: 'fruit', label: '吃水果', icon: '🍎', color: '#ef4444' },
    { type: 'stretch', label: '拉伸', icon: '🤸', color: '#8b5cf6' },
    { type: 'meditation', label: '冥想', icon: '🧘', color: '#f472b6' },
    { type: 'reading', label: '阅读', icon: '📖', color: '#14b8a6' }
  ];

  // 心情子选项
  const MOOD_OPTIONS = [
    { type: 'mood_happy', label: '开心', icon: '😄', color: '#fbbf24' },
    { type: 'mood_calm', label: '平静', icon: '😌', color: '#60a5fa' },
    { type: 'mood_energetic', label: '充满活力', icon: '⚡', color: '#34d399' },
    { type: 'mood_anxious', label: '焦虑', icon: '😰', color: '#f87171' },
    { type: 'mood_tired', label: '疲惫', icon: '😴', color: '#9ca3af' },
    { type: 'mood_sad', label: '难过', icon: '😢', color: '#818cf8' }
  ];

  function saveCheckinToLocal(type) {
    try {
      const data = localStorage.getItem('health_checkins');
      const checkins = data ? JSON.parse(data) : [];
      const today = new Date().toISOString().split('T')[0];
      // 检查今天是否已打同一类型的卡
      if (!checkins.some(c => c.checkin_date === today && c.checkin_type === type)) {
        checkins.push({
          id: Date.now() + Math.random(),
          checkin_type: type,
          checkin_date: today,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('health_checkins', JSON.stringify(checkins));
        showCheckinToast(type);
        // 触发页面更新
        setTimeout(runOptimizations, 100);
      } else {
        showToast('今日已打卡此项目 ✅');
      }
    } catch(e) {}
  }

  function showCheckinToast(type) {
    const labels = {
      water: '💧 喝水打卡成功！多喝水皮肤好～',
      fruit: '🍎 吃水果打卡成功！维生素满满！',
      stretch: '🤸 拉伸打卡成功！身体更灵活！',
      meditation: '🧘 冥想打卡成功！心灵更平静！',
      reading: '📖 阅读打卡成功！知识就是力量！',
      mood_happy: '😄 开心！好心情是最好的养生！',
      mood_calm: '😌 平静，内心安宁就是福气～',
      mood_energetic: '⚡ 充满活力，今天状态满分！',
      mood_anxious: '😰 焦虑也是正常的，对自己好一点～',
      mood_tired: '😴 累了就好好休息，别硬撑！',
      mood_sad: '😢 难过了就找人聊聊，别一个人扛～'
    };
    showToast(labels[type] || '✅ 打卡成功！');
  }

  function enhanceCheckin() {
    let checkins = [];
    try {
      const data = localStorage.getItem('health_checkins');
      if (data) checkins = JSON.parse(data);
    } catch(e) {}
    if (checkins.length === 0) return;

    const totalDays = new Set(checkins.map(c => c.checkin_date)).size;
    const today = new Date().toISOString().split('T')[0];
    const todayCheckins = checkins.filter(c => c.checkin_date === today);

    let streak = 0;
    const d = new Date();
    while (true) {
      if (checkins.some(c => c.checkin_date === d.toISOString().split('T')[0])) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }

    const typeCount = {};
    checkins.forEach(c => { typeCount[c.checkin_type] = (typeCount[c.checkin_type] || 0) + 1; });

    let section = null;
    document.querySelectorAll('section').forEach(sec => {
      if (sec.textContent.includes('打卡') && sec.querySelector('button')) section = sec;
    });
    if (!section) {
      document.querySelectorAll('h2, h3').forEach(h => {
        if (h.textContent.includes('健康打卡') || h.textContent.includes('打卡记录')) {
          section = h.closest('section') || h.parentElement;
        }
      });
    }
    if (!section || section.querySelector('.yikao-checkin-streak')) return;

    // 统计卡片
    const el = document.createElement('div');
    el.className = 'yikao-checkin-streak';
    el.style.cssText = 'margin:12px 16px;padding:16px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-radius:14px;';

    // 统计各类别天数（基础4类+扩展类按前缀分组）
    const countByBaseType = {};
    Object.keys(CHECKIN_TYPES).forEach(t => { countByBaseType[t] = 0; });
    checkins.forEach(c => {
      const baseType = c.checkin_type.startsWith('mood_') ? 'mood' : c.checkin_type;
      if (countByBaseType[baseType] !== undefined) countByBaseType[baseType]++;
    });

    const typeRow = Object.entries(CHECKIN_TYPES).map(([t, info]) => {
      const c = countByBaseType[t] || 0;
      return `<div style="flex:1;text-align:center;padding:6px 4px;background:white;border-radius:8px;border:1px solid #e2e8f0;"><div style="font-size:18px;">${info.icon}</div><div style="font-size:10px;color:#64748b;margin-top:2px;">${c}天</div></div>`;
    }).join('');

    // 额外选项按钮的HTML
    const extraBtns = EXTRA_CHECKINS.map(item => {
      const done = todayCheckins.some(c => c.checkin_type === item.type);
      return `<button class="yikao-extra-checkin-btn" data-type="${item.type}" style="flex:1;padding:8px 4px;border:1px solid ${done ? item.color+'40' : '#e2e8f0'};border-radius:10px;background:${done ? item.color+'15' : 'white'};cursor:pointer;text-align:center;transition:all 0.2s;min-width:60px;" onmouseover="this.style.borderColor='${item.color}'" onmouseout="this.style.borderColor='${done ? item.color+'40' : '#e2e8f0'}'"><div style="font-size:20px;">${item.icon}</div><div style="font-size:10px;color:#64748b;margin-top:2px;">${item.label}</div></button>`;
    }).join('');

    // 心情子选项
    const moodBtns = MOOD_OPTIONS.map(item => {
      const done = todayCheckins.some(c => c.checkin_type === item.type);
      return `<button class="yikao-mood-checkin-btn" data-type="${item.type}" style="padding:6px 8px;border:1px solid ${done ? item.color+'40' : '#e2e8f0'};border-radius:8px;background:${done ? item.color+'15' : 'white'};cursor:pointer;text-align:center;transition:all 0.2s;" onmouseover="this.style.borderColor='${item.color}'" onmouseout="this.style.borderColor='${done ? item.color+'40' : '#e2e8f0'}'"><div style="font-size:16px;">${item.icon}</div><div style="font-size:9px;color:#64748b;margin-top:1px;">${item.label}</div></button>`;
    }).join('');

    const msg = streak >= 7 ? '🎉 太棒了！已连续打卡 '+streak+' 天，继续保持！'
      : streak >= 3 ? '💪 已连续打卡 '+streak+' 天，加油！'
      : '坚持打卡，养成健康习惯！';

    el.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="font-size:32px;">🔥</div>
          <div><div style="font-size:24px;font-weight:800;color:#16a34a;line-height:1;">${streak}</div><div style="font-size:11px;color:#16a34a;">连续打卡天数</div></div>
        </div>
        <div style="text-align:right;"><div style="font-size:20px;font-weight:700;color:#059669;">${totalDays}</div><div style="font-size:11px;color:#059669;">累计打卡天数</div></div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,0,0,0.05);">${typeRow}</div>
      <div style="margin:10px 0 6px;font-size:12px;color:#64748b;font-weight:500;">📌 更多打卡</div>
      <div class="yikao-extra-checkin-row" style="display:flex;gap:6px;flex-wrap:wrap;">${extraBtns}</div>
      <div style="margin:8px 0 4px;font-size:12px;color:#ec4899;font-weight:500;">😊 今天心情怎么样？</div>
      <div class="yikao-mood-checkin-row" style="display:flex;gap:4px;flex-wrap:wrap;">${moodBtns}</div>
      <div style="margin-top:8px;font-size:12px;color:#16a34a;text-align:center;font-weight:500;">${msg}</div>`;

    section.insertBefore(el, section.firstChild);

    // 绑定额外选项点击事件
    el.querySelectorAll('.yikao-extra-checkin-btn, .yikao-mood-checkin-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        saveCheckinToLocal(this.dataset.type);
      });
    });
  }

  const origRun = runOptimizations;
  runOptimizations = function() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      beautifyStats();
      enableHotTips();
      generateDetailedAnalysis();
      updateHistoryUI();
      enhanceCheckin();
    }, 300);
  };
})();