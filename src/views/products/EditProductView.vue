<script setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from "vue-i18n";
import {
  CheckCircle,
  CirclePlus,
  DollarSign,
  Edit,
  Languages,
  Package,
  Pencil,
  Scale,
  Tag,
  Trash2
} from 'lucide-vue-next';
import {message} from 'ant-design-vue';
import useCategoryStore from "@/stores/category.js";
import AddCategoryView from "@/views/categories/AddCategoryView.vue";
import useProductStore from "@/stores/product.js";
import useCloudinaryStore from "@/stores/cloudinary.js";
import {useRoute} from "vue-router";

const {t} = useI18n();
const activeKey = ref(['1']);
const customStyle = 'background: white; border-radius: 4px; margin-bottom: 24px; border: 0; overflow: hidden';
const productForm = ref({
  trangThai: true,
  danhMuc: {id: null}
})
const customRequest = ({file, onSuccess}) => {
  onSuccess('ok', file);
};
const handleImageChange = (info) => {
  info.file.status = 'done';
};
const thumbnailFileList = ref([]);
const thumbnailPreviewVisible = ref(false);
const thumbnailPreviewImage = ref('');
const thumbnailPreviewTitle = ref('');

const imageListFileList = ref([]);
const imageListPreviewVisible = ref(false);
const imageListPreviewImage = ref('');
const imageListPreviewTitle = ref('');

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const specsVN = ref([]);
const specsEN = ref([]);
const specModalVisible = ref(false);
const specForm = ref({name: '', value: ''});
const editingSpecIndex = ref(null);
const currentLanguage = ref('vn');
const handleThumbnailPreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  thumbnailPreviewImage.value = file.url || file.preview;
  thumbnailPreviewVisible.value = true;
  thumbnailPreviewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handleImageListPreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  imageListPreviewImage.value = file.url || file.preview;
  imageListPreviewVisible.value = true;
  imageListPreviewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handleCancel = (type) => {
  if (type === 'thumbnail') {
    thumbnailPreviewVisible.value = false;
    thumbnailPreviewTitle.value = '';
  } else {
    imageListPreviewVisible.value = false;
    imageListPreviewTitle.value = '';
  }
};
const showSpecModal = (language, index = null) => {
  currentLanguage.value = language;
  if (index !== null) {
    editingSpecIndex.value = index;
    const specsList = language === 'vn' ? specsVN.value : specsEN.value;
    specForm.value = {name: specsList[index].name, value: specsList[index].value};
  } else {
    editingSpecIndex.value = null;
    specForm.value = {name: '', value: ''};
  }
  specModalVisible.value = true;
};

const handleSpecSubmit = () => {
  if (!validateSpecForm()) {
    return;
  }

  const specData = {...specForm.value};
  const targetList = currentLanguage.value === 'vn' ? specsVN.value : specsEN.value;

  if (editingSpecIndex.value !== null) {
    targetList[editingSpecIndex.value] = {name: specData.name, value: specData.value};
    message.success(t('update_success_msg', {content: t('specs')}));
  } else {
    targetList.push({name: specData.name, value: specData.value});
    message.success(t('save_success_msg', {content: t('specs')}));
  }

  specModalVisible.value = false;
};

const deleteSpec = (language, index) => {
  const targetList = language === 'vn' ? specsVN.value : specsEN.value;
  targetList.splice(index, 1);
  message.success(t('delete_success_msg', {content: t('specs')}));
};
const validateSpecForm = () => {
  if (!specForm.value.name || specForm.value.name.trim() === '') {
    message.error(t('specs_name_required'));
    return false;
  }

  if (!specForm.value.value || specForm.value.value.trim() === '') {
    message.error(t('specs_value_required'));
    return false;
  }

  const targetList = currentLanguage.value === 'vn' ? specsVN.value : specsEN.value;
  const isDuplicate = targetList.some((spec, index) => {
    if (editingSpecIndex.value !== null && index === editingSpecIndex.value) {
      return false;
    }

    return spec.name.toLowerCase() === specForm.value.name.toLowerCase();
  });

  if (isDuplicate) {
    message.error(t('specs_name_duplicate', {language: currentLanguage.value.toUpperCase()}));
    return false;
  }

  return true;
};

const colorList = ref([]);
const colorModalVisible = ref(false);
const colorForm = ref({
  nameVn: '',
  nameEn: '',
  sku: '',
  stock: 0,
  imageUrl: ''
});
const editingColorIndex = ref(null);
const colorImages = ref([]);

const computedImages = computed(() => {
  return [...imageListFileList.value, ...colorImages.value].map(file => ({
    url: file.url || file.thumbUrl || (file.preview ? file.preview : ''),
    uid: file.uid
  }));
});

const showColorModal = (index = null) => {
  if (index !== null) {
    editingColorIndex.value = index;
    const color = colorList.value[index];
    colorForm.value = {...color};
  } else {
    editingColorIndex.value = null;
    colorForm.value = {nameVn: '', nameEn: '', stock: 0, imageUrl: ''};
  }
  colorModalVisible.value = true;
};

const validateColorForm = () => {
  if (!colorForm.value.nameVn || colorForm.value.nameVn.trim() === '') {
    message.error(t('color_required'));
    return false;
  }
  if (!colorForm.value.sku || colorForm.value.sku.trim() === '') {
    message.error(t('sku_required'));
    return false;
  }

  if (colorForm.value.stock < 0) {
    message.error(t('stock_greater_than_zero'));
    return false;
  }

  if (!colorForm.value.imageUrl) {
    message.error(t('image_required'));
    return false;
  }

  const isDuplicate = colorList.value.some((color, index) => {
    if (editingColorIndex.value !== null && index === editingColorIndex.value) {
      return false;
    }

    if (color.nameVn.toLowerCase() === colorForm.value.nameVn.toLowerCase()) {
      message.error(t('color_duplicate', {language: t('vietnamese')}));
      return true;
    }

    if (colorForm.value.nameEn && color.nameEn &&
        color.nameEn.toLowerCase() === colorForm.value.nameEn.toLowerCase()) {
      message.error(t('color_duplicate', {language: t('english')}));
      return true;
    }

    return false;
  });

  return !isDuplicate;
};

const handleColorSubmit = () => {
  if (!validateColorForm()) {
    return;
  }

  const colorData = {...colorForm.value};

  if (editingColorIndex.value !== null) {
    colorList.value[editingColorIndex.value] = colorData;
    message.success(t('update_success_msg', {content: t('color')}));
  } else {
    colorList.value.push(colorData);
    message.success(t('save_success_msg', {content: t('color')}));
  }

  colorModalVisible.value = false;
};

const deleteColor = (index) => {
  colorList.value.splice(index, 1);
  message.success(t('delete_success_msg', {content: t('color')}));
};

const handleColorImageUpload = ({file}) => {
  if (file.status === 'done' || file.status === 'uploading') {
    getBase64(file.originFileObj).then(url => {
      const newImage = {
        uid: Date.now().toString(),
        name: file.name,
        status: 'done',
        url: url,
        thumbUrl: url
      };
      colorImages.value = [...colorImages.value, newImage];
      colorForm.value.imageUrl = url;
    });
  }
};

const useColorVariants = ref(false);


const handleSwitchChange = (checked) => {
  useColorVariants.value = checked;
  if (!checked && activeKey.value.includes('4')) {
    activeKey.value = activeKey.value.filter(key => key !== '4');
  }
};
const base64ToFile = async (base64String, fileName) => {
  const response = await fetch(base64String);
  const blob = await response.blob();
  return new File([blob], fileName, {type: blob.type});

}
const addCategoryModalVisible = ref(false);
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const cloudinaryStore = useCloudinaryStore();
let productEnId = null;
let detailId = null;
const saveProduct = async () => {
  if (colorList.value.length < 2 && useColorVariants.value) {
    message.error(t('color_at_least_two'));
    return;
  }
  if (specsVN.value.length > 0 && specsEN.value.length > 0 && specsVN.value.length !== specsEN.value.length) {
    message.error(t('specs_not_match'));
    return;
  }
  if (thumbnailFileList.value.length === 0) {
    message.error(t('thumbnail_required'));
    return;
  }
  if (imageListFileList.value.length === 0) {
    message.error(t('image_list_required'));
    return;
  }
  productForm.value.thongSoJson = specsVN.value.length > 0 ? JSON.stringify(specsVN.value) : null;
  if (thumbnailFileList?.value[0]?.originFileObj) {
    const getThumbnail = await cloudinaryStore.upload(thumbnailFileList.value[0]?.originFileObj);
    productForm.value.anhDaiDien = getThumbnail.secure_url;
    productForm.value.publicId = getThumbnail.public_id;
  }
  const productToAdd = {...productForm.value};
  delete productToAdd?.tenSanPhamEn;
  delete productToAdd?.tonKho;
  delete productToAdd?.moTaEn;
  delete productToAdd?.sku;
  const savedProduct = await productStore.saveProduct(productToAdd);
  const productEN = {
    id: productEnId,
    sanPham: {id: savedProduct.id},
    ngonNgu: {id: 'en'},
    tenSanPham: productForm.value.tenSanPhamEn || null,
    moTaSanPham: productForm.value.moTaEn || null,
    thongSoJson: specsEN.value.length > 0 ? JSON.stringify(specsEN.value) : null
  }
  await productStore.saveProductLang(productEN);
  await productStore.deleteProductImages(productParamId.value);
  const imageList = [];
  for (const file of imageListFileList.value) {
    if (file?.originFileObj) {
      const getImage = await cloudinaryStore.upload(file?.originFileObj);
      imageList.push({
        sanPham: {id: savedProduct.id},
        url: getImage.secure_url,
        publicId: getImage.public_id
      });
    } else {
      imageList.push({
        sanPham: {id: savedProduct.id},
        url: file.url || file.thumbUrl,
        publicId: file.name || null
      });
    }
  }
  if (imageList.length > 0) {
    await productStore.saveAllImages(imageList);
  }
  if (useColorVariants.value) {
    await productStore.deleteProductDetail(productParamId.value);
    for (const color of colorList.value) {
      const colorVN = {
        sanPham: {id: savedProduct.id},
        mauSac: color.nameVn,
        sku: color.sku,
        tonKho: color.stock,
      }
      if (color.imageUrl.startsWith('data:image')) {
        const imageFile = await base64ToFile(color.imageUrl, `${color.nameVn}.png`);
        const anhMau = await cloudinaryStore.upload(imageFile);
        colorVN.anhMau = anhMau.secure_url;
        colorVN.publicId = anhMau.public_id;
      } else {
        colorVN.anhMau = color.imageUrl;
        colorVN.publicId = color.publicId;
      }
      const savedColorVN = await productStore.saveProductDetail(colorVN);
      if (color.nameEn) {
        const colorEN = {
          chiTietSanPham: {id: savedColorVN.id},
          ngonNgu: {id: 'en'},
          tenMauSac: color.nameEn || null
        }
        await productStore.saveProductColorLang(colorEN);
      }
    }
  } else {
    await productStore.deleteProductDetail(productParamId.value);
    await productStore.saveProductDetail({
      sanPham: {id: savedProduct.id},
      sku: productForm.value.sku,
      tonKho: productForm.value.tonKho
    })
  }

  await productStore.getProductsList()
  message.success(t('save_success_msg', {content: t('product')}));
}
const route = useRoute();
const productParamId = computed(() => route.params.id);
onMounted(async () => {
  await categoryStore.getCategoriesList();
  await productStore.findById(productParamId.value);
  productForm.value = productStore.product;
  console.log(productForm.value);
  const productEN = await productStore.findProductByLang(productParamId.value, 'en');
  productForm.value.tenSanPhamEn = productEN.tenSanPham || null;
  productForm.value.moTaEn = productEN.moTaSanPham || null;
  productEnId = productEN.id;
  specsVN.value = productStore.product.thongSoJson ? JSON.parse(productStore.product.thongSoJson) : [];
  specsEN.value = productEN.thongSoJson ? JSON.parse(productEN.thongSoJson) : [];
  thumbnailFileList.value.push({
    uid: Date.now().toString(),
    name: productStore.product.publicId,
    status: 'done',
    url: productStore.product.anhDaiDien,
    thumbUrl: productStore.product.anhDaiDien
  });
  const images = await productStore.findImages(productParamId.value);
  for (const image of images) {
    imageListFileList.value.push({
      uid: image.id,
      name: image.publicId,
      status: 'done',
      url: image.url,
      thumbUrl: image.url
    });
  }
  const productDetails = await productStore.findProductDetail(productParamId.value);
  if (productDetails.length > 1) {
    useColorVariants.value = true;
    for (const detail of productDetails) {
      const color = {
        nameVn: detail.mauSac,
        nameEn: detail.mauSacEn,
        stock: detail.tonKho,
        sku: detail.sku,
        imageUrl: detail.anhMau,
        publicId: detail.publicId
      }
      colorList.value.push(color);
    }
  } else {
    productForm.value.tonKho = productDetails[0].tonKho;
    productForm.value.sku = productDetails[0].sku;
    detailId = productDetails[0].id;
  }

});
</script>

<template>
  <form @submit.prevent="saveProduct">
    <div class="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-medium text-gray-800">{{
            `${t('edit', {content: t('product')})} (ID: ${productParamId})`
          }}</h1>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600">{{ t('color') }}</span>
        <a-switch v-model:checked="useColorVariants" @change="handleSwitchChange"/>
      </div>
    </div>
    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel key="1" :header="t('basic_info')" :style="customStyle">
        <div class="space-y-6">
          <!-- Mã sản phẩm -->
          <div v-if="!useColorVariants" class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
                `${t('code')} ${t('product')} (SKU)`
              }}</label>
            <div class="relative">
              <input
                  v-model="productForm.sku"
                  required
                  minlength="3"
                  type="text"
                  :placeholder="`${t('enter')} ${t('code')}`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <Package class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>

          <!-- Tên sản phẩm (Tiếng Việt) -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
                `${t('name')} ${t('product')} (${t('vietnamese')} - ${t('default')})`
              }}</label>
            <div class="relative">
              <input
                  v-model="productForm.tenSanPham"
                  type="text"
                  required
                  minlength="3"
                  :placeholder="`${t('enter')} ${t('name')} ${t('product')}`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <Languages class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>

          <!-- Tên sản phẩm (English) -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
                `${t('name')} ${t('product')} (${t('english')})`
              }}</label>
            <div class="relative">
              <input
                  v-model="productForm.tenSanPhamEn"
                  minlength="3"
                  type="text"
                  :placeholder="`${t('enter')} ${t('name')} ${t('product')}`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <Languages class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>

          <!-- Danh mục sản phẩm -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
                `${t('categories')} ${t('product')}`
              }}</label>
            <div class="flex items-center gap-3">
              <div class="relative flex-1">
                <select
                    v-model="productForm.danhMuc.id"
                    required
                    class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option value="" selected>{{ t('select') }}</option>
                  <option v-for="category in categoryStore.categoriesList" :value="category.id">{{
                      category.tenDanhMuc
                    }}
                  </option>
                </select>
                <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
              </div>
              <button
                  @click="addCategoryModalVisible = true"
                  type="button"
                  class="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200"
              >
                <CirclePlus class="w-5 h-5"/>
              </button>
            </div>
          </div>

          <!-- Giá sản phẩm -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
                `${t('price')} ${t('product')} VND`
              }}</label>
            <div class="relative">
              <input
                  required
                  v-model="productForm.giaCoSo"
                  type="number"
                  :placeholder="`${t('enter')} ${t('price')} VND`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>
          <div v-if="!useColorVariants" class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('stock') }}</label>
            <div class="relative">
              <input
                  v-model="productForm.tonKho"
                  required
                  type="number"
                  min="0"
                  :placeholder="`${t('enter')} ${t('stock')}`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <CheckCircle class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>

          <!-- Cân nặng sản phẩm -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ `${t('weight')} ${t('product')}` }}</label>
            <div class="relative">
              <input
                  required
                  v-model="productForm.canNang"
                  type="number"
                  :placeholder="`${t('enter')} ${t('weight')}`"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
              <Scale class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            </div>
          </div>

          <!-- Trạng thái sản phẩm -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ `${t('status')} ${t('product')}` }}</label>
            <div class="flex gap-6">
              <label class="flex items-center gap-2">
                <input
                    v-model="productForm.trangThai"
                    type="radio"
                    name="status"
                    :value="true"
                    class="text-indigo-600 focus:ring-indigo-500"
                >
                <span class="text-gray-700">{{ t('on_sell') }}</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                    v-model="productForm.trangThai"
                    type="radio"
                    name="status"
                    :value="false"
                    class="text-indigo-600 focus:ring-indigo-500"
                >
                <span class="text-gray-700">{{ t('off_sell') }}</span>
              </label>
            </div>
          </div>

          <!-- Mô tả sản phẩm Vietnamese -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
                `${t('description')} ${t('product')} (${t('vietnamese')} - ${t('default')})`
              }}</label>
            <div class="relative">
              <textarea
                  v-model="productForm.moTa"
                  :placeholder="`${t('enter')} ${t('description')} ${t('product')}`"
                  rows="4"
                  class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
              ></textarea>
              <Pencil class="absolute left-3 top-4 w-5 h-5 text-gray-400"/>
            </div>
          </div>
        </div>
        <!--        Mô tả sản phẩm English -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 mt-5">{{
              `${t('description')} ${t('product')} (${t('english')})`
            }}</label>
          <div class="relative">
            <textarea
                v-model="productForm.moTaEn"
                minlength="5"
                :placeholder="`${t('enter')} ${t('description')} ${t('product')}`"
                rows="4"
                class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
            ></textarea>
            <Pencil class="absolute left-3 top-4 w-5 h-5 text-gray-400"/>
          </div>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="2" :header="t('image')" :style="customStyle">
        <div class="space-y-8">
          <!-- Ảnh thu nhỏ (Thumbnail) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('thumbnail') }}</label>
            <div class="clearfix">
              <a-upload
                  v-model:file-list="thumbnailFileList"
                  @change="handleImageChange"
                  :custom-request="customRequest"
                  accept="image/*"
                  list-type="picture-card"
                  @preview="handleThumbnailPreview"
                  :max-count="1"
              >
                <div v-if="thumbnailFileList.length < 1">
                  <CirclePlus/>
                </div>
              </a-upload>
              <a-modal
                  style="top: 20px"
                  width="900px"
                  :open="thumbnailPreviewVisible"
                  :title="thumbnailPreviewTitle"
                  :footer="null"
                  @cancel="handleCancel('thumbnail')"
              >
                <img alt="thumbnail" style="width: 100%; max-height: 400px!important; object-fit: contain"
                     :src="thumbnailPreviewImage"/>
              </a-modal>
            </div>
          </div>

          <!-- Danh sách hình ảnh -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('image_list') }}</label>
            <div class="clearfix">
              <a-upload
                  v-model:file-list="imageListFileList"
                  @change="handleImageChange"
                  :custom-request="customRequest"
                  accept="image/*"
                  list-type="picture-card"
                  @preview="handleImageListPreview"
                  :multiple="true"
              >
                <div>
                  <CirclePlus/>
                </div>
              </a-upload>
              <a-modal
                  style="top: 20px"
                  width="900px"
                  :open="imageListPreviewVisible"
                  :title="imageListPreviewTitle"
                  :footer="null"
                  @cancel="handleCancel('imageList')"
              >
                <img alt="image" style="width: 100%; max-height: 400px!important; object-fit: contain"
                     :src="imageListPreviewImage"/>
              </a-modal>
            </div>
          </div>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="3" :header="t('specs')" :style="customStyle">
        <div class="space-y-6">
          <!-- Hai nút thêm thông số -->
          <div class="flex justify-end gap-4">
            <button
                type="button"
                @click="showSpecModal('vn')"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 flex items-center gap-2"
            >
              <CirclePlus class="w-5 h-5"/>
              {{ t('add', {content: t('specs')}) }} {{ `(VN - ${t('default')})` }}
            </button>
            <button
                type="button"
                @click="showSpecModal('en')"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 flex items-center gap-2"
            >
              <CirclePlus class="w-5 h-5"/>
              {{ t('add', {content: t('specs')}) }} (EN)
            </button>
          </div>

          <!-- Hai bảng thông số song song -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Bảng thông số tiếng Việt -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">{{ t('specs') }} (VN)</h3>
              <div v-if="specsVN.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-700">
                  <thead class="text-xs uppercase bg-gray-50">
                  <tr>
                    <th class="px-4 py-3">{{ t('name') }}</th>
                    <th class="px-4 py-3">{{ t('value') }}</th>
                    <th class="px-4 py-3 text-center">{{ t('actions') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(spec, index) in specsVN" :key="index" class="border-b hover:bg-gray-50">
                    <td class="px-4 py-3">{{ spec.name }}</td>
                    <td class="px-4 py-3">{{ spec.value }}</td>
                    <td class="px-4 py-3 flex justify-center gap-3">
                      <div @click="showSpecModal('vn', index)" class="text-indigo-600 hover:text-indigo-800">
                        <Edit class="w-5 h-5"/>
                      </div>
                      <a-popconfirm
                          :title="t('confirm_delete')"
                          :ok-text="t('yes')"
                          :cancel-text="t('cancel')"
                          @confirm="deleteSpec('vn', index)"
                      >
                        <div class="text-red-600 hover:text-red-800">
                          <Trash2 class="w-5 h-5"/>
                        </div>
                      </a-popconfirm>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center text-gray-500 py-4">
                {{ t('no_specs') }}
              </div>
            </div>

            <!-- Bảng thông số tiếng Anh -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">{{ t('specs') }} (EN)</h3>
              <div v-if="specsEN.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-700">
                  <thead class="text-xs uppercase bg-gray-50">
                  <tr>
                    <th class="px-4 py-3">{{ t('name') }}</th>
                    <th class="px-4 py-3">{{ t('value') }}</th>
                    <th class="px-4 py-3 text-center">{{ t('actions') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(spec, index) in specsEN" :key="index" class="border-b hover:bg-gray-50">
                    <td class="px-4 py-3">{{ spec.name }}</td>
                    <td class="px-4 py-3">{{ spec.value }}</td>
                    <td class="px-4 py-3 flex justify-center gap-3">
                      <div @click="showSpecModal('en', index)" class="text-indigo-600 hover:text-indigo-800">
                        <Edit class="w-5 h-5"/>
                      </div>
                      <a-popconfirm
                          :title="t('confirm_delete')"
                          :ok-text="t('yes')"
                          :cancel-text="t('cancel')"
                          @confirm="deleteSpec('en', index)"
                      >
                        <div class="text-red-600 hover:text-red-800">
                          <Trash2 class="w-5 h-5"/>
                        </div>
                      </a-popconfirm>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center text-gray-500 py-4">
                {{ t('no_specs') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Modal thêm/sửa thông số -->
        <a-modal
            :open="specModalVisible"
            :title="`${editingSpecIndex !== null ? t('edit', {content: t('specs')}) : t('add', {content: t('specs')})} (${currentLanguage === 'vn' ? 'VN' + ` - ${t('default')}` : 'EN'})`"
            @ok="handleSpecSubmit"
            @cancel="specModalVisible = false"
            :ok-text="t('confirm')"
            :cancel-text="t('cancel')"
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('name') }} ({{ currentLanguage === 'vn' ? 'VN' : 'EN' }})
                <span class="text-red-500">*</span>
              </label>
              <input
                  v-model="specForm.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  :placeholder="`${t('enter')} ${t('name')} ${t('specs')}`"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('value') }} ({{ currentLanguage === 'vn' ? 'VN' : 'EN' }})
                <span class="text-red-500">*</span>
              </label>
              <input
                  v-model="specForm.value"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  :placeholder="`${t('enter')} ${t('value')} ${t('specs')}`"
              >
            </div>
          </div>
        </a-modal>
      </a-collapse-panel>
      <a-collapse-panel v-if="useColorVariants" key="4" :header="t('color')" :style="customStyle">
        <div class="space-y-6">
          <!-- Button thêm màu sắc -->
          <div class="flex justify-end">
            <button
                type="button"
                @click="showColorModal()"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 flex items-center gap-2"
            >
              <CirclePlus class="w-5 h-5"/>
              {{ t('add', {content: t('color')}) }}
            </button>
          </div>

          <!-- Bảng danh sách màu sắc -->
          <div>
            <div v-if="colorList.length > 0" class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-700">
                <thead class="text-xs uppercase bg-gray-50">
                <tr>
                  <th class="px-4 py-3">{{ t('name') }} (VN)</th>
                  <th class="px-4 py-3">{{ t('name') }} (EN)</th>
                  <th class="px-4 py-3">SKU</th>
                  <th class="px-4 py-3">{{ t('stock') }}</th>
                  <th class="px-4 py-3">{{ t('image') }}</th>
                  <th class="px-4 py-3 text-center">{{ t('actions') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(color, index) in colorList" :key="index" class="border-b hover:bg-gray-50">
                  <td class="px-4 py-3">{{ color.nameVn }}</td>
                  <td class="px-4 py-3">{{ color.nameEn || 'N/A' }}</td>
                  <td class="px-4 py-3">{{ color.sku }}</td>
                  <td class="px-4 py-3">{{ color.stock }}</td>
                  <td class="px-4 py-3">
                    <img
                        v-if="color.imageUrl"
                        :src="color.imageUrl"
                        alt="color"
                        class="w-12 h-12 object-contain rounded"
                    />
                    <span v-else class="text-gray-400">{{ t('no_image') }}</span>
                  </td>
                  <!-- Thay thế phần code hiển thị các icon trong cột actions của bảng màu sắc -->
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-3">
                      <div @click="showColorModal(index)"
                           class="text-indigo-600 hover:text-indigo-800 cursor-pointer p-1">
                        <Edit class="w-5 h-5"/>
                      </div>
                      <a-popconfirm
                          :title="t('confirm_delete')"
                          :ok-text="t('yes')"
                          :cancel-text="t('cancel')"
                          @confirm="deleteColor(index)"
                      >
                        <div class="text-red-600 hover:text-red-800 cursor-pointer p-1">
                          <Trash2 class="w-5 h-5"/>
                        </div>
                      </a-popconfirm>
                    </div>
                  </td>

                </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center text-gray-500 py-4">
              {{ t('no_colors') }}
            </div>
          </div>

          <!-- Modal thêm/sửa màu sắc -->
          <a-modal
              :open="colorModalVisible"
              :title="`${editingColorIndex !== null ? t('edit', {content: t('color')}) : t('add', {content: t('color')})}`"
              @ok="handleColorSubmit"
              @cancel="colorModalVisible = false"
              :ok-text="t('confirm')"
              :cancel-text="t('cancel')"
              width="700px"
          >
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('name') }} {{ t('color') }} (VN) <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="colorForm.nameVn"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :placeholder="`${t('enter')} ${t('name')} ${t('color')}`"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('name') }} {{ t('color') }} (EN)
                </label>
                <input
                    v-model="colorForm.nameEn"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :placeholder="`${t('enter')} ${t('name')} ${t('color')}`"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  SKU <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="colorForm.sku"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :placeholder="`${t('enter')} SKU`"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('stock') }} <span class="text-red-500">*</span>
                </label>
                <input
                    v-model.number="colorForm.stock"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :placeholder="`${t('enter')} ${t('stock')}`"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('image') }} {{ t('color') }} <span class="text-red-500">*</span>
                </label>

                <!-- Upload hình ảnh mới -->
                <div class="mb-4">
                  <a-upload
                      :file-list="[]"
                      :custom-request="customRequest"
                      @change="handleColorImageUpload"
                      accept="image/*"
                      list-type="picture-card"
                      :show-upload-list="false"
                  >
                    <div>
                      <CirclePlus/>
                    </div>
                  </a-upload>
                </div>

                <!-- Chọn từ danh sách hình ảnh đã có -->
                <div>
                  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-60 overflow-y-auto p-2">
                    <div
                        v-for="image in computedImages"
                        :key="image.uid"
                        class="relative"
                    >
                      <input
                          type="radio"
                          :id="`image-${image.uid}`"
                          name="colorImage"
                          :value="image.url"
                          v-model="colorForm.imageUrl"
                          class="absolute opacity-0 w-full h-full cursor-pointer"
                      />
                      <label
                          :for="`image-${image.uid}`"
                          class="block cursor-pointer"
                      >
                        <div
                            class="w-full aspect-square rounded border-2 overflow-hidden"
                            :class="{'border-indigo-600': colorForm.imageUrl === image.url, 'border-transparent': colorForm.imageUrl !== image.url}"
                        >
                          <img
                              :src="image.url"
                              alt="color option"
                              class="w-full h-full object-contain"
                          />
                        </div>
                      </label>
                      <div
                          v-if="colorForm.imageUrl === image.url"
                          class="absolute top-1 right-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-modal>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <div class="mt-8 flex justify-end space-x-4">
      <button
          type="button"
          class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
      >
        {{ t('cancel') }}
      </button>
      <button
          type="submit"
          class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 font-medium flex items-center gap-2"
      >
        <CheckCircle class="w-5 h-5"/>
        {{ t('save') }}
      </button>
    </div>
  </form>
  <a-modal :footer="null" v-model:open="addCategoryModalVisible" :title="null">
    <AddCategoryView style="border: none; box-shadow: none; background-color: transparent; padding: 0; margin: 0;"/>
  </a-modal>
</template>