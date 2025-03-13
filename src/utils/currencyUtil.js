import {useI18n} from "vue-i18n";

const displayCurrency = (source) => {
    const {locale, n} = useI18n({useScope: 'global'})
    const fixedRate = 25000 // 1USD = 25000VND
    if (!locale.value) return source
    if (locale.value === 'vi') return n(source, 'currency')
    return n(source / fixedRate, 'currency')
};
export default displayCurrency