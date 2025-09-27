// src/hooks/index.js
import { useState, useEffect, useCallback, useRef } from 'react'
import { AuthService, MoodEntry, Habit, HabitEntry, PsychologyPattern } from '../api/services'

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    AuthService.getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { user } = await AuthService.signIn(email, password)
    return user
  }, [])

  const signUp = useCallback(async (email, password, metadata) => {
    const { user } = await AuthService.signUp(email, password, metadata)
    return user
  }, [])

  const signOut = useCallback(async () => {
    await AuthService.signOut()
  }, [])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }
}

// Mood data management hook
export function useMoodData() {
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMoods = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MoodEntry.list('created_at', false, 50)
      setMoods(data)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load moods:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addMood = useCallback(async (moodData) => {
    try {
      const newMood = await MoodEntry.create(moodData)
      setMoods(prev => [newMood, ...prev])
      return newMood
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const updateMood = useCallback(async (id, updateData) => {
    try {
      const updatedMood = await MoodEntry.update(id, updateData)
      setMoods(prev => prev.map(mood => 
        mood.id === id ? updatedMood : mood
      ))
      return updatedMood
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const deleteMood = useCallback(async (id) => {
    try {
      await MoodEntry.delete(id)
      setMoods(prev => prev.filter(mood => mood.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  useEffect(() => {
    loadMoods()
  }, [loadMoods])

  // Computed values
  const stats = {
    total: moods.length,
    averageMood: moods.length > 0 
      ? moods.reduce((sum, mood) => sum + mood.mood_score, 0) / moods.length 
      : 0,
    averageStress: moods.length > 0 
      ? moods.reduce((sum, mood) => sum + mood.stress_level, 0) / moods.length 
      : 0,
    recentTrend: moods.length >= 14 ? (() => {
      const recent = moods.slice(0, 7)
      const older = moods.slice(7, 14)
      const recentAvg = recent.reduce((sum, mood) => sum + mood.mood_score, 0) / recent.length
      const olderAvg = older.reduce((sum, mood) => sum + mood.mood_score, 0) / older.length
      return recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable'
    })() : 'insufficient_data'
  }

  return {
    moods,
    loading,
    error,
    stats,
    addMood,
    updateMood,
    deleteMood,
    refreshMoods: loadMoods
  }
}

// Habit tracking hook
export function useHabits() {
  const [habits, setHabits] = useState([])
  const [habitEntries, setHabitEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [habitsData, entriesData] = await Promise.all([
        Habit.list('created_at', false),
        HabitEntry.list('created_at', false, 100)
      ])
      setHabits(habitsData.filter(habit => habit.is_active))
      setHabitEntries(entriesData)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load habits:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addHabit = useCallback(async (habitData) => {
    try {
      const newHabit = await Habit.create(habitData)
      setHabits(prev => [newHabit, ...prev])
      return newHabit
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const updateHabit = useCallback(async (id, updateData) => {
    try {
      const updatedHabit = await Habit.update(id, updateData)
      setHabits(prev => prev.map(habit => 
        habit.id === id ? updatedHabit : habit
      ))
      return updatedHabit
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const logHabitEntry = useCallback(async (habitId, entryData) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const existingEntry = habitEntries.find(
        entry => entry.habit_id === habitId && entry.date === today
      )

      let result
      if (existingEntry) {
        result = await HabitEntry.update(existingEntry.id, entryData)
        setHabitEntries(prev => prev.map(entry =>
          entry.id === existingEntry.id ? result : entry
        ))
      } else {
        result = await HabitEntry.create({
          habit_id: habitId,
          date: today,
          ...entryData
        })
        setHabitEntries(prev => [result, ...prev])
      }
      
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [habitEntries])

  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  // Helper function to get completion rate
  const getHabitCompletionRate = useCallback((habitId, days = 30) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const relevantEntries = habitEntries.filter(entry => 
      entry.habit_id === habitId && 
      new Date(entry.date) >= cutoffDate
    )
    
    const completedEntries = relevantEntries.filter(entry => entry.completed)
    return relevantEntries.length > 0 ? (completedEntries.length / relevantEntries.length) * 100 : 0
  }, [habitEntries])

  return {
    habits,
    habitEntries,
    loading,
    error,
    addHabit,
    updateHabit,
    logHabitEntry,
    getHabitCompletionRate,
    refreshHabits: loadHabits
  }
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const metricsRef = useRef(new Map())
  
  const trackEvent = useCallback((eventName, value = 1, tags = {}) => {
    const metric = {
      name: eventName,
      value,
      timestamp: Date.now(),
      tags: {
        ...tags,
        session_id: getSessionId(),
        user_agent: navigator.userAgent,
        url: window.location.href
      }
    }
    
    if (!metricsRef.current.has(eventName)) {
      metricsRef.current.set(eventName, [])
    }
    
    const metrics = metricsRef.current.get(eventName)
    metrics.push(metric)
    
    // Keep only last 100 metrics per event type
    if (metrics.length > 100) {
      metrics.shift()
    }
    
    // Send to analytics if configured
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        custom_parameter: value,
        ...tags
      })
    }
  }, [])

  const trackAPICall = useCallback(async (name, apiCall, tags = {}) => {
    const startTime = performance.now()
    let success = true
    let error = null
    
    try {
      const result = await apiCall()
      return result
    } catch (err) {
      success = false
      error = err.message
      throw err
    } finally {
      const duration = performance.now() - startTime
      trackEvent('api_call_duration', duration, {
        ...tags,
        api_name: name,
        success,
        error
      })
    }
  }, [trackEvent])

  const startTiming = useCallback((name) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}_start`)
    }
  }, [])

  const endTiming = useCallback((name, tags = {}) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}_end`)
      performance.measure(name, `${name}_start`, `${name}_end`)
      
      const entries = performance.getEntriesByName(name, 'measure')
      if (entries.length > 0) {
        trackEvent(name, entries[0].duration, tags)
      }
      
      // Clean up
      performance.clearMarks(`${name}_start`)
      performance.clearMarks(`${name}_end`)
      performance.clearMeasures(name)
    }
  }, [trackEvent])

  return { trackEvent, trackAPICall, startTiming, endTiming }
}

// Local storage hook with JSON serialization
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

// Debounced value hook
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(elementRef, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        ...options
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [elementRef, options])

  return isIntersecting
}

// Helper function to get or create session ID
function getSessionId() {
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}