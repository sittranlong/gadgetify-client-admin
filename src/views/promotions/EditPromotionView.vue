<script setup>
import {useI18n} from "vue-i18n";
import {
  CheckCheck, CheckCircle,
  Pencil,
  Tag,
  DollarSign,
  CalendarCheck,
  CalendarX,
} from 'lucide-vue-next';
import {ref, watch, provide, onMounted} from "vue";
import {message} from "ant-design-vue";
import usePromotionStore from "@/stores/promotion.js";
import ProductList from "@/views/promotions/childs/ProductList.vue";
import PromotionAddedProduct from "@/views/promotions/childs/PromotionAddedProduct.vue";
import {useRoute} from "vue-router";

const {t} = useI18n();
const route = useRoute();
const promotionStore = usePromotionStore()
const addedProducts = ref([]);
provide('addedProducts', addedProducts)
watch(addedProducts.value, (newVal) => {
  console.log(newVal);
})
const nameEN = ref();
const newPromotion = ref({
  trangThai: true
});
const validateBeforeSave = () => {
  const startDate = new Date(newPromotion.value.ngayBatDau);
  const endDate = new Date(newPromotion.value.ngayKetThuc);
  if (endDate <= startDate) {
    message.error(t('end_date_must_be_greater_than_start_date'));
    return false;
  }
  if (addedProducts.value.length === 0) {
    message.error(t('list_product_not_empty'));
    return false;
  }
  return true;
}
onMounted(async () => {
  await promotionStore.findById(route.params.id);
  newPromotion.value = promotionStore.promotion;
  newPromotion.value.tenDotKhuyenMai = promotionStore.promotion.vi;
  nameEN.value = promotionStore.promotion.en;
  addedProducts.value = [...promotionStore.promotion.sanPhamsList]
  console.log(promotionStore.promotion);
})
const savePromotion = async () => {
  if (!validateBeforeSave()) {
    return;
  }
  console.log(newPromotion.value);
  const savedPromotion = await promotionStore.savePromotion(newPromotion.value);
  console.log(savedPromotion);
  if (nameEN.value) {
    await promotionStore.savePromotionLang({
      id: promotionStore.promotion.idEn,
      dotKhuyenMai: {id: savedPromotion?.id},
      ngonNgu: {id: 'en'},
      tenDotKhuyenMai: nameEN.value
    })
  }
  await promotionStore.deletePromotionDetailsByPromotionId(savedPromotion.id);
  const promotionDetails = addedProducts.value.map((product) => ({
    dotKhuyenMai: {id: savedPromotion.id},
    sanPham: {id: product.id}
  }));
  await promotionStore.savePromotionDetails(promotionDetails);
  await promotionStore.getPromotionsList();
  message.success(t('save_success_msg', {content: t('promotion')}));
};
const activeKey = ref('1');
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="flex items-center gap-3 mb-2">
      <CheckCheck class="w-6 h-6 text-indigo-600"/>
      <h2 class="text-xl font-semibold text-gray-800">
        {{ t('edit', {content: t('promotion')}) }}
      </h2>
    </div>
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" :tab="t('basic_info')">
        <form class="space-y-6" @submit.prevent="savePromotion">
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ `${t('name')} ${t('promotion')} (${t('vietnamese')} - ${t('default')})` }}
            </label>
            <div class="relative">
              <input
                  required
                  minlength="3"
                  type="text"
                  v-model="newPromotion.tenDotKhuyenMai"
                  :placeholder="`${t('enter')} ${t('name')} ${t('promotion')} ${t('vietnamese')}`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ `${t('name')} ${t('promotion')} (${t('english')})}` }}
            </label>
            <div class="relative">
              <input
                  minlength="3"
                  type="text"
                  v-model="nameEN"
                  :placeholder="`${t('enter')} ${t('name')} ${t('promotion')} ${t('english')}`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ `${t('percent')} ${t('discount')}` }}
            </label>
            <div class="relative">
              <input
                  required
                  type="number"
                  min="1"
                  :max="50"
                  v-model="newPromotion.phanTramGiam"
                  :placeholder="`${t('enter')} ${t('percent')} ${t('discount')}`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ `${t('status')} ${t('promotion')}` }}</label>
            <div class="flex gap-6">
              <label class="flex items-center gap-2">
                <input
                    v-model="newPromotion.trangThai"
                    checked
                    type="radio"
                    :value="true"
                    class="text-indigo-600 focus:ring-indigo-500"
                >
                <span class="text-gray-700">{{ t('active') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                    v-model="newPromotion.trangThai"
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
                  v-model="newPromotion.ngayBatDau"
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
                  v-model="newPromotion.ngayKetThuc"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <CalendarX class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <button
                @click="$router.push('/promotions')"
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
              {{ `${t('save')} ${t('promotion')}` }}
            </button>
          </div>
        </form>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="t('added_product')">
        <PromotionAddedProduct/>
      </a-tab-pane>
      <a-tab-pane key="3" :tab="t('add', {content: t('product')})">
        <ProductList/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>