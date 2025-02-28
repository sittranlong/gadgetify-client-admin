import {defineStore} from "pinia";
import {useLoading} from 'vue-loading-overlay'
import {ref} from "vue";

const useLoadingStore = defineStore('loading', () => {
    let loader = null;
    let isLoading = ref(false);
    const loading = useLoading({
        loader: 'dots',
        color: '#4295f0',
        enforceFocus: true,
        lockScroll: true,
    });

    function show() {
        loader = loading.show();
        isLoading.value = true;
    }

    function hide() {
        loader.hide();
        isLoading.value = false;
    }

    return {show, hide, isLoading}
})
export default useLoadingStore;