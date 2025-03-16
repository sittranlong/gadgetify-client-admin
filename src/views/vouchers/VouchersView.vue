<script setup>
import {useI18n} from "vue-i18n";
import {computed, onMounted, ref} from 'vue';
import {CirclePause, Eye, Plus, Search} from 'lucide-vue-next';
import {useRoute} from "vue-router";
import useVoucherStore from "@/stores/voucher.js";
import displayCurrency from "../../utils/currencyUtil.js";

const voucherStore = useVoucherStore();
const {t} = useI18n();
const searchQuery = ref('');
const statusFilter = ref('');
const expiryFilter = ref('');
const route = useRoute();

const filteredVouchers = computed(() => {
  return voucherStore.vouchersList.filter(voucher => {
    const matchesSearch = voucher.maPhieuGiamGia.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus = statusFilter.value === '' ||
        (statusFilter.value === 'active' && voucher.trangThai) ||
        (statusFilter.value === 'inactive' && !voucher.trangThai);

    const isExpired = new Date(voucher.ngayKetThuc) < new Date();
    const matchesExpiry = expiryFilter.value === '' ||
        (expiryFilter.value === 'expired' && isExpired) ||
        (expiryFilter.value === 'not_expired' && !isExpired);

    return matchesSearch && matchesStatus && matchesExpiry;
  });
});

onMounted(async () => {
  if (route.name === 'vouchers') {
    await voucherStore.getVouchersList();
    console.log(voucherStore.vouchersList);
  }
})
</script>

<template>
  <div class="space-y-4" v-if="route.name === 'vouchers'">
    <div class="flex flex-col sm:flex-row gap-4">
      <h2 class="text-lg font-semibold text-gray-800">{{ t('voucher') }}</h2>
      <div class="flex-1 flex gap-4 items-center justify-between sm:justify-end">
        <div class="relative flex-1 sm:flex-initial">
          <input
              v-model="searchQuery"
              type="text"
              :placeholder="`${t('search')} ${t('voucher')}`"
              class="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
        </div>
        <RouterLink to="/vouchers/add">
          <button
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus class="w-4 h-4"/>
            <span>{{ t('add', {content: t('voucher')}) }}</span>
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
              {{ `${t('code')}` }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('value') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('status') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('hsd') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ `${t('order')} ${t('min')}` }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ `${t('order')} ${t('max')}` }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('actions') }}
            </th>
          </tr>
          </thead>
          <tbody v-if="filteredVouchers.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="(voucher, index) in filteredVouchers" :key="voucher.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ voucher.maPhieuGiamGia }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ voucher.loaiGiamGia === 0 ? `${voucher.giaTriGiamGia}%` : displayCurrency(voucher.giaTriGiamGia) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <a-tag :color="voucher.trangThai ? 'success' : 'error'">
                {{ voucher.trangThai ? t('active') : t('inactive') }}
              </a-tag>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <a-tag v-if="new Date(voucher.ngayBatDau + 'T00:00:00') > new Date()" color="warning">
                {{ t('not_started') }}
              </a-tag>
              <a-tag v-else :color="new Date(voucher.ngayKetThuc) < new Date() ? 'error' : 'success'">
                {{ new Date(voucher.ngayKetThuc) < new Date() ? t('expired') : t('not_expired') }}
              </a-tag>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ displayCurrency(voucher.giaTriDonHangToiThieu || 0) }}
            </td>
            <td v-if="voucher.giaTriDonHangToiDa" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ displayCurrency(voucher.giaTriDonHangToiDa || 0) }}
            </td>
            <td v-else class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <a-tag color="warning">
                N/A
              </a-tag>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex gap-3">
                <button
                    @click="$router.push(`/vouchers/${voucher.id}`)"
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    :title="t('edit')"
                >
                  <Eye class="w-4 h-4"/>
                </button>
                <a-popconfirm
                    v-if="voucher.trangThai"
                    :title="`${t('confirm')} ${t('inactive')}?`"
                    :ok-text="t('yes')"
                    :cancel-text="t('cancel')"
                    @confirm="voucherStore.updateStatus(voucher.id)"
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
