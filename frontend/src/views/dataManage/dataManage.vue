<template>
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
      <v-col cols="12" md="12">
        <UiParentCard>
          <div class="flex mb-4">
            <h2 class="flex-grow">การจัดการหมวดหมู่รายการ</h2>
            <div class="search-container">
              <input type="text" v-model="ICsearchQuery" placeholder="Search..." class="search-input" />
              <i class="mdi mdi-magnify search-icon"></i>
            </div>
            <ModalAddIC @click="addIC" @addIC="handleAddIC" />
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 10%">#</th>
                  <th
                    v-for="(header, index) in itemCategoryHeaders"
                    :key="index"
                    class="header-cell"
                    :style="{ width: header.width + '%' }"
                  >
                    <span>{{ header.label }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in ICpaginatedData" :key="index">
                  <td>{{ ICcurrentIndex + index + 1 }}</td>
                  <td v-for="(header, index) in itemCategoryHeaders" :key="index">
                    <template v-if="header.field == 'isReferenced'">
                      <div v-if="item.isReferenced">
                        <v-chip size="small" text="กำลังใช้งาน" color="success" variant="tonal" class="mr-2" />
                      </div>
                      <div v-else>
                        <v-chip size="small" text="รอใช้งาน" color="warning" variant="tonal" class="mr-2" />
                      </div>
                    </template>

                    <template v-else-if="header.field == 'Action'">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <ModalUpdateIC
                            @click="updateIC"
                            @updateIC="handleUpdateIC"
                            :item_cat_id="item.item_cat_id"
                            :item_cat_name="item.item_cat_name"
                          />
                        </template>
                      </v-tooltip>&nbsp
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            size="small"
                            :disabled="item.isReferenced"
                            @click="deleteIC(item.item_cat_id, item.item_cat_name)"
                          >
                            <v-icon color="grey-lighten-1"> mdi-trash-can-outline </v-icon>
                          </v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </template>
                    <template v-else>
                      {{ item[header.field] }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <v-container class="max-width">
            <v-row justify="end">
              <v-pagination :length="ICtotalPages" :total-visible="3" v-model="ICcurrentPage" :size="20"></v-pagination>
            </v-row>
          </v-container>
        </UiParentCard>

        <UiParentCard class="mt-6">
          <div class="flex mb-4">
            <h2 class="flex-grow">การจัดการหน่วยนับ</h2>
            <div class="search-container">
              <input type="text" v-model="UNsearchQuery" placeholder="Search..." class="search-input" />
              <i class="mdi mdi-magnify search-icon"></i>
            </div>
            <ModalAddUnit @click="addUnit" @addUnit="handleAddUnit" />
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 10%">#</th>
                  <th v-for="(header, index) in unitHeaders" :key="index" class="header-cell" :style="{ width: header.width + '%' }">
                    <span>{{ header.label }}</span>
                  </th>
                  <th style="width: 20%">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in UNpaginatedData" :key="index">
                  <td>{{ UNcurrentIndex + index + 1 }}</td>
                  <td v-for="(header, index) in unitHeaders" :key="index">
                    <template v-if="header.field == 'isReferenced'">
                      <div v-if="item.isReferenced">
                        <v-chip size="small" text="กำลังใช้งาน" color="success" variant="tonal" class="mr-2" />
                      </div>
                      <div v-else>
                        <v-chip size="small" text="รอใช้งาน" color="warning" variant="tonal" class="mr-2" />
                      </div>
                    </template>
                    <template v-else>
                      {{ item[header.field] }}
                    </template>
                  </td>
                  <td>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <ModalUpdateUnit
                          @click="updateUnit"
                          @updateUnit="handleUpdateUnit"
                          :unit_id="item.unit_id"
                          :unit_name="item.unit_name"
                        />
                      </template> </v-tooltip
                    >&nbsp

                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon
                          v-bind="props"
                          size="small"
                          :disabled="item.isReferenced"
                          @click="delete_Unit(item.unit_id, item.unit_name)"
                        >
                          <v-icon color="grey-lighten-1"> mdi-trash-can-outline </v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <v-container class="max-width"
            ><v-row justify="end">
              <v-pagination :length="UNtotalPages" :total-visible="3" v-model="UNcurrentPage" :size="20"></v-pagination> </v-row
          ></v-container>
        </UiParentCard>

        <UiParentCard class="mt-6">
          <div class="flex mb-4">
            <h2 class="flex-grow">การจัดการหมวดหมู่ธุรกรรม</h2>
            <div class="search-container">
              <input type="text" v-model="TCsearchQuery" placeholder="Search..." class="search-input" />
              <i class="mdi mdi-magnify search-icon"></i>
            </div>
            <!-- <ModalAddTransactionCategory @click="addTC" @addTC="handleAddTC" /> -->
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 10%">#</th>
                  <th v-for="(header, index) in TCHeaders" :key="index" class="header-cell" :style="{ width: header.width + '%' }">
                    <span>{{ header.label }}</span>
                  </th>
                  <!-- <th style="width: 20%">Actions</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in TCpaginatedData" :key="index">
                  <td>{{ TCcurrentIndex + index + 1 }}</td>
                  <td v-for="(header, index) in TCHeaders" :key="index">
                    <template v-if="header.field == 'isReferenced'">
                      <div v-if="item.isReferenced">
                        <v-chip size="small" text="กำลังใช้งาน" color="success" variant="tonal" class="mr-2" />
                      </div>
                      <div v-else>
                        <v-chip size="small" text="รอใช้งาน" color="warning" variant="tonal" class="mr-2" />
                      </div>
                    </template>
                    <template v-else>
                      {{ item[header.field] }}
                    </template>
                  </td>
                  <!-- <td>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <ModalUpdateTC
                          @click="updateTC"
                          @updateTC="handleUpdateTC"
                          :trans_cat_id="item.trans_cat_id"
                          :trans_cat_name="item.trans_cat_name"
                        />
                      </template> </v-tooltip
                    >&nbsp

                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon
                          v-bind="props"
                          size="small"
                          :disabled="item.isReferenced"
                          @click="deleteTC(item.trans_cat_id, item.trans_cat_name)"
                        >
                          <v-icon color="grey-lighten-1"> mdi-trash-can-outline </v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
          <v-container class="max-width"
            ><v-row justify="end">
              <v-pagination :length="TCtotalPages" :total-visible="3" v-model="TCcurrentPage" :size="20"></v-pagination> </v-row
          ></v-container>
        </UiParentCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';
import { ref, reactive, computed, defineEmits, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import {
  getAllItemCategory,
  deleteItemCategory,
  getAllUnit,
  deleteUnit,
  getAllTransactionCategory,
  deleteTransactionCategory
} from '@/service/dataManage';
import ModalAddIC from './_modalAddItemCategory.vue';
import ModalUpdateIC from './_modalEditItemCategory.vue';
import ModalAddUnit from './_modalAddUnit.vue';
import ModalUpdateUnit from './_modalEditUnit.vue';
import ModalAddTransactionCategory from './_modalAddTransactionCategory.vue';
import ModalUpdateTC from './_modalEditTransactionCategory.vue';

const page = ref({ title: 'Data Management' });

const breadcrumbs = ref([
  { title: 'Management', disabled: true, href: '#' },
  { title: 'Data Management', disabled: false, href: '#' }
]);

const isPanelOpen = ref(false);
//------------------Item Category --------------------
interface IDataItemCategory {
  item_cat_id: number;
  item_cat_name: string;
  isReferenced: boolean;
}

const dataGridItemCategory = reactive({
  dataList: [] as IDataItemCategory[]
});

const itemCategoryHeaders = reactive([
  { label: 'รหัสประเภทสินค้า', value: 'item_cat_id', field: 'item_cat_id', width: '20' },
  { label: 'ชื่อประเภทสินค้า', value: 'item_cat_name', field: 'item_cat_name', width: '30' },
  { label: 'การใช้งาน', value: 'isReferenced', field: 'isReferenced', width: '20' },
  { label: 'จัดการ', field: 'Action', width: '20' }
]);

const dataItemCategory = async () => {
  const res = await getAllItemCategory();
  dataGridItemCategory.dataList = res.data;
};

const ICcurrentPage = ref(1);
const ICperPage = ref(5);
const ICsearchQuery = ref('');

const ICfilteredData = computed(() => {
  return dataGridItemCategory.dataList.filter((item) => {
    return item.item_cat_name.toLowerCase().includes(ICsearchQuery.value.toLowerCase());
  });
});

const ICpaginatedData = computed(() => {
  const start = (ICcurrentPage.value - 1) * ICperPage.value;
  const end = Math.min(start + ICperPage.value, ICfilteredData.value.length);
  return ICfilteredData.value.slice(start, end);
});

const ICtotalPages = computed(() => {
  return Math.ceil(ICfilteredData.value.length / ICperPage.value);
});

const ICcurrentIndex = computed(() => {
  return (ICcurrentPage.value - 1) * ICperPage.value;
});

const modalAddIC = ref(false);
const modalUpdate = ref(false);

const addIC = () => {
  modalAddIC.value = true;
};

const updateIC = () => {
  modalUpdate.value = true;
};

const handleAddIC = () => {
  dataItemCategory();
};

const handleUpdateIC = () => {
  dataItemCategory();
};

const deleteIC = async (id: number, name: string) => {
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
      await deleteItemCategory(id);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your item category has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        dataItemCategory();
      });
    }
  } catch (error) {
    console.error('Error while deleting item category:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong while deleting the item category.'
    });
  }
};
//------------------Item Category --------------------

//------------------ Unit --------------------
interface IDataUnit {
  unit_id: number;
  unit_name: string;
  isReferenced: boolean;
}

const dataGridUnit = reactive({
  dataList: [] as IDataUnit[]
});

const unitHeaders = reactive([
  { label: 'รหัสหน่วยนับ', value: 'unit_id', field: 'unit_id', width: '20' },
  { label: 'ชื่อหน่วยนับ', value: 'unit_name', field: 'unit_name', width: '30' },
  { label: 'การใช้งาน', value: 'isReferenced', field: 'isReferenced', width: '20' }
]);

const dataUnit = async () => {
  const res = await getAllUnit();
  dataGridUnit.dataList = res.data;
};

const modalAddUnit = ref(false);
const modalUpdateUnit = ref(false);

const addUnit = () => {
  modalAddUnit.value = true;
};

const updateUnit = () => {
  modalUpdateUnit.value = true;
};

const handleAddUnit = () => {
  dataUnit();
};

const handleUpdateUnit = () => {
  dataUnit();
};

const UNcurrentPage = ref(1);
const UNperPage = ref(5);
const UNsearchQuery = ref('');

const UNfilteredData = computed(() => {
  return dataGridUnit.dataList.filter((item) => {
    return item.unit_name.toLowerCase().includes(UNsearchQuery.value.toLowerCase());
  });
});

const UNpaginatedData = computed(() => {
  const start = (UNcurrentPage.value - 1) * UNperPage.value;
  const end = Math.min(start + UNperPage.value, UNfilteredData.value.length);
  return UNfilteredData.value.slice(start, end);
});

const UNtotalPages = computed(() => {
  return Math.ceil(UNfilteredData.value.length / UNperPage.value);
});

const UNcurrentIndex = computed(() => {
  return (UNcurrentPage.value - 1) * UNperPage.value;
});

const delete_Unit = async (id: number, name: string) => {
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
      await deleteUnit(id);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your unit has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        dataUnit();
      });
    }
  } catch (error) {
    console.error('Error while deleting unit:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong while deleting the unit.'
    });
  }
};
//------------------ Unit --------------------

//================== Transaction Category =========================
interface IDataTC {
  trans_cat_id: number;
  trans_cat_name: string;
  isReferenced: boolean;
}

const dataGridTC = reactive({
  dataList: [] as IDataTC[]
});

const TCHeaders = reactive([
  { label: 'รหัสธุรกรรม', value: 'trans_cat_id', field: 'trans_cat_id', width: '20' },
  { label: 'ชื่อธุรกรรม', value: 'trans_cat_name', field: 'trans_cat_name', width: '30' },
  { label: 'การใช้งาน', value: 'isReferenced', field: 'isReferenced', width: '20' }
]);

const dataTC = async () => {
  const res = await getAllTransactionCategory();
  dataGridTC.dataList = res.data;
};

const modalAddTC = ref(false);
const modalUpdateTC = ref(false);

const addTC = () => {
  modalAddTC.value = true;
};

const updateTC = () => {
  modalUpdateTC.value = true;
};

const handleAddTC = () => {
  dataTC();
};

const handleUpdateTC = () => {
  dataTC();
};

const TCcurrentPage = ref(1);
const TCperPage = ref(5);
const TCsearchQuery = ref('');

const TCfilteredData = computed(() => {
  return dataGridTC.dataList.filter((item) => {
    return item.trans_cat_name.toLowerCase().includes(TCsearchQuery.value.toLowerCase());
  });
});

const TCpaginatedData = computed(() => {
  const start = (TCcurrentPage.value - 1) * TCperPage.value;
  const end = Math.min(start + TCperPage.value, TCfilteredData.value.length);
  return TCfilteredData.value.slice(start, end);
});

const TCtotalPages = computed(() => {
  return Math.ceil(TCfilteredData.value.length / TCperPage.value);
});

const TCcurrentIndex = computed(() => {
  return (UNcurrentPage.value - 1) * UNperPage.value;
});

const deleteTC = async (id: number, name: string) => {
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
      await deleteTransactionCategory(id);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your Transaction Category has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        dataTC();
      });
    }
  } catch (error) {
    console.error('Error while deleting Transaction Category:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong while deleting the Transaction Category.'
    });
  }
};

onMounted(() => {
  dataItemCategory();
  dataUnit();
  dataTC();
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
