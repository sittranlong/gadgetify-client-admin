import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {message} from 'ant-design-vue';
import {useI18n} from "vue-i18n";

const useCategoryStore = defineStore('category', () => {
    const {t, locale} = useI18n({useScope: 'global'});
    const categoriesList = ref([])
    const category = ref({})
    const saveCategory = async (category) => {
        const savedCategory = (await axios.post('/danh-muc', category)).data.data
        message.success(t('save_success_msg', {content: t('categories')}));
        await getCategoriesList();
        return savedCategory
    }
    const saveCategoryLang = async (categoryLang) => {
        await axios.post('/danh-muc/lang', categoryLang)
    }
    const getCategoriesList = async () => {
        console.log(locale.value)
        categoriesList.value = (await axios.get(`/danh-muc?lang=${locale.value}`)).data.data
    }
    const findById = async (id) => {
        category.value = (await axios.get(`/danh-muc/${id}`)).data.data
    }
    const deleteCategory = async (id) => {
        await axios.delete(`/danh-muc/${id}`)
        await getCategoriesList()
        message.success(t('delete_success_msg', {content: t('categories')}));
    }
    return {categoriesList, category, saveCategory, saveCategoryLang, getCategoriesList, deleteCategory, findById}
})
export default useCategoryStore