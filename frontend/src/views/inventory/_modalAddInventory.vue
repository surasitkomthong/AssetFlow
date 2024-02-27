<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ props }">
      <v-btn icon density="compact" v-bind="props">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="h3"><v-icon size="small" color="primary">mdi-plus</v-icon> เพิ่มสินค้า </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.itemName"
                :counter="50"
                label="ชื่อสินค้า*"
                hint="Enter up to 50 characters"
                :rules="[(v) => (!!v && v.length <= 50) || 'Please enter data']"
                :error-messages="formData.itemName.length > 50 ? ['****Maximum 50 characters****'] : []"
                required
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.selectedCategory"
                :items="dropdownData.category.item_cat_name"
                label="ประเภทสินค้า*"
                :rules="[(v) => !!v || 'Please enter data']"
                required
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.selectedUnit"
                :items="dropdownData.unit.unit_name"
                label="หน่วยนับ*"
                :rules="[(v) => !!v || 'Please enter data']"
                required
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                min="0"
                type="number"
                v-model="formData.totalQuantity"
                label="สินค้าทั้งหมด*"
                :rules="[(v) => !!v || 'Please enter data']"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="formData.totalQuantity" label="สินค้าคงเหลือ" disabled required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <!-- <small><span style="color: red">*indicates required field</span></small> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" variant="text" @click="saveItem">Save</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="validationDialog" max-width="300">
      <v-card>
        <v-card-text><span style="color: red;">กรุณากรอกข้อมูลให้ครบถ้วน</span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="validationDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineEmits } from 'vue';
import { getAllItemCategory, getAllItemUnit } from '@/service/masterdata';
import { createInventory } from '@/service/inventory';
import Swal from 'sweetalert2';

const emit = defineEmits(['addItem']);
const validationDialog = ref(false);


interface FormData {
  itemName: string;
  totalQuantity: string;
  remainingQuantity: string;
  selectedUnit: string | null;
  selectedCategory: string | null;
}

const dialog = ref(false);
const dropdownData = reactive({
  unit: {
    unit_id: [],
    unit_name: []
  },
  category: {
    item_cat_id: [],
    item_cat_name: []
  }
});

const formData: FormData = reactive({
  itemName: '',
  totalQuantity: '',
  remainingQuantity: '',
  selectedUnit: null,
  selectedCategory: null
});

const masterData = async () => {
  try {
    const [unit_res, category_res] = await Promise.all([getAllItemUnit(), getAllItemCategory()]);

    dropdownData.unit.unit_id = unit_res.data.map((unit: any) => unit.unit_id);
    dropdownData.unit.unit_name = unit_res.data.map((unit: any) => unit.unit_name);
    dropdownData.category.item_cat_id = category_res.data.map((category: any) => category.item_cat_id);
    dropdownData.category.item_cat_name = category_res.data.map((category: any) => category.item_cat_name);
  } catch (error) {
    console.error('Error fetching master data:', error);
  }
};

const saveItem = async () => {
  if (!formData.itemName || !formData.selectedCategory || !formData.selectedUnit || !formData.totalQuantity) {
    validationDialog.value = true;
    return ;
  }

  const selectedUnitIndex = dropdownData.unit.unit_name.findIndex((name) => name === formData.selectedUnit);
  const selectedCategoryIndex = dropdownData.category.item_cat_name.findIndex((name) => name === formData.selectedCategory);

  const paramData = {
    item_name: formData.itemName,
    item_cat: dropdownData.category.item_cat_id[selectedCategoryIndex],
    item_unit: dropdownData.unit.unit_id[selectedUnitIndex],
    item_total: formData.totalQuantity,
    item_remain: formData.totalQuantity
  };

  try {
    const res = await createInventory(paramData);
    console.log('Inventory created successfully:', res);
    clearFormData();
    Swal.fire({
      icon: 'success',
      title: 'Your item has been saved',
      showConfirmButton: false,
      timer: 2000
    });
    dialog.value = false;
    emit('addItem', res);
  } catch (error) {
    console.error('Error while creating inventory:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while creating the inventory. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
};

const clearFormData = () => {
  formData.itemName = '';
  formData.totalQuantity = '';
  formData.remainingQuantity = '';
  formData.selectedUnit = null;
  formData.selectedCategory = null;
};

onMounted(() => {
  masterData();
});
</script>
