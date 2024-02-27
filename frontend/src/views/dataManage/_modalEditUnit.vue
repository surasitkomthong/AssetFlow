<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ props }">
      <v-btn icon size="small" v-bind="props">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="h3"><v-icon size="small" color="primary">mdi-pencil</v-icon> แก้ไขหน่วยนับ</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
              autofocus
                v-model="unitName"
                :counter="50"
                label="ชื่อหน่วยนับ*"
                hint="Enter up to 50 characters"
                :rules="[(v) => (!!v && v.length <= 50) || 'Please enter data']"
                :error-messages="unitName.length > 50 ? ['****Maximum 50 characters****'] : []"
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
import { updateUnit } from '@/service/dataManage';

interface Props {
  unit_id: number;
  unit_name: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['updateUnit']);
const validationDialog = ref(false);
const dialog = ref(false);
const unitName = ref(props.unit_name);
// unitName.value = props.unit_name;

const saveItem = async () => {
  if (!unitName.value) {
    validationDialog.value = true;
    return;
  }

  try {
    const data = { unit_name: unitName.value };
    const res = await updateUnit(props.unit_id, data);
    console.log('Item category updated successfully:', res);
    clearFormData();
    Swal.fire({
      icon: 'success',
      title: 'Your item category has been updated',
      showConfirmButton: false,
      timer: 2000
    });
    dialog.value = false;
    emit('updateUnit', res);
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
  unitName.value = '';
};

watch(props, () => {
  unitName.value = props.unit_name;
});
</script>
