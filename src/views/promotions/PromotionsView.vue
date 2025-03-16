<script setup>
import {useI18n} from "vue-i18n";
import {computed, onMounted, ref} from 'vue';
import {CirclePause, Eye, Plus, Search} from 'lucide-vue-next';
import {useRoute} from "vue-router";
import usePromotionStore from "@/stores/promotion.js";

const promotionStore = usePromotionStore();
const {t} = useI18n();
const searchQuery = ref('');
const statusFilter = ref('');
const expiryFilter = ref('');
const route = useRoute();

const filteredPromotions = computed(() => {
  return promotionStore.promotionsList.filter(promotion => {
    const matchesSearch = promotion.tenDotKhuyenMai.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus = statusFilter.value === '' ||
        (statusFilter.value === 'active' && promotion.trangThai) ||
        (statusFilter.value === 'inactive' && !promotion.trangThai);

    const isExpired = new Date(promotion.ngayKetThuc) < new Date();
    const matchesExpiry = expiryFilter.value === '' ||
        (expiryFilter.value === 'expired' && isExpired) ||
        (expiryFilter.value === 'not_expired' && !isExpired);

    return matchesSearch && matchesStatus && matchesExpiry;
  });
});

onMounted(async () => {
  if (route.name === 'promotions') {
    await promotionStore.getPromotionsList();
    console.log(promotionStore.promotionsList);
  }
})
</script>

<template>
  <div class="space-y-4" v-if="route.name === 'promotions'">
    <div class="flex flex-col sm:flex-row gap-4">
      <h2 class="text-lg font-semibold text-gray-800">{{ t('promotion') }}</h2>
      <div class="flex-1 flex gap-4 items-center justify-between sm:justify-end">
        <div class="relative flex-1 sm:flex-initial">
          <input
              v-model="searchQuery"
              type="text"
              :placeholder="`${t('search')} ${t('promotion')}`"
              class="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
        </div>
        <RouterLink to="/promotions/add">
          <button
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus class="w-4 h-4"/>
            <span>{{ t('add', {content: t('promotion')}) }}</span>
          </button>
        </RouterLink>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-auto">
        <select
            v-model="statusFilter"
            class="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">{{ t('all') }} {{ t('status') }}</option>
          <option value="active">{{ t('active') }}</option>
          <option value="inactive">{{ t('inactive') }}</option>
        </select>
      </div>
      <div class="w-full sm:w-auto">
        <select
            v-model="expiryFilter"
            class="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">{{ t('all') }} {{ t('hsd') }}</option>
          <option value="expired">{{ t('expired') }}</option>
          <option value="not_expired">{{ t('not_expired') }}</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ `${t('name')}` }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('value') + ' (%)' }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('status') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('hsd') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('start_date') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('end_date') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('actions') }}
            </th>
          </tr>
          </thead>
          <tbody v-if="filteredPromotions.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="(promotion, index) in filteredPromotions" :key="promotion.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ promotion.tenDotKhuyenMai }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{
                promotion.phanTramGiam
              }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <a-tag :color="promotion.trangThai ? 'success' : 'error'">
                {{ promotion.trangThai ? t('active') : t('inactive') }}
              </a-tag>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <a-tag v-if="new Date(promotion.ngayBatDau + 'T00:00:00') > new Date()" color="warning">
                {{ t('not_started') }}
              </a-tag>
              <a-tag v-else :color="new Date(promotion.ngayKetThuc) < new Date() ? 'error' : 'success'">
                {{ new Date(promotion.ngayKetThuc) < new Date() ? t('expired') : t('not_expired') }}
              </a-tag>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ promotion.ngayBatDau }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ promotion.ngayKetThuc }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex gap-3">
                <button
                    @click="$router.push(`/promotions/${promotion.id}`)"
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    :title="t('edit')"
                >
                  <Eye class="w-4 h-4"/>
                </button>
                <a-popconfirm
                    v-if="promotion.trangThai"
                    :title="`${t('confirm')} ${t('inactive')}?`"
                    :ok-text="t('yes')"
                    :cancel-text="t('cancel')"
                    @confirm="promotionStore.updateStatus(promotion.id)"
                >
                  <button
                      class="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      :title="t('inactive')"
                  >
                    <CirclePause class="w-4 h-4"/>
                  </button>
                </a-popconfirm>
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-else class="bg-white divide-y divide-gray-200">
          <tr>
            <td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              <a-empty :description="t('no_data')"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <RouterView v-else/>
</template>
