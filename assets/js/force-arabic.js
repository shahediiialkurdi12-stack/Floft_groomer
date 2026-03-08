// Force Arabic language on first load
(function() {
  const STORAGE_KEY = 'user-lang';
  
  // Check if user has a saved language preference
  const savedLang = localStorage.getItem(STORAGE_KEY);
  
  // If no saved preference or it's 'en', set to 'ar'
  if (!savedLang || savedLang !== 'ar') {
    localStorage.setItem(STORAGE_KEY, 'ar');
    // Force trigger language change
    if (window.applyLanguage) {
      window.applyLanguage('ar');
    }
  }
  
  // Set HTML dir attribute
  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');
})();
