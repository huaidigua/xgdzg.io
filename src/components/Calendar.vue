<script setup lang="ts">
import { ref, reactive } from 'vue'
import Snowflakes from 'magic-snowflakes';
import Lottery from './lottery/index.vue';
const state = reactive({ data: [], canLottery: false })
const snowflakes = new Snowflakes();
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
    if (data && data.dates) {
      defaultDates = data.dates;
      dateList = defaultDates.map((val: any) => new Date(val))
      state.data = [...data.dates];
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
snowflakes.start();
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
        alert(`签到成功~ 签到时间：${moment().format('YYYY-MM-DD: HH:mm:ss')}`)
        // 可以抽奖
        state.canLottery = true
      }
    }
    else {
      newData.dates = ['2023-12-24']
      // newData.dates = [now]
      alert(`签到成功~ 签到时间：${moment().format('YYYY-MM-DD: HH:mm:ss')}`)
      state.canLottery = true
    }
    dateList = newData.dates.map((val: any) => new Date(val))
    defaultDates = newData.dates
    // state.data = newData.dates;
    objectStore.put(newData);
  };
}

</script>

<template>
  <div class="inDate">
    <div>
      <div class="rainbow">小🐶蛋打卡器v2.0</div>
      <van-cell class="cellClass" title="查看签到日期" :value="text" @click="show = true" />
      <van-calendar readonly :default-date="dateList" v-model:show="show" :min-date="minDate" type="multiple"
        @confirm="onConfirm" />
      <van-cell title="签到" @click="onDid" />
    </div>
    <div>
      <Lottery :data="state.data" :canLottery="state.canLottery" />
    </div>
    <div class="bottomImg">
      <img src="../assets/cherry.gif" />
    </div>
  </div>
  <!-- <van-calendar v-model:show="show" :min-date="minDate" type="multiple" @confirm="onConfirm" /> -->
</template>
<style scoped>
.rainbow {
  text-align: center;
  font-size: 2rem;
  background: linear-gradient(to right, burlywood, yellow, lime, aqua, blue, fuchsia) 0 / 50%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hue 6s infinite;
}

.dog {
  color: #000000;
  background: #FFFFFF;
}

@keyframes hue {
  from {
    filter: hue-rotate(0deg);
  }

  to {
    filter: hue-rotate(360deg);
  }
}

.inDate {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-content: space-between;
}

.cellClass {
  color: red;
}

.caluation {
  width: 100%;
  text-align: center;
  font-size: 2rem;
  background-color: aqua;
  color: cadetblue;
}

.bottomImg {
  img {
    width: 100%;
  }
}
</style>
