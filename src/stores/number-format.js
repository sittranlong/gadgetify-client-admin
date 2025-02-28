import {ref} from 'vue'
import {defineStore} from 'pinia'

const useNumberFormat = defineStore('number-format', () => {
    const selectedCurrency = ref('VND')
    const changeCurrency = (currency) => {
        selectedCurrency.value = currency
    }
    return {selectedCurrency, changeCurrency}
})
export default useNumberFormat