import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
                        text: 'categories',
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
                                text: 'categories',
                                to: '/categories',
                            },
                            {
                                active: true,
                                text: 'add_category',
                            }
                        ],
                    },
                }
            ]
        },
    ],
})

export default router
