<script setup>
import {computed, onMounted, ref} from 'vue';
import {CreditCard, MapPin, Package, Phone, Printer, User} from 'lucide-vue-next';
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import useOrderStore from "@/stores/order.js";
import displayCurrency from "../../utils/currencyUtil.js";
import {message} from "ant-design-vue";

const {n, t, d} = useI18n({useScope: 'global'});
const route = useRoute();
const orderIdParam = computed(() => route.params.id);
console.log(orderIdParam.value);
const orderStore = useOrderStore();
const getStatusText = (status) => {
  const statusMap = {
    0: t('unpaid'),
    1: t('pending_confirmation'),
    2: t('pending_shipping'),
    3: t('shipping'),
    4: t('delivered'),
    5: t('cancelled'),
  };
  return statusMap[status] || t('unknown');
};
const getStatusColor = (status) => {
  const colorMap = {
    0: 'orange',
    1: 'blue',
    2: 'cyan',
    3: 'purple',
    4: 'green',
    5: 'red',
  };
  return colorMap[status] || 'default';
};
const getPaymentMethodText = (method) => {
  const methodMap = {
    0: t('cash_on_delivery'),
    1: t('bank_transfer'),
    2: t('card_payment'),
  };
  return methodMap[method] || t('unknown');
};
const canMoveToNextStatus = (status) => {
  return status >= 1 && status < 4;
};

const getNextStatusActionText = (status) => {
  const actionMap = {
    0: t('confirm_payment'),
    1: t('prepare_shipping'),
    2: t('start_shipping'),
    3: t('confirm_delivery'),
  };
  return actionMap[status] || '';
};
const orderDetail = ref([]);
const updateStatus = async () => {
  await orderStore.updateStatus(orderIdParam.value);
  await orderStore.findById(orderIdParam.value);
  orderDetail.value = await orderStore.findOrderDetail(orderIdParam.value);
  await orderStore.getOrdersList();
  message.success(`${t('order')} ${orderStore?.orderById?.maDonHang} ${t('status_updated_to')} ${getStatusText(orderStore?.orderById?.trangThai)}`);
};
onMounted(async () => {
  if (route.name !== 'order-detail') {
    return;
  }
  await orderStore.findById(orderIdParam.value);
  orderDetail.value = await orderStore.findOrderDetail(orderIdParam.value);
  console.log(orderDetail.value);
});
</script>
<template>
  <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div class="flex items-center mb-1">
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">{{ t('order_details') }}</h1>
          </div>
          <div class="flex items-center">
            <span class="text-gray-600 mr-2">{{ `${t('order_id')}:  ` }}<span class="font-medium">{{
                orderStore?.orderById?.maDonHang
              }}</span></span>
            <a-tag :color="getStatusColor(orderStore?.orderById?.trangThai)">
              {{ getStatusText(orderStore?.orderById?.trangThai) }}
            </a-tag>
          </div>
        </div>
        <div class="flex space-x-2 self-end md:self-auto">
          <button
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
            <Printer size="16" class="mr-1"/>
            {{ t('print') }}
          </button>
          <button
              @click="updateStatus"
              v-if="canMoveToNextStatus(orderStore?.orderById?.trangThai)"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            {{ getNextStatusActionText(orderStore?.orderById?.trangThai) }}
          </button>
        </div>
      </div>

      <!-- Thông tin đơn hàng và khách hàng -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <!-- Thông tin đơn hàng -->
        <div class="bg-white rounded-lg shadow p-5">
          <h2 class="flex items-center text-lg font-medium text-gray-900 mb-4">
            <Package size="18" class="mr-2 text-gray-500"/>
            {{ `${t('info')} ${t('order')}` }}
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('status') }}</span>
              <a-tag :color="getStatusColor(orderStore?.orderById?.trangThai)">
                {{ getStatusText(orderStore?.orderById?.trangThai) }}
              </a-tag>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('created_at') }}</span>
              <span class="text-gray-900">{{ d(orderStore?.orderById?.ngayTao || new Date(), 'long') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('payment_method') }}</span>
              <span class="text-gray-900">{{ getPaymentMethodText(orderStore?.orderById?.phuongThucThanhToan) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Voucher</span>
              <span class="text-gray-900 font-medium">{{ orderStore?.orderById?.maPhieuGiamGia || t('none') }}</span>
            </div>
          </div>
        </div>

        <!-- Thông tin khách hàng -->
        <div class="bg-white rounded-lg shadow p-5">
          <h2 class="flex items-center text-lg font-medium text-gray-900 mb-4">
            <User size="18" class="mr-2 text-gray-500"/>
            {{ `${t('info')} ${t('delivery')}` }}
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500 w-24 flex-shrink-0">{{ t('customer') }}</span>
              <span class="text-gray-900">{{ orderStore?.orderById?.tenKhachHang }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 w-24 flex-shrink-0">{{ t('recipient') }}</span>
              <span class="text-gray-900">{{ orderStore?.orderById?.tenNguoiNhan }}</span>
            </div>
            <div class="flex justify-between">
              <Phone size="16" class="text-gray-500 mr-2 flex-shrink-0 mt-1"/>
              <span class="text-gray-900">{{ orderStore?.orderById?.soDienThoaiNguoiNhan }}</span>
            </div>
            <div class="flex justify-between">
              <MapPin size="16" class="text-gray-500 mr-2 flex-shrink-0 mt-1"/>
              <span class="text-gray-900">{{ orderStore?.orderById?.diaChiGiaoHang }}</span>
            </div>
          </div>
        </div>

        <!-- Thông tin thanh toán -->
        <div class="bg-white rounded-lg shadow p-5">
          <h2 class="flex items-center text-lg font-medium text-gray-900 mb-4">
            <CreditCard size="18" class="mr-2 text-gray-500"/>
            {{ `${t('info')} ${t('payment')}` }}
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('subtotal') }}</span>
              <span class="text-gray-900">{{ displayCurrency(orderStore?.orderById?.tongTienSanPham || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('shipping_fee') }}</span>
              <span class="text-gray-900">{{ displayCurrency(orderStore?.orderById?.phiVanChuyen || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ t('discount') }}</span>
              <span class="text-green-600">-{{ displayCurrency(orderStore?.orderById?.tienGiamGia || 0) }}</span>
            </div>
            <div class="border-t pt-3 mt-3 flex justify-between font-medium">
              <span class="text-gray-900">{{ `${t('total')} ${t('payment')}` }}</span>
              <span class="text-xl text-blue-600">{{ displayCurrency(orderStore?.orderById?.tongTien || 0) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div class="p-5 border-b">
          <h2 class="text-lg font-medium text-gray-900">{{ `${t('list')} ${t('products')}` }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('products') }}
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('unit_price') }}
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('quantity') }}
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('subtotal') }}
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in orderDetail" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-16 w-16">
                    <img class="h-16 w-16 rounded object-cover" :src="item.hinhAnh" :alt="item.tenSanPham"/>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ item.tenSanPham }}</div>
                    <div v-if="item.tenMauSac" class="text-sm text-gray-500">{{ item.tenMauSac }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                {{ displayCurrency(item.donGia || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                {{ item.soLuong }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                {{ displayCurrency(item.thanhTien || 0) }}
              </td>
            </tr>
            </tbody>
            <tfoot class="bg-gray-50">
            <tr>
              <td colspan="3" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                {{ `${t('total')} (${orderDetail.length} ${t('products')})` }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                {{ displayCurrency(orderStore?.orderById?.tongTienSanPham || 0) }}
              </td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
