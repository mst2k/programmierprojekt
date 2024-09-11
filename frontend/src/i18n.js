import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from '../src/translations/en.json'
import translationDE from '../src/translations/de.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'de',
    debug: true,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;