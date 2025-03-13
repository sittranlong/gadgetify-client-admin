import {defineStore} from "pinia";
import axios from "axios";
import {ref} from "vue";
import {useI18n} from "vue-i18n";

const useOrderStore = defineStore('order', () => {
    const {locale} = useI18n({useScope: 'global'});
    const ordersList = ref([])
    const orderById = ref()
    const getOrdersList = async () => {
        ordersList.value = (await axios.get('/don-hang?lang=' + locale.value)).data.data
    }
    const findById = async (id) => {
        orderById.value = (await axios.get(`/don-hang/${id}`)).data.data
        return (await axios.get(`/don-hang/${id}`)).data.data
    }
    const updateStatus = async (id) => {
        await axios.patch(`/don-hang/${id}`)
        await getOrdersList()
    }
    const findOrderDetail = async (id) => {
        return (await axios.get(`/chi-tiet-don-hang/don-hang/${id}?lang=${locale.value}`)).data.data
    }
    return {ordersList, getOrdersList, findById, updateStatus, orderById, findOrderDetail}
})
export default useOrderStore