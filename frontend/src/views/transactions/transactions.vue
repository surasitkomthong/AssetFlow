<template>
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
      <v-col cols="12" md="12">
        <UiParentCard>
          <div class="flex mb-4">
            <h2 class="flex-grow">ข้อมูลเบิก/ยืมของ</h2>
            <div class="search-container">
              <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
              <i class="mdi mdi-magnify search-icon"></i>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th v-for="(header, index) in headers" :key="index" class="header-cell" :style="{ width: header.width + '%' }">
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
                    <template v-if="header.field == 'start_date'">
                      {{ formatDate(item[header.field]) }}
                    </template>
                    <template v-else-if="header.field == 'end_date'">
                      <div
                        style="color: red"
                        v-if="item.status_id == 1001 && isDateGreaterThanToday(item.end_date) && item.trans_cat_id == 1001"
                      >
                        <!-- {{ formatDate(item[header.field]) }} <br /> -->
                        <div style="display: flex; justify-content: space-between; align-items: center">
                          <div>
                            {{ formatDate(item[header.field]) }} <br />
                            <div style="font-size: 12px">เลยกำหนดส่งคืน</div>
                          </div>
                          <!-- <span style="" class="mdi mdi-calendar-alert"></span> -->
                          <v-icon size="default" icon="mdi-calendar-alert"></v-icon>
                        </div>
                      </div>
                      <div style="color: green" v-else-if="item.status_id == 1002 && item.trans_cat_id == 1001">
                        <div style="display: flex; justify-content: space-between; align-items: center">
                          <div>
                            <div v-if="item.end_date != null">{{ formatDate(item[header.field]) }}<br /></div>
                            <div v-else></div>
                            <div style="font-size: 12px">ส่งคืนแล้ว</div>
                          </div>
                          <v-icon size="default" icon="mdi-check-circle-outline"></v-icon>
                        </div>
                      </div>
                      <div v-else-if="item.end_date == null && item.status_id == 1001 && item.trans_cat_id == 1001">
                        <!-- {{ formatDate(item[header.field]) }} <br /> -->
                        <div style="display: flex; justify-content: space-between; color: orange">
                          <div style="font-size: 12px">กรุณาติดตามสม่ำเสมอ</div>
                          <v-icon size="default" icon="mdi-alert-circle-outline"></v-icon>
                          <!-- <span class="mdi mdi-alert-circle-outline"></span> -->
                        </div>
                      </div>
                      <div v-else>
                        {{ formatDate(item[header.field]) }}
                      </div>
                    </template>
                    <template v-else-if="header.field == 'qty'">
                      {{ item.qty + ' ' + item.unit_name }}
                    </template>
                    <template v-else-if="header.field == 'trans_cat_name'">
                      <v-chip
                        v-if="item.trans_cat_id == 1001"
                        size="small"
                        :text="`${item.trans_cat_name}`"
                        color="warning"
                        variant="tonal"
                        class="mr-2"
                      />
                      <v-chip v-else size="small" :text="`${item.trans_cat_name}`" color="info" variant="tonal" class="mr-2" />
                    </template>
                    <template v-else-if="header.field == 'status_name'">
                      <div v-if="item.trans_cat_id == 1001">
                        <v-chip
                          v-if="item.status_id == 1001"
                          size="small"
                          :text="`${item.status_name}`"
                          color="success"
                          variant="tonal"
                          class="mr-2"
                        />
                        <v-chip
                          v-else-if="item.status_id == 1002"
                          size="small"
                          :text="`${item.status_name}`"
                          color="primary"
                          variant="tonal"
                          class="mr-2"
                        />
                        <v-chip v-else size="small" :text="`${item.status_name}`" color="dark" variant="tonal" class="mr-2" />
                      </div>
                    </template>
                    <template v-else>
                      {{ item[header.field] }}
                    </template>
                  </td>
                  <td>
                    <div v-if="item.trans_cat_id == 1001 && item.status_id == 1001">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            @click="return_Item(item.trans_id, item.item_id, item.qty, item.item_name)"
                            icon
                            v-bind="props"
                            size="small"
                            :disabled="item.status_id != 1001 || item.trans_cat_id != 1001"
                          >
                            <v-icon color="grey-lighten-1"> mdi-clipboard-arrow-down-outline </v-icon>
                          </v-btn>
                        </template>
                        <span>คืนสินค้า</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <v-container class="max-width">
            <v-row justify="end">
              <v-pagination :length="totalPages" :total-visible="3" v-model="currentPage" :size="20"></v-pagination>
            </v-row>
          </v-container>
        </UiParentCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect, defineEmits, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { getAllITransaction, returnItem } from '@/service/transaction';
import Swal from 'sweetalert2';

const page = ref({ title: 'Transaction' });

const breadcrumbs = ref([
  { title: 'Management', disabled: true, href: '#' },
  { title: 'Transaction', disabled: false, href: '#' }
]);

const headers = reactive([
  { label: 'ชื่อ', value: 'full_name', field: 'full_name', sortable: true },
  { label: 'สินค้า', value: 'item_name', field: 'item_name', sortable: true },
  { label: 'จำนวน', value: 'qty', field: 'qty', sortable: true },
  //   { label: 'หน่วยนับ', value: 'unit_name', field: 'unit_name', sortable: true },
  { label: 'วันที่ทำการ', value: 'start_date', field: 'start_date', sortable: true },
  { label: 'กำหนดคืน', value: 'end_date', field: 'end_date', sortable: true },
  { label: 'ประเภท', value: 'trans_cat_name', field: 'trans_cat_name', sortable: true },
  { label: 'สถานะ', value: 'status_name', field: 'status_name', sortable: true }
]);

interface IData {
  trans_id: number;
  item_id: number;
  item_name: string;
  item_cat_name: string | null;
  qty: number;
  unit_name: string;
  user_id: number;
  user_firstname: string;
  user_lastname: string;
  trans_cat_id: number;
  trans_cat_name: string;
  start_date: string | null;
  end_date: string | null;
  status_id: number;
  status_name: string;
  full_name: string;
}

const dataGridTransaction = reactive({
  dataList: [] as IData[]
});

const dataTransaction = async () => {
  const res = await getAllITransaction();
  dataGridTransaction.dataList = res.data;
};

const currentPage = ref(1);
const perPage = ref(10);
const searchQuery = ref('');

const filteredData = computed(() => {
  return dataGridTransaction.dataList.filter((item) => {
    return (
      item.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.item_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
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

const return_Item = (id: number, item_id: number, qty_: number, item_name: string) => {
  const data = {
    qty: qty_,
    itemId: item_id
  };

  Swal.fire({
    title: 'ยืนยันการคืนสินค้า',
    text: `คุณแน่ใจหรือไม่ที่ต้องการที่จะคืนสินค้านี้?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก'
  })
    .then((result) => {
      if (result.isConfirmed) {
        const res = returnItem(id, data);
        Swal.fire({
          title: 'คืนสินค้าเรียบร้อย',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          dataTransaction();
        });
      } else {
        return;
      }
    })
    .catch((error) => {
      console.error('Error while showing swal:', error);
      Swal.fire('ข้อผิดพลาด', 'มีข้อผิดพลาดเกิดขึ้น', 'error');
    });
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-'; // กรณีไม่มีวันที่

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  };

  return date.toLocaleDateString('th-TH', options);
};

const isDateGreaterThanToday = (dateString: string | null): boolean => {
  if (!dateString) return false; // กรณีไม่มีวันที่

  const date = new Date(dateString);
  const today = new Date();

  return date.getTime() < today.getTime(); // เปรียบเทียบค่า timestamp
};

watchEffect(() => {
  currentPage.value = 1;
});

onMounted(() => {
  dataTransaction();
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
