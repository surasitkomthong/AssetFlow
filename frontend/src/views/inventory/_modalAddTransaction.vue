<template>
  <v-dialog v-model="dialog" persistent width="800">
    <template v-slot:activator="{ props }">
      <v-btn icon size="small" v-bind="props" :disabled="isDisable">
        <v-icon>mdi-book-arrow-down-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="h3"><v-icon size="small" color="primary">mdi-book-arrow-down-outline</v-icon> เพิ่มการเบิก/ยืมของ</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="props.item_name" :counter="50" label="ชื่อสินค้า*" hint="Enter up to 50 characters" disabled required>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.user_id"
                :items="dropdownData.users.user_name"
                label="ผู้เบิก/ยืมของ*"
                :rules="[(v) => !!v || 'Please enter data']"
                required
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.trans_cat_id"
                :items="dropdownData.trans.trans_name"
                label="ประเภทธุรกรรม*"
                :rules="[(v) => !!v || 'Please enter data']"
                required
              >
              </v-select>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                type="date"
                v-model="formData.start_date"
                label="วันที่ทำการ*"
                :rules="[(v) => !!v || 'Please enter data']"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field type="date" v-model="formData.end_date" label="วันที่สิ้นสุด"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                min="0"
                type="number"
                v-model="formData.qty"
                label="จำนวนที่เบิก/ยืมของ*"
                :hint="`จำนวนที่สามารถเบิก/ยืมได้สูงสุดคือ ${props.item_remain}`"
                :rules="[(v) => !!v || 'Please enter data']"
                :error-messages="formData.qty > props.item_remain ? ['****ไม่สามารถเบิก/ยืมของมากกว่าสินค้าคงเหลือได้****'] : []"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small><span style="color: blue">***กรณีเบิกของไม่ต้องใส่วันที่สิ้นสุด หากใส่กรุณาล้างข้อมูล</span></small>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" variant="text" @click="saveItem()">Save</v-btn>
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

    <v-dialog v-model="validationRemain" max-width="400">
      <v-card>
        <v-card-text><span style="color: red">ไม่สามารถเบิก/ยืมของมากกว่าสินค้าคงเหลือได้</span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="validationRemain = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="validationEnddate" max-width="400">
      <v-card>
        <v-card-text><span style="color: red">กรุณาเคลียข้อมูลวันที่สิ้นสุดเนื่องจากการเบิกของไม่จำเป็นต้องคืน</span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="validationEnddate = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineEmits } from 'vue';
import { getAllItemCategory, getAllItemUnit, getAllUser, getAllTrans } from '@/service/masterdata';
import { createTrans } from '@/service/inventory';
import Swal from 'sweetalert2';

const emit = defineEmits(['addTrans']);
const validationDialog = ref(false);
const validationRemain = ref(false);
const validationEnddate = ref(false);

interface Props {
  item_id: number;
  item_name: string;
  item_total: number;
  item_remain: number;
  isDisable: boolean;
}

const props = defineProps<Props>();

const formData = reactive({
  user_id: '',
  qty: 0,
  trans_cat_id: null,
  start_date: new Date().toJSON().slice(0, 10),
  end_date: null,
  status_id: ''
});

const dialog = ref(false);
const dropdownData = reactive({
  unit: {
    unit_id: [],
    unit_name: []
  },
  category: {
    item_cat_id: [],
    item_cat_name: []
  },
  users: {
    user_id: [],
    user_name: []
  },
  trans: {
    trans_id: [],
    trans_name: []
  }
});

const masterData = async () => {
  try {
    const [unit_res, category_res, user_res, trans_res] = await Promise.all([
      getAllItemUnit(),
      getAllItemCategory(),
      getAllUser(),
      getAllTrans()
    ]);

    dropdownData.unit.unit_id = unit_res.data.map((unit: any) => unit.unit_id);
    dropdownData.unit.unit_name = unit_res.data.map((unit: any) => unit.unit_name);
    dropdownData.category.item_cat_id = category_res.data.map((category: any) => category.item_cat_id);
    dropdownData.category.item_cat_name = category_res.data.map((category: any) => category.item_cat_name);
    dropdownData.users.user_id = user_res.data.map((user: any) => user.user_id);
    dropdownData.users.user_name = user_res.data.map((user: any) => user.full_name);
    dropdownData.trans.trans_id = trans_res.data.map((trans: any) => trans.trans_cat_id);
    dropdownData.trans.trans_name = trans_res.data.map((trans: any) => trans.trans_cat_name);
  } catch (error) {
    console.error('Error fetching master data:', error);
  }
};

const saveItem = async () => {
  if (!formData.user_id || !formData.qty || !formData.trans_cat_id || !formData.start_date) {
    validationDialog.value = true;
    return;
  }

  if (formData.qty > props.item_remain) {
    validationRemain.value = true;
    return;
  }

  const selectUserIndex = dropdownData.users.user_name.findIndex((name) => name === formData.user_id);
  const selectTransIndex = dropdownData.trans.trans_name.findIndex((name) => name === formData.trans_cat_id);

  if (dropdownData.trans.trans_id[selectTransIndex] == 1002 && formData.end_date) {
    validationEnddate.value = true;
    return;
  }

  if (formData.trans_cat_id == 1001){
    formData.end_date = null
  }

  const paramData = {
    item_id: props.item_id,
    user_id: dropdownData.users.user_id[selectUserIndex],
    qty: formData.qty,
    trans_cat_id: dropdownData.trans.trans_id[selectTransIndex],
    start_date: formData.start_date,
    end_date: formData.end_date,
    status_id: dropdownData.trans.trans_id[selectTransIndex] == 1001 ? 1001 : 1002
  };

  try {
    const res = await createTrans(paramData);
    console.log('transactions created successfully:', res);
    Swal.fire({
      icon: 'success',
      title: 'Your item has been saved',
      showConfirmButton: false,
      timer: 2000
    });
    clearFormData();
    dialog.value = false;
    emit('addTrans', res);
  } catch (error) {
    console.error('Error while creating transactions:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while creating the transactions. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
};

const clearFormData = () => {
  (formData.user_id = ''),
    (formData.qty = 0),
    (formData.trans_cat_id = ''),
    (formData.start_date = new Date().toJSON().slice(0, 10)),
    (formData.end_date = ''),
    (formData.status_id = '');
};
onMounted(() => {
  masterData();
});
</script>
