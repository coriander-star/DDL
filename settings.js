// 设置面板功能
(function() {
  'use strict';

  // 等待页面加载完成
  function initSettings() {
    // 深色模式切换
    const darkModeToggle = document.querySelector('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg .w-12.h-6.bg-slate-200.dark\\:bg-teal-500');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDarkMode();
      });
    }

    // 健康提醒切换
    const healthReminderToggle = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg .w-12.h-6')[1];
    if (healthReminderToggle) {
      healthReminderToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleHealthReminder();
      });
    }

    // 关于医靠
    const aboutBtn = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg.cursor-pointer')[0];
    if (aboutBtn) {
      aboutBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showAboutModal();
      });
    }

    // 使用说明
    const helpBtn = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg.cursor-pointer')[1];
    if (helpBtn) {
      helpBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showHelpModal();
      });
    }

    // 意见反馈
    const feedbackBtn = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg.cursor-pointer')[2];
    if (feedbackBtn) {
      feedbackBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showFeedbackModal();
      });
    }

    // 添加登录注册按钮
    addLoginButton();
  }

  // 深色模式切换
  function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    } else {
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    }
    
    // 更新开关状态
    updateToggleUI();
  }

  // 健康提醒切换
  function toggleHealthReminder() {
    const isEnabled = localStorage.getItem('healthReminder') === 'true';
    localStorage.setItem('healthReminder', (!isEnabled).toString());
    
    // 更新开关状态
    updateHealthReminderUI();
    
    // 显示提示
    showToast(!isEnabled ? '健康提醒已开启' : '健康提醒已关闭');
  }

  // 更新深色模式开关UI
  function updateToggleUI() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    const toggle = document.querySelector('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg .w-12.h-6.bg-slate-200.dark\\:bg-teal-500');
    if (toggle) {
      const knob = toggle.querySelector('div');
      if (isDark) {
        toggle.classList.remove('bg-slate-200');
        toggle.classList.add('bg-teal-500');
        knob.style.right = '4px';
        knob.style.left = 'auto';
      } else {
        toggle.classList.remove('bg-teal-500');
        toggle.classList.add('bg-slate-200');
        knob.style.left = '4px';
        knob.style.right = 'auto';
      }
    }
  }

  // 更新健康提醒开关UI
  function updateHealthReminderUI() {
    const isEnabled = localStorage.getItem('healthReminder') === 'true';
    const toggle = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg .w-12.h-6')[1];
    if (toggle) {
      const knob = toggle.querySelector('div');
      if (isEnabled) {
        toggle.classList.add('bg-teal-500');
        toggle.classList.remove('bg-slate-200');
        knob.style.right = '4px';
        knob.style.left = 'auto';
      } else {
        toggle.classList.remove('bg-teal-500');
        toggle.classList.add('bg-slate-200');
        knob.style.left = '4px';
        knob.style.right = 'auto';
      }
    }
  }

  // 显示关于医靠弹窗
  function showAboutModal() {
    const modal = createModal('关于医靠', `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🌿</div>
        <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">医靠</h3>
        <p style="color: #666; margin-bottom: 16px;">脆皮大学生的健康助手</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; text-align: left; font-size: 14px; line-height: 1.6;">
          <p><strong>版本：</strong>v1.0.0</p>
          <p><strong>开发者：</strong>医靠团队</p>
          <p><strong>简介：</strong>医靠是一款专为大学生设计的健康管理应用，结合中医智慧与现代科技，提供体质评估、AI舌诊、急救指南、健康养生、饮食指南、穴位按摩、情绪疗愈等全方位健康服务。</p>
        </div>
      </div>
    `);
    document.body.appendChild(modal);
  }

  // 显示使用说明弹窗
  function showHelpModal() {
    const modal = createModal('使用说明', `
      <div style="padding: 20px; font-size: 14px; line-height: 1.8;">
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🏠 首页</h4>
          <p style="color: #666;">快速访问所有功能模块，获取健康资讯。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🔍 健康评估</h4>
          <p style="color: #666;">通过中医九种体质测评，了解您的体质类型。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">👅 AI舌诊</h4>
          <p style="color: #666;">拍照分析舌象，获取健康状况评估。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🏥 急救指南</h4>
          <p style="color: #666;">突发不适时的应急处理方法。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🍵 健康养生</h4>
          <p style="color: #666;">适合大学生的轻养生方案和建议。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🥗 饮食指南</h4>
          <p style="color: #666;">根据体质推荐饮食搭配和食疗方案。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">💆 穴位按摩</h4>
          <p style="color: #666;">常用穴位定位和按摩手法指导。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🌈 情绪疗愈</h4>
          <p style="color: #666;">冥想、呼吸调节等情绪管理技巧。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">👤 个人中心</h4>
          <p style="color: #666;">查看健康记录、打卡记录和测评报告。</p>
        </div>
      </div>
    `);
    document.body.appendChild(modal);
  }

  // 显示意见反馈弹窗
  function showFeedbackModal() {
    const modal = createModal('意见反馈', `
      <div style="padding: 20px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">反馈类型</label>
          <select id="feedbackType" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
            <option value="suggestion">功能建议</option>
            <option value="bug">问题反馈</option>
            <option value="content">内容纠错</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">详细描述</label>
          <textarea id="feedbackContent" rows="4" placeholder="请详细描述您的建议或遇到的问题..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">联系方式（可选）</label>
          <input type="text" id="feedbackContact" placeholder="邮箱或手机号" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
        </div>
        <button onclick="submitFeedback()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #ff6b6b, #e74c3c); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">提交反馈</button>
      </div>
    `);
    document.body.appendChild(modal);
  }

  // 创建弹窗
  function createModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="background: white; border-radius: 16px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="padding: 16px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 18px; font-weight: bold; margin: 0;">${title}</h3>
          <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
        </div>
        <div class="modal-content">${content}</div>
      </div>
    `;
    
    modal.className = 'modal-overlay';
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    return modal;
  }

  // 提交反馈
  window.submitFeedback = function() {
    const type = document.getElementById('feedbackType').value;
    const content = document.getElementById('feedbackContent').value;
    const contact = document.getElementById('feedbackContact').value;
    
    if (!content.trim()) {
      showToast('请填写详细描述');
      return;
    }
    
    // 模拟提交
    console.log('反馈提交:', { type, content, contact });
    showToast('感谢您的反馈！我们会尽快处理。');
    
    // 关闭弹窗
    document.querySelector('.modal-overlay').remove();
  };

  // 显示提示
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10001;
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateX(-50%) translateY(0); }
      to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
    .login-register-btn {
      padding: 6px 16px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }
    .login-register-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    .login-register-btn:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(style);

  // 添加登录注册按钮和昵称编辑到用户信息卡片
  function addLoginButton() {
    const userCard = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-2xl.shadow-lg.p-6.mb-6');
    if (!userCard) return;

    const existingBtn = userCard.querySelector('.login-register-btn');
    if (existingBtn) return;

    const flexContainer = userCard.querySelector('.flex.items-center.gap-4');
    if (!flexContainer) return;

    const btnGroup = document.createElement('div');
    btnGroup.style.cssText = 'display:flex;gap:6px;align-items:center;';

    const loginBtn = document.createElement('button');
    loginBtn.className = 'login-register-btn';

    if (checkLoginStatus()) {
      loginBtn.textContent = '退出登录';
      loginBtn.onclick = createLogoutHandler(loginBtn);

      // 添加修改昵称按钮
      const renameBtn = document.createElement('button');
      renameBtn.textContent = '✏️';
      renameBtn.title = '修改昵称';
      renameBtn.style.cssText = 'padding:6px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:20px;font-size:13px;cursor:pointer;transition:all 0.2s;';
      renameBtn.onclick = function(e) {
        e.stopPropagation();
        showRenameModal();
      };
      btnGroup.appendChild(renameBtn);
    } else {
      loginBtn.textContent = '登录/注册';
      loginBtn.onclick = function(e) {
        e.stopPropagation();
        showLoginModal();
      };
    }

    btnGroup.appendChild(loginBtn);
    flexContainer.appendChild(btnGroup);

    updateUserCardFromBackend();
  }

  // 显示修改昵称弹窗
  function showRenameModal() {
    const modal = document.createElement('div');
    modal.className = 'yikao-auth-modal-overlay';
    const currentNickname = localStorage.getItem('userNickname') || '医靠用户';
    modal.innerHTML = `
      <style>
        .rename-modal { background: white; border-radius: 16px; width: 90%; max-width: 360px; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease; text-align: center; }
        .dark .rename-modal { background: #1e293b; }
        .rename-title { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 6px; }
        .dark .rename-title { color: white; }
        .rename-sub { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .rename-input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px; text-align: center; box-sizing: border-box; outline: none; transition: border-color 0.2s; background: white; color: #1f2937; }
        .rename-input:focus { border-color: #e74c3c; }
        .dark .rename-input { background: #374151; border-color: #4b5563; color: white; }
        .rename-btn { width: 100%; padding: 12px; margin-top: 12px; background: linear-gradient(135deg, #ff6b6b, #e74c3c); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .rename-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(231,76,60,0.3); }
        .rename-cancel { width: 100%; padding: 10px; margin-top: 8px; background: transparent; color: #94a3b8; border: none; font-size: 14px; cursor: pointer; }
        .rename-cancel:hover { color: #64748b; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      </style>
      <div class="rename-modal">
        <div class="rename-title">修改昵称</div>
        <div class="rename-sub">给自己取一个喜欢的名字吧</div>
        <input type="text" class="rename-input" id="renameInput" value="${currentNickname}" placeholder="输入新昵称" maxlength="20" autofocus>
        <button class="rename-btn" id="renameSubmitBtn">保存</button>
        <button class="rename-cancel" onclick="this.closest('.yikao-auth-modal-overlay').remove()">取消</button>
      </div>
    `;
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);

    document.getElementById('renameSubmitBtn').addEventListener('click', function() {
      const newName = document.getElementById('renameInput').value.trim();
      if (!newName) { showToast('昵称不能为空'); return; }
      if (newName.length > 20) { showToast('昵称不能超过20个字'); return; }

      localStorage.setItem('userNickname', newName);

      const token = localStorage.getItem('authToken');
      if (token && window.apiUpdateProfile) {
        apiUpdateProfile(newName, '').catch(() => {});
      }

      const userCard = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-2xl.shadow-lg.p-6.mb-6');
      if (userCard) {
        const nameEl = userCard.querySelector('h1');
        if (nameEl) nameEl.textContent = newName;
      }

      modal.remove();
      showToast('昵称已修改为：' + newName);
    });

    document.getElementById('renameInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('renameSubmitBtn').click();
    });

    setTimeout(() => {
      const input = document.getElementById('renameInput');
      input.select();
    }, 100);
  }

  function createLogoutHandler(btn) {
    return function(e) {
      e.stopPropagation();
      logout();
      showToast('已退出登录');
      
      btn.textContent = '登录/注册';
      btn.onclick = function(e) {
        e.stopPropagation();
        showLoginModal();
      };
      
      // 重置用户卡片内容
      const userCard = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-2xl.shadow-lg.p-6.mb-6');
      if (userCard) {
        const userName = userCard.querySelector('h1');
        if (userName) {
          userName.textContent = '脆皮大学生';
        }
        const userDays = userCard.querySelector('p.text-slate-500');
        if (userDays) {
          userDays.textContent = '加入医靠第 12 天';
        }
        const loginCount = userCard.querySelector('.text-2xl.font-bold.text-emerald-600');
        if (loginCount) {
          loginCount.textContent = '0';
        }
        const loginLabel = userCard.querySelector('.text-xs.text-slate-500');
        if (loginLabel) {
          loginLabel.textContent = '次测评';
        }
        
        // 重置统计卡片
        const statsCards = userCard.querySelectorAll('.stats-row-card');
        if (statsCards.length === 5) {
          statsCards[0].querySelector('.stats-value').textContent = '0';
          statsCards[1].querySelector('.stats-value').textContent = '0';
          statsCards[2].querySelector('.stats-value').textContent = '0';
          statsCards[3].querySelector('.stats-value').textContent = '0';
          statsCards[4].querySelector('.stats-value').textContent = '未测评';
        }
      }
      
      // 清空测评历史显示
      const historySection = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-xl');
      if (historySection && historySection.querySelector('.lucide-clock')) {
        const historyContainer = historySection.querySelector('.space-y-3');
        if (historyContainer) {
          historyContainer.innerHTML = '<div class="text-center text-slate-500 py-4">暂无测评记录</div>';
        }
      }
      
      // 刷新页面确保完全恢复初始状态
      setTimeout(() => {
        location.reload();
      }, 500);
    };
  }

  // 统一认证检查：支持后端API登录和本地登录两种模式
  function checkLoginStatus() {
    // 检查后端API登录方式（优先）
    if (localStorage.getItem('authToken')) return true;
    // 检查本地登录方式（旧）
    const user = localStorage.getItem('loggedInUser');
    return !!user;
  }

  function getLoggedInUser() {
    // 优先从后端API登录凭证读取
    const email = localStorage.getItem('userEmail');
    const nickname = localStorage.getItem('userNickname');
    const userId = localStorage.getItem('userId');
    if (userId) {
      return { id: userId, email, nickname, source: 'api' };
    }
    // 回退到本地登录方式
    const user = localStorage.getItem('loggedInUser');
    return user ? { ...JSON.parse(user), source: 'local' } : null;
  }

  function saveLoginStatus(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('registerTime');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('registerTime');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('healthAssessmentResult');
    localStorage.removeItem('assessmentHistory');
  }

  // ==================== 统一登录注册弹窗 ====================
  function showLoginModal() {
    const existingModal = document.querySelector('.yikao-auth-modal-overlay');
    if (existingModal) { existingModal.remove(); return; }

    const modal = document.createElement('div');
    modal.className = 'yikao-auth-modal-overlay';
    modal.innerHTML = `
      <style>
        .yikao-auth-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
          z-index: 10001; animation: fadeIn 0.2s ease;
        }
        .yikao-auth-modal {
          background: white; border-radius: 16px; width: 90%; max-width: 400px;
          max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.3s ease;
        }
        .dark .yikao-auth-modal { background: #1e293b; }
        .yikao-auth-tabs {
          display: flex; border-bottom: 1px solid #e2e8f0; padding: 4px 4px 0 4px;
        }
        .yikao-auth-tab {
          flex: 1; padding: 12px; text-align: center; font-size: 14px; font-weight: 500;
          cursor: pointer; border: none; background: transparent; color: #94a3b8;
          border-bottom: 2px solid transparent; transition: all 0.2s ease;
        }
        .yikao-auth-tab.active { color: #e74c3c; border-bottom-color: #e74c3c; background: transparent; }
        .yikao-auth-tab:hover { color: #64748b; }
        .dark .yikao-auth-tab { color: #94a3b8; }
        .dark .yikao-auth-tab.active { color: #ff6b6b; border-bottom-color: #ff6b6b; }
        .yikao-auth-body { padding: 20px; }
        .yikao-auth-field { margin-bottom: 14px; }
        .yikao-auth-label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
        .dark .yikao-auth-label { color: #e5e7eb; }
        .yikao-auth-input {
          width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 10px;
          font-size: 14px; transition: all 0.2s ease; box-sizing: border-box;
          background: white; color: #1f2937; outline: none;
        }
        .dark .yikao-auth-input { background: #374151; border-color: #4b5563; color: white; }
        .yikao-auth-input:focus { border-color: #e74c3c; box-shadow: 0 0 0 3px rgba(231,76,60,0.1); }
        .yikao-auth-code-row { display: flex; gap: 8px; }
        .yikao-auth-code-row .yikao-auth-input { flex: 1; }
        .yikao-auth-code-btn {
          padding: 10px 16px; background: #e74c3c; color: white; border: none;
          border-radius: 10px; font-size: 13px; cursor: pointer; white-space: nowrap;
          transition: all 0.2s ease; flex-shrink: 0;
        }
        .yikao-auth-code-btn:hover { background: #c0392b; }
        .yikao-auth-code-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .yikao-auth-btn {
          width: 100%; padding: 12px; background: linear-gradient(135deg, #ff6b6b, #e74c3c);
          color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease; margin-top: 8px;
        }
        .yikao-auth-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(231,76,60,0.3); }
        .yikao-auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .yikao-auth-switch { text-align: center; margin-top: 16px; font-size: 13px; color: #64748b; }
        .yikao-auth-switch a { color: #e74c3c; cursor: pointer; font-weight: 500; }
        .yikao-auth-switch a:hover { text-decoration: underline; }
        .yikao-auth-error { color: #e74c3c; font-size: 13px; text-align: center; margin-top: 8px; min-height: 20px; }
        .yikao-auth-success { color: #10b981; font-size: 13px; text-align: center; margin-top: 8px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      </style>
      <div class="yikao-auth-modal">
        <div class="yikao-auth-tabs" id="yikaoAuthTabs">
          <button class="yikao-auth-tab active" data-tab="email-login" onclick="switchAuthTab('email-login')">邮箱登录</button>
          <button class="yikao-auth-tab" data-tab="phone-login" onclick="switchAuthTab('phone-login')">手机登录</button>
          <button class="yikao-auth-tab" data-tab="register" onclick="switchAuthTab('register')">注册</button>
        </div>
        <div class="yikao-auth-body">
          <div id="yikaoAuthEmailLogin">
            <div class="yikao-auth-field">
              <label class="yikao-auth-label">邮箱地址</label>
              <input type="email" id="authEmail" class="yikao-auth-input" placeholder="请输入邮箱地址" autocomplete="email">
            </div>
            <div class="yikao-auth-field">
              <label class="yikao-auth-label">密码</label>
              <input type="password" id="authEmailPwd" class="yikao-auth-input" placeholder="请输入密码" autocomplete="current-password">
            </div>
            <button class="yikao-auth-btn" onclick="handleEmailLoginSubmit()">登 录</button>
            <div class="yikao-auth-error" id="authEmailLoginError"></div>
          </div>
          <div id="yikaoAuthPhoneLogin" style="display:none">
            <div class="yikao-auth-field">
              <label class="yikao-auth-label">手机号</label>
              <input type="tel" id="authPhone" class="yikao-auth-input" placeholder="请输入手机号">
            </div>
            <div class="yikao-auth-field">
              <label class="yikao-auth-label">密码</label>
              <input type="password" id="authPhonePwd" class="yikao-auth-input" placeholder="请输入密码">
            </div>
            <button class="yikao-auth-btn" onclick="handlePhoneLoginSubmit()">登 录</button>
            <div class="yikao-auth-error" id="authPhoneLoginError"></div>
          </div>
          <div id="yikaoAuthRegister" style="display:none">
            <div style="display:flex;gap:8px;margin-bottom:14px;">
              <button class="yikao-auth-subtab active" data-subtab="reg-email" onclick="switchRegTab('reg-email')" style="flex:1;padding:8px;border:1px solid #e74c3c;border-radius:8px;background:#fff5f5;color:#e74c3c;font-size:13px;font-weight:500;cursor:pointer;">📧 邮箱注册</button>
              <button class="yikao-auth-subtab" data-subtab="reg-phone" onclick="switchRegTab('reg-phone')" style="flex:1;padding:8px;border:1px solid #e2e8f0;border-radius:8px;background:white;color:#94a3b8;font-size:13px;font-weight:500;cursor:pointer;">📱 手机注册</button>
            </div>
            <div id="yikaoRegEmail">
              <div class="yikao-auth-field">
                <label class="yikao-auth-label">邮箱地址</label>
                <input type="email" id="authRegEmail" class="yikao-auth-input" placeholder="请输入邮箱地址" autocomplete="email">
              </div>
              <div class="yikao-auth-field">
                <label class="yikao-auth-label">验证码</label>
                <div class="yikao-auth-code-row">
                  <input type="text" id="authRegCode" class="yikao-auth-input" placeholder="请输入验证码" maxlength="6">
                  <button class="yikao-auth-code-btn" id="authSendCodeBtn" onclick="handleSendRegCode()">发送验证码</button>
                </div>
              </div>
              <div class="yikao-auth-field">
                <label class="yikao-auth-label">设置密码</label>
                <input type="password" id="authRegPwd" class="yikao-auth-input" placeholder="至少8位，含字母和数字">
              </div>
              <button class="yikao-auth-btn" onclick="handleRegEmailSubmit()">注 册</button>
            </div>
            <div id="yikaoRegPhone" style="display:none">
              <div class="yikao-auth-field">
                <label class="yikao-auth-label">手机号</label>
                <input type="tel" id="authRegPhone" class="yikao-auth-input" placeholder="请输入手机号">
              </div>
              <div class="yikao-auth-field">
                <label class="yikao-auth-label">验证码</label>
                <div class="yikao-auth-code-row">
                  <input type="text" id="authRegPhoneCode" class="yikao-auth-input" placeholder="请输入验证码" maxlength="6">
                  <button class="yikao-auth-code-btn" id="authSendPhoneCodeBtn" onclick="handleSendPhoneRegCode()">发送验证码</button>
                </div>
              </div>
              <div class="yikao-auth-field">
                <label class="yikao-auth-label">设置密码</label>
                <input type="password" id="authRegPhonePwd" class="yikao-auth-input" placeholder="至少8位，含字母和数字">
              </div>
              <button class="yikao-auth-btn" onclick="handleRegPhoneSubmit()">注 册</button>
            </div>
            <div class="yikao-auth-error" id="authRegisterError"></div>
          </div>
        </div>
      </div>
    `;

    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
  }

  // ==================== 认证相关全局函数 ====================

  // 切换Tab
  window.switchAuthTab = function(tab) {
    const tabs = document.querySelectorAll('.yikao-auth-tab');
    const panels = ['yikaoAuthEmailLogin', 'yikaoAuthPhoneLogin', 'yikaoAuthRegister'];
    const tabMap = { 'email-login': 0, 'phone-login': 1, 'register': 2 };

    tabs.forEach(t => t.classList.remove('active'));
    tabs.forEach(t => { if (t.dataset.tab === tab) t.classList.add('active'); });

    panels.forEach((id, i) => {
      document.getElementById(id).style.display = i === tabMap[tab] ? 'block' : 'none';
    });
  };

  // 切换注册子Tab（邮箱/手机）
  window.switchRegTab = function(tab) {
    const subtabs = document.querySelectorAll('#yikaoAuthRegister .yikao-auth-subtab');
    subtabs.forEach(t => {
      if (t.dataset.subtab === tab) {
        t.style.background = '#fff5f5';
        t.style.color = '#e74c3c';
        t.style.borderColor = '#e74c3c';
      } else {
        t.style.background = 'white';
        t.style.color = '#94a3b8';
        t.style.borderColor = '#e2e8f0';
      }
    });
    document.getElementById('yikaoRegEmail').style.display = tab === 'reg-email' ? 'block' : 'none';
    document.getElementById('yikaoRegPhone').style.display = tab === 'reg-phone' ? 'block' : 'none';
  };

  // 邮箱登录
  window.handleEmailLoginSubmit = async function() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authEmailPwd').value;
    const errorEl = document.getElementById('authEmailLoginError');

    if (!email) { errorEl.textContent = '请输入邮箱地址'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = '邮箱格式不正确'; return; }
    if (!password || password.length < 6) { errorEl.textContent = '密码不能少于6位'; return; }
    errorEl.textContent = '登录中...';

    try {
      const result = await apiLogin(email, password);
      if (result.success) {
        showToast('登录成功！');
        document.querySelector('.yikao-auth-modal-overlay').remove();
        setTimeout(() => location.reload(), 300);
      } else {
        errorEl.textContent = result.error || '登录失败';
      }
    } catch (err) {
      errorEl.textContent = err.message || '登录失败，请检查网络';
    }
  };

  // 手机登录（本地）
  window.handlePhoneLoginSubmit = function() {
    const phone = document.getElementById('authPhone').value;
    const password = document.getElementById('authPhonePwd').value;
    const errorEl = document.getElementById('authPhoneLoginError');

    if (!phone) { errorEl.textContent = '请输入手机号'; return; }
    if (!password) { errorEl.textContent = '请输入密码'; return; }

    const users = getLocalUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    if (!user) {
      errorEl.textContent = '手机号或密码错误';
      return;
    }

    saveLocalLoginStatus(user);
    showToast('登录成功！');
    document.querySelector('.yikao-auth-modal-overlay').remove();
    setTimeout(() => location.reload(), 300);
  };

  // 发送注册验证码
  window.handleSendRegCode = async function() {
    const email = document.getElementById('authRegEmail').value.trim();
    const btn = document.getElementById('authSendCodeBtn');
    const errorEl = document.getElementById('authRegisterError');

    if (!email) { errorEl.textContent = '请输入邮箱地址'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = '邮箱格式不正确'; return; }

    btn.disabled = true;
    btn.textContent = '发送中...';
    errorEl.textContent = '';

    try {
      const result = await apiSendCode(email, 'register');
      if (result.success) {
        errorEl.textContent = result.code ? '验证码: ' + result.code : '验证码已发送';
        let countdown = 60;
        const timer = setInterval(() => {
          countdown--;
          btn.textContent = countdown + '秒后重发';
          if (countdown <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.textContent = '发送验证码';
          }
        }, 1000);
      } else {
        btn.disabled = false;
        btn.textContent = '发送验证码';
        errorEl.textContent = result.error || '发送失败';
      }
    } catch (err) {
      btn.disabled = false;
      btn.textContent = '发送验证码';
      errorEl.textContent = err.message || '发送失败';
    }
  };

  // 邮箱注册提交
  window.handleRegEmailSubmit = async function() {
    const email = document.getElementById('authRegEmail').value.trim();
    const code = document.getElementById('authRegCode').value.trim();
    const password = document.getElementById('authRegPwd').value;
    const errorEl = document.getElementById('authRegisterError');

    if (!email) { errorEl.textContent = '请输入邮箱地址'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = '邮箱格式不正确'; return; }
    if (!code) { errorEl.textContent = '请输入验证码'; return; }
    if (!password || password.length < 8) { errorEl.textContent = '密码不能少于8位'; return; }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) { errorEl.textContent = '密码需包含字母和数字'; return; }

    errorEl.textContent = '注册中...';

    try {
      const result = await apiRegister(email, password, code);
      if (result.success) {
        showToast('注册成功！');
        document.querySelector('.yikao-auth-modal-overlay').remove();
        setTimeout(() => location.reload(), 300);
      } else {
        errorEl.textContent = result.error || '注册失败';
      }
    } catch (err) {
      errorEl.textContent = err.message || '注册失败，请检查网络';
    }
  };

  // 手机注册 - 发送验证码
  let currentPhoneRegCode = '';
  window.handleSendPhoneRegCode = function() {
    const phone = document.getElementById('authRegPhone').value.trim();
    const btn = document.getElementById('authSendPhoneCodeBtn');
    const errorEl = document.getElementById('authRegisterError');

    if (!phone) { errorEl.textContent = '请输入手机号'; return; }
    if (!/^1[3-9]\d{9}$/.test(phone)) { errorEl.textContent = '手机号格式不正确'; return; }

    btn.disabled = true;
    btn.textContent = '发送中...';
    errorEl.textContent = '';

    // 生成4位验证码
    currentPhoneRegCode = Math.floor(1000 + Math.random() * 9000).toString();
    errorEl.textContent = '验证码: ' + currentPhoneRegCode;

    let countdown = 60;
    const timer = setInterval(() => {
      countdown--;
      btn.textContent = countdown + '秒后重发';
      if (countdown <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = '发送验证码';
      }
    }, 1000);
  };

  // 手机注册提交
  window.handleRegPhoneSubmit = function() {
    const phone = document.getElementById('authRegPhone').value.trim();
    const code = document.getElementById('authRegPhoneCode').value.trim();
    const password = document.getElementById('authRegPhonePwd').value;
    const errorEl = document.getElementById('authRegisterError');

    if (!phone) { errorEl.textContent = '请输入手机号'; return; }
    if (!/^1[3-9]\d{9}$/.test(phone)) { errorEl.textContent = '手机号格式不正确'; return; }
    if (!code) { errorEl.textContent = '请输入验证码'; return; }
    if (code !== currentPhoneRegCode) { errorEl.textContent = '验证码错误'; return; }
    if (!password || password.length < 8) { errorEl.textContent = '密码不能少于8位'; return; }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) { errorEl.textContent = '密码需包含字母和数字'; return; }

    // 保存到本地用户
    const users = getLocalUsers();
    if (users.find(u => u.phone === phone)) {
      errorEl.textContent = '该手机号已注册';
      return;
    }
    users.push({ phone, password, nickname: '用户' + phone.slice(-4), createdAt: new Date().toISOString() });
    saveLocalUsers(users);

    saveLocalLoginStatus({ phone, nickname: '用户' + phone.slice(-4) });
    showToast('注册成功！');
    document.querySelector('.yikao-auth-modal-overlay').remove();
    setTimeout(() => location.reload(), 300);
  };

  // 本地用户数据存储（手机登录用）
  function getLocalUsers() {
    try { return JSON.parse(localStorage.getItem('yikao_local_phone_users') || '[]'); }
    catch(e) { return []; }
  }
  function saveLocalUsers(users) {
    localStorage.setItem('yikao_local_phone_users', JSON.stringify(users));
  }
  function saveLocalLoginStatus(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    localStorage.setItem('userNickname', user.nickname || '用户');
    localStorage.setItem('isLoggedIn', 'true');
  }
  // 邮箱登录模态框
  function showEmailLoginModal() {
    // 移除已存在的模态框
    const existingModal = document.querySelector('.email-login-modal-overlay');
    if (existingModal) {
      existingModal.remove();
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'email-login-modal-overlay';
    modal.innerHTML = `
      <style>
        .email-login-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
          z-index: 10001; animation: fadeIn 0.2s ease;
        }
        .email-login-modal {
          background: white; border-radius: 16px; width: 90%; max-width: 400px;
          max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.3s ease;
        }
        .dark .email-login-modal { background: #1e293b; }
        .email-login-header {
          padding: 24px 24px 0 24px; text-align: center;
        }
        .email-login-icon {
          width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
          font-size: 28px;
        }
        .email-login-title {
          font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 8px;
        }
        .dark .email-login-title { color: white; }
        .email-login-subtitle {
          font-size: 14px; color: #64748b; margin-bottom: 24px;
        }
        .dark .email-login-subtitle { color: #94a3b8; }
        .email-login-body { padding: 0 24px 24px 24px; }
        .email-input-group {
          margin-bottom: 16px;
        }
        .email-input-label {
          display: block; font-size: 14px; font-weight: 500; color: #374151;
          margin-bottom: 8px;
        }
        .dark .email-input-label { color: #e5e7eb; }
        .email-input {
          width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; transition: all 0.2s ease; box-sizing: border-box;
          background: white; color: #1f2937;
        }
        .dark .email-input { 
          background: #374151; border-color: #4b5563; color: white;
        }
        .email-input:focus {
          outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }
        .email-input::placeholder { color: #9ca3af; }
        .password-input-wrapper {
          position: relative;
        }
        .password-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 18px;
          padding: 4px;
        }
        .password-toggle:hover { color: #6b7280; }
        .forgot-password {
          text-align: right; margin-bottom: 20px;
        }
        .forgot-password-link {
          font-size: 13px; color: #667eea; text-decoration: none; cursor: pointer;
        }
        .forgot-password-link:hover { text-decoration: underline; }
        .login-button {
          width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease; margin-bottom: 16px;
        }
        .login-button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102,126,234,0.4); }
        .login-button:active { transform: translateY(0); }
        .login-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .register-section {
          text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;
        }
        .dark .register-section { border-top-color: #374151; }
        .register-text {
          font-size: 14px; color: #64748b; margin-bottom: 8px;
        }
        .dark .register-text { color: #9ca3af; }
        .register-link {
          color: #667eea; font-weight: 600; cursor: pointer; text-decoration: none;
        }
        .register-link:hover { text-decoration: underline; }
        .remember-me {
          display: flex; align-items: center; margin-bottom: 16px;
        }
        .remember-me input { margin-right: 8px; width: 16px; height: 16px; cursor: pointer; }
        .remember-me label { font-size: 13px; color: #64748b; cursor: pointer; }
        .dark .remember-me label { color: #9ca3af; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      </style>
      <div class="email-login-modal">
        <div class="email-login-header">
          <div class="email-login-icon">📧</div>
          <h2 class="email-login-title">邮箱登录</h2>
          <p class="email-login-subtitle">使用邮箱账号登录医靠</p>
        </div>
        <div class="email-login-body">
          <div class="email-input-group">
            <label class="email-input-label">邮箱地址</label>
            <input type="email" id="loginEmail" class="email-input" placeholder="请输入邮箱地址" autocomplete="email">
          </div>
          <div class="email-input-group">
            <label class="email-input-label">密码</label>
            <div class="password-input-wrapper">
              <input type="password" id="loginPassword" class="email-input" placeholder="请输入密码" style="padding-right: 44px;" autocomplete="current-password">
              <button type="button" class="password-toggle" onclick="toggleEmailPassword()">👁️</button>
            </div>
          </div>
          <div class="remember-me">
            <input type="checkbox" id="rememberEmail">
            <label for="rememberEmail">记住邮箱</label>
          </div>
          <div class="forgot-password">
            <a class="forgot-password-link" onclick="showForgotPasswordModal()">忘记密码？</a>
          </div>
          <button class="login-button" onclick="performEmailLogin()">登 录</button>
          <div class="register-section">
            <p class="register-text">还没有账号？<a class="register-link" onclick="switchToEmailRegister()">立即注册</a></p>
          </div>
        </div>
      </div>
    `;
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    document.body.appendChild(modal);
    
    // 自动填充记住的邮箱
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      document.getElementById('loginEmail').value = savedEmail;
      document.getElementById('rememberEmail').checked = true;
    }

    // 回车登录
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performEmailLogin();
      }
    });
  }

  // 切换密码可见性
  window.toggleEmailPassword = function() {
    const passwordInput = document.getElementById('loginPassword');
    const toggleBtn = document.querySelector('.password-toggle');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleBtn.textContent = '🙈';
    } else {
      passwordInput.type = 'password';
      toggleBtn.textContent = '👁️';
    }
  };

  // 执行邮箱登录
  window.performEmailLogin = function() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberEmail = document.getElementById('rememberEmail').checked;

    // 验证邮箱格式
    if (!email) {
      showToast('请输入邮箱地址');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('请输入正确的邮箱格式');
      return;
    }

    // 验证密码
    if (!password) {
      showToast('请输入密码');
      return;
    }
    if (password.length < 6) {
      showToast('密码长度不能少于6位');
      return;
    }

    // 记住邮箱
    if (rememberEmail) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // 调用后端API登录
    const loginButton = document.querySelector('.login-button');
    loginButton.disabled = true;
    loginButton.textContent = '登录中...';

    // 使用API登录
    apiLogin(email, password)
      .then(result => {
        if (result.success) {
          // 关闭模态框
          const modal = document.querySelector('.email-login-modal-overlay');
          if (modal) modal.remove();

          showToast('登录成功！');
          
          // 触发登录状态更新（如果存在全局函数）
          if (typeof window.updateLoginStatus === 'function') {
            window.updateLoginStatus();
          }

          // 刷新页面以更新UI
          setTimeout(() => {
            location.reload();
          }, 500);
        } else {
          showToast(result.error || '登录失败');
          loginButton.disabled = false;
          loginButton.textContent = '登 录';
        }
      })
      .catch(error => {
        showToast(error.message || '登录失败，请检查网络连接');
        loginButton.disabled = false;
        loginButton.textContent = '登 录';
      });
  };

  // 切换到邮箱注册
  window.switchToEmailRegister = function() {
    // 关闭登录模态框
    const loginModal = document.querySelector('.email-login-modal-overlay');
    if (loginModal) loginModal.remove();

    // 显示注册模态框
    showEmailRegisterModal();
  };

  // 邮箱注册模态框
  function showEmailRegisterModal() {
    const modal = document.createElement('div');
    modal.className = 'email-login-modal-overlay';
    modal.innerHTML = `
      <style>
        .register-modal { background: white; border-radius: 16px; width: 90%; max-width: 400px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease; }
        .dark .register-modal { background: #1e293b; }
        .register-header { padding: 24px 24px 0 24px; text-align: center; }
        .register-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px; }
        .register-title { font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 8px; }
        .dark .register-title { color: white; }
        .register-subtitle { font-size: 14px; color: #64748b; margin-bottom: 24px; }
        .dark .register-subtitle { color: #94a3b8; }
        .register-body { padding: 0 24px 24px 24px; }
        .register-input-group { margin-bottom: 16px; }
        .register-input-label { display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px; }
        .dark .register-input-label { color: #e5e7eb; }
        .register-input { width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; transition: all 0.2s ease; box-sizing: border-box; background: white; color: #1f2937; }
        .dark .register-input { background: #374151; border-color: #4b5563; color: white; }
        .register-input:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        .register-input::placeholder { color: #9ca3af; }
        .verification-code-wrapper { display: flex; gap: 8px; }
        .verification-code-wrapper .register-input { flex: 1; }
        .send-code-btn { padding: 12px 16px; background: #10b981; color: white; border: none; border-radius: 12px; font-size: 14px; cursor: pointer; white-space: nowrap; transition: all 0.2s ease; }
        .send-code-btn:hover { background: #059669; }
        .send-code-btn:disabled { opacity: 0.6; cursor: not-allowed; background: #10b981; }
        .password-strength { margin-top: 8px; }
        .password-strength-bar { height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; }
        .password-strength-fill { height: 100%; width: 0%; transition: all 0.3s ease; }
        .password-strength-text { font-size: 12px; color: #64748b; margin-top: 4px; }
        .strength-weak { background: #ef4444; width: 33%; }
        .strength-medium { background: #f59e0b; width: 66%; }
        .strength-strong { background: #10b981; width: 100%; }
        .register-button { width: 100%; padding: 14px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; margin-bottom: 16px; }
        .register-button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(16,185,129,0.4); }
        .register-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .login-section { text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb; }
        .dark .login-section { border-top-color: #374151; }
        .login-text { font-size: 14px; color: #64748b; }
        .dark .login-text { color: #9ca3af; }
        .login-link { color: #10b981; font-weight: 600; cursor: pointer; }
        .login-link:hover { text-decoration: underline; }
        .terms-checkbox { display: flex; align-items: flex-start; margin-bottom: 16px; }
        .terms-checkbox input { margin-right: 8px; margin-top: 2px; width: 16px; height: 16px; cursor: pointer; }
        .terms-checkbox label { font-size: 13px; color: #64748b; line-height: 1.4; }
        .dark .terms-checkbox label { color: #9ca3af; }
        .terms-link { color: #10b981; cursor: pointer; }
        .terms-link:hover { text-decoration: underline; }
      </style>
      <div class="register-modal">
        <div class="register-header">
          <div class="register-icon">✨</div>
          <h2 class="register-title">邮箱注册</h2>
          <p class="register-subtitle">创建医靠账号，开启健康之旅</p>
        </div>
        <div class="register-body">
          <div class="register-input-group">
            <label class="register-input-label">邮箱地址</label>
            <input type="email" id="registerEmail" class="register-input" placeholder="请输入邮箱地址" autocomplete="email">
          </div>
          <div class="register-input-group">
            <label class="register-input-label">验证码</label>
            <div class="verification-code-wrapper">
              <input type="text" id="registerEmailCode" class="register-input" placeholder="请输入验证码" maxlength="6">
              <button class="send-code-btn" id="sendEmailCodeBtn" onclick="sendEmailVerificationCode()">发送验证码</button>
            </div>
          </div>
          <div class="register-input-group">
            <label class="register-input-label">设置密码</label>
            <input type="password" id="registerEmailPassword" class="register-input" placeholder="请设置密码（至少8位，含字母和特殊符号）" oninput="checkPasswordStrength(this.value)">
            <div class="password-strength">
              <div class="password-strength-bar"><div class="password-strength-fill" id="passwordStrengthFill"></div></div>
              <div class="password-strength-text" id="passwordStrengthText">密码强度：弱</div>
            </div>
          </div>
          <div class="register-input-group">
            <label class="register-input-label">确认密码</label>
            <input type="password" id="registerEmailPasswordConfirm" class="register-input" placeholder="请再次输入密码">
          </div>
          <div class="terms-checkbox">
            <input type="checkbox" id="agreeEmailTerms">
            <label for="agreeEmailTerms">我已阅读并同意<a class="terms-link" onclick="showTermsModal()">《用户协议》</a>和<a class="terms-link" onclick="showPrivacyModal()">《隐私政策》</a></label>
          </div>
          <button class="register-button" onclick="performEmailRegister()">立即注册</button>
          <div class="login-section">
            <p class="login-text">已有账号？<a class="login-link" onclick="switchToEmailLogin()">立即登录</a></p>
          </div>
        </div>
      </div>
    `;
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    document.body.appendChild(modal);
  }

  // 发送邮箱验证码
  let emailCodeTimer = null;
  let emailCodeCountdown = 0;
  let currentEmailCode = '';

  window.sendEmailVerificationCode = function() {
    const email = document.getElementById('registerEmail').value.trim();
    const sendBtn = document.getElementById('sendEmailCodeBtn');

    // 验证邮箱
    if (!email) {
      showToast('请输入邮箱地址');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('请输入正确的邮箱格式');
      return;
    }

    // 检查是否在倒计时中
    if (emailCodeCountdown > 0) {
      return;
    }

    // 调用后端API发送验证码
    sendBtn.disabled = true;
    sendBtn.textContent = '发送中...';

    apiSendCode(email, 'register')
      .then(result => {
        if (result.success) {
          // 演示模式：显示验证码
          showToast(`验证码已发送到 ${email}（演示：${result.code}）`);
          currentEmailCode = result.code;

          // 开始倒计时
          emailCodeCountdown = 60;
          
          emailCodeTimer = setInterval(() => {
            emailCodeCountdown--;
            sendBtn.textContent = `${emailCodeCountdown}秒后重发`;
            
            if (emailCodeCountdown <= 0) {
              clearInterval(emailCodeTimer);
              sendBtn.disabled = false;
              sendBtn.textContent = '发送验证码';
            }
          }, 1000);
        } else {
          showToast(result.error || '发送验证码失败');
          sendBtn.disabled = false;
          sendBtn.textContent = '发送验证码';
        }
      })
      .catch(error => {
        showToast(error.message || '发送验证码失败，请检查网络连接');
        sendBtn.disabled = false;
        sendBtn.textContent = '发送验证码';
      });
  };

  // 检查密码强度
  window.checkPasswordStrength = function(password) {
    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (!password) {
      strengthFill.className = 'password-strength-fill';
      strengthFill.style.width = '0%';
      strengthText.textContent = '密码强度：弱';
      return;
    }

    let strength = 0;
    
    // 长度检查
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // 包含字母
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    
    // 包含数字
    if (/[0-9]/.test(password)) strength += 1;
    
    // 包含特殊符号
    if (/[！@#￥%……&*？!@#$%^&*?]/.test(password)) strength += 1;

    if (strength <= 2) {
      strengthFill.className = 'password-strength-fill strength-weak';
      strengthText.textContent = '密码强度：弱';
    } else if (strength <= 4) {
      strengthFill.className = 'password-strength-fill strength-medium';
      strengthText.textContent = '密码强度：中等';
    } else {
      strengthFill.className = 'password-strength-fill strength-strong';
      strengthText.textContent = '密码强度：强';
    }
  };

  // 执行邮箱注册
  window.performEmailRegister = function() {
    const email = document.getElementById('registerEmail').value.trim();
    const code = document.getElementById('registerEmailCode').value.trim();
    const password = document.getElementById('registerEmailPassword').value;
    const passwordConfirm = document.getElementById('registerEmailPasswordConfirm').value;
    const agreeTerms = document.getElementById('agreeEmailTerms').checked;

    // 验证邮箱
    if (!email) {
      showToast('请输入邮箱地址');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('请输入正确的邮箱格式');
      return;
    }

    // 验证验证码
    if (!code) {
      showToast('请输入验证码');
      return;
    }

    // 验证密码
    if (!password) {
      showToast('请设置密码');
      return;
    }
    if (password.length < 8) {
      showToast('密码长度不能少于8位');
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      showToast('密码需包含字母（不区分大小写）');
      return;
    }
    if (!/[！@#￥%……&*？!@#$%^&*?]/.test(password)) {
      showToast('密码需包含特殊符号（！@#￥%……&*？）');
      return;
    }

    // 验证确认密码
    if (!passwordConfirm) {
      showToast('请确认密码');
      return;
    }
    if (password !== passwordConfirm) {
      showToast('两次输入的密码不一致');
      return;
    }

    // 验证协议
    if (!agreeTerms) {
      showToast('请阅读并同意用户协议和隐私政策');
      return;
    }

    // 调用后端API注册
    const registerButton = document.querySelector('.register-button');
    registerButton.disabled = true;
    registerButton.textContent = '注册中...';

    // 使用API注册
    apiRegister(email, password, code)
      .then(result => {
        if (result.success) {
          // 关闭模态框
          const modal = document.querySelector('.email-login-modal-overlay');
          if (modal) modal.remove();

          showToast('注册成功！');
          
          // 刷新页面以更新UI
          setTimeout(() => {
            location.reload();
          }, 500);
        } else {
          showToast(result.error || '注册失败');
          registerButton.disabled = false;
          registerButton.textContent = '立即注册';
        }
      })
      .catch(error => {
        showToast(error.message || '注册失败，请检查网络连接');
        registerButton.disabled = false;
        registerButton.textContent = '立即注册';
      });
  };

  // 切换到邮箱登录
  window.switchToEmailLogin = function() {
    // 关闭注册模态框
    const registerModal = document.querySelector('.email-login-modal-overlay');
    if (registerModal) registerModal.remove();

    // 显示登录模态框
    showEmailLoginModal();
  };

  // 显示用户协议模态框
  window.showTermsModal = function() {
    const modal = document.createElement('div');
    modal.className = 'email-login-modal-overlay';
    modal.innerHTML = `
      <style>
        .terms-modal { background: white; border-radius: 16px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .dark .terms-modal { background: #1e293b; }
        .terms-title { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 16px; }
        .dark .terms-title { color: white; }
        .terms-content { font-size: 14px; color: #475569; line-height: 1.8; }
        .dark .terms-content { color: #cbd5e1; }
        .terms-close-btn { width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 12px; font-size: 16px; cursor: pointer; margin-top: 20px; }
      </style>
      <div class="terms-modal">
        <h3 class="terms-title">用户协议</h3>
        <div class="terms-content">
          <p><strong>一、服务条款</strong></p>
          <p>欢迎使用医靠健康助手。本协议是您与医靠平台之间的法律协议，请仔细阅读。</p>
          <p><strong>二、用户注册</strong></p>
          <p>1. 用户应提供真实、准确的个人信息。</p>
          <p>2. 用户账号仅限本人使用，不得转让、出租或出借。</p>
          <p><strong>三、用户行为规范</strong></p>
          <p>1. 用户不得利用平台从事违法活动。</p>
          <p>2. 用户应遵守平台的使用规则和社区规范。</p>
          <p><strong>四、隐私保护</strong></p>
          <p>医靠重视用户隐私保护，具体详见隐私政策。</p>
          <p><strong>五、免责声明</strong></p>
          <p>本平台提供的健康信息仅供参考，不构成医疗建议。如有健康问题，请咨询专业医生。</p>
        </div>
        <button class="terms-close-btn" onclick="this.closest('.email-login-modal-overlay').remove()">我已了解</button>
      </div>
    `;
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
  };

  // 显示隐私政策模态框
  window.showPrivacyModal = function() {
    const modal = document.createElement('div');
    modal.className = 'email-login-modal-overlay';
    modal.innerHTML = `
      <style>
        .privacy-modal { background: white; border-radius: 16px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .dark .privacy-modal { background: #1e293b; }
        .privacy-title { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 16px; }
        .dark .privacy-title { color: white; }
        .privacy-content { font-size: 14px; color: #475569; line-height: 1.8; }
        .dark .privacy-content { color: #cbd5e1; }
        .privacy-close-btn { width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 12px; font-size: 16px; cursor: pointer; margin-top: 20px; }
      </style>
      <div class="privacy-modal">
        <h3 class="privacy-title">隐私政策</h3>
        <div class="privacy-content">
          <p><strong>一、信息收集</strong></p>
          <p>我们收集的信息包括：注册信息（邮箱、密码）、使用记录（测评历史、打卡记录）等。</p>
          <p><strong>二、信息使用</strong></p>
          <p>我们使用收集的信息用于：提供健康评估服务、改善用户体验、发送健康提醒等。</p>
          <p><strong>三、信息保护</strong></p>
          <p>我们采用安全措施保护您的个人信息，防止未经授权的访问、使用或泄露。</p>
          <p><strong>四、信息共享</strong></p>
          <p>除法律规定或您同意外，我们不会向第三方共享您的个人信息。</p>
          <p><strong>五、您的权利</strong></p>
          <p>您有权访问、更正、删除您的个人信息，或注销账号。</p>
          <p><strong>六、联系我们</strong></p>
          <p>如有隐私相关问题，请通过反馈功能联系我们。</p>
        </div>
        <button class="privacy-close-btn" onclick="this.closest('.email-login-modal-overlay').remove()">我已了解</button>
      </div>
    `;
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
  };

  // 显示忘记密码模态框
  window.showForgotPasswordModal = function() {
    const modal = document.createElement('div');
    modal.className = 'email-login-modal-overlay';
    modal.innerHTML = `
      <style>
        .forgot-modal { background: white; border-radius: 16px; width: 90%; max-width: 400px; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .dark .forgot-modal { background: #1e293b; }
        .forgot-title { font-size: 20px; font-weight: bold; color: #1e293b; text-align: center; margin-bottom: 8px; }
        .dark .forgot-title { color: white; }
        .forgot-desc { font-size: 14px; color: #64748b; text-align: center; margin-bottom: 20px; }
        .dark .forgot-desc { color: #94a3b8; }
        .dark .forgot-modal .email-input { background: #374151; border-color: #4b5563; color: white; }
        .send-code-btn {
          padding: 10px 16px; background: #667eea; color: white; border: none; border-radius: 8px;
          font-size: 13px; cursor: pointer; white-space: nowrap;
        }
        .send-code-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .reset-btn {
          width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600;
          cursor: pointer; margin-top: 16px;
        }
        .reset-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102,126,234,0.4); }
      </style>
      <div class="forgot-modal">
        <h3 class="forgot-title">重置密码</h3>
        <p class="forgot-desc">输入注册邮箱，我们将发送重置链接</p>
        <div class="email-input-group">
          <input type="email" id="resetEmail" class="email-input" placeholder="请输入注册邮箱">
        </div>
        <button class="reset-btn" onclick="sendResetEmail()">发送重置邮件</button>
      </div>
    `;
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
  };

  // 发送重置邮件
  window.sendResetEmail = function() {
    const email = document.getElementById('resetEmail').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('请输入正确的邮箱地址');
      return;
    }
    showToast('重置邮件已发送，请查收邮箱');
    setTimeout(() => {
      const modal = document.querySelector('.email-login-modal-overlay');
      if (modal) modal.remove();
    }, 1500);
  };

  // 处理邮箱登录
  window.handleEmailLogin = function() {
    showEmailLoginModal();
  };

  window.handleWechatLogin = function() {
    showToast('微信登录功能开发中...');
  };

  // 处理注册
  window.handleRegister = function() {
    const phone = document.getElementById('registerPhone').value;
    const code = document.getElementById('registerCode').value;
    const password = document.getElementById('registerPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!phone) {
      showToast('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的手机号');
      return;
    }
    if (!code) {
      showToast('请输入验证码');
      return;
    }
    if (code !== currentCode) {
      showToast('验证码错误');
      return;
    }
    if (!password) {
      showToast('请设置密码');
      return;
    }
    if (password.length < 8) {
      showToast('密码长度不能少于8位');
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      showToast('密码需包含字母（不区分大小写）');
      return;
    }
    if (!/[！@#￥%……&*？!@#$%^&*?]/.test(password)) {
      showToast('密码需包含特殊符号（！@#￥%……&*？）');
      return;
    }
    if (!agreeTerms) {
      showToast('请阅读并同意用户协议和隐私政策');
      return;
    }

    const users = getUsers();
    const existingUser = users.find(u => u.phone === phone);
    
    if (existingUser) {
      showToast('该手机号已注册');
      return;
    }

    const newUser = {
      phone: phone,
      password: password,
      nickname: '用户' + phone.slice(-4),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    saveLoginStatus({
      phone: newUser.phone,
      nickname: newUser.nickname,
      createdAt: newUser.createdAt
    });

    showToast('注册成功！');
    document.querySelector('.modal-overlay').remove();
    updateUserCard();
  };

  function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // 显示忘记密码弹窗
  window.showForgotPassword = function() {
    const modal = createModal('忘记密码', `
      <div style="padding: 20px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">手机号</label>
          <input type="tel" id="forgotPhone" placeholder="请输入手机号" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">验证码</label>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="forgotCode" placeholder="请输入验证码" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
            <button onclick="sendForgotCode()" id="sendForgotCodeBtn" style="padding: 12px 20px; background: #f5f5f5; color: #666; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;">获取验证码</button>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">新密码</label>
          <input type="password" id="forgotPassword" placeholder="请设置新密码" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
        </div>
        <button onclick="handleForgotPassword()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">重置密码</button>
      </div>
    `);
    document.body.appendChild(modal);
  };

  // 发送忘记密码验证码
  let forgotCode = '';
  
  window.sendForgotCode = function() {
    const phone = document.getElementById('forgotPhone').value;
    const btn = document.getElementById('sendForgotCodeBtn');
    
    if (!phone) {
      showToast('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的手机号');
      return;
    }
    
    btn.disabled = true;
    btn.textContent = '发送中...';
    
    setTimeout(() => {
      btn.textContent = '60s后重发';
      let countdown = 60;
      const timer = setInterval(() => {
        countdown--;
        btn.textContent = countdown + 's后重发';
        if (countdown <= 0) {
          clearInterval(timer);
          btn.disabled = false;
          btn.textContent = '获取验证码';
        }
      }, 1000);
      
      forgotCode = Math.floor(1000 + Math.random() * 9000).toString();
      showToast('验证码：' + forgotCode);
    }, 1000);
  };

  // 处理忘记密码
  window.handleForgotPassword = function() {
    const phone = document.getElementById('forgotPhone').value;
    const code = document.getElementById('forgotCode').value;
    const password = document.getElementById('forgotPassword').value;
    
    if (!phone) {
      showToast('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的手机号');
      return;
    }
    if (!code) {
      showToast('请输入验证码');
      return;
    }
    if (code !== forgotCode) {
      showToast('验证码错误');
      return;
    }
    if (!password) {
      showToast('请设置新密码');
      return;
    }
    if (password.length < 8) {
      showToast('密码长度不能少于8位');
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      showToast('密码需包含字母（不区分大小写）');
      return;
    }
    if (!/[！@#￥%……&*？!@#$%^&*?]/.test(password)) {
      showToast('密码需包含特殊符号（！@#￥%……&*？）');
      return;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.phone === phone);
    
    if (userIndex === -1) {
      showToast('该手机号未注册');
      return;
    }
    
    users[userIndex].password = password;
    saveUsers(users);
    
    showToast('密码重置成功！');
    document.querySelector('.modal-overlay').remove();
  };

  // 从后端API获取用户信息并更新卡片
  function updateUserCardFromBackend() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const userCard = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-2xl.shadow-lg.p-6.mb-6');
    if (!userCard) return;

    // 从后端获取用户信息
    apiGetUserInfo()
      .then(result => {
        if (!result.success) return;
        const user = result.user;

        // 更新用户名
        const userName = userCard.querySelector('h1');
        if (userName) {
          userName.textContent = user.nickname || user.email;
        }

        // 更新状态文本
        const userDays = userCard.querySelector('p.text-slate-500');
        if (userDays) {
          const daysSince = user.createdAt
            ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000*60*60*24))
            : 0;
          userDays.textContent = daysSince > 0 ? `加入医靠第 ${daysSince} 天` : '已登录';
        }

        // 更新统计数据（如果有）
        if (user.stats) {
          const statsCards = userCard.querySelectorAll('.stats-value');
          if (statsCards.length >= 5) {
            statsCards[0].textContent = user.stats.favorites || 0;
            statsCards[1].textContent = user.stats.checkins || 0;
            statsCards[2].textContent = user.stats.assessments || 0;
            statsCards[4].textContent = user.stats.currentConstitution || '未测评';
          }
        }
      })
      .catch(() => {
        // 后端不可用，使用本地数据
        const user = getLoggedInUser();
        if (!user) return;
        const userName = userCard.querySelector('h1');
        if (userName) userName.textContent = user.nickname || '用户';
        const userDays = userCard.querySelector('p.text-slate-500');
        if (userDays) userDays.textContent = '已登录';
      });
  }
  function updateUserCard() {
    const userCard = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-2xl.shadow-lg.p-6.mb-6');
    if (!userCard) return;

    const loginBtn = userCard.querySelector('.login-register-btn');
    const isLoggedIn = checkLoginStatus();

    if (loginBtn) {
      if (isLoggedIn) {
        loginBtn.textContent = '退出登录';
        loginBtn.onclick = createLogoutHandler(loginBtn);
      } else {
        loginBtn.textContent = '登录/注册';
        loginBtn.onclick = function(e) {
          e.stopPropagation();
          showLoginModal();
        };
      }
    }

    if (isLoggedIn) {
      const user = getLoggedInUser();
      const userName = userCard.querySelector('h1');
      if (userName) {
        userName.textContent = user?.nickname || user?.email || '医靠用户';
      }
      const userDays = userCard.querySelector('p.text-slate-500');
      if (userDays) {
        userDays.textContent = '已登录';
      }
      updateUserCardFromBackend();
    }
  }

  // 清理过期数据（数据库重新初始化时使用）
  function clearExpiredData() {
    // 清理已过期的验证码（超过10分钟）
    // 由后端数据库自动处理
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
  } else {
    initSettings();
  }

  // 监听页面变化，处理动态加载的内容
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        initSettings();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();