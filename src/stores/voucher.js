import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";

const useVoucherStore = defineStore('voucher', () => {
    const {t} = useI18n({useScope: 'global'});
    const voucher = ref({})
    const vouchersList = ref([])
    const getVouchersList = async () => {
        vouchersList.value = (await axios.get('/phieu-giam-gia')).data.data
    }
    const findById = async (id) => {
        voucher.value = (await axios.get(`/phieu-giam-gia/${id}`)).data.data
    }
    const saveVoucher = async (voucher) => {
        await axios.post('/phieu-giam-gia', voucher)
        await getVouchersList()
    }
    const updateStatus = async (id) => {
        await axios.patch(`/phieu-giam-gia/${id}`)
        await getVouchersList()
        message.success(t('update_success_msg', {content: t('voucher')}));
    }
    return {voucher, vouchersList, getVouchersList, findById, saveVoucher, updateStatus}

});
export default useVoucherStore;