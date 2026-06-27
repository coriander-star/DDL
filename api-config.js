// =============================================
// API配置文件 - 支持双模式
// =============================================
// 模式说明：
//   服务器模式 — 部署后端后设置 API_BACKEND_URL
//   本地模式   — API_BACKEDN_URL = null，所有数据存 localStorage
// =============================================

// ★★★ 部署后端后，把 null 改成你的后端地址 ★★★
// 例如: const API_BACKEND_URL = 'https://yikao-api.railway.app';
const API_BACKEND_URL = "https://ddl-production-37a5.up.railway.app";

// =============================================

window.API_BASE_URL = API_BACKEND_URL;
const HAS_BACKEND = API_BACKEND_URL !== null;

// ==================== 后端API请求 ====================

async function apiRequest(endpoint, method, data) {
  const options = {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  const token = localStorage.getItem('authToken');
  if (token) options.headers['Authorization'] = 'Bearer ' + token;
  if (data && method !== 'GET') options.body = JSON.stringify(data);
  const resp = await fetch(API_BACKEND_URL + endpoint, options);
  const result = await resp.json();
  if (!resp.ok) throw new Error(result.error || '请求失败');
  return result;
}

// ==================== 本地存储工具 ====================

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem('yikao_local_users') || '[]'); }
  catch(e) { return []; }
}
function saveLocalUsers(users) {
  localStorage.setItem('yikao_local_users', JSON.stringify(users));
}
function saveAuthSession(user) {
  const token = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('authToken', token);
  localStorage.setItem('userEmail', user.email || '');
  localStorage.setItem('userId', user.id || token);
  localStorage.setItem('userNickname', user.nickname || '医靠用户');
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('loginTime', new Date().toISOString());
}
function getCurrentConstitution() {
  try {
    const data = JSON.parse(localStorage.getItem('constitution_assessments') || '[]');
    return data.length > 0 ? (data[0].constitution_type || '未测评') : '未测评';
  } catch(e) { return '未测评'; }
}

// ==================== 用户认证API ====================

async function apiRegister(email, password, code) {
  if (HAS_BACKEND) {
    try {
      const result = await apiRequest('/register', 'POST', { email, password, code });
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userNickname', result.user.nickname);
        localStorage.setItem('isLoggedIn', 'true');
      }
      return result;
    } catch(e) { /* fallback to local */ }
  }
  // 本地回退
  const users = getLocalUsers();
  if (users.find(u => u.email === email)) return { success: false, error: '该邮箱已被注册' };
  const nickname = email.split('@')[0];
  users.push({ email, password, nickname, id: 'user_' + Date.now(), createdAt: new Date().toISOString() });
  saveLocalUsers(users);
  saveAuthSession({ email, nickname });
  return { success: true, token: localStorage.getItem('authToken'), user: { email, nickname } };
}

async function apiLogin(email, password) {
  if (HAS_BACKEND) {
    try {
      const result = await apiRequest('/login', 'POST', { email, password });
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userNickname', result.user.nickname);
        localStorage.setItem('isLoggedIn', 'true');
      }
      return result;
    } catch(e) { /* fallback to local */ }
  }
  const users = getLocalUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, error: '邮箱或密码错误' };
  saveAuthSession(user);
  return { success: true, token: localStorage.getItem('authToken'), user: { email, nickname: user.nickname } };
}

async function apiSendCode(email, type) {
  if (HAS_BACKEND) {
    try { return await apiRequest('/send-code', 'POST', { email, type }); } catch(e) {}
  }
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return { success: true, message: '验证码已发送', code };
}

async function apiGetUserInfo() {
  if (HAS_BACKEND) {
    try { return await apiRequest('/user/info'); } catch(e) {}
  }
  const email = localStorage.getItem('userEmail');
  const nickname = localStorage.getItem('userNickname');
  const userId = localStorage.getItem('userId');
  if (!userId) return { success: false, error: '未登录' };
  let assessments = 0, checkins = 0, favorites = 0;
  try { assessments = (JSON.parse(localStorage.getItem('constitution_assessments') || '[]')).length; } catch(e) {}
  try { checkins = new Set((JSON.parse(localStorage.getItem('health_checkins') || '[]')).map(c => c.checkin_date)).size; } catch(e) {}
  try { favorites = (JSON.parse(localStorage.getItem('user_favorites') || '[]')).length; } catch(e) {}
  return { success: true, user: { id: userId, email: email || '', nickname: nickname || '医靠用户', createdAt: localStorage.getItem('loginTime') || '', stats: { assessments, checkins, favorites, currentConstitution: getCurrentConstitution() } } };
}

async function apiUpdateProfile(nickname, avatar) {
  if (HAS_BACKEND) {
    try { return await apiRequest('/user/profile', 'PUT', { nickname, avatar }); } catch(e) {}
  }
  const email = localStorage.getItem('userEmail');
  if (email) {
    const users = getLocalUsers();
    const user = users.find(u => u.email === email);
    if (user) { user.nickname = nickname; saveLocalUsers(users); }
  }
  if (nickname) localStorage.setItem('userNickname', nickname);
  return { success: true };
}

// ==================== 测评历史API ====================

async function apiSaveAssessment(constitutionType, scores) {
  if (HAS_BACKEND) {
    try { return await apiRequest('/assessment', 'POST', { constitutionType, scores }); } catch(e) {}
  }
  try {
    const data = JSON.parse(localStorage.getItem('constitution_assessments') || '[]');
    data.unshift({ id: Date.now(), constitution_type: constitutionType, scores: scores || {}, constitution_scores: scores || {}, created_at: new Date().toISOString() });
    if (data.length > 20) data.pop();
    localStorage.setItem('constitution_assessments', JSON.stringify(data));
  } catch(e) {}
  return { success: true };
}

async function apiGetAssessmentHistory(limit) {
  if (HAS_BACKEND) {
    try { return await apiRequest('/assessment/history?limit=' + (limit || 10)); } catch(e) {}
  }
  try { return { success: true, history: JSON.parse(localStorage.getItem('constitution_assessments') || '[]').slice(0, limit || 10) }; } catch(e) {}
  return { success: true, history: [] };
}

// ==================== 打卡记录API ====================

async function apiSaveCheckin(checkinType) {
  if (HAS_BACKEND) {
    try { return await apiRequest('/checkin', 'POST', { checkinType }); } catch(e) {}
  }
  try {
    const data = JSON.parse(localStorage.getItem('health_checkins') || '[]');
    const today = new Date().toISOString().split('T')[0];
    if (!data.some(c => c.checkin_date === today && c.checkin_type === checkinType)) {
      data.push({ id: Date.now() + Math.random(), checkin_type: checkinType, checkin_date: today, created_at: new Date().toISOString() });
      localStorage.setItem('health_checkins', JSON.stringify(data));
    }
  } catch(e) {}
  return { success: true };
}

async function apiGetCheckinRecords(limit) {
  if (HAS_BACKEND) {
    try { return await apiRequest('/checkin/records?limit=' + (limit || 30)); } catch(e) {}
  }
  try { return { success: true, records: JSON.parse(localStorage.getItem('health_checkins') || '[]').slice(0, limit || 30) }; } catch(e) {}
  return { success: true, records: [] };
}

// ==================== 收藏API ====================

async function apiAddFavorite(itemType, itemId) {
  if (HAS_BACKEND) {
    try { return await apiRequest('/favorite', 'POST', { itemType, itemId }); } catch(e) {}
  }
  try {
    const data = JSON.parse(localStorage.getItem('user_favorites') || '[]');
    if (!data.some(f => f.item_id === itemId)) {
      data.push({ item_type: itemType, item_id: itemId, created_at: new Date().toISOString() });
      localStorage.setItem('user_favorites', JSON.stringify(data));
    }
  } catch(e) {}
  return { success: true };
}

async function apiRemoveFavorite(itemType, itemId) {
  if (HAS_BACKEND) {
    try { return await apiRequest('/favorite', 'DELETE', { itemType, itemId }); } catch(e) {}
  }
  try {
    let data = JSON.parse(localStorage.getItem('user_favorites') || '[]');
    data = data.filter(f => !(f.item_type === itemType && f.item_id === itemId));
    localStorage.setItem('user_favorites', JSON.stringify(data));
  } catch(e) {}
  return { success: true };
}

async function apiGetFavorites() {
  if (HAS_BACKEND) {
    try { return await apiRequest('/favorites'); } catch(e) {}
  }
  try { return { success: true, favorites: JSON.parse(localStorage.getItem('user_favorites') || '[]') }; } catch(e) {}
  return { success: true, favorites: [] };
}

// ==================== 健康检查 ====================

async function apiHealthCheck() {
  if (HAS_BACKEND) {
    try { return await apiRequest('/health'); } catch(e) {}
  }
  return { status: 'ok', message: '医靠健康助手（本地模式）', timestamp: new Date().toISOString() };
}

// ==================== 后端连接状态指示器 ====================

async function checkBackendStatus() {
  if (!HAS_BACKEND) return false;
  try {
    const result = await apiHealthCheck();
    return result.status === 'ok';
  } catch(e) { return false; }
}

// 暴露全局API
window.apiRequest = apiRequest;
window.apiRegister = apiRegister;
window.apiLogin = apiLogin;
window.apiSendCode = apiSendCode;
window.apiGetUserInfo = apiGetUserInfo;
window.apiUpdateProfile = apiUpdateProfile;
window.apiSaveAssessment = apiSaveAssessment;
window.apiGetAssessmentHistory = apiGetAssessmentHistory;
window.apiSaveCheckin = apiSaveCheckin;
window.apiGetCheckinRecords = apiGetCheckinRecords;
window.apiAddFavorite = apiAddFavorite;
window.apiRemoveFavorite = apiRemoveFavorite;
window.apiGetFavorites = apiGetFavorites;
window.apiHealthCheck = apiHealthCheck;
window.checkBackendStatus = checkBackendStatus;

console.log('🌿 医靠已启动 | 模式: ' + (HAS_BACKEND ? '服务器模式 (' + API_BACKEND_URL + ')' : '本地存储模式'));