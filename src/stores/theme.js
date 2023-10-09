import { defineStore } from 'pinia'
import { usePrimeVue } from 'primevue/config'
import { onMounted, ref } from 'vue'

/**
 * 定義一個名為 useThemeStore 的狀態庫，該狀態庫包含了一些操作主題顏色的函數。
 * @returns {Object} 返回一個包含 theme、toggleTheme、initTheme 的對象。
 */
export const useThemeStore = defineStore(
  'themeControl',
  () => {
    /**
     * 生成一個媒體查詢對象，用於檢測當前使用者是否選擇深色模式。
     * @returns {MediaQueryList|null} 返回一個 MediaQueryList 物件或 null
     */
    const genDarkQuery = () => {
      try {
        return window.matchMedia('(prefers-color-scheme: dark)')
      } catch (error) {
        return null
      }
    }

    const theme = ref(genDarkQuery()?.matches ? 'dark' : 'light')
    const PrimeVue = usePrimeVue()

    /**
     * 切換主題模式。
     * 如果當前模式是淺色模式，則切換到深色模式，反之亦然。
     */
    const toggleTheme = () => {
      let newTheme = ''
      if (theme.value === 'light') newTheme = 'dark'
      else if (theme.value === 'dark') newTheme = 'light'
      theme.value = newTheme

      doChangeTheme()
    }

    /**
     * 更改文檔根元素的 data-theme 屬性，以應用當前選定的主題模式。
     */
    const doChangeTheme = () => {
      document.documentElement.setAttribute('data-theme', theme.value)

      doPrimeVueThemeChange()
    }

    /**
     * 更改PrimeVue主題色。
     */
    const doPrimeVueThemeChange = () => {
      // https://stackoverflow.com/questions/76037337/primevue-theme-change
      let oldTheme = ''
      if (theme.value === 'light') oldTheme = 'dark'
      else if (theme.value === 'dark') oldTheme = 'light'

      PrimeVue.changeTheme(oldTheme, theme.value, 'id-to-link', () => {})
    }

    /**
     * 初始化主題模式。
     * 在元素掛載後，設置當前選定的主題模式。
     */
    const initTheme = () => {
      onMounted(() => {
        doChangeTheme()
      })
    }

    return { theme, toggleTheme, initTheme }
  },
  { persist: true },
)
