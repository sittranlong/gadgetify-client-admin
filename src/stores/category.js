import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {message} from 'ant-design-vue';
import {useI18n} from "vue-i18n";

const useCategoryStore = defineStore('category', () => {
    const {t} = useI18n({useScope: 'global'});
    const categoriesList = ref([])
    const category = ref({})
    const saveCategory = async (category) => {
        const savedCategory = (await axios.post('/danh-muc', category)).data.data
        message.success(t('add_success_msg', {content: t('categories')}));
        return savedCategory
    }
    const saveCategoryLang = async (categoryLang) => {
        await axios.post('/danh-muc/lang', categoryLang)
    }
    const getCategoriesList = async () => {
        categoriesList.value = (await axios.get('/danh-muc')).data.data
    }
    return {categoriesList, category, saveCategory, saveCategoryLang, getCategoriesList}
})
export default useCategoryStore