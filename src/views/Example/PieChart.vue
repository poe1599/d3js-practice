<script setup>
import * as d3 from 'd3'
import { onMounted } from 'vue'

defineOptions({
  name: 'PieChart',
})

onMounted(() => {
  const currentWidth = parseInt(d3.select('.PieChart').style('width'))
  const height = 400
  const margin = 40
  const data = [
    { item: '交通', value: 3600 },
    { item: '房租', value: 5500 },
    { item: '日常用品', value: 1300 },
    { item: '吃飯', value: 5000 },
    { item: '衣服', value: 3600 },
    { item: '娛樂', value: 2000 },
    { item: '浪費', value: 450 },
  ]

  const svg = d3.select('.PieChart').append('svg').attr('width', currentWidth).attr('height', height)

  svg
    .append('g')
    .attr('class', 'slices')
    .attr('transform', `translate(${currentWidth / 2}, ${height / 2})`)

  const color = d3.scaleOrdinal().range(d3.schemeSet2)

  // 半徑
  const radius = Math.min(currentWidth, height) / 2 - margin

  // pieChart建立函式
  const pieChartGenerator = d3.pie().value(d => d.value)

  // 設定內/外圈半徑
  const arc = d3.arc().innerRadius(0).outerRadius(radius).padAngle(0)

  // 建構函式帶入資料
  const pieChartData = pieChartGenerator(data)

  // 建立pieChart
  const pieChart = svg.select('.slices').selectAll('path').data(pieChartData).enter()

  // 綁定圓弧路徑
  pieChart
    .append('path')
    .attr('d', arc)
    .attr('class', 'arc')
    .attr('fill', color)
    .attr('stroke', '#fff')
    .style('stroke-width', '3px')
    .style('opacity', 1)

  // 加上區塊標示
  // 計算百分比
  const total = d3.sum(data, d => d.value)
  data.forEach(i => {
    i.percentage = Math.round((i.value / total) * 100)
  })

  // 調整標示位置
  const textArc = d3
    .arc()
    .innerRadius(radius)
    .outerRadius(radius - 10)

  // 綁定標籤位置
  pieChart
    .append('text')
    .attr('transform', d => `translate(${textArc.centroid(d)})`)
    .text(d => `${d.data.item} ${d.data.percentage}%`)
    .style('text-anchor', 'middle')
    .style('font-size', 16)
    .style('fill', 'black')

  // 滑鼠互動
  d3.selectAll('.arc')
    .style('cursor', 'pointer')
    .on('mouseover', d => {
      d3.select(d.target)
        .transition()
        .duration(300)
        .style('filter', 'drop-shadow(2px 4px 6px black)')
        .style('transform', 'scale(1.1)')
    })
    .on('mouseleave', d => {
      d3.select(d.target)
        .transition()
        .duration(300)
        .style('filter', 'drop-shadow(0 0 0 black)')
        .style('transform', 'scale(1)')
    })
})

// 封裝todo:
// * 設定傳入:
//   * 選擇器
//   * 寬度
//   * 高度
//   * margin
//   * pie 之間間距寬度
//   * 色票/色票生成方式
//   * data
//   * 標籤 key
//   * 資料 key
//   * 預設是否顯示標籤
//   * 預設標籤形式
//   * 客製標籤模板
//   * mouseover 處理
//   * mouseleave 處理
//
// return
// * 圖表生成/更新函式
// * 圖表實體
//   * ...實體使用參數
</script>

<template>
  <div class="PieChart"></div>
</template>

<style lang="scss" scoped>
.PieChart {
  width: 100%;
}
</style>
