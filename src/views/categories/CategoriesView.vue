<script setup>
import {useI18n} from "vue-i18n";
import {ref, computed} from 'vue';
import {Plus, Pencil, Trash2, Search} from 'lucide-vue-next';
import {useRoute} from "vue-router";

const {t} = useI18n();
const searchQuery = ref('');
const route = useRoute();
// Mock data for demonstration
const categories = ref([
  {id: 1, name: "Electronics"},
  {id: 2, name: "Clothing"},
  {id: 3, name: "Books"},
  {id: 4, name: "Sports"},
]);

const filteredCategories = computed(() => {
  return categories.value.filter(category =>
      category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="space-y-4" v-if="route.name === 'categories'">
    <div class="flex flex-col sm:flex-row gap-4">
      <h2 class="text-lg font-semibold text-gray-800">{{ t('categories') }}</h2>
      <div class="flex-1 flex gap-4 items-center justify-between sm:justify-end">
        <div class="relative flex-1 sm:flex-initial">
          <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('search_category')"
              class="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
        </div>
        <RouterLink to="/categories/add">
          <button
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus class="w-4 h-4"/>
            <span>{{ t('add_category') }}</span>
          </button>
        </RouterLink>

      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('no') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('name') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ t('actions') }}
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(category, index) in filteredCategories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ category.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ category.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex gap-3">
                <button
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    :title="t('edit')"
                >
                  <Pencil class="w-4 h-4"/>
                </button>
                <button
                    class="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    :title="t('delete')"
                >
                  <Trash2 class="w-4 h-4"/>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <RouterView v-else/>
</template>
