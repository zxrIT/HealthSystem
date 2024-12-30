import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import zh from "../locales/zh.json"
import en from "../locales/en.json"

const resources = {
    zh,
    en,
}

i18next.use(initReactI18next).init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
        escapeValue: false
    }
})

export default i18next;