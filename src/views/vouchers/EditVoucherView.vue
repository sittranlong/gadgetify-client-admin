<script setup>
import {useI18n} from "vue-i18n";
import {
  AtSign,
  CalendarCheck,
  CalendarX,
  CheckCheck,
  CheckCircle,
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  Tag,
} from 'lucide-vue-next';
import {onMounted, ref} from "vue";
import useVoucherStore from "@/stores/voucher.js";
import {message} from "ant-design-vue";
import {useRoute} from "vue-router";

const voucherStore = useVoucherStore()
const route = useRoute();
const voucherId = route.params.id;
const {t} = useI18n();
const newVoucher = ref({
  loaiGiamGia: 0,
  trangThai: true,
});
const validateBeforeSave = () => {
  if (newVoucher.value.giaTriDonHangToiDa <= newVoucher.value.giaTriDonHangToiThieu) {
    message.error(t('max_order_must_be_greater_than_min_order'));
    return false;
  }
  const startDate = new Date(newVoucher.value.ngayBatDau);
  const endDate = new Date(newVoucher.value.ngayKetThuc);
  if (endDate <= startDate) {
    message.error(t('end_date_must_be_greater_than_start_date'));
    return false;
  }
  return true;
}
const saveVoucher = async () => {
  console.log(newVoucher.value);
  if (!validateBeforeSave()) {
    return;
  }
  await voucherStore.saveVoucher(newVoucher.value);
  message.success(t('save_success_msg', {content: t('voucher')}));
};
onMounted(async () => {
  await voucherStore.findById(voucherId);
  console.log(voucherStore.voucher);
  newVoucher.value = voucherStore.voucher;
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="flex items-center gap-3 mb-6">
      <CheckCheck class="w-6 h-6 text-indigo-600"/>
      <h2 class="text-xl font-semibold text-gray-800">
        {{ t('edit', {content: t('voucher')}) }}
      </h2>
    </div>

    <form class="space-y-6" @submit.prevent="saveVoucher">
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `ID ${t('voucher')}` }}
        </label>
        <div class="relative">
          <input
              disabled
              minlength="3"
              type="text"
              :value="voucherId"
              :placeholder="t('category_placeholder')"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <AtSign class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('code')} ${t('voucher')}` }}
        </label>
        <div class="relative">
          <input
              required
              minlength="3"
              type="text"
              v-model="newVoucher.maPhieuGiamGia"
              :placeholder="`${t('enter')} ${t('code')} ${t('voucher')}`"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ `${t('type')} ${t('voucher')}` }}</label>
        <div class="flex gap-6">
          <label class="flex items-center gap-2">
            <input
                v-model="newVoucher.loaiGiamGia"
                checked
                type="radio"
                :value="0"
                class="text-indigo-600 focus:ring-indigo-500"
            >
            <span class="text-gray-700">{{ t('percent') }}</span>
          </label>
          <label class="flex items-center gap-2">
            <input
                v-model="newVoucher.loaiGiamGia"
                type="radio"
                :value="1"
                class="text-indigo-600 focus:ring-indigo-500"
            >
            <span class="text-gray-700">{{ t('fixed_amount') }}</span>
          </label>
        </div>
      </div>
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('value')} ${t('voucher')}` }}
        </label>
        <div class="relative">
          <input
              required
              type="number"
              :max="newVoucher.loaiGiamGia === 0 ? 50 : null"
              v-model="newVoucher.giaTriGiamGia"
              :placeholder="`${t('enter')} ${t('value')} ${t('voucher')}`"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('quantity')}` }}
        </label>
        <div class="relative">
          <input
              type="number"
              min="1"
              required
              v-model="newVoucher.soLuong"
              :placeholder="`${t('enter')} ${t('quantity')}`"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <Package class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('order')} ${t('min')}` }}
        </label>
        <div class="relative">
          <input
              type="number"
              min="0"
              required
              v-model="newVoucher.giaTriDonHangToiThieu"
              :placeholder="`${t('enter')} ${t('order')} ${t('min')}`"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <ShoppingCart class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>
      <div class="relative" v-if="newVoucher.loaiGiamGia === 0">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('order')} ${t('max')}` }}
        </label>
        <div class="relative">
          <input
              type="number"
              min="0"
              v-model="newVoucher.giaTriDonHangToiDa"
              :placeholder="`${t('enter')} ${t('order')} ${t('max')}`"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <ShoppingCart class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>
      <div class="relative" v-if="newVoucher.loaiGiamGia === 0">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('max_order_discount')}` }}
        </label>
        <div class="relative">
          <input
              type="number"
              min="1"
              v-model="newVoucher.giaTriToiDaGiamGia"
              :placeholder="`${t('enter')} ${t('max_order_discount')}`"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <CreditCard class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ `${t('status')} ${t('voucher')}` }}</label>
        <div class="flex gap-6">
          <label class="flex items-center gap-2">
            <input
                v-model="newVoucher.trangThai"
                checked
                type="radio"
                :value="true"
                class="text-indigo-600 focus:ring-indigo-500"
            >
            <span class="text-gray-700">{{ t('active') }}</span>
          </label>
          <label class="flex items-center gap-2">
            <input
                v-model="newVoucher.trangThai"
                type="radio"
                :value="false"
                class="text-indigo-600 focus:ring-indigo-500"
            >
            <span class="text-gray-700">{{ t('inactive') }}</span>
          </label>
        </div>
      </div>
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('date')} ${t('start')}` }}
        </label>
        <div class="relative">
          <input
              type="date"
              required
              v-model="newVoucher.ngayBatDau"
              :placeholder="`${t('enter')} ${t('start')} ${t('date')}`"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <CalendarCheck class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('date')} ${t('end')}` }}
        </label>
        <div class="relative">
          <input
              type="date"
              required
              v-model="newVoucher.ngayKetThuc"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <CalendarX class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <button
            @click="$router.push('/vouchers')"
            type="button"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
        >
          {{ t('cancel') }}
        </button>
        <button
            type="submit"
            class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 flex items-center gap-2"
        >
          <CheckCircle class="w-5 h-5"/>
          {{ t('save') }}
        </button>
      </div>
    </form>
  </div>
</template>