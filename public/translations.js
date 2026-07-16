(() => {
  const supportedLanguages = ['en', 'pt', 'fr', 'es'];
  const uiTranslations = {
    pt: {
      'Open navigation': 'Abrir navegação',
      'Close navigation': 'Fechar navegação',
      'Choose language': 'Escolher idioma',
      'Currency converter': 'Conversor de moeda',
      'Travel request': 'Pedido de viagem',
      'Name': 'Nome',
      'Destination': 'Destino',
      'Travel dates': 'Datas da viagem',
      'Number of travelers': 'Número de viajantes'
    },
    fr: {
      'Open navigation': 'Ouvrir la navigation',
      'Close navigation': 'Fermer la navigation',
      'Choose language': 'Choisir la langue',
      'Currency converter': 'Convertisseur de devises',
      'Travel request': 'Demande de voyage',
      'Name': 'Nom',
      'Destination': 'Destination',
      'Travel dates': 'Dates du voyage',
      'Number of travelers': 'Nombre de voyageurs'
    },
    es: {
      'Open navigation': 'Abrir navegación',
      'Close navigation': 'Cerrar navegación',
      'Choose language': 'Elegir idioma',
      'Currency converter': 'Conversor de moneda',
      'Travel request': 'Solicitud de viaje',
      'Name': 'Nombre',
      'Destination': 'Destino',
      'Travel dates': 'Fechas del viaje',
      'Number of travelers': 'Número de viajeros'
    }
  };

  let pendingLanguage = null;
  let googleTranslateReady = false;

  const normalizeLanguage = (language) => supportedLanguages.includes(language) ? language : 'en';
  const currentLanguage = () => normalizeLanguage(document.documentElement.lang || localStorage.getItem('imbondeiro-language') || 'en');
  const translateUi = (source) => currentLanguage() === 'en' ? source : uiTranslations[currentLanguage()]?.[source] || source;

  const setActiveLanguageButton = (language) => {
    document.querySelectorAll('.language-option').forEach((button) => {
      const active = button.dataset.lang === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const setGoogleCookie = (language) => {
    const value = language === 'en' ? '/en/en' : `/en/${language}`;
    document.cookie = `googtrans=${value}; path=/`;
    document.cookie = `googtrans=${value}; path=/; domain=${location.hostname}`;
  };

  const clearGoogleCookie = () => {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${location.hostname}`;
  };

  const applyGoogleSelect = (language) => {
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) return false;
    combo.value = language === 'en' ? '' : language;
    combo.dispatchEvent(new Event('change'));
    return true;
  };

  const dispatchLanguageChange = (language) => {
    document.documentElement.lang = language;
    localStorage.setItem('imbondeiro-language', language);
    setActiveLanguageButton(language);
    document.dispatchEvent(new CustomEvent('imbondeiro:languagechange', { detail: { language } }));
  };

  const ensureGoogleTranslate = () => {
    if (!document.getElementById('google_translate_element')) {
      const element = document.createElement('div');
      element.id = 'google_translate_element';
      element.className = 'google-translate-host';
      element.setAttribute('aria-hidden', 'true');
      document.body.appendChild(element);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: supportedLanguages.join(','),
        autoDisplay: false
      }, 'google_translate_element');
      googleTranslateReady = true;
      if (pendingLanguage) {
        const nextLanguage = pendingLanguage;
        pendingLanguage = null;
        setTimeout(() => applyLanguage(nextLanguage), 150);
      }
    };

    if (!document.querySelector('script[data-google-translate]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.dataset.googleTranslate = 'true';
      document.head.appendChild(script);
    }
  };

  function applyLanguage(language) {
    const nextLanguage = normalizeLanguage(language);
    dispatchLanguageChange(nextLanguage);

    if (nextLanguage === 'en') {
      clearGoogleCookie();
      applyGoogleSelect('en');
      if (document.documentElement.className.includes('translated-')) {
        window.location.reload();
      }
      return;
    }

    setGoogleCookie(nextLanguage);
    if (!googleTranslateReady || !applyGoogleSelect(nextLanguage)) {
      pendingLanguage = nextLanguage;
      ensureGoogleTranslate();
    }
  }

  window.translateUi = translateUi;
  window.setImbondeiroLanguage = applyLanguage;

  document.querySelectorAll('.language-option').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });

  const savedLanguage = normalizeLanguage(localStorage.getItem('imbondeiro-language') || 'en');
  dispatchLanguageChange(savedLanguage);
  ensureGoogleTranslate();
  if (savedLanguage !== 'en') pendingLanguage = savedLanguage;
})();
