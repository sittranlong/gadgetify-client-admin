<script setup>
import {BarChart, Server, ShoppingBag, ShoppingCart, TrendingUp, UserPlus, Users} from 'lucide-vue-next'
import {ref} from "vue";

const statsData = ref([
  {
    title: 'Total Users',
    value: '1,234',
    icon: Users,
    trend: 12,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Total Orders',
    value: '856',
    icon: ShoppingCart,
    trend: -5,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'Revenue',
    value: '$12,345',
    icon: BarChart,
    trend: 8,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    title: 'Growth',
    value: '+24%',
    icon: TrendingUp,
    trend: 24,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
])
const recentActivities = ref([
  {
    id: 1,
    description: 'New user registered',
    time: '5 minutes ago',
    datetime: '2025-02-24T23:37:00',
    icon: UserPlus,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    description: 'New order received',
    time: '1 hour ago',
    datetime: '2025-02-24T22:42:00',
    icon: ShoppingBag,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 3,
    description: 'Server update completed',
    time: '2 hours ago',
    datetime: '2025-02-24T21:42:00',
    icon: Server,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
])
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <template v-for="stat in statsData" :key="stat.title">
      <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
        <div class="flex items-center">
          <div :class="['p-3 rounded-lg', stat.bgColor]">
            <component :is="stat.icon" :class="['h-6 w-6', stat.iconColor]"/>
          </div>
          <div class="ml-4">
            <h3 class="text-gray-500 text-sm font-medium">{{ stat.title }}</h3>
            <p class="text-2xl font-semibold text-gray-800">{{ stat.value }}</p>
            <div :class="['text-sm flex items-center', stat.trend > 0 ? 'text-green-600' : 'text-red-600']">
              <component :is="stat.trend > 0 ? 'TrendingUp' : 'TrendingDown'" class="h-4 w-4 mr-1"/>
              {{ Math.abs(stat.trend) }}% from last month
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div class="mt-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <div class="flow-root">
          <ul class="-mb-8">
            <template v-for="(activity, index) in recentActivities" :key="activity.id">
              <li>
                <div class="relative pb-8">
            <span v-if="index !== recentActivities.length - 1"
                  class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true">
            </span>
                  <div class="relative flex space-x-3">
                    <div :class="['h-8 w-8 rounded-full flex items-center justify-center', activity.bgColor]">
                      <component :is="activity.icon" :class="['h-5 w-5', activity.iconColor]"/>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p class="text-sm text-gray-800">{{ activity.description }}</p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-gray-500">
                        <time :datetime="activity.datetime">{{ activity.time }}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>