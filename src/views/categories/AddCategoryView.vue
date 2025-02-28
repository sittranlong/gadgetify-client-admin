<script setup>
import {useI18n} from "vue-i18n";
import {CirclePlus, Languages} from 'lucide-vue-next';
import {ref} from "vue";
import useCategoryStore from "@/stores/category.js";

const categoryStore = useCategoryStore();
const {t} = useI18n();
const newCategory = ref({});
const addCategory = async () => {
  const savedCategory = await categoryStore.saveCategory({
    tenDanhMuc: newCategory.value.vi,
  })
  console.log(savedCategory);
  await categoryStore.saveCategoryLang({
    danhMuc: {id: savedCategory.id},
    tenDanhMuc: newCategory.value.en,
    ngonNgu: {id: "en"}
  })
  newCategory.value = {}
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="flex items-center gap-3 mb-6">
      <CirclePlus class="w-6 h-6 text-indigo-600"/>
      <h2 class="text-xl font-semibold text-gray-800">
        {{ t('add_category') }}
      </h2>
    </div>

    <form class="space-y-6" @submit.prevent="addCategory">
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
      <div class="flex justify-end">
        <button
            type="submit"
            class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 flex items-center gap-2"
        >
          <CirclePlus class="w-5 h-5"/>
          {{ t('add_category') }}
        </button>
      </div>
    </form>
  </div>
</template>