<script setup lang="ts">
import { Calendar } from "vant";
import { onMounted, ref } from 'vue'
import moment from 'moment';
const text = ref('');
const show = ref(false);
const minDate = new Date(2022, 12, 1);
const defaultDates = []
var request = indexedDB.open("myDatabase", 1);
const onConfirm = (dates: any) => {
  show.value = false;
  text.value = `选择了 ${dates.length} 个日期`;
};
request.onsuccess = function (event: any) {
  var db = event.target.result;
  console.log(db.transaction("signInDate", "readonly"))
  // 获取事务
  var transaction = db.transaction(["signInDate"], "readonly");
  var objectStore = transaction.objectStore("signInDate");
  //获取数据
  var request = objectStore.get(1);
  // 处理获取请求成功的情况
  request.onsuccess = function (event: any) {
    var data = event.target.result;
    console.log('data', data)
  };
  // 处理获取请求失败的情况
  request.onerror = function (event: any) {
    console.error("Error retrieving data: " + event.target.errorCode);
  };
}
request.onupgradeneeded = function (event: any) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("signInDate", { keyPath: "id" });
  // 其他操作
};

const onDid = () => {
  var request = indexedDB.open("myDatabase", 1);
  // 处理数据库打开或创建成功的情况
  request.onsuccess = function (event: any) {
    var db = event.target.result;
    // 在这里进行后续的操作
    var transaction = db.transaction(["signInDate"], "readwrite");
    var objectStore = transaction.objectStore("signInDate");
    var request1 = objectStore.get(1);
    var newData = { id: '1', dates: [moment().format('YYYYMMDD')] };
    objectStore.put(newData);
  };
  // 处理数据库版本更新的情况
  request.onupgradeneeded = function (event: any) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("signInDate", { keyPath: "id" });
    // 其他操作
  };

}
onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>

<template>
  <van-cell class="cellClass" title="查看签到日期" :value="text" @click="show = true" />
  <van-calendar v-model:show="show" :min-date="minDate" type="multiple" @confirm="onConfirm" />
  <van-cell title="签到" :value="text" @click="onDid" />
  <!-- <van-calendar v-model:show="show" :min-date="minDate" type="multiple" @confirm="onConfirm" /> -->
</template>
<style scoped>
.cellClass {
  color: red;
}
</style>
