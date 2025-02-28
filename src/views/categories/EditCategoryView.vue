<script setup>
import {useI18n} from "vue-i18n";
import {Languages, CircleX, CheckCheck, AtSign} from 'lucide-vue-next';
import {computed, onMounted, ref} from "vue";
import useCategoryStore from "@/stores/category.js";
import {useRoute} from "vue-router";

const route = useRoute();
const categoryId = route.params.id;
const categoryStore = useCategoryStore();
const idEn = computed(() => {
  return categoryStore.category.idEn ? categoryStore.category.idEn : null;
})
const {t} = useI18n();
const newCategory = ref({});
const saveCategory = async () => {
  const savedCategory = await categoryStore.saveCategory({
    id: categoryId,
    tenDanhMuc: newCategory.value.vi,
  })
  await categoryStore.findById(savedCategory.id);
  await categoryStore.saveCategoryLang({
    id: idEn.value,
    danhMuc: {id: savedCategory.id},
    tenDanhMuc: newCategory.value.en,
    ngonNgu: {id: "en"}
  })
};
onMounted(async () => {
  await categoryStore.findById(categoryId);
  console.log(categoryStore.category);
  console.log(idEn.value);
  newCategory.value.vi = categoryStore.category.tenDanhMuc;
  newCategory.value.en = categoryStore.category.en;
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="flex items-center gap-3 mb-6">
      <CheckCheck class="w-6 h-6 text-indigo-600"/>
      <h2 class="text-xl font-semibold text-gray-800">
        {{ t('edit', {content: t('categories')}) }}
      </h2>
    </div>

    <form class="space-y-6" @submit.prevent="saveCategory">
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `ID ${t('categories')}` }}
        </label>
        <div class="relative">
          <input
              disabled
              minlength="3"
              type="text"
              :value="categoryId"
              :placeholder="t('category_placeholder')"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <AtSign class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('category_name')} (${t('vietnamese')} - ${t('default')})` }}
        </label>
        <div class="relative">
          <input
              required
              minlength="3"
              type="text"
              v-model="newCategory.vi"
              :placeholder="t('category_placeholder')"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <Languages class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ `${t('category_name')} (${t('english')})` }}
        </label>
        <div class="relative">
          <input
              required
              minlength="3"
              type="text"
              v-model="newCategory.en"
              :placeholder="t('category_placeholder')"
              class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
          <Languages class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
        </div>
      </div>

      <!-- Button -->
      <div class="flex justify-end gap-4">
        <button
            @click="$router.push('/categories')"
            type="button"
            class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-all duration-200 flex items-center gap-2"
        >
          <CircleX class="w-5 h-5"/>
          {{ t('cancel') }}
        </button>
        <button
            type="submit"
            class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 flex items-center gap-2"
        >
          <CheckCheck class="w-5 h-5"/>
          {{ t('save') }}
        </button>
      </div>
    </form>
  </div>
</template>