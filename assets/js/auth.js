/**
 * ====================================================================
 * auth.js - إدارة تسجيل الدخول والخروج
 * ====================================================================
 * 
 * الوظائف:
 * 1. التحقق من حالة تسجيل الدخول
 * 2. عرض/إخفاء زر تسجيل الخروج
 * 3. إعادة التوجيه للصفحة الأخرى إذا كان المستخدم غير مصرح
 * 4. إظهار معلومات المستخدم
 * 
 * الاستخدام:
 * <script src="assets/js/auth.js"></script>
 * ====================================================================
 */

/**
 * التحقق من حالة تسجيل الدخول
 * إذا لم يكن المستخدم مسجل دخول، أعد التوجيه لصفحة تسجيل الدخول
 * 
 * الاستثناءات (صفحات عامة لا تحتاج تحقق):
 * - login.html (صفحة تسجيل الدخول نفسها فقط)
 */
function checkAuthStatus() {
  // احصل على اسم الصفحة الحالية
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // قائمة الصفحات التي لا تحتاج تحقق من تسجيل الدخول
  const publicPages = ['login.html'];
  
  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = localStorage.getItem('user');
  
  // إذا كان المستخدم مسجل دخول، استمر
  if (isLoggedIn && user) {
    return true;
  }
  
  // إذا لم يكون مسجل دخول والصفحة الحالية تتطلب تسجيل دخول
  if (!isLoggedIn && !publicPages.includes(currentPage)) {
    // أعد التوجيه لصفحة تسجيل الدخول
    window.location.href = 'login.html';
    return false;
  }
  
  return false;
}

/**
 * إضافة زر تسجيل الخروج
 * يتم استدعاء هذه الدالة من الهيدر
 */
function addLogoutButton() {
  // تحقق من وجود nav-cta
  const navCta = document.querySelector('.nav-cta');
  if (!navCta) return;
  
  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = localStorage.getItem('user');
  
  // إذا كان مسجل دخول، أضف زر تسجيل الخروج
  if (isLoggedIn && user) {
    // تحويل المستخدم من JSON string
    let userData;
    try {
      userData = JSON.parse(user);
    } catch (e) {
      userData = null;
    }
    
    // إنشاء عنصر تسجيل الخروج
    const logoutWrapper = document.createElement('div');
    logoutWrapper.className = 'user-menu';
    logoutWrapper.style.cssText = `
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-left: 1rem;
    `;
    
    // صورة المستخدم (إن وجدت)
    if (userData && userData.picture) {
      const userImage = document.createElement('img');
      userImage.src = userData.picture;
      userImage.alt = userData.name || 'User Avatar';
      userImage.style.cssText = `
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid var(--accent);
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      
      // عند الضغط على الصورة، عرض القائمة
      userImage.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.querySelector('.logout-menu');
        if (menu) {
          menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
      });
      
      logoutWrapper.appendChild(userImage);
    }
    
    // قائمة تسجيل الخروج
    const logoutMenu = document.createElement('div');
    logoutMenu.className = 'logout-menu';
    logoutMenu.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1000;
      min-width: 200px;
      box-shadow: var(--shadow2);
      display: none;
    `;
    
    // معلومات المستخدم
    const userInfo = document.createElement('div');
    userInfo.style.cssText = `
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--line);
    `;
    
    const userName = document.createElement('p');
    userName.style.cssText = `
      margin: 0;
      color: var(--text);
      font-weight: 700;
      font-size: 0.9rem;
    `;
    userName.textContent = userData?.name || 'المستخدم';
    userInfo.appendChild(userName);
    
    const userEmail = document.createElement('p');
    userEmail.style.cssText = `
      margin: 0.3rem 0 0;
      color: var(--muted2);
      font-size: 0.85rem;
    `;
    userEmail.textContent = userData?.email || '';
    userInfo.appendChild(userEmail);
    
    logoutMenu.appendChild(userInfo);
    
    // زر تسجيل الخروج
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    logoutBtn.style.cssText = `
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      color: var(--danger);
      font-weight: 700;
      cursor: pointer;
      text-align: right;
      transition: all 0.2s ease;
    `;
    
    // ترجمة نص الخروج
    if (document.documentElement.lang === 'ar') {
      logoutBtn.textContent = 'تسجيل الخروج';
    } else {
      logoutBtn.textContent = 'Sign Out';
    }
    
    // مفهوم data-key للترجمة
    logoutBtn.dataset.key = 'logout';
    
    // عند الضغط على زر تسجيل الخروج
    logoutBtn.addEventListener('click', handleLogout);
    
    logoutBtn.addEventListener('mouseenter', () => {
      logoutBtn.style.background = 'rgba(239, 68, 68, 0.1)';
    });
    
    logoutBtn.addEventListener('mouseleave', () => {
      logoutBtn.style.background = 'transparent';
    });
    
    logoutMenu.appendChild(logoutBtn);
    logoutWrapper.appendChild(logoutMenu);
    
    // ضع العنصر في nav-cta
    navCta.insertBefore(logoutWrapper, navCta.firstChild);
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
      if (!logoutWrapper.contains(e.target)) {
        logoutMenu.style.display = 'none';
      }
    });
  }
}

/**
 * دالة تسجيل الخروج
 * حذف بيانات المستخدم من localStorage
 */
function handleLogout() {
  // تأكد من رغبة المستخدم
  if (confirm('هل تريد فعلاً تسجيل الخروج؟')) {
    // حذف بيانات المستخدم
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    
    // أعد التوجيه لصفحة تسجيل الدخول
    window.location.href = 'login.html';
  }
}

/**
 * إضافة ترجمة لزر تسجيل الخروج
 * ستتم إضافة "logout" إلى ملف language-switcher-v5.js
 */
document.addEventListener('DOMContentLoaded', () => {
  // تحقق من حالة تسجيل الدخول
  checkAuthStatus();
  
  // أضف زر تسجيل الخروج إلى الهيدر (بعد قليل من التحميل)
  setTimeout(() => {
    addLogoutButton();
  }, 500);
});

/**
 * ====================================================================
 * التكامل مع language-switcher-v5.js
 * ====================================================================
 * 
 * عند تغيير اللغة، يتم تحديث نص زر تسجيل الخروج تلقائياً
 * لأن language-switcher-v5.js يبحث عن جميع عناصر [data-key]
 * 
 * لذلك أضفنا data-key="logout" إلى زر تسجيل الخروج
 * ويجب إضافة الترجمة في language-switcher-v5.js:
 * 
 * ar: { "logout": "تسجيل الخروج", ... }
 * en: { "logout": "Sign Out", ... }
 */
