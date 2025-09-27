// src/utils/index.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind CSS class merger
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export const dateUtils = {
  formatDate(date, format = 'short') {
    if (!date) return ''
    
    const d = new Date(date)
    const options = {
      short: { month: 'short', day: 'numeric' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      datetime: { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      }
    }
    
    return d.toLocaleDateString('en-US', options[format])
  },

  timeAgo(date) {
    if (!date) return ''
    
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now - past) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return this.formatDate(date, 'medium')
  },

  isToday(date) {
    if (!date) return false
    const today = new Date()
    const checkDate = new Date(date)
    return today.toDateString() === checkDate.toDateString()
  },

  isThisWeek(date) {
    if (!date) return false
    const today = new Date()
    const checkDate = new Date(date)
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    return checkDate >= startOfWeek && checkDate <= endOfWeek
  },

  getDaysInRange(startDate, endDate) {
    const days = []
    const currentDate = new Date(startDate)
    const end = new Date(endDate)
    
    while (currentDate <= end) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }
}

// Number formatting utilities
export const numberUtils = {
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  },

  formatPercentage(value, decimals = 2) {
    return `${(value * 100).toFixed(decimals)}%`
  },

  formatNumber(value, decimals = 2) {
    if (value === null || value === undefined) return '—'
    return Number(value).toFixed(decimals)
  },

  abbreviateNumber(value) {
    if (value === null || value === undefined) return '—'
    
    const num = Number(value)
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toString()
  },

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  },

  roundToNearest(value, nearest = 1) {
    return Math.round(value / nearest) * nearest
  }
}

// String utilities
export const stringUtils = {
  capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  truncate(str, length = 100, suffix = '...') {
    if (!str || str.length <= length) return str
    return str.slice(0, length) + suffix
  },

  slugify(str) {
    if (!str) return ''
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  extractInitials(name) {
    if (!name) return ''
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  },

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },

  generateId(length = 8) {
    return Math.random().toString(36).substr(2, length)
  }
}

// Array utilities
export const arrayUtils = {
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key]
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {})
  },

  sortBy(array, key, direction = 'asc') {
    return [...array].sort((a, b) => {
      const aVal = key.split('.').reduce((obj, k) => obj?.[k], a)
      const bVal = key.split('.').reduce((obj, k) => obj?.[k], b)
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  },

  unique(array, key) {
    if (!key) return [...new Set(array)]
    
    const seen = new Set()
    return array.filter(item => {
      const val = key.split('.').reduce((obj, k) => obj?.[k], item)
      if (seen.has(val)) return false
      seen.add(val)
      return true
    })
  },

  chunk(array, size) {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },

  shuffle(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

// Color utilities
export const colorUtils = {
  getMoodColor(score) {
    if (score >= 8) return 'text-green-500'
    if (score >= 6) return 'text-yellow-500'
    if (score >= 4) return 'text-orange-500'
    return 'text-red-500'
  },

  getMoodBgColor(score) {
    if (score >= 8) return 'bg-green-500/20'
    if (score >= 6) return 'bg-yellow-500/20'
    if (score >= 4) return 'bg-orange-500/20'
    return 'bg-red-500/20'
  },

  getStressColor(level) {
    if (level <= 3) return 'text-green-500'
    if (level <= 5) return 'text-yellow-500'
    if (level <= 7) return 'text-orange-500'
    return 'text-red-500'
  },

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },

  rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }).join("")
  }
}

// Validation utilities
export const validationUtils = {
  validateMoodEntry(data) {
    const errors = {}
    
    if (!data.mood_score || data.mood_score < 1 || data.mood_score > 10) {
      errors.mood_score = 'Mood score must be between 1 and 10'
    }
    
    if (!data.energy_level || data.energy_level < 1 || data.energy_level > 10) {
      errors.energy_level = 'Energy level must be between 1 and 10'
    }
    
    if (!data.stress_level || data.stress_level < 1 || data.stress_level > 10) {
      errors.stress_level = 'Stress level must be between 1 and 10'
    }
    
    if (!data.trading_confidence || data.trading_confidence < 1 || data.trading_confidence > 10) {
      errors.trading_confidence = 'Trading confidence must be between 1 and 10'
    }
    
    const validSentiments = ['BEARISH', 'NEUTRAL', 'BULLISH']
    if (!validSentiments.includes(data.market_sentiment)) {
      errors.market_sentiment = 'Invalid market sentiment'
    }
    
    if (data.notes && data.notes.length > 1000) {
      errors.notes = 'Notes must be less than 1000 characters'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  validateHabit(data) {
    const errors = {}
    
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Habit name is required'
    }
    
    if (data.name && data.name.length > 100) {
      errors.name = 'Habit name must be less than 100 characters'
    }
    
    if (!data.category) {
      errors.category = 'Category is required'
    }
    
    const validFrequencies = ['daily', 'weekly', 'monthly']
    if (!validFrequencies.includes(data.target_frequency)) {
      errors.target_frequency = 'Invalid target frequency'
    }
    
    if (!data.target_value || data.target_value < 1) {
      errors.target_value = 'Target value must be at least 1'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  sanitizeInput(input) {
    if (typeof input !== 'string') return input
    
    return input
      .trim()
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
  }
}

// Storage utilities
export const storageUtils = {
  set(key, value, expiry = null) {
    try {
      const item = {
        value,
        expiry: expiry ? Date.now() + expiry : null
      }
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const parsed = JSON.parse(item)
      
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key)
        return null
      }
      
      return parsed.value
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  },

  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }
}

// Async utilities
export const asyncUtils = {
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  timeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), ms)
      )
    ])
  },

  retry(fn, attempts = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
      const attempt = (n) => {
        fn()
          .then(resolve)
          .catch((error) => {
            if (n === 1) {
              reject(error)
            } else {
              setTimeout(() => attempt(n - 1), delay)
            }
          })
      }
      attempt(attempts)
    })
  }
}

// Browser utilities
export const browserUtils = {
  copyToClipboard(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return Promise.resolve()
    }
  },

  downloadAsFile(content, filename, contentType = 'text/plain') {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    }
  },

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  },

  isAndroid() {
    return /Android/.test(navigator.userAgent)
  }
}

// Chart utilities for data visualization
export const chartUtils = {
  prepareMoodChartData(moodEntries) {
    return moodEntries
      .slice(-30) // Last 30 entries
      .reverse()
      .map(entry => ({
        date: dateUtils.formatDate(entry.created_at, 'short'),
        mood: entry.mood_score,
        energy: entry.energy_level,
        stress: entry.stress_level,
        confidence: entry.trading_confidence,
        timestamp: entry.created_at
      }))
  },

  prepareHabitChartData(habits, entries) {
    return habits.map(habit => {
      const habitEntries = entries.filter(entry => entry.habit_id === habit.id)
      const last7Days = dateUtils.getDaysInRange(
        new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        new Date()
      )
      
      const dailyData = last7Days.map(date => {
        const dateStr = date.toISOString().split('T')[0]
        const entry = habitEntries.find(e => e.date === dateStr)
        return {
          date: dateUtils.formatDate(date, 'short'),
          completed: entry ? (entry.completed ? 1 : 0) : 0,
          value: entry ? entry.value : 0
        }
      })
      
      return {
        habit: habit.name,
        data: dailyData,
        completionRate: habitEntries.filter(e => e.completed).length / Math.max(habitEntries.length, 1) * 100
      }
    })
  },

  calculateMovingAverage(data, window = 7) {
    const result = []
    for (let i = window - 1; i < data.length; i++) {
      const sum = data.slice(i - window + 1, i + 1).reduce((acc, val) => acc + val, 0)
      result.push(sum / window)
    }
    return result
  },

  calculateTrend(data) {
    if (data.length < 2) return 0
    
    const n = data.length
    const sumX = (n * (n - 1)) / 2
    const sumY = data.reduce((sum, val) => sum + val, 0)
    const sumXY = data.reduce((sum, val, index) => sum + (index * val), 0)
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    return slope
  }
}

// Navigation utilities
export const navigationUtils = {
  createPageUrl(pageName) {
    if (!pageName) return '/'
    
    // Convert page names to URLs based on your actual routes
    const urlMap = {
      'Dashboard': '/',
      'MoodTracking': '/MoodTracking',  // Updated to match your actual routes
      'AICoach': '/AICoach',
      'HabitTracker': '/HabitTracker', 
      'PsychologyPatterns': '/PsychologyPatterns',
      'MarketIntelligence': '/MarketIntelligence'
    }
    
    return urlMap[pageName] || `/${pageName}`
  },

  getPageNameFromUrl(url) {
    if (!url || url === '/') return 'Dashboard'
    
    const pathMap = {
      '/MoodTracking': 'MoodTracking',
      '/AICoach': 'AICoach',
      '/HabitTracker': 'HabitTracker', 
      '/PsychologyPatterns': 'PsychologyPatterns',
      '/MarketIntelligence': 'MarketIntelligence'
    }
    
    return pathMap[url] || 'Dashboard'
  },

  isActivePage(currentPage, targetPage) {
    return currentPage === targetPage
  }
}

// Export createPageUrl for backward compatibility
export const createPageUrl = navigationUtils.createPageUrl

// All utilities are already exported above with individual export const statements
// No need for additional export block