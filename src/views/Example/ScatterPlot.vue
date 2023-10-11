<script setup>
import * as d3 from 'd3'
import { onMounted } from 'vue'

defineOptions({
  name: 'ScatterPlot',
})

onMounted(() => {
  window.d3 = d3
  const currentWidth = parseInt(d3.select('.ScatterPlot').style('width'))
  const height = 400
  const margin = 100
  const getFakedata = () => {
    const fakedata = []
    const getAge = () => {
      return d3.scaleLinear().domain([0, 1]).range([18, 65])(d3.randomBates(3)())
    }
    const getIncome = (() => {
      const logN = d3.randomLogNormal(1, 1)
      const list = []
      for (let i = 1; i <= 100; i++) {
        list.push(logN())
      }
      const [min, max] = d3.extent(list)
      const linear = d3.scaleLinear().domain([min, max]).range([26000, 200000])
      return () => linear(logN())
    })()
    for (let i = 1; i <= 1000; i++) {
      fakedata.push({ age: getAge(), income: getIncome() })
    }
    return fakedata
  }
  const data = getFakedata()

  const svg = d3.select('.ScatterPlot').append('svg').attr('width', currentWidth).attr('height', height)

  // 建立x軸線
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map(i => i.age)))
    .range([0, currentWidth - margin * 2])
  const xAxisGenerator = d3.axisBottom(xScale)
  svg
    .append('g')
    .attr('transform', `translate(${margin},${height - margin / 2})`)
    .call(xAxisGenerator)

  // 建立y軸線
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map(i => i.income)))
    .range([height - margin, 0])
  const yAxisGenerator = d3.axisLeft(yScale).tickFormat(d => `$${d}`)
  svg
    .append('g')
    .attr('transform', `translate(${margin},${margin / 2})`)
    .call(yAxisGenerator)

  // 建立資料點
  svg
    .append('g')
    .selectAll('dot')
    .data(data)
    .join('circle')
    .attr('cx', d => xScale(d.age))
    .attr('cy', d => yScale(d.income))
    .attr('r', 1.5)
    .attr('transform', `translate(${margin},${margin / 2})`)
})

// 封裝todo:
// * 設定傳入:
//   * 選擇器
//   * 寬度
//   * 高度
//   * margin(上下左右)
//   * 資料點顏色函式
//   * data
//   * x軸資料 key
//   * y軸資料 key
//   * 座標軸format函式//
//   * 資料點半徑
// return
// * 圖表生成/更新函式
// * 圖表實體
//   * ...實體使用參數
</script>

<template>
  <div class="ScatterPlot"></div>
</template>

<style lang="scss" scoped>
.ScatterPlot {
  width: 100%;
}
</style>
