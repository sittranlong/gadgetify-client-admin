import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useI18n} from "vue-i18n";
import {computed} from "vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/categories',
            name: 'categories',
            component: () => import('../views/categories/CategoriesView.vue'),
            meta: {
                breadcrumbs: [
                    {
                        active: true,
                        text: computed(() => useI18n().t('categories')),
                    }
                ],
            },
            children: [
                {
                    path: '/categories/add',
                    name: 'add-category',
                    component: () => import('../views/categories/AddCategoryView.vue'),
                    meta: {
                        breadcrumbs: [
                            {
                                text: computed(() => useI18n().t('categories')),
                                to: '/categories',
                            },
                            {
                                active: true,
                                text: computed(() => useI18n().t('add', {content: useI18n().t('categories')})),
                            }
                        ],
                    },
                },
                {
                    path: '/categories/:id',
                    name: 'edit-category',
                    component: () => import('../views/categories/EditCategoryView.vue'),
                    meta: {
                        breadcrumbs: [
                            {
                                text: computed(() => useI18n().t('categories')),
                                to: '/categories',
                            },
                            {
                                active: true,
                                text: computed(() => useI18n().t('edit', {content: useI18n().t('categories')})),
                            }
                        ],
                    },
                },
            ]
        },
        {
            path: '/products',
            name: 'products',
            component: () => import('../views/products/ProductsView.vue'),
            meta: {
                breadcrumbs: [
                    {
                        active: true,
                        text: computed(() => useI18n().t('products')),
                    }
                ],
            },
            children: [
                {
                    path: '/products/add',
                    name: 'add-product',
                    component: () => import('../views/products/AddProductView.vue'),
                    meta: {
                        breadcrumbs: [
                            {
                                text: computed(() => useI18n().t('products')),
                                to: '/products',
                            },
                            {
                                active: true,
                                text: computed(() => useI18n().t('add', {content: useI18n().t('product')})),
                            }
                        ],
                    },
                },
                {
                    path: '/products/:id',
                    name: 'edit-product',
                    component: () => import('../views/products/EditProductView.vue'),
                    meta: {
                        breadcrumbs: [
                            {
                                text: computed(() => useI18n().t('products')),
                                to: '/products',
                            },
                            {
                                active: true,
                                text: computed(() => useI18n().t(`edit`, {content: useI18n().t('product')})),
                            }
                        ],
                    },
                },
            ]
        },
        {
            path: '/orders',
            name: 'orders',
            component: () => import('../views/orders/OrdersView.vue'),
            meta: {
                breadcrumbs: [
                    {
                        active: true,
                        text: computed(() => useI18n().t('orders')),
                    }
                ],
            },
            children: [
                {
                    path: '/orders/:id',
                    name: 'order-detail',
                    component: () => import('../views/orders/OrderDetailView.vue'),
                    meta: {
                        breadcrumbs: [
                            {
                                text: computed(() => useI18n().t('orders')),
                                to: '/orders',
                            },
                            {
                                active: true,
                                text: computed(() => useI18n().t('order_details')),
                            }
                        ],
                    },
                },
            ]
        }
    ],
})

export default router
