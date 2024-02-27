<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ props }">
      <v-btn icon size="small" v-bind="props">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="h3"><v-icon size="small" color="primary">mdi-pencil</v-icon> แก้ไขประเภทสินค้า </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
              autofocus
                v-model="ICName"
                :counter="50"
                label="ชื่อประเภทสินค้า*"
                hint="Enter up to 50 characters"
                :rules="[(v) => (!!v && v.length <= 50) || 'Please enter data']"
                :error-messages="ICName.length > 50 ? ['****Maximum 50 characters****'] : []"
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
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { updateItemCategory } from '@/service/dataManage';

interface Props {
  item_cat_id: number;
  item_cat_name: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['updateIC']);
const validationDialog = ref(false);
const dialog = ref(false);
const ICName = ref(props.item_cat_name);
// ICName.value = props.item_cat_name;

const saveItem = async () => {
  if (!ICName.value) {
    validationDialog.value = true;
    return;
  }

  try {
    const data = { item_cat_name: ICName.value };
    const res = await updateItemCategory(props.item_cat_id, data);
    console.log('Item category updated successfully:', res);
    clearFormData();
    Swal.fire({
      icon: 'success',
      title: 'Your item category has been updated',
      showConfirmButton: false,
      timer: 2000
    });
    dialog.value = false;
    emit('updateIC', res);
  } catch (error) {
    console.error('Error while updating item category:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while updating the item category. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
};

const clearFormData = () => {
  ICName.value = '';
};

watch(props, () => {
  ICName.value = props.item_cat_name;
});
</script>
