import { ref, computed } from 'vue'

const isDark = ref(false)

export const useTheme = () => {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  const themeClasses = computed(() => ({
    bgPrimary: isDark.value ? 'bg-[#0f0b1d]' : 'bg-white',
    bgSecondary: isDark.value ? 'bg-gray-800' : 'bg-gray-100',
    bgCard: isDark.value ? 'bg-gray-900' : 'bg-white',

    textPrimary: isDark.value ? 'text-white' : 'text-gray-900',
    textSecondary: isDark.value ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark.value ? 'text-gray-500' : 'text-gray-400',

    borderPrimary: isDark.value ? 'border-gray-700' : 'border-gray-200',
    borderSecondary: isDark.value ? 'border-gray-600' : 'border-gray-300',
  }))

  return {
    isDark,
    toggleTheme,
    initTheme,
    themeClasses,
  }
}
