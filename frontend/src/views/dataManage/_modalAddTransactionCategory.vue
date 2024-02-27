<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ props }">
      <v-btn icon density="compact" v-bind="props">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="h3"><v-icon size="small" color="primary">mdi-plus</v-icon> Add New Transaction Category</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                autofocus
                v-model="formData.TCName"
                :counter="50"
                label="Transaction Category name*"
                hint="Enter up to 50 characters"
                :rules="[(v) => (!!v && v.length <= 50) || 'Please enter data']"
                :error-messages="formData.TCName.length > 50 ? ['****Maximum 50 characters****'] : []"
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
import { createTransactionCategory } from '@/service/dataManage';

const emit = defineEmits(['addTC']);
const validationDialog = ref(false);
const dialog = ref(false);

interface FormData {
  TCName: string;
}

const formData: FormData = reactive({
  TCName: ''
});

const saveItem = async () => {
  if (!formData.TCName) {
    validationDialog.value = true;
    return;
  }

  try {
    const data = { trans_cat_name: formData.TCName };
    const res = await createTransactionCategory(data);
    console.log('Transaction Category created successfully:', res);
    clearFormData();
    Swal.fire({
      icon: 'success',
      title: 'Your Transaction Category has been saved',
      showConfirmButton: false,
      timer: 2000
    });
    dialog.value = false;
    emit('addTC', res);
  } catch (error) {
    console.error('Error while creating Transaction Category:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while creating the Transaction Category. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
};

const clearFormData = () => {
  formData.TCName = '';
};
</script>
