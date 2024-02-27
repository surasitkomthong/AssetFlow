<template>
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
      <v-col cols="12" md="12">
        <UiParentCard>
          <div class="flex mb-4">
            <h2 class="flex-grow">สินค้าในคลัง</h2>
            <div class="search-container">
              <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
              <i class="mdi mdi-magnify search-icon"></i>
            </div>
            <ModalAddInventory @click="addInventory()" @addItem="handleAddItem" />
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th v-for="(header, index) in headers" :key="index" class="header-cell">
                    <span>{{ header.label }}</span>
                  </th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                <!-- Display data based on the current page -->
                <tr v-for="(item, index) in paginatedData" :key="index">
                  <td>{{ currentIndex + index + 1 }}</td>
                  <td v-for="(header, index) in headers" :key="index">
                    <template v-if="header.field === 'status'">
                      <div v-if="item.status == false">
                        <!-- <v-badge color="error" content="Not in stock" inline></v-badge> -->
                        <v-chip size="small" text="หมด" color="error" variant="tonal" class="mr-2" />
                      </div>
                      <div v-else>
                        <!-- <v-badge color="success" content="In stock" inline></v-badge> -->
                        <v-chip size="small" text="คงเหลือ" color="success" variant="tonal" class="mr-2" />
                      </div>
                    </template>
                    <template v-else-if="header.field === 'item_total'">
                      <div v-if="item.item_remain > item.item_total">
                        {{ item.item_total }} <br />
                        <span style="font-size: 12px; color: red">กรุณาตรวจสอบความถูกต้อง </span>
                        <v-icon color="error">mdi-alert-circle-outline</v-icon>
                      </div>
                      <div v-else>
                        {{ item.item_total }}
                      </div>
                    </template>
                    <template v-else-if="header.field === 'item_remain'">
                      <div v-if="item.item_remain > item.item_total">
                        {{ item.item_remain }} <br />
                        <span style="font-size: 12px; color: red">กรุณาตรวจสอบความถูกต้อง </span>
                        <v-icon color="error">mdi-alert-circle-outline</v-icon>
                      </div>
                      <div v-else>
                        {{ item.item_remain }}
                      </div>
                    </template>
                    <template v-else>
                      {{ item[header.field] }}
                    </template>
                  </td>
                  <td>
                    <!-- Add buttons or components for editing data -->
                    <div class="flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <ModalAddTransaction
                            @click="addTransaction()"
                            @addTrans="dataInventory()"
                            :item_id="item.item_id"
                            :item_name="item.item_name"
                            :item_total="item.item_total"
                            :item_remain="item.item_remain"
                            :isDisable="item.item_remain == 0"
                          />
                        </template>
                        <span>Withdraw/Borrow</span> </v-tooltip
                      >&nbsp

                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <ModalEditInventory
                            @click="updateInventory"
                            @editItem="handleUpdateIem()"
                            :item_id="item.item_id"
                            :item_name="item.item_name"
                            :item_total="item.item_total"
                            :item_remain="item.item_remain"
                            :unit_name="item.unit_name"
                            :item_cat_name="item.item_cat_name"
                          />
                        </template>
                        <span>Edit</span> </v-tooltip
                      >&nbsp

                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            size="small"
                            :disabled="item.item_total != item.item_remain"
                            @click="deleteItem(item.item_id, item.item_name)"
                          >
                            <v-icon color="grey-lighten-1"> mdi-trash-can-outline </v-icon>
                          </v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Add Pagination section -->
          <v-container class="max-width"
            ><v-row justify="end">
              <v-pagination :length="totalPages" :total-visible="3" v-model="currentPage" :size="20"></v-pagination> </v-row
          ></v-container>
        </UiParentCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect, defineEmits } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { getAllInventory, deleteInventory } from '@/service/inventory';
import ModalAddInventory from './_modalAddInventory.vue';
import Swal from 'sweetalert2';
import ModalEditInventory from './_modalEditInventory.vue';
import ModalAddTransaction from './_modalAddTransaction.vue';

const modalAddInventory = ref(false);
const modalUpdate = ref(false);
const modalAddTransaction = ref(false);

const addInventory = () => {
  modalAddInventory.value = true;
};

const updateInventory = () => {
  modalUpdate.value = true;
};

const addTransaction = () => {
  modalAddTransaction.value = true;
};

interface IData {
  item_id: number;
  item_name: string;
  item_cat: number;
  item_cat_name: string;
  item_unit: number;
  unit_name: string;
  item_total: number;
  item_remain: number;
  status: boolean;
}

const dataGridInventory = reactive({
  dataList: [] as IData[]
});

const page = ref({ title: 'Inventory' });

const breadcrumbs = ref([
  { title: 'Management', disabled: true, href: '#' },
  { title: 'Inventory', disabled: false, href: '#' }
]);

const headers = reactive([
  { label: 'ชื่อสินค้า', value: 'item_id', field: 'item_name', sortable: true },
  { label: 'ประเภทสินค้า', value: 'item_cat_id', field: 'item_cat_name', sortable: true },
  { label: 'หน่วยนับ', value: 'unit_id', field: 'unit_name', sortable: true },
  { label: 'สินค้าทั้งหมด', value: 'item_total', field: 'item_total', sortable: true },
  { label: 'สินค้าคงเหลือ', value: 'item_remain', field: 'item_remain', sortable: true },
  { label: 'สถานะ', field: 'status', sortable: true }
]);

const dataInventory = async () => {
  const res = await getAllInventory();
  dataGridInventory.dataList = res.data;
};

const handleAddItem = () => {
  dataInventory();
};

const handleUpdateIem = () => {
  dataInventory();
};

const checkClick = (id: number) => {
  alert(id);
};

dataInventory();

const currentPage = ref(1);
const perPage = ref(10);
const searchQuery = ref('');

const filteredData = computed(() => {
  return dataGridInventory.dataList.filter((item) => {
    return item.item_name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = Math.min(start + perPage.value, filteredData.value.length);
  return filteredData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / perPage.value);
});

const currentIndex = computed(() => {
  return (currentPage.value - 1) * perPage.value;
});

const deleteItem = async (id: number, name: string) => {
  const item_id = id;
  try {
    const confirmResult = await Swal.fire({
      title: 'คุณแน่ใจใช่ไหมว่าจะลบ?',
      text: `${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    });
    if (confirmResult.isConfirmed) {
      await deleteInventory(id);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your item has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        dataInventory();
      });
    }
  } catch (error) {
    console.error('Error while deleting item:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong while deleting the item.'
    });
  }
};

watchEffect(() => {
  currentPage.value = 1;
});
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #ebe6f6;
  border-right: 1px solid #ddd;
}

th:last-child {
  border-right: none;
}

th:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

tr:hover {
  background-color: #f2eff9;
}

.header-cell {
  justify-content: space-between;
  align-items: center;
}

.sort-icon {
  margin-top: 6px;
}

.flex {
  display: flex;
  align-items: center;
}

.flex-grow {
  flex-grow: 1;
}

.pagination-container {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.pagination-container > * {
  margin-left: 5px;
  font-size: 14px;
}

.search-container {
  position: relative;
  width: 200px;
  margin-right: 5px;
}

.search-input {
  width: 100%;
  padding: 10px 30px;
  border-radius: 10px;
  border: 1px solid #ebe6f6;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #999;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #999;
  font-size: 20px;
}
</style>
