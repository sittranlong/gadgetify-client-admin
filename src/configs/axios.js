import useLoadingStore from "@/stores/loading.js";
import axios from "axios";

const axiosConfig = () => {
    axios.defaults.baseURL = "http://localhost:8080/api";
    const loading = useLoadingStore();
    let requestCount = 0;
    axios.interceptors.request.use(
        (config) => {
            requestCount++;
            if (requestCount > 0) {
                loading.show();
            }
            return config;
        },
        (error) => {
            requestCount--;
            if (requestCount === 0) {
                loading.hide();
            }
            return Promise.reject(error);
        }
    );
    axios.interceptors.response.use(
        (response) => {
            requestCount--;
            if (requestCount === 0) {
                loading.hide();
            }
            return response;
        },
        (error) => {
            requestCount--;
            if (requestCount === 0) {
                loading.hide();
            }
            return Promise.reject(error);
        }
    );
};
export default axiosConfig;
