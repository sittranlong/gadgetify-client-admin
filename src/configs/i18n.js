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
        add: 'Add {content}',
        no: 'No',
        name: 'Name',
        actions: 'Actions',
        edit: 'Edit {content}',
        delete: 'Delete',
        search_category: 'Search category',
        category_name: 'Category name',
        english: 'English',
        vietnamese: 'Vietnamese',
        category_placeholder: 'Enter category name',
        default: 'Default',
        save_success_msg: 'Save {content} successfully',
        delete_success_msg: 'Delete {content} successfully',
        confirm_delete: 'Are you sure you want to delete this item?',
        yes: 'Yes',
        cancel: 'Cancel',
        save: 'Save',
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
        add: 'Thêm {content}',
        no: 'STT',
        name: 'Tên',
        actions: 'Thao tác',
        edit: 'Sửa {content}',
        delete: 'Xóa',
        search_category: 'Tìm kiếm danh mục',
        category_name: 'Tên danh mục',
        english: 'Tiếng Anh',
        vietnamese: 'Tiếng Việt',
        category_placeholder: 'Nhập tên danh mục',
        default: 'Mặc định',
        save_success_msg: 'Lưu {content} thành công',
        delete_success_msg: 'Xóa {content} thành công',
        confirm_delete: 'Bạn có chắc chắn muốn xóa mục này?',
        yes: 'Có',
        cancel: 'Hủy',
        save: 'Lưu',
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