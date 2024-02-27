<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ props }">
      <v-btn icon size="small" v-bind="props">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="h3"><v-icon size="small" color="primary">mdi-pencil</v-icon> Edit Transaction Category</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
              autofocus
                v-model="TCName"
                :counter="50"
                label="Item Transaction Category name*"
                hint="Enter up to 50 characters"
                :rules="[(v) => (!!v && v.length <= 50) || 'Please enter data']"
                :error-messages="TCName.length > 50 ? ['****Maximum 50 characters****'] : []"
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
import { updateTransactionCategory } from '@/service/dataManage';

interface Props {
  trans_cat_id: number;
  trans_cat_name: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['updateTC']);
const validationDialog = ref(false);
const dialog = ref(false);
const TCName = ref(props.trans_cat_name);
// TCName.value = props.trans_cat_name;

const saveItem = async () => {
  if (!TCName.value) {
    validationDialog.value = true;
    return;
  }

  try {
    const data = { trans_cat_name: TCName.value };
    const res = await updateTransactionCategory(props.trans_cat_id, data);
    console.log('Transaction Category updated successfully:', res);
    clearFormData();
    Swal.fire({
      icon: 'success',
      title: 'Your Transaction Category has been updated',
      showConfirmButton: false,
      timer: 2000
    });
    dialog.value = false;
    emit('updateTC', res);
  } catch (error) {
    console.error('Error while updating Transaction Category:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while updating the Transaction Category. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
};

const clearFormData = () => {
  TCName.value = '';
};

watch(props, () => {
  TCName.value = props.trans_cat_name;
});
</script>
