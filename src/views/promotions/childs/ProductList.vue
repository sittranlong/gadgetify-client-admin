<template>
  <div class="space-y-4">
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
        <div>
          <span class="block text-sm font-medium mb-2">{{ t('name') }}:</span>
          <div class="flex items-center space-x-2">
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
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div
        class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <a-config-provider>
          <template #renderEmpty>
            <a-empty :description="t('added_full')"/>
          </template>
          <a-table
              :row-selection="rowSelection"
              :columns="columns"
              :data-source="filteredProducts"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
              :row-key="record => record.id"
              class="min-w-full">
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
                <a-tag :title="t('base_price')" color="blue">
                  {{ displayCurrency(record.giaCoSo || 0) }}
                </a-tag>
                <br>
                <a-tag :title="t('promotion_price')" style="margin-top: 5px" color="green"
                       v-if="record.giaSauKhuyenMai < record.giaCoSo">
                  {{ displayCurrency(record.giaSauKhuyenMai || 0) }}
                </a-tag>
              </template>

              <!-- Inventory Status Column -->
              <template v-else-if="column.dataIndex === 'trangThaiKho'">
                <a-tag :color="isInStock(record.trangThaiKho) ? 'blue' : 'orange'">
                  {{ getStockStatusText(record.trangThaiKho) }}
                </a-tag>
              </template>

              <!-- Actions Column -->
            </template>
          </a-table>
        </a-config-provider>
      </div>
    </div>
  </div>
  <div class="flex justify-end mt-6">
    <button
        @click="handleAddProducts"
        type="submit"
        class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 flex items-center gap-2"
    >
      <CirclePlus class="w-5 h-5"/>
      {{ t('add', {content: t('product')}) }}
    </button>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, inject} from 'vue';
import {message} from 'ant-design-vue';
import {Search, Plus, Eye, CirclePause, CirclePlus} from 'lucide-vue-next';
import {useI18n} from 'vue-i18n';
import useProductStore from "@/stores/product.js";
import displayCurrency from "@/utils/currencyUtil.js";

let selectedProducts = []
const addedProducts = inject('addedProducts')
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    selectedProducts = selectedRows
  }
};
const handleAddProducts = () => {
  addedProducts.value.push(...selectedProducts)
  message.success(`${t('added')} ${selectedProducts.length} ${t('product')}`)
}
const productStore = useProductStore();
const {n, t} = useI18n();
onMounted(async () => {
  await productStore.getProductsList();
  pagination.value.total = productStore.productsList.length;
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
  const categories = new Set(filteredProducts.value.map(item => item.tenDanhMuc));
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
  }
]);

const filteredProducts = computed(() => {
  let result = [...productStore.productsList];
  result = result.filter(product => product.trangThai);
  result = result.filter(product => !addedProducts.value.some(addedProduct => addedProduct.id === product.id));

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
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
