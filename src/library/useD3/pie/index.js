import * as d3 from 'd3'

/**
 * 繪製圓餅圖
 * @param {Object} basic - 基本設定(必填)
 * @param {string} [basic.select] - css 選擇器
 * @param {number} [basic.width] - 寬
 * @param {number} [basic.height] - 高
 * @param {string} [basic.valueKey] - 數值鍵值
 * @param {string} [basic.labelKey] - 標籤鍵值
 *
 * @param {Object} advanced - 進階設定(有預設參數)
 * @param {Array} [advanced.radius] - 內/外圈半徑比例
 * @param {Function} [advanced.colorCb] - 顏色函式
 * @param {number} [advanced.duration] - 動畫時間
 * @param {boolean|null} [basic.isSortAsc] - 是否資料升冪排列
 * @param {Object} [advanced.arcStyle] - 圖形樣式
 * @param {Object} [advanced.arcAttr] - 圖形屬性
 * @param {string} [advanced.arcClass] - 圖形 class
 * @param {boolean|null} [advanced.isArcRotateForward] - 是否圖形正轉
 * @param {boolean} [advanced.isLabel] - 是否顯示標籤
 * @param {Object} [advanced.labelStyle] - 標籤樣式
 * @param {Object} [advanced.labelAttr] - 標籤屬性
 * @param {string} [advanced.labelClass] - 標籤 class
 * @param {Function} [advanced.labelCb] - 標籤內容函式
 * @param {boolean} [advanced.isTooltip] - 是否顯示提示框
 * @param {Object} [advanced.tooltipStyle] - 提示框樣式
 * @param {Object} [advanced.tooltipAttr] - 提示框屬性
 * @param {string} [advanced.tooltipClass] - 提示框 class
 * @param {Function} [advanced.tooltipCb] - 提示框內容函式
 * @param {string} [advanced.tooltipPosition] - 提示框預設位置
 *
 * @param {Array} data - 圖表資料
 */
const usePie = async ({
  basic: { select, width, height, valueKey, labelKey } = {},
  advanced: {
    radius = [0, 0.8],
    colorCb = d3.scaleOrdinal().range(d3.schemeSet3),
    duration = 500,
    isSortAsc = null,

    // 圖形相關
    arcStyle = {},
    arcAttr = {},
    arcClass = '',
    isArcRotateForward = true,

    // 標籤相關
    isLabel = true,
    labelStyle = {},
    labelAttr = {},
    labelClass = '',
    labelCb = d => `${d.data[labelKey]} ${d.percentage}%`,

    // tooltip
    isTooltip = true,
    tooltipStyle = {},
    tooltipAttr = {},
    tooltipClass = '',
    tooltipCb = d => `${d.data[labelKey]} ${d.data[valueKey]}`,
    tooltipPosition = 'right',
  } = {},
  data,
} = {}) => {
  if ([select, width, height, valueKey, labelKey, data].includes(undefined)) {
    const errorText = '未設定圖型基本資料'
    console.warn(errorText)
    throw new Error(errorText)
  }

  // 屬性/樣式設定工廠
  const selectionSettingFactory = ({ selection, key, config }) => {
    Object.entries(config).forEach(i => {
      selection[key](i[0], i[1])
    })
  }

  const shortSide = width < height ? width : height
  const innerRadius = (shortSide * radius[0]) / 2
  const outerRadius = (shortSide * radius[1]) / 2

  // 設定內/外圈半徑弧度
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).padAngle(0)

  // 調整標示位置
  const labelArc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius * 1.5)

  // 圖表資料處理函式
  const chartGenerator = d3
    .pie()
    .sort((a, b) => {
      if (isSortAsc === null) return null
      return isSortAsc ? a[valueKey] - b[valueKey] : b[valueKey] - a[valueKey]
    })
    .value(d => d[valueKey])

  // 圖表渲染資料
  const chartData = chartGenerator(data)

  // 計算百分比
  const total = d3.sum(chartData, d => d.value)
  chartData.forEach(i => {
    i.percentage = Math.round((i.value / total) * 100)
  })

  d3.select(select).style('position', 'relative')

  // 取得 svg
  let svg = d3.select(select).select('svg')
  if (svg.empty()) {
    svg = d3
      .select(select)
      .append('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height])
  }

  /** =========================
   * 處理圖形
   ========================= */
  // 移除舊圖表滑鼠互動事件
  d3.selectAll('.arc').on('mouseover', null).on('mouseleave', null)

  // 圓弧圖形父元素
  const arcGroup = svg.selectAll('.arcGroup').data(['']).join('g').attr('class', 'arcGroup')

  // 綁定圓弧圖形
  arcGroup
    .selectAll('path')
    .data(chartData)
    .join('path')
    .attr('d', arc)
    .attr('class', `arc ${arcClass}`)
    .attr('fill', colorCb)
    .attr('stroke', '#fff')
    .attr('stroke-width', '#2px')
    .transition()
    .duration(duration)
    .attrTween('d', d => {
      if (isArcRotateForward === null) return

      // 正轉
      const forwardRotation = () => {
        const i = d3.interpolate(d.startAngle, d.endAngle)
        return function turn(t) {
          d.endAngle = i(t)
          return arc(d)
        }
      }
      // 逆轉
      const reverseRotation = () => {
        const i = d3.interpolate(d.endAngle, d.startAngle)
        return function turn(t) {
          d.startAngle = i(t)
          return arc(d)
        }
      }

      return isArcRotateForward ? forwardRotation() : reverseRotation()
    })

  // 圓弧圖形套用參數設定
  const arcSelections = arcGroup.selectAll('.arc')
  selectionSettingFactory({ selection: arcSelections, key: 'style', config: arcStyle })
  selectionSettingFactory({ selection: arcSelections, key: 'attr', config: arcAttr })

  // 加入滑鼠互動
  setTimeout(() => {
    arcSelections
      .on('mouseover', d => {
        d3.select(d.target).transition().duration(300).style('transform', 'scale(1.04)')
      })
      .on('mouseleave', d => {
        d3.select(d.target).transition().duration(300).style('transform', 'scale(1)')
      })
  }, duration)

  /** =========================
   * 處理標籤
   ========================= */
  // 標籤父元素
  const labelGroup = svg
    .selectAll('.labelGroup')
    .data(isLabel ? [''] : [])
    .join('g')
    .attr('class', 'labelGroup')

  // 綁定標籤
  labelGroup
    .selectAll('text')
    .data(chartData)
    .join('text')
    .text(labelCb)
    .attr('opacity', 0)
    .attr('class', `label ${labelClass}`)
    .style('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('fill', 'black')
    .transition()
    .duration(duration)
    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
    .attr('opacity', 1)

  // 標籤套用參數設定
  const labelSelections = svg.selectAll('.label')
  selectionSettingFactory({ selection: labelSelections, key: 'style', config: labelStyle })
  selectionSettingFactory({ selection: labelSelections, key: 'attr', config: labelAttr })

  /** =========================
   * 處理提示框
   ========================= */
  const tooltip = d3
    .select(select)
    .selectAll('.tooltip')
    .data(isTooltip ? [''] : [])
    .join('div')
    .attr('class', `tooltip ${tooltipClass}`)
    .style('pointer-events', 'none')
    .style('position', 'absolute')
    .style('display', 'none')
    .style('left', 0)
    .style('top', 0)
    .style('background', '#fff')
    .style('padding', '4px')
    .style('font-size', '12px')
    .style('color', 'black')
    .style('border-radius', '4px')

  // 提示框位移
  arcSelections.on('mouseenter mousemove', (e, d) => {
    tooltip.html(tooltipCb(d)).style('display', 'block')

    const tooltipWidth = tooltip.node().offsetWidth
    const tooltipHeight = tooltip.node().offsetHeight
    const selectWidth = d3.select(select).node().getBoundingClientRect().width
    const selectHeight = d3.select(select).node().getBoundingClientRect().height
    let offsetX = e.offsetX
    let offsetY = e.offsetY

    switch (tooltipPosition) {
      case 'top': {
        offsetX = offsetX - tooltipWidth / 2
        offsetY = offsetY - tooltipHeight - 8
        break
      }
      case 'bottom': {
        offsetX = offsetX - tooltipWidth / 2
        offsetY = offsetY + 24
        break
      }
      case 'left': {
        offsetX = offsetX - tooltipWidth - 8
        offsetY = offsetY - tooltipHeight / 2
        break
      }
      case 'right': {
        offsetX = offsetX + 24
        offsetY = offsetY - tooltipHeight / 2
        break
      }
      default:
    }

    // 計算提示框的最大允許偏移量
    const maxOffsetX = selectWidth - tooltipWidth
    const maxOffsetY = selectHeight - tooltipHeight

    // 取得實際偏移值
    const rangeClamp = (value, min, max) => {
      if (min > max) throw new Error('偏移值 min 必須小於等於 max')
      if (value < min) return min
      else if (value > max) return max
      else return value
    }

    // 調整提示框位置
    const adjustedOffsetX = rangeClamp(offsetX, 0, maxOffsetX)
    const adjustedOffsetY = rangeClamp(offsetY, 0, maxOffsetY)

    tooltip.style('transform', `translate(${adjustedOffsetX}px, ${adjustedOffsetY}px)`)
  })

  arcSelections.on('mouseout', () => {
    tooltip.style('display', 'none')
  })

  // 提示框套用參數設定
  selectionSettingFactory({ selection: tooltip, key: 'style', config: tooltipStyle })
  selectionSettingFactory({ selection: tooltip, key: 'attr', config: tooltipAttr })

  return {
    d3,
    basic: {
      select,
      width,
      height,
      valueKey,
      labelKey,
    },
    advanced: {
      radius,
      colorCb,
      duration,
      isSortAsc,

      arcStyle,
      arcAttr,
      arcClass,
      isArcRotateForward,

      isLabel,
      labelStyle,
      labelAttr,
      labelClass,
      labelCb,

      isTooltip,
      tooltipStyle,
      tooltipAttr,
      tooltipClass,
      tooltipCb,
      tooltipPosition,
    },
    chart: {
      shortSide,
      innerRadius,
      outerRadius,
      arc,
      labelArc,
      chartData,

      svg,
      arcSelections,
      labelSelections,
      tooltip,
    },
  }
}

export default usePie
