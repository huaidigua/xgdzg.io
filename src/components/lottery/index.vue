<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import moment from 'moment';

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    canLottery: Boolean
});
let newDate = props.data;
// 是否显示
let isShow = true;
// 是否抽过奖
let isRote = false;
// 能否抽奖
let canLottery = props.canLottery
let count: any = ref(null)
onMounted(() => {
    onLottery()
})
watch(
    () => props.data,
    (newVal, oldVal) => {
        console.log(newVal, oldVal)
        newDate = newVal;
        let now: string = moment().format('YYYY-MM-DD')
        if (newDate.includes(now)) {
            isShow = false
        } else {
            isShow = true
        }
    }
);
watch(
    () => props.canLottery,
    (newVal, oldVal) => {
        canLottery = newVal
    }
);
let arr = []
const onLottery = () => {
    var canvasI = document.getElementById("canvas-one");
    var canvasII = document.getElementById('canvas-bg');
    var ctx = canvasI.getContext('2d');//创建id为canvasI的绘图
    var ctx2 = canvasII.getContext('2d');//创建id为canvasII的绘图

    var lottery = function () {
        this.mytime = '';//跑马灯定时器名称
        this.lamp = 0;//判断跑马灯闪烁标记
        this.w2 = '';
        this.h2 = '';
        this.w1 = '';
        this.h1 = '';
        this.itemsNum = 0; //大转盘等分数
        this.itemsArc = 0; //大转盘每等分角度
        this.color = [];//扇形的背景颜色交替
        this.text = [];//每个扇形中的文字填充
        this.isRotate = 0;
    }
    lottery.prototype.init = function (num, arc, colors, textArray, isRotate) {
        this.itemsNum = num; //大转盘等分数
        this.itemsArc = arc; //大转盘每等分角度
        this.color = colors;//扇形的背景颜色交替
        this.text = textArray;//每个扇形中的文字填充
        this.isRotate = isRotate;
        this.getCanvasI()
        this.getCanvasII()
    }
    //获取圆心尺寸
    lottery.prototype.getCanvasII = function () {
        let widthII = canvasII.width
        let heightII = canvasII.height
        this.w2 = parseInt(widthII / 2)
        this.h2 = parseInt(heightII / 2)
        this.light()
    }
    //转盘内部绘制
    lottery.prototype.getCanvasI = function () {
        let itemsArc = 360 / this.itemsNum   //获取大转盘每等分的角度
        this.itemsArc = itemsArc
        let widthI = canvasI.width
        let heightI = canvasI.height
        this.w1 = parseInt(widthI / 2)
        this.h1 = parseInt(heightI / 2)
        this.Items(itemsArc)//每一份扇形的内部绘制
        this.mytime = setInterval(this.light.bind(this), 1000)
    }
    //绘制奖品名称
    lottery.prototype.Items = function (e) {
        let that = this
        let itemsArc = e//每一分扇形的角度
        let Num = that.itemsNum// 等分数量
        let text = that.text// 放文字的数组
        for (let i = 0; i < Num; i++) {
            ctx.beginPath()
            ctx.moveTo(that.w1, that.h1)
            ctx.arc(that.w1, that.h1, that.w1 - 5, itemsArc * i * Math.PI / 180, (itemsArc + itemsArc * i) * Math.PI / 180)//绘制扇形，注意下一个扇形比上一个扇形多一个itemsArc的角度
            ctx.closePath()
            if (i % 2 == 0) {//绘制偶数扇形和奇数扇形的颜色不同
                ctx.fillStyle = that.color[0]
            } else {
                ctx.fillStyle = that.color[1]
            }
            ctx.fill()
            ctx.save()
            ctx.beginPath()
            ctx.fontSize = 12
            ctx.fillStyle = '#000'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.translate(that.w1, that.h1);//将原点移至圆形圆心位置
            ctx.rotate((itemsArc * (i + 2)) * Math.PI / 180);//旋转文字，从 i+2 开始，因为扇形是从数学意义上的第四象限第一个开始的，文字目前的位置是在圆心正上方，所以起始位置要将其旋转2个扇形的角度让其与第一个扇形的位置一致。
            ctx.fillText(that.text[i], 0, -(that.h1 * 0.8));
            ctx.restore();//保存绘图上下文，使上一个绘制的扇形保存住。
        }
    }

    //跑马灯绘制
    lottery.prototype.light = function () {
        var that = this
        var itemsNum = that.itemsNum
        that.lamp++
        if (that.lamp >= 2) {
            that.lamp = 0
        }
        ctx2.beginPath()
        ctx2.arc(that.w2, that.h2, that.w2, 0, 2 * Math.PI)//绘制底色为红色的圆形
        ctx2.fillStyle = "#FA7471";
        ctx2.fill()
        for (let i = 0; i < that.itemsNum * 2; i++) {//跑马灯小圆圈比大圆盘等分数量多一倍
            ctx2.save()
            ctx2.beginPath()
            ctx2.translate(that.w2, that.h2)
            ctx2.rotate(30 * i * Math.PI / 180)
            ctx2.arc(0, that.h2 - 10, 5, 0, 2 * Math.PI)//圆形跑马灯小圆圈
            //跑马灯第一次闪烁时与第二次闪烁时绘制相反的颜色，再配上定时器循环闪烁就可以达到跑马灯一闪一闪的效果了
            if (that.lamp == 0) {//第一次闪烁时偶数奇数的跑马灯各绘制一种颜色
                if (i % 2 == 0) {
                    ctx2.fillStyle = "#FBF1A9";
                } else {
                    ctx2.fillStyle = "#fbb936";
                }
            } else {//第二次闪烁时偶数奇数的跑马灯颜色对调
                if (i % 2 == 0) {
                    ctx2.fillStyle = "#fbb936";
                } else {
                    ctx2.fillStyle = "#FBF1A9";
                }
            }
            ctx2.fill()
            ctx2.restore()//恢复之前保存的上下文，可以将循环出来的跑马灯都保存下来。没有这一句那么每循环出一个跑马灯则上一个跑马灯绘图将被覆盖，
        }
    }
    const Lotter = new lottery();
    count.value = Lotter;
    var colors = ["#5FCBD5", "#FFF"];
    var text = ["五十元", "五元", "十元", "二十元", "一元", "一百元"];
    count.value.init(6, 0, colors, text, 0)
}
//60 -20   1-0 10-120  5-180 50-240 100-300
let rotateList = [60, 60, 60, 60, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 360, 360, 360, 360, 360, 360, 240, 240, 300, 360, 360]

const onchange = () => {
    let now: string = moment().format('YYYY-MM-DD')
    if (!canLottery) {
        alert('签到才能抽奖😄')
        return
    }
    if (newDate.includes(now) || isRote) {
        alert('一天只能抽一次哦😯')
        return
    }
    if (!count.value) return
    let n = 0
    //count.value.isRotate
    //传入指定的旋转角度，内部指定获奖结果。在指定角度上加上旋转基数模拟转盘随机旋转。
    // 随机获奖结果
    let rand = Math.floor(Math.random() * 50)
    //Math.random() * 1000//取一个随机的旋转角度，使获奖结果随机化
    n = rotateList[rand] + 1440;
    // rand - (rand % 60) + 1440  // //1440为旋转基数，最低要旋转1440度，即4圈。rand-(rand%60) 这个是让指针永远停在扇形中心的算法。n + 是为了重复点击的时候有足够的旋转角度。
    console.log(n % 360)
    count.value.isRotate = n
    isRote = true
    if (count.value.isRotate) {
        document.getElementById('rotate').style.transform = 'rotate(' + count.value.isRotate + 'deg)'
    }
}

</script>

<template>
    <div class='content' v-show="isShow">
        <canvas id='canvas-bg' class='canvasII' width="300" height="300"></canvas>
        <div class='canvasI' id='rotate'>
            <canvas id="canvas-one" class='canvasI' width="280" height="280"></canvas>
        </div>
        <img class='start' src='../../assets/1.png' id="start" @click="onchange" />
    </div>
</template>

<style>
.content {
    width: 310px;
    height: 310px;
    margin: 0 auto;
    margin-top: 100px;
    position: relative;
}

.canvasI {
    width: 270px;
    height: 270px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto auto;
    transition: all 3s ease;
}

.canvasII {
    width: 300px;
    height: 300px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;
}

.start {
    position: absolute;
    width: 70px;
    height: 70px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto auto;
}
</style>
