// src/api/mockData.js
// Replace Base44 entities with local data management

let mockDatabase = {
  moodEntries: [],
  marketIntelligence: [],
  psychologyPatterns: [],
  habits: [],
  habitEntries: []
};

// Generate some sample data
const generateSampleData = () => {
  // Sample mood entries
  mockDatabase.moodEntries = [
    {
      id: 1,
      mood_score: 7,
      energy_level: 6,
      stress_level: 4,
      trading_confidence: 8,
      market_sentiment: "BULLISH",
      created_date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 2,
      mood_score: 5,
      energy_level: 5,
      stress_level: 6,
      trading_confidence: 5,
      market_sentiment: "NEUTRAL",
      created_date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];

  // Sample market intelligence
  mockDatabase.marketIntelligence = [
    {
      id: 1,
      title: "Market Update",
      content: "Markets showing strong momentum",
      sentiment_score: 0.7,
      created_date: new Date().toISOString()
    }
  ];

  // Sample psychology patterns
  mockDatabase.psychologyPatterns = [
    {
      id: 1,
      pattern_type: "stress_trading",
      severity: "medium",
      confidence: 0.8,
      description: "Tendency to trade more when stressed",
      created_date: new Date().toISOString()
    }
  ];

  // Sample habits
  mockDatabase.habits = [
    {
      id: 1,
      name: "Morning Meditation",
      description: "Start the day with mindfulness",
      category: "mental",
      target_frequency: "daily",
      target_value: 10,
      target_unit: "minutes",
      is_active: true,
      created_date: new Date(Date.now() - 604800000).toISOString() // 1 week ago
    },
    {
      id: 2,
      name: "Market Analysis",
      description: "Review market trends and news",
      category: "trading",
      target_frequency: "daily",
      target_value: 1,
      target_unit: "session",
      is_active: true,
      created_date: new Date(Date.now() - 518400000).toISOString() // 6 days ago
    },
    {
      id: 3,
      name: "Physical Exercise",
      description: "Stay physically active",
      category: "physical",
      target_frequency: "daily",
      target_value: 30,
      target_unit: "minutes",
      is_active: true,
      created_date: new Date(Date.now() - 432000000).toISOString() // 5 days ago
    }
  ];

  // Sample habit entries
  mockDatabase.habitEntries = [
    {
      id: 1,
      habit_id: 1,
      date: new Date().toISOString().split('T')[0], // Today
      value: 10,
      completed: true,
      created_date: new Date().toISOString()
    },
    {
      id: 2,
      habit_id: 2,
      date: new Date().toISOString().split('T')[0], // Today
      value: 1,
      completed: true,
      created_date: new Date().toISOString()
    },
    {
      id: 3,
      habit_id: 1,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      value: 15,
      completed: true,
      created_date: new Date(Date.now() - 86400000).toISOString()
    }
  ];
};

// Initialize with sample data
generateSampleData();

// Generic CRUD operations
const createCRUD = (tableName) => ({
  async list(sortBy = "-created_date", limit = null) {
    let data = [...mockDatabase[tableName]];
    
    // Sort data
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      data.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    } else {
      data.sort((a, b) => new Date(a[sortBy]) - new Date(b[sortBy]));
    }
    
    // Apply limit
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return data;
  },

  async create(itemData) {
    const newItem = {
      ...itemData,
      id: Math.max(0, ...mockDatabase[tableName].map(item => item.id)) + 1,
      created_date: new Date().toISOString()
    };
    
    mockDatabase[tableName].push(newItem);
    return newItem;
  },

  async update(id, updateData) {
    const index = mockDatabase[tableName].findIndex(item => item.id === id);
    if (index !== -1) {
      mockDatabase[tableName][index] = {
        ...mockDatabase[tableName][index],
        ...updateData,
        updated_date: new Date().toISOString()
      };
      return mockDatabase[tableName][index];
    }
    throw new Error(`Item with id ${id} not found`);
  },

  async delete(id) {
    const index = mockDatabase[tableName].findIndex(item => item.id === id);
    if (index !== -1) {
      mockDatabase[tableName].splice(index, 1);
      return true;
    }
    throw new Error(`Item with id ${id} not found`);
  }
});

// Export entities that match your original Base44 structure
export const MoodEntry = createCRUD('moodEntries');
export const MarketIntelligence = createCRUD('marketIntelligence');
export const PsychologyPattern = createCRUD('psychologyPatterns');
export const Habit = createCRUD('habits');
export const HabitEntry = createCRUD('habitEntries');

// Mock AI integration (replace InvokeLLM)
export const InvokeLLM = async (prompt) => {
  // Simulate AI response delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock response based on the prompt
  if (prompt.toLowerCase().includes('mood') || prompt.toLowerCase().includes('stress')) {
    return "Based on your recent mood patterns, I notice you tend to have higher stress levels on weekdays. Consider implementing short meditation breaks during your trading sessions.";
  } else if (prompt.toLowerCase().includes('trading') || prompt.toLowerCase().includes('market')) {
    return "Your trading confidence appears to correlate with market sentiment. When the market is bullish, you show increased confidence. This is a normal pattern, but be mindful of overconfidence during strong market runs.";
  } else {
    return "I'm here to help you understand your psychological patterns and improve your trading mindset. Feel free to ask me about your mood trends, stress management, or trading psychology insights.";
  }
};

// Mock user authentication (replace User.auth)
export const User = {
  getCurrentUser: async () => ({
    id: 1,
    name: "Demo User",
    email: "demo@example.com"
  }),
  
  login: async (credentials) => {
    // Mock login - always succeeds
    return { success: true, user: { id: 1, name: "Demo User" } };
  },
  
  logout: async () => {
    return { success: true };
  }
};

// Utility to reset data (useful for demo)
export const resetMockData = () => {
  generateSampleData();
};