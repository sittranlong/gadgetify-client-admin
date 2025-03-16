import {defineStore} from "pinia";
import {useI18n} from "vue-i18n";
import {message} from "ant-design-vue";
import axios from "axios";
import {ref} from "vue";

const usePromotionStore = defineStore('promotion', () => {
    const {t, locale} = useI18n({useScope: 'global'});
    const promotion = ref({})
    const promotionsList = ref([])
    const getPromotionsList = async () => {
        promotionsList.value = (await axios.get(`/dot-khuyen-mai?lang=${locale.value}`)).data.data
    }
    const findById = async (id) => {
        promotion.value = (await axios.get(`/dot-khuyen-mai/${id}?lang=${locale.value}`)).data.data
    }
    const savePromotion = async (promotion) => {
        await getPromotionsList()
        return (await axios.post('/dot-khuyen-mai', promotion)).data.data
    }
    const updateStatus = async (id) => {
        await axios.patch(`/dot-khuyen-mai/${id}`)
        await getPromotionsList()
        message.success(t('update_success_msg', {content: t('promotion')}));
    }
    const savePromotionLang = async (promotionLang) => {
        await axios.post('/dot-khuyen-mai/lang', promotionLang)
    }
    const savePromotionDetails = async (promotionDetailList) => {
        await axios.post('/chi-tiet-dot-khuyen-mai/all', promotionDetailList)
    }
    const deletePromotionDetailsByPromotionId = async (id) => {
        await axios.delete(`/chi-tiet-dot-khuyen-mai/dot-khuyen-mai/${id}`)
    }
    return {
        promotion,
        promotionsList,
        getPromotionsList,
        findById,
        savePromotion,
        updateStatus,
        savePromotionLang,
        savePromotionDetails,
        deletePromotionDetailsByPromotionId
    }
})
export default usePromotionStore;