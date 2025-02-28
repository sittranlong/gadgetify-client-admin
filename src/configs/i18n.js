import {createI18n} from 'vue-i18n';

// Định nghĩa các bản dịch cho Tiếng Việt và Tiếng Anh
const messages = {
    en: {
        hello: 'Hello world',
        welcome: 'Welcome to our store',
        price: 'Price',
        categories: 'Categories',
        products: 'Products',
        dashboard: 'Dashboard',
        users: 'Users',
        analytics: 'Analytics',
        orders: 'Orders',
        select_language: 'Select language',
        select_currency: 'Select currency',
        add_category: 'Add category',
        no: 'No',
        name: 'Name',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        search_category: 'Search category',
        category_name: 'Category name',
        english: 'English',
        vietnamese: 'Vietnamese',
        category_placeholder: 'Enter category name',
        default: 'Default',
        add_success_msg: 'Add {content} successfully',
    },
    vi: {
        hello: 'Xin chào',
        welcome: 'Chào mừng đến với cửa hàng của chúng tôi',
        price: 'Giá',
        categories: 'Danh mục',
        products: 'Sản phẩm',
        dashboard: 'Trang chủ',
        users: 'Người dùng',
        analytics: 'Thống kê',
        orders: 'Đơn hàng',
        select_language: 'Chọn ngôn ngữ',
        select_currency: 'Chọn tiền tệ',
        add_category: 'Thêm danh mục',
        no: 'STT',
        name: 'Tên',
        actions: 'Thao tác',
        edit: 'Sửa',
        delete: 'Xóa',
        search_category: 'Tìm kiếm danh mục',
        category_name: 'Tên danh mục',
        english: 'Tiếng Anh',
        vietnamese: 'Tiếng Việt',
        category_placeholder: 'Nhập tên danh mục',
        default: 'Mặc định',
        add_success_msg: 'Thêm {content} thành công',
    },
};
const numberFormats = {
    en: {
        currency: {
            style: 'currency',
            currency: 'USD',
        },
        percent: {
            style: 'percent',
            minimumFractionDigits: 1,
        },
    },
    vi: {
        currency: {
            style: 'currency',
            currency: 'VND',
            currencyDisplay: 'symbol',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        },
        percent: {
            style: 'percent',
            minimumFractionDigits: 0,
        },
    },
};
const i18n = createI18n({
    legacy: false,
    locale: 'vi', // Ngôn ngữ mặc định
    fallbackLocale: 'en', // Ngôn ngữ dự phòng nếu bản dịch không tồn tại
    messages,
    numberFormats,
});

export default i18n;