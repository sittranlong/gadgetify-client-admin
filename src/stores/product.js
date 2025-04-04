import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useI18n} from "vue-i18n";

const useProductStore = defineStore('product', () => {
    const {locale, t} = useI18n({useScope: 'global'});
    const product = ref({})
    const productsList = ref([])
    const saveProduct = async (product) => {
        return (await axios.post('/san-pham', product)).data.data
    }
    const saveProductLang = async (productLang) => {
        await axios.post('/san-pham/lang', productLang)
    }
    const saveAllImages = async (images) => {
        await axios.post('/hinh-anh/all', images)
    }
    const saveProductDetail = async (productDetail) => {
        return (await axios.post('/chi-tiet-san-pham', productDetail)).data.data
    }
    const saveProductColorLang = async (productColorLang) => {
        await axios.post('/san-pham/mau-sac/lang', productColorLang)
    }

    const getProductsList = async () => {
        productsList.value = (await axios.get('/san-pham?lang=' + locale.value)).data.data
    }
    const updateStatus = async (id) => {
        await axios.patch(`/san-pham/${id}`)
        await getProductsList()
    }
    const findById = async (id) => {
        product.value = (await axios.get(`/san-pham/${id}`)).data.data
    }
    const findProductByLang = async (pid, lid) => {
        return (await axios.get(`/san-pham/lang?pid=${pid}&lid=${lid}`)).data.data
    }
    const findImages = async (id) => {
        return (await axios.get(`/hinh-anh/san-pham/${id}`)).data.data
    }
    const findProductDetail = async (id) => {
        return (await axios.get(`/chi-tiet-san-pham/san-pham/${id}`)).data.data
    }
    const deleteProductImages = async (id) => {
        await axios.delete(`/hinh-anh/san-pham/${id}`)
    }
    const deleteProductDetail = async (id) => {
        await axios.delete(`/chi-tiet-san-pham/san-pham/${id}`)
    }
    const findAllBrands = async () => {
        return (await axios.get('/san-pham/hang')).data.data
    }
    return {
        product,
        productsList,
        saveProduct,
        getProductsList,
        saveProductLang,
        saveAllImages,
        saveProductDetail,
        saveProductColorLang,
        updateStatus,
        findById,
        findProductByLang,
        findImages,
        findProductDetail,
        deleteProductImages,
        deleteProductDetail,
        findAllBrands
    }
});
export default useProductStore