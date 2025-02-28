<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div v-if="isMobile && isSidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-black/50 z-20 lg:hidden">
      </div>
    </Transition>

    <!-- Header -->
    <!-- Header -->
    <header class="bg-white shadow-md fixed w-full z-30">
      <div class="flex items-center justify-between px-4 lg:px-6 h-16">
        <!-- Left Section -->
        <div class="flex items-center">
          <button @click="toggleSidebar"
                  class="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-1">
            <Menu v-if="!isSidebarOpen" class="h-6 w-6"/>
            <X v-else class="h-6 w-6"/>
          </button>
          <h1 class="ml-4 text-lg lg:text-xl font-semibold text-gray-800 hidden sm:block">
            Admin Dashboard
          </h1>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- Language Selector -->
          <div class="relative group">
            <select @change="changeLocale" class="appearance-none w-20 md:w-32 bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 md:pr-10 text-gray-700
     focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
     hover:border-indigo-300 cursor-pointer transition-all duration-200 ease-in-out
     bg-gradient-to-r from-white to-gray-50 shadow-sm text-sm">
              <option value="vi">VN</option>
              <option value="en">ENG</option>
            </select>
            <ChevronDown class="h-4 w-4 text-gray-500 absolute right-2 md:right-3 top-1/2 -translate-y-1/2
     pointer-events-none transition-transform duration-200 group-hover:text-indigo-500
     group-hover:-rotate-180"/>
            <span class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white
     text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200
     pointer-events-none whitespace-nowrap hidden md:block">
       {{ t('select_language') }}
      </span>
          </div>

          <!-- Currency Selector -->
          <div class="relative group">
            <select
                @change="numberFormatStore.changeCurrency($event.target.value)"
                class="appearance-none w-20 md:w-32 bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 md:pr-10 text-gray-700
     focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
     hover:border-indigo-300 cursor-pointer transition-all duration-200 ease-in-out
     bg-gradient-to-r from-white to-gray-50 shadow-sm text-sm">
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
            <ChevronDown class="h-4 w-4 text-gray-500 absolute right-2 md:right-3 top-1/2 -translate-y-1/2
     pointer-events-none transition-transform duration-200 group-hover:text-indigo-500
     group-hover:-rotate-180"/>
            <span class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white
     text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200
     pointer-events-none whitespace-nowrap hidden md:block">
        {{ t('select_currency') }}
      </span>
          </div>

          <!-- Notifications -->
          <button class="text-gray-500 hover:text-gray-600 relative">
            <Bell class="h-6 w-6"/>
            <span
                class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
       3
      </span>
          </button>

          <!-- User Menu -->
          <div class="relative" @click="isUserMenuOpen = !isUserMenuOpen">
            <button class="flex items-center space-x-3 md:space-x-3 focus:outline-none">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="User"
                   class="w-8 h-8 rounded-full border-2 border-indigo-500">
              <span class="text-gray-700 hidden md:block">Admin User</span>
              <ChevronDown class="h-4 w-4 text-gray-500 hidden md:block"/>
            </button>

            <!-- Dropdown Menu -->
            <Transition name="scale">
              <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User class="h-4 w-4 mr-2"/>
                  Profile
                </a>
                <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings class="h-4 w-4 mr-2"/>
                  Settings
                </a>
                <hr class="my-1">
                <a href="#" class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <LogOut class="h-4 w-4 mr-2"/>
                  Logout
                </a>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <!-- Sidebar -->
    <aside :class="[
   'fixed top-16 h-[calc(100vh-4rem)] bg-gray-800 text-white transition-all duration-300 ease-in-out z-20',
   isMobile ? 'w-72' : (isSidebarOpen ? 'w-72' : 'w-20'),
   isMobile ? (isSidebarOpen ? 'left-0' : '-left-72') : 'left-0'
  ]">
      <nav class="h-full overflow-y-auto">
        <div class="p-4">
          <!-- Navigation Items -->
          <div class="space-y-1">
            <template v-for="item in navigationItems" :key="item.name">
              <RouterLink :to="item.href" :class="[
        'flex items-center px-4 py-3 rounded-lg transition-colors group',
        { 'justify-start': isSidebarOpen || isMobile, 'justify-center': !isSidebarOpen && !isMobile },
        item.active ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
       ]">
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0"/>
                <span :class="['ml-3', { 'hidden': !isSidebarOpen && !isMobile }]">
         {{ item.name }}
        </span>
                <!-- Tooltip for collapsed sidebar -->
                <span v-if="!isSidebarOpen && !isMobile"
                      class="fixed left-20 bg-gray-900 text-white px-2 py-1 rounded ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
         {{ item.name }}
        </span>
              </RouterLink>
            </template>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main :class="[
   'pt-16 transition-all duration-300',
   isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-72' : 'ml-20')
  ]">
      <div class="p-6">
        <!-- Breadcrumb -->
        <div class="mb-3">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <RouterLink to="/" class="text-gray-700 hover:text-indigo-600 flex items-center">
                  <Home class="h-4 w-4 mr-2"/>
                  {{ t('dashboard') }}
                </RouterLink>
              </li>
              <li v-if="breadcrumbs" v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                <div class="flex items-center">
                  <ChevronRight class="h-4 w-4  mx-2"/>
                  <RouterLink v-if="!breadcrumb.active" class="text-gray-700 hover:text-indigo-600" :to="breadcrumb.to">
                    {{
                      breadcrumb.text
                    }}
                  </RouterLink>
                  <span v-else class="text-gray-700 hover:text-indigo-600">
                    {{
                      breadcrumb.text
                    }}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <RouterView/>
      </div>
    </main>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {
  BarChart,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  ListTree,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  User,
  Users,
  X
} from 'lucide-vue-next'
import {useI18n} from "vue-i18n";
import useNumberFormat from "@/stores/number-format.js";
import {useRoute} from "vue-router";

const route = useRoute()
const breadcrumbs = computed(() => route.meta.breadcrumbs || null)
const numberFormatStore = useNumberFormat()
const {t, locale} = useI18n({useScope: 'global'})
const changeLocale = (e) => {
  locale.value = e.target.value
}
// Responsive state
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 1024)
const isSidebarOpen = ref(window.innerWidth >= 1024)
const isUserMenuOpen = ref(false)

// Navigation items
const navigationItems = ref([
  {
    name: computed(() => {
      return t('dashboard')
    }), href: '/', icon: Home, active: computed(() => route.path === '/')
  },
  {
    name: computed(() => {
      return t('users')
    }), href: '#', icon: Users, active: false
  },
  {
    name: computed(() => {
      return t('analytics')
    }), href: '#', icon: BarChart, active: false
  },
  {
    name: computed(() => {
      return t('products')
    }), href: '#', icon: Package, active: false
  },
  {
    name: computed(() => {
      return t('orders')
    }), href: '#', icon: ShoppingCart, active: false
  },
  {
    name: computed(() => {
      return t('categories')
    }), href: '/categories', icon: ListTree, active: computed(() => route.path.includes('categories'))
  },
])


// Recent activities

// Methods
const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (!isMobile.value) {
    isSidebarOpen.value = true
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  if (isMobile.value && isSidebarOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
}

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
    document.body.style.overflow = 'auto'
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
