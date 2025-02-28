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
    ],
})

export default router
