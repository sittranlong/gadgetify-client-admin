<template>
  <div class="space-y-4" v-if="route.name === 'products'">
    <div class="flex flex-col sm:flex-row gap-4">
      <h2 class="text-lg font-semibold text-gray-800">{{ t('products') }}</h2>
      <div class="flex-1 flex gap-4 items-center justify-between sm:justify-end">
        <!-- Filters -->
        <div class="relative flex-1 sm:flex-initial">
          <a-input
              v-model:value="filters.searchText"
              :placeholder="`${t('search')} ${t('product')}`"
              class="w-full sm:w-64 pl-10 pr-4 py-2"
              allow-clear
          >
            <template #prefix>
              <Search class="w-4 h-4 text-gray-400"/>
            </template>
          </a-input>
        </div>

        <!-- Add Product Button -->
        <RouterLink to="/products/add">
          <button
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus class="w-4 h-4"/>
            <span>{{ t('add', {content: t('product')}) }}</span>
          </button>
        </RouterLink>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Price Range Filter -->
        <div>
          <span class="block text-sm font-medium mb-2">{{ t('price') }}:</span>
          <div class="flex items-center space-x-2">
            <a-input-number
                v-model:value="filters.minPrice"
                :min="0"
                :placeholder="`${t('from')}`"
                class="w-full flex-1"
            />
            <span>-</span>
            <a-input-number
                v-model:value="filters.maxPrice"
                :min="0"
                :placeholder="`${t('to')}`"
                class="w-full flex-1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div
        class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <a-table
            :columns="columns"
            :data-source="filteredProducts"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            :row-key="record => record.id"
            class="min-w-full"
        >
          <!-- Product Name Column -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'tenSanPham'">
              <div class="flex items-center">
                <img
                    :src="record.anhDaiDien"
                    :alt="record.tenSanPham"
                    class="w-10 h-10 object-cover rounded mr-3"
                />
                <span>{{ record.tenSanPham }}</span>
              </div>
            </template>

            <!-- Price Column -->
            <template v-else-if="column.dataIndex === 'giaCoSo'">
              {{ displayCurrency(record.giaCoSo || 0) }}
            </template>

            <!-- Status Column -->
            <template v-else-if="column.dataIndex === 'trangThai'">
              <a-tag :color="record.trangThai ? 'success' : 'error'">
                {{ record.trangThai ? t('on_sell') : t('off_sell') }}
              </a-tag>
            </template>

            <!-- Inventory Status Column -->
            <template v-else-if="column.dataIndex === 'trangThaiKho'">
              <a-tag :color="isInStock(record.trangThaiKho) ? 'blue' : 'orange'">
                {{ getStockStatusText(record.trangThaiKho) }}
              </a-tag>
            </template>

            <!-- Actions Column -->
            <template v-else-if="column.dataIndex === 'actions'">
              <div class="flex gap-3">
                <button
                    @click="$router.push(`/products/${record.id}`)"
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    :title="t('edit')"
                >
                  <Eye class="w-4 h-4"/>
                </button>
                <a-popconfirm
                    v-if="record.trangThai"
                    :title="`${t('confirm')} ${t('off_sell')}?`"
                    :ok-text="t('yes')"
                    :cancel-text="t('cancel')"
                    @confirm="handleStopSell(record)"
                >
                  <button
                      class="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      :title="t('off_sell')"
                  >
                    <CirclePause class="w-4 h-4"/>
                  </button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
  <RouterView v-else/>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {message} from 'ant-design-vue';
import {Search, Plus, Eye, CirclePause} from 'lucide-vue-next';
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import useProductStore from "@/stores/product.js";
import displayCurrency from "../../utils/currencyUtil.js";

const route = useRoute();
const productStore = useProductStore();
const {n, t} = useI18n();
onMounted(async () => {
  if (route.name === 'products') {
    await productStore.getProductsList();
    pagination.value.total = productStore.productsList.length;
  }
});
const isInStock = (status) => {
  return status === 'Còn hàng' || status === 'In stock';
};

const getStockStatusText = (status) => {
  if (isInStock(status)) {
    return t('in_stock');
  } else {
    return t('out_of_stock');
  }
};
const loading = ref(false);

const filters = ref({
  searchText: '',
  minPrice: null,
  maxPrice: null,
  category: [],
  status: [],
  inventoryStatus: [],
});

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
});

const categoryOptions = computed(() => {
  const categories = new Set(productStore.productsList.map(item => item.tenDanhMuc));
  return Array.from(categories).map(category => ({
    text: category,
    value: category,
  }));
});

const stockStatusOptions = computed(() => [
  {text: t('in_stock'), value: 'in_stock'},
  {text: t('out_of_stock'), value: 'out_of_stock'}
]);

const columns = computed(() => [
  {
    title: t('name'),
    dataIndex: 'tenSanPham',
    key: 'tenSanPham',
    sorter: (a, b) => a.tenSanPham.localeCompare(b.tenSanPham),
  },
  {
    title: t('price'),
    dataIndex: 'giaCoSo',
    key: 'giaCoSo',
    sorter: (a, b) => a.giaCoSo - b.giaCoSo,
  },
  {
    title: t('categories'),
    dataIndex: 'tenDanhMuc',
    key: 'tenDanhMuc',
    filters: categoryOptions.value,
    onFilter: (value, record) => record.tenDanhMuc === value,
  },
  {
    title: t('status'),
    dataIndex: 'trangThai',
    key: 'trangThai',
    filters: [
      {text: t('on_sell'), value: true},
      {text: t('off_sell'), value: false},
    ],
    onFilter: (value, record) => record.trangThai === value,
  },
  {
    title: t('stock'),
    dataIndex: 'trangThaiKho',
    key: 'trangThaiKho',
    filters: stockStatusOptions.value,
    onFilter: (value, record) => {
      if (value === 'in_stock') {
        return isInStock(record.trangThaiKho);
      } else {
        return !isInStock(record.trangThaiKho);
      }
    },
  },
  {
    title: t('actions'),
    dataIndex: 'actions',
    key: 'actions',
    width: 120,
  },
]);

const filteredProducts = computed(() => {
  let result = [...productStore.productsList];

  if (filters.value.searchText) {
    const searchText = filters.value.searchText.toLowerCase();
    result = result.filter(product =>
        product.tenSanPham.toLowerCase().includes(searchText)
    );
  }

  if (filters.value.minPrice !== null) {
    result = result.filter(product => product.giaCoSo >= filters.value.minPrice);
  }

  if (filters.value.maxPrice !== null && filters.value.maxPrice >= filters.value.minPrice) {
    result = result.filter(product => product.giaCoSo <= filters.value.maxPrice);
  }

  return result;
});

const handleTableChange = (pag, filters, sorter) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
};
const handleStopSell = async (record) => {
  await productStore.updateStatus(record.id);
  message.success(`${t('off_sell')} ${t('product')} ${record.tenSanPham} ${t('success')}`);
};
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
