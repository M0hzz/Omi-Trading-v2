// src/api/services.js
// This file replaces your existing mockData.js
import { supabase } from '../lib/supabase'

// Generic CRUD operations for Supabase
const createCRUD = (tableName) => ({
  async list(orderBy = 'created_at', ascending = false, limit = null) {
    try {
      let query = supabase
        .from(tableName)
        .select('*')
      
      // Handle ordering - fix the syntax issue
      let orderField = orderBy
      let orderDirection = ascending
      
      // Handle "-created_at" format from your existing components
      if (orderField.startsWith('-')) {
        orderField = orderField.substring(1)
        orderDirection = false
      }
      
      // Apply ordering
      query = query.order(orderField, { ascending: orderDirection })

      // Apply limit if specified
      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query
      
      if (error) {
        console.error(`Error fetching ${tableName}:`, error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error(`CRUD list error for ${tableName}:`, error)
      throw error
    }
  },

  async create(itemData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from(tableName)
      .insert([{ ...itemData, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
})

// Export entities (same interface as your mockData.js)
export const MoodEntry = createCRUD('mood_entries')
export const MarketIntelligence = createCRUD('market_intelligence')
export const PsychologyPattern = createCRUD('psychology_patterns')
export const Habit = createCRUD('habits')
export const HabitEntry = createCRUD('habit_entries')

// AI Services
export const AIServices = {
  async chat(messages, context = null) {
    try {
      const systemPrompt = `You are an expert AI Trading Psychology Coach. You help traders understand their psychological patterns, manage stress, and optimize their mental performance.

${context ? `Context about the user: ${JSON.stringify(context)}` : ''}

Always provide practical, actionable advice. Be empathetic and supportive. Focus on psychological aspects of trading, stress management, and behavioral patterns.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('AI Chat Error:', error)
      return "I'm sorry, I'm having trouble connecting right now. Please try again later."
    }
  },

  async analyzeMoodPatterns(moodEntries) {
    if (!moodEntries || moodEntries.length === 0) {
      return {
        patterns: ['No mood data available'],
        triggers: [],
        recommendations: ['Start logging your mood regularly for better insights'],
        risks: []
      }
    }

    try {
      const analysis = moodEntries.map(entry => ({
        date: entry.created_at,
        mood: entry.mood_score,
        energy: entry.energy_level,
        stress: entry.stress_level,
        confidence: entry.trading_confidence,
        sentiment: entry.market_sentiment
      }))

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'user',
            content: `Analyze these mood and trading psychology patterns: ${JSON.stringify(analysis)}. 
            
Please identify:
1. Key patterns and trends
2. Potential psychological triggers  
3. Recommendations for improvement
4. Risk factors to watch

Format as JSON with: { "patterns": [], "triggers": [], "recommendations": [], "risks": [] }`
          }],
          max_tokens: 1500,
          temperature: 0.3
        })
      })

      const data = await response.json()
      return JSON.parse(data.choices[0].message.content)
    } catch (error) {
      console.error('Pattern Analysis Error:', error)
      return {
        patterns: ['Unable to analyze patterns at this time'],
        triggers: [],
        recommendations: ['Continue logging your mood data for better insights'],
        risks: []
      }
    }
  }
}

// Market Data Services
export const MarketServices = {
  async getMarketOverview() {
    if (!import.meta.env.VITE_ALPHA_VANTAGE_API_KEY) {
      console.warn('Alpha Vantage API key not configured')
      return []
    }

    try {
      const symbols = ['SPY', 'QQQ', 'VIX']
      const promises = symbols.map(symbol => 
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`)
          .then(res => res.json())
      )

      const results = await Promise.all(promises)
      return results.map((result, index) => ({
        symbol: symbols[index],
        data: result['Global Quote']
      }))
    } catch (error) {
      console.error('Market Data Error:', error)
      return []
    }
  },

  async getMarketNews(query = 'stock market trading', limit = 10) {
    if (!import.meta.env.VITE_NEWS_API_KEY) {
      console.warn('News API key not configured')
      return []
    }

    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()
      return data.articles || []
    } catch (error) {
      console.error('News API Error:', error)
      return []
    }
  }
}

// Authentication helpers
export const AuthService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Legacy exports for backward compatibility with your existing components
export const InvokeLLM = AIServices.chat
export const User = AuthService

// Utility to reset/seed data for development
export const devUtils = {
  async seedSampleData() {
    if (import.meta.env.NODE_ENV !== 'development') {
      console.warn('Sample data seeding only available in development')
      return
    }

    try {
      // Create sample mood entries
      const sampleMoods = [
        {
          mood_score: 7,
          energy_level: 6,
          stress_level: 4,
          trading_confidence: 8,
          market_sentiment: 'BULLISH',
          notes: 'Feeling optimistic about market outlook'
        },
        {
          mood_score: 5,
          energy_level: 5,
          stress_level: 6,
          trading_confidence: 5,
          market_sentiment: 'NEUTRAL',
          notes: 'Mixed feelings about current volatility'
        }
      ]

      for (const mood of sampleMoods) {
        await MoodEntry.create(mood)
      }

      // Create sample habits
      const sampleHabits = [
        {
          name: 'Morning Meditation',
          description: 'Start the day with mindfulness',
          category: 'mental',
          target_frequency: 'daily',
          target_value: 10,
          target_unit: 'minutes',
          is_active: true
        },
        {
          name: 'Market Analysis',
          description: 'Review market trends and news',
          category: 'trading',
          target_frequency: 'daily',
          target_value: 1,
          target_unit: 'session',
          is_active: true
        }
      ]

      for (const habit of sampleHabits) {
        await Habit.create(habit)
      }

      console.log('✅ Sample data seeded successfully!')
    } catch (error) {
      console.error('❌ Failed to seed sample data:', error)
    }
  }
}