<template>
  <div class="space-y-4" v-if="route.name === 'orders'">
    <div class="flex flex-col sm:flex-row gap-4">
      <h2 class="text-lg font-semibold text-gray-800">{{ t('orders') }}</h2>
      <div class="flex-1 flex gap-4 items-center justify-between sm:justify-end">
        <div class="relative flex-1 sm:flex-initial">
          <a-input
              v-model:value="searchText"
              :placeholder="`${t('search')} ${t('order')}`"
              class="w-full sm:w-64 pl-10 pr-4 py-2"
              allow-clear
          >
            <template #prefix>
              <Search class="w-4 h-4 text-gray-400"/>
            </template>
          </a-input>
        </div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span class="block text-sm font-medium mb-2">{{ t('date_range') }}:</span>
          <a-range-picker
              v-model:value="dateRange"
              class="w-full"
              :placeholder="[t('start_date'), t('end_date')]"
          />
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <a-config-provider>
          <template #renderEmpty>
            <a-empty :description="t('no_data')"/>
          </template>
          <a-table
              :columns="columns"
              :data-source="filteredOrders"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
              :row-key="record => record.id"
              class="min-w-full">
            <!-- Order ID Column -->
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'maDonHang'">
                <span class="font-medium">{{ record.maDonHang }}</span>
              </template>

              <!-- Status Column -->
              <template v-else-if="column.dataIndex === 'trangThai'">
                <a-tag :color="getStatusColor(record.trangThai)">
                  {{ getStatusText(record.trangThai) }}
                </a-tag>
              </template>

              <!-- Total Column -->
              <template v-else-if="column.dataIndex === 'tongTien'">
                {{ n(record.tongTien, 'currency') }}
              </template>

              <!-- Payment Method Column -->
              <template v-else-if="column.dataIndex === 'phuongThucThanhToan'">
                {{ getPaymentMethodText(record.phuongThucThanhToan) }}
              </template>

              <!-- Date Column -->
              <template v-else-if="column.dataIndex === 'ngayTao'">
                {{ d(record.ngayTao, 'long') }}
              </template>

              <!-- Actions Column -->
              <template v-else-if="column.dataIndex === 'actions'">
                <div class="flex gap-3">
                  <button
                      @click="$router.push(`/orders/${record.id}`)"
                      class="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      :title="t('view_details')"
                  >
                    <Eye class="w-4 h-4"/>
                  </button>
                  <button
                      v-if="canMoveToNextStatus(record.trangThai)"
                      @click="updateStatus(record.id)"
                      class="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      :title="getNextStatusActionText(record.trangThai)"
                  >
                    <ArrowRight class="w-4 h-4"/>
                  </button>
                </div>
              </template>
            </template>
          </a-table>
        </a-config-provider>
      </div>
    </div>
  </div>
  <RouterView v-else/>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {message} from 'ant-design-vue';
import {Search, Eye, ArrowRight} from 'lucide-vue-next';
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import useOrderStore from "@/stores/order.js";

const route = useRoute();
const {n, t, d} = useI18n();

const loading = ref(false);
const orders = ref([]);
const searchText = ref('');
const statusFilter = ref([]);
const paymentMethodFilter = ref([]);
const dateRange = ref([]);
const detailModalVisible = ref(false);
const selectedOrder = ref(null);

const statusOptions = [
  {text: t('unpaid'), value: 0},
  {text: t('pending_confirmation'), value: 1},
  {text: t('pending_shipping'), value: 2},
  {text: t('shipping'), value: 3},
  {text: t('delivered'), value: 4},
  {text: t('cancelled'), value: 5},
];

const paymentMethodOptions = [
  {text: t('cash_on_delivery'), value: 0},
  {text: t('bank_transfer'), value: 1},
  {text: t('card_payment'), value: 2},
];

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
});

const columns = [
  {
    title: t('order_id'),
    dataIndex: 'maDonHang',
    key: 'maDonHang',
    sorter: (a, b) => a.maDonHang.localeCompare(b.maDonHang),
  },
  {
    title: t('customer_name'),
    dataIndex: 'tenKhachHang',
    key: 'tenKhachHang',
    sorter: (a, b) => a.tenKhachHang.localeCompare(b.tenKhachHang),
  },
  {
    title: t('status'),
    dataIndex: 'trangThai',
    key: 'trangThai',
    filters: statusOptions,
    onFilter: (value, record) => record.trangThai === value,
    sorter: (a, b) => a.trangThai - b.trangThai,
  },
  {
    title: t('total'),
    dataIndex: 'tongTien',
    key: 'tongTien',
    sorter: (a, b) => a.tongTien - b.tongTien,
  },
  {
    title: t('payment_method'),
    dataIndex: 'phuongThucThanhToan',
    key: 'phuongThucThanhToan',
    filters: paymentMethodOptions,
    onFilter: (value, record) => record.phuongThucThanhToan === value,
    sorter: (a, b) => a.phuongThucThanhToan - b.phuongThucThanhToan,
  },
  {
    title: t('date'),
    dataIndex: 'ngayTao',
    key: 'ngayTao',
    sorter: (a, b) => new Date(a.ngayTao) - new Date(b.ngayTao),
  },
  {
    title: t('actions'),
    dataIndex: 'actions',
    key: 'actions',
    width: 120,
  },
];

const filteredOrders = computed(() => {
  let result = [...orderStore.ordersList];

  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(order =>
        order.maDonHang.toLowerCase().includes(search)
    );
  }

  if (statusFilter.value && statusFilter.value.length > 0) {
    result = result.filter(order => statusFilter.value.includes(order.trangThai));
  }

  if (paymentMethodFilter.value && paymentMethodFilter.value.length > 0) {
    result = result.filter(order => paymentMethodFilter.value.includes(order.phuongThucThanhToan));
  }

  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = dateRange.value[0]?.startOf('day');
    const endDate = dateRange.value[1]?.endOf('day');

    if (startDate && endDate) {
      result = result.filter(order => {
        const orderDate = new Date(order.ngayTao);
        return orderDate >= startDate.toDate() && orderDate <= endDate.toDate();
      });
    }
  }

  return result;
});

const handleTableChange = (pag, filters, sorter) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
};

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
const updateStatus = async (id) => {
  await orderStore.updateStatus(id);
  await orderStore.getOrdersList();
  await orderStore.findById(id);
  message.success(`${t('order')} ${orderStore?.orderById?.maDonHang} ${t('status_updated_to')} ${getStatusText(orderStore?.orderById?.trangThai)}`);
}
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
const orderStore = useOrderStore();
onMounted(async () => {
  if (route.name === 'orders') {
    await orderStore.getOrdersList();
    console.log(orderStore.ordersList);
  }
});
</script>