<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ props }">
      <v-btn icon size="small" v-bind="props">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="h3"><v-icon size="small" color="primary">mdi-pencil</v-icon> แก้ไขสินค้า </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="newData.item_name"
                :counter="50"
                label="ชื่อสินค้า*"
                hint="Enter up to 50 characters"
                :rules="[(v) => (!!v && v.length <= 50) || 'Please enter data']"
                :error-messages="newData.item_cat_name.length > 50 ? ['****Maximum 50 characters****'] : []"
                required
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="newData.item_cat_name"
                :items="dropdownData.category.item_cat_name"
                label="ประเภทสินค้า*"
                :rules="[(v) => !!v || 'Please enter data']"
                required
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="newData.unit_name"
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
                v-model="newData.item_total"
                label="สินค้าทั้งหมด*"
                :rules="[(v) => !!v || 'Please enter data']"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                min="0"
                type="number"
                v-model="newData.item_remain"
                label="สินค้าคงเหลือ"
                :error-messages="
                  newData.item_remain > newData.item_total ? ['คงเหลือไม่สามารถมากกว่าสินค้าทั้งหมดได้'] : []
                "
                required
              ></v-text-field>
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
        <v-card-text><span style="color: red">กรุณากรอกข้อมูลให้ครบถ้วน</span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="validationDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="validateTotalRemail" max-width="420">
      <v-card>
        <v-card-text><span style="color: red">ข้อมูลสินค้าคงเหลือไม่สามารถมากกว่าสินค้าทั้งหมดได้</span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="validateTotalRemail = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineEmits, watch } from 'vue';
import { getAllItemCategory, getAllItemUnit } from '@/service/masterdata';
import { updateInventory } from '@/service/inventory';
import Swal from 'sweetalert2';

const emit = defineEmits(['editItem']);
const validationDialog = ref(false);
const validateTotalRemail = ref(false);

interface Props {
  item_id: number;
  item_name: string;
  item_total: number;
  item_remain: number;
  unit_name: string;
  item_cat_name: string;
}

const props = defineProps<Props>();

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

const newData = reactive({
  item_id: props.item_id || '',
  item_name: props.item_name || '',
  item_total: props.item_total,
  item_remain: props.item_remain,
  unit_name: props.unit_name || '',
  item_cat_name: props.item_cat_name || ''
});

onMounted(() => {
  watch(
    [
      () => props.item_id,
      () => props.item_name,
      () => props.item_total,
      () => props.item_remain,
      () => props.unit_name,
      () => props.item_cat_name
    ],
    (
      [newItemId, newItemName, newItemTotal, newItemRemain, newUnitName, newItemCatName],
      [oldItemId, oldItemName, oldItemTotal, oldItemRemain, oldUnitName, oldItemCatName]
    ) => {
      newData.item_id = newItemId || '';
      newData.item_name = newItemName || '';
      newData.item_total = newItemTotal;
      newData.item_remain = newItemRemain;
      newData.unit_name = newUnitName || '';
      newData.item_cat_name = newItemCatName || '';
    }
  );
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
  if (!newData.item_name || !newData.item_total || !newData.item_remain || !newData.item_cat_name || !newData.unit_name) {
    validationDialog.value = true;
    return;
  }

  if (newData.item_remain > newData.item_total) {
    validateTotalRemail.value = true;
    return;
  }

  const selectedUnitIndex = dropdownData.unit.unit_name.findIndex((name) => name === newData.unit_name);
  const selectedCategoryIndex = dropdownData.category.item_cat_name.findIndex((name) => name === newData.item_cat_name);

  const paramData = {
    item_name: newData.item_name,
    item_cat: dropdownData.category.item_cat_id[selectedCategoryIndex],
    item_unit: dropdownData.unit.unit_id[selectedUnitIndex],
    item_total: newData.item_total,
    item_remain: newData.item_remain
  };

  try {
    const res = await updateInventory(props.item_id, paramData);
    console.log('Inventory update successfully:', res);
    Swal.fire({
      icon: 'success',
      title: 'Your item has been update',
      showConfirmButton: false,
      timer: 2000
    });
    dialog.value = false;
    emit('editItem', res);
  } catch (error) {
    console.error('Error while update inventory:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while update the inventory. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
};

onMounted(() => {
  masterData();
});
</script>
