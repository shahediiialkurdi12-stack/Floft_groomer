/**
 * ====================================================================
 * main.js - الوظائف التفاعلية للموقع
 * ====================================================================
 * 
 * هذا الملف يحتوي على جميع الوظائف التفاعلية الأساسية:
 * 1. تبديل الوضع الليلي/الفاتح (Dark Mode)
 * 2. قائمة الهاتف المنزلقة (Hamburger Menu)
 * 3. البحث والتصفية (Search Filter)
 * 4. نموذج الحجز والرسائل (Form Submission)
 * 
 * نمط التطوير: IIFE (Immediately Invoked Function Expression)
 * الفائدة: عزل الكود عن النطاق العام (Global Scope)
 * ====================================================================
 */

(function(){
  
  // ====================================================================
  // 1️⃣ تبديل الوضع الليلي والفاتح (Dark Mode Toggle)
  // ====================================================================
  // الغرض: السماح للمستخدم بالتبديل بين الوضع الليلي والفاتح
  // وحفظ التفضيل بحيث يتذكره الموقع في الزيارات القادمة
  
  const darkModeToggle = document.querySelector('[data-dark-mode-toggle]'); // البحث عن الزر
  const html = document.documentElement; // جذر الصفحة (html tag)
  
  // استرجاع التفضيل المحفوظ من localStorage
  // localStorage يحفظ البيانات في متصفح المستخدم (لا تُحذف عند إغلاق المتصفح)
  const savedMode = localStorage.getItem('darkMode');
  
  // إذا كان التفضيل "فاتح" (light)، أضف الـ class 'light-mode' إلى HTML
  if(savedMode === 'light'){
    html.classList.add('light-mode');
  }
  
  // عند الضغط على الزر، قم بتبديل الوضع
  if(darkModeToggle){
    darkModeToggle.addEventListener('click', ()=>{
      // toggle هنا: إذا كان موجود أزله، وإن لم يكن موجود أضفه
      const isLight = html.classList.toggle('light-mode');
      
      // احفظ الاختيار الجديد في localStorage للعودة إليه لاحقاً
      localStorage.setItem('darkMode', isLight ? 'light' : 'dark');
    });
  }

  // ====================================================================
  // 2️⃣ قائمة الهاتف المنزلقة (Hamburger Menu / Mobile Drawer)
  // ====================================================================
  // الغرض: فتح وإغلاق قائمة التنقل على الهواتف الذكية
  // لأن قائمة سطح المكتب الكاملة لا تناسب الهواتف الصغيرة
  
  const btn = document.querySelector('[data-hamburger]'); // زر القائمة (الثلاث خطوط)
  const drawer = document.querySelector('[data-drawer]'); // القائمة المنزلقة نفسها
  
  if(btn && drawer){
    btn.addEventListener('click', ()=>{
      // toggle: إذا كانت القائمة مفتوحة أغلقها، وإن لم تكن مفتوحة افتحها
      const open = drawer.classList.toggle('open');
      
      // قراءة الشاشة (Screen Readers) تحتاج معرفة حالة الزر
      // aria-expanded: تخبر القارئ إذا كان الشيء مفتوح أم لا
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ====================================================================
  // 3️⃣ البحث والتصفية (Search Filter)
  // ====================================================================
  // الغرض: السماح للمستخدم بالبحث عن الخدمات والعناصر بسرعة
  // يُستخدم في صفحات: services.html و packages.html
  
  const search = document.querySelector('[data-filter-input]'); // حقل البحث
  const items = document.querySelectorAll('[data-filter-item]'); // جميع العناصر القابلة للتصفية
  
  if(search && items.length){
    // دالة مساعدة: تنظف النص وتحوله لأحرف صغيرة
    // مثال: "  غرفة  " → "غرفة"
    const normalize = (s)=> (s||'').toString().trim().toLowerCase();
    
    // في كل مرة يكتب المستخدم شيء في البحث
    search.addEventListener('input', ()=>{
      const q = normalize(search.value); // النص المبحوث عنه (بعد التنظيف)
      
      // افحص كل عنصر واحد بواحد
      items.forEach(el=>{
        // النص الكامل للعنصر الذي سيبحث فيه
        const hay = normalize(el.getAttribute('data-filter-text'));
        
        // إذا كان البحث فارغ أو وجدنا النص، اعرض العنصر
        // وإلا اخفِهِ (display: none)
        el.style.display = (!q || hay.includes(q)) ? '' : 'none';
      });
    });
  }

  // ====================================================================
  // 4️⃣ نموذج الحجز وإظهار الرسالة (Form Submission)
  // ====================================================================
  // الغرض: عند إرسال نموذج الحجز، اعرض رسالة تأكيد للمستخدم
  // الملاحظة: النموذج تجريبي - البيانات لا تُحفظ (لا يوجد server)
  
  const form = document.querySelector('form[data-contact-form]'); // النموذج
  const toast = document.querySelector('[data-toast]'); // الرسالة (Toast notification)
  
  if(form && toast){
    form.addEventListener('submit', (e)=>{
      // منع السلوك الافتراضي (إرسال النموذج والانتقال للصفحة التالية)
      e.preventDefault();
      
      // أظهر رسالة "تم إرسال طلبك"
      toast.classList.add('show');
      
      // بعد 4.5 ثانية انية، اخفِ الرسالة تلقائياً
      window.setTimeout(()=> toast.classList.remove('show'), 4500);
      
      // امسح جميع حقول النموذج (أعد تعيينها للقيم الافتراضية)
      form.reset();
    });
  }

  // ====================================================================
  // ملاحظة حول تبديل اللغة
  // ====================================================================
  // نظام تبديل اللغة يتم التعامل معه بالكامل في ملف منفصل:
  // language-switcher-v5.js
  // 
  // لا نحتاج لربط الأحداث هنا لأنها مربوطة بالفعل في الملف المخصص
  
})();
