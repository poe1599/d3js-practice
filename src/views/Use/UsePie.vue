<script setup>
import { onMounted, reactive } from 'vue'
import { usePie } from '@/library/useD3/index'

defineOptions({
  name: 'UsePie',
})

const data = reactive([
  { name: '食', cost: 5000 },
  { name: '衣', cost: 2000 },
  { name: '住', cost: 5500 },
  { name: '行', cost: 500 },
  { name: '育', cost: 1000 },
  { name: '樂', cost: 6000 },
])

const option = reactive({ name: '', cost: 0 })

const clickRemove = item => {
  const index = data.findIndex(i => i.name === item.name)
  data.splice(index, 1)
}

const clickAdd = () => {
  if (option.name === '') {
    alert('未輸入項目名稱')
    return
  }

  if (data.some(i => i.name === option.name)) {
    alert('項目名稱重複')
    return
  }

  data.push(JSON.parse(JSON.stringify(option)))
  clickClear()
}

const clickClear = () => {
  option.name = ''
  option.cost = 0
}

const clickDraw = () => {
  clickClear()
  drawChart()
}

// 繪製圖表
const drawChart = () => {
  usePie({
    // 基本設定
    basic: {
      select: '.pie',
      width: 400,
      height: 400,
      valueKey: 'cost',
      labelKey: 'name',
    },
    // 進階設定
    advanced: {
      // radius: [0, 0.8],
      // colorCb: d => [][d.index],
      // duration: 500,
      // isSortAsc: null,
      // // 圖形相關
      // arcStyle: {},
      // arcAttr: {},
      // arcClass: '',
      // isArcRotateForward: true,
      // // 標籤相關
      // isLabel: true,
      // labelStyle: {},
      // labelAttr: {},
      // labelClass: '',
      // labelCb: d => `${d.data['cost']} ${d.percentage}%`,
      // // tooltip
      // isTooltip: true,
      // tooltipStyle: {},
      // tooltipAttr: {},
      // tooltipClass: '',
      // tooltipCb: d => `${d.data['cost']} ${d.data['name']}`,
      // tooltipPosition: 'right',
    },
    data,
  }).then(res => {
    // 客製化處理
    console.log(res)
  })
}

onMounted(() => {
  drawChart()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <div>
        <div v-for="item in data" :key="item.name" class="m-1 flex justify-between max-w-[400px]">
          <span class="inline-block w-32 mr-4">{{ item.name }}</span>
          <input v-model="item.cost" class="inline-block w-48 border-2 p-1 text-right" type="number" step="500" />
          <button class="text-white bg-gray-500 m-1 px-2 rounded" @click="clickRemove(item)">Remove</button>
        </div>
      </div>
      <div class="m-1 flex justify-between max-w-[320px]">
        <input v-model="option.name" class="inline-block m-1 border-2 p-1" placeholder="項目" type="text" />
        <input
          v-model="option.cost"
          class="inline-block m-1 w-48 border-2 p-1 text-right"
          placeholder="花費"
          type="number"
          step="500"
        />
        <button class="text-white bg-lime-500 m-1 px-2 rounded" @click="clickAdd">Add</button>
        <button class="text-white bg-orange-500 m-1 px-2 rounded" @click="clickClear">Clear</button>
        <button class="text-white bg-blue-500 m-1 px-2 rounded" @click="clickDraw">Draw</button>
      </div>
    </div>
  </div>
  <div class="pie max-w-[400px] border-2"></div>
</template>

<style lang="scss" scoped></style>
<style lang="css"></style>
