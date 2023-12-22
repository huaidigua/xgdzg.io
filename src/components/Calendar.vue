<script setup lang="ts">
import { Calendar } from "vant";
import { onMounted, ref } from 'vue'
import moment from 'moment';
const text = ref('');
const show = ref(false);
const minDate = new Date(2022, 12, 1);
let defaultDates: any = []
let dateList: any[] = []
var request = indexedDB.open("myDatabase", 1);
const onConfirm = (dates: any) => {
  show.value = false;
  text.value = `选择了 ${dates.length} 个日期`;
};
request.onsuccess = function (event: any) {
  var db = event.target.result;
  // 获取事务
  var transaction = db.transaction(["signInDate"], "readonly");
  var objectStore = transaction.objectStore("signInDate");
  //获取数据
  var request = objectStore.get(1);
  // 处理获取请求成功的情况
  request.onsuccess = function (event: any) {
    var data = event.target.result;
    console.log(data)
    if (data && data.dates) {
      defaultDates = data.dates;
      dateList = defaultDates.map((val: any) => new Date(val))
    }
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
    let now: string = moment().format('YYYY-MM-DD')
    var newData: any = { id: 1, dates: [] };
    if (defaultDates && defaultDates.length) {
      newData.dates = defaultDates
      if (defaultDates.includes(now)) {
        alert('重复签到')
      } else {
        newData.dates.push(now)
        console.log(now, newData.dates)
        alert(`签到成功~ 签到时间：${moment().format('YYYY-MM-DD: HH:mm:ss')}`)
      }
    }
    else {
      newData.dates = [now]
      alert(`签到成功~ 签到时间：${moment().format('YYYY-MM-DD: HH:mm:ss')}`)
    }
    dateList = newData.dates.map((val: any) => new Date(val))
    console.log(dateList, newData, defaultDates)
    objectStore.put(newData);
  };
}
onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>

<template>
  <div class="caluation">小🐶蛋打卡器v1.0</div>
  <van-cell class="cellClass" title="查看签到日期" :value="text" @click="show = true" />
  <van-calendar readonly :default-date="dateList" v-model:show="show" :min-date="minDate" type="multiple"
    @confirm="onConfirm" />
  <van-cell title="签到" :value="text" @click="onDid" />
  <!-- <van-calendar v-model:show="show" :min-date="minDate" type="multiple" @confirm="onConfirm" /> -->
</template>
<style scoped>
.cellClass {
  color: red;
}

.caluation {
  width: 100%;
  text-align: center;
  font-size: 2rem;
  background-color: aqua;
  color: cadetblue
}
</style>
