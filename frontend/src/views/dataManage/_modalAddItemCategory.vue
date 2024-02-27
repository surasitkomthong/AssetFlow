<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ props }">
      <v-btn icon density="compact" v-bind="props">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="h3"><v-icon size="small" color="primary">mdi-plus</v-icon> เพิ่มประเภทสินค้า</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                autofocus
                v-model="formData.ICName"
                :counter="50"
                label="ชื่อประเภทสินค้า*"
                hint="Enter up to 50 characters"
                :rules="[(v) => (!!v && v.length <= 50) || 'Please enter data']"
                :error-messages="formData.ICName.length > 50 ? ['****Maximum 50 characters****'] : []"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
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
          <v-btn color="blue darken-1" text @click="validationDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue';
import Swal from 'sweetalert2';
import { createItemCategory } from '@/service/dataManage';

const emit = defineEmits(['addIC']);
const validationDialog = ref(false);
const dialog = ref(false);

interface FormData {
  ICName: string;
}

const formData: FormData = reactive({
  ICName: ''
});

const saveItem = async () => {
  if (!formData.ICName) {
    validationDialog.value = true;
    return;
  }

  try {
    const data = { item_cat_name: formData.ICName };
    const res = await createItemCategory(data);
    console.log('Item category created successfully:', res);
    clearFormData();
    Swal.fire({
      icon: 'success',
      title: 'Your item category has been saved',
      showConfirmButton: false,
      timer: 2000
    });
    dialog.value = false;
    emit('addIC', res);
  } catch (error) {
    console.error('Error while creating item category:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while creating the item category. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
};

const clearFormData = () => {
  formData.ICName = '';
};
</script>
