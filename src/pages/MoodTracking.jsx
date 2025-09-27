// src/pages/MoodTracking.jsx
import React, { useState, useEffect } from "react";
import { MoodEntry } from "../api/services";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, PlusCircle, CheckCircle, Edit, Trash2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simple MoodHistory component built-in to avoid import issues
const SimpleMoodHistory = ({ entries = [], onEdit, onDelete }) => {
  console.log('📋 SimpleMoodHistory entries:', entries);
  
  if (!entries || entries.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto text-slate-500 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Mood Entries</h3>
          <p className="text-slate-400">Your mood history will appear here once you start logging entries.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">
        Mood History ({entries.length} entries)
      </h2>
      
      {entries.map((entry, index) => (
        <Card 
          key={entry.id || index} 
          className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-colors"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white text-lg">
                  Entry #{entry.id?.toString().slice(-8) || index + 1}
                </CardTitle>
                <p className="text-slate-400 text-sm">
                  {entry.created_at ? new Date(entry.created_at).toLocaleString() : 'No date'}
                </p>
              </div>
              
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    onClick={() => onEdit(entry)}
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={() => onDelete(entry.id)}
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Mood Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                  (entry.mood_score || 0) >= 8 ? 'text-green-500 bg-green-500/20' :
                  (entry.mood_score || 0) >= 6 ? 'text-yellow-500 bg-yellow-500/20' :
                  (entry.mood_score || 0) >= 4 ? 'text-orange-500 bg-orange-500/20' :
                  'text-red-500 bg-red-500/20'
                }`}>
                  {entry.mood_score || '?'}
                </div>
                <p className="text-slate-400 text-sm mt-1">Mood</p>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                  (entry.energy_level || 0) >= 8 ? 'text-green-500 bg-green-500/20' :
                  (entry.energy_level || 0) >= 6 ? 'text-yellow-500 bg-yellow-500/20' :
                  (entry.energy_level || 0) >= 4 ? 'text-orange-500 bg-orange-500/20' :
                  'text-red-500 bg-red-500/20'
                }`}>
                  {entry.energy_level || '?'}
                </div>
                <p className="text-slate-400 text-sm mt-1">Energy</p>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                  (entry.stress_level || 0) <= 3 ? 'text-green-500 bg-green-500/20' :
                  (entry.stress_level || 0) <= 5 ? 'text-yellow-500 bg-yellow-500/20' :
                  (entry.stress_level || 0) <= 7 ? 'text-orange-500 bg-orange-500/20' :
                  'text-red-500 bg-red-500/20'
                }`}>
                  {entry.stress_level || '?'}
                </div>
                <p className="text-slate-400 text-sm mt-1">Stress</p>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                  (entry.trading_confidence || 0) >= 8 ? 'text-green-500 bg-green-500/20' :
                  (entry.trading_confidence || 0) >= 6 ? 'text-yellow-500 bg-yellow-500/20' :
                  (entry.trading_confidence || 0) >= 4 ? 'text-orange-500 bg-orange-500/20' :
                  'text-red-500 bg-red-500/20'
                }`}>
                  {entry.trading_confidence || '?'}
                </div>
                <p className="text-slate-400 text-sm mt-1">Confidence</p>
              </div>
            </div>
            
            {/* Market Sentiment */}
            {entry.market_sentiment && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Market Sentiment:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  entry.market_sentiment === 'BULLISH' ? 'bg-green-500/20 text-green-400' :
                  entry.market_sentiment === 'BEARISH' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {entry.market_sentiment}
                </span>
              </div>
            )}
            
            {/* Notes */}
            {entry.notes && (
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {entry.notes}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Simple MoodForm component built-in to avoid import issues
const SimpleMoodForm = ({ entry, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    mood_score: 5,
    energy_level: 5,
    stress_level: 5,
    trading_confidence: 5,
    market_sentiment: 'NEUTRAL',
    notes: ''
  });

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    }
  }, [entry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-8">
      <CardHeader>
        <CardTitle className="text-white">
          {entry ? 'Edit Mood Entry' : 'New Mood Entry'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Score */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Mood Score: {formData.mood_score}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood_score}
              onChange={(e) => handleSliderChange('mood_score', e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Energy Level: {formData.energy_level}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.energy_level}
              onChange={(e) => handleSliderChange('energy_level', e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Stress Level: {formData.stress_level}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.stress_level}
              onChange={(e) => handleSliderChange('stress_level', e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Trading Confidence */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Trading Confidence: {formData.trading_confidence}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.trading_confidence}
              onChange={(e) => handleSliderChange('trading_confidence', e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Market Sentiment */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Market Sentiment
            </label>
            <select
              value={formData.market_sentiment}
              onChange={(e) => setFormData(prev => ({ ...prev, market_sentiment: e.target.value }))}
              className="w-full p-2 bg-slate-800 border border-slate-600 text-white rounded-md"
            >
              <option value="BEARISH">Bearish</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="BULLISH">Bullish</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How are you feeling? Any thoughts about the market or your trading?"
              className="w-full p-3 bg-slate-800 border border-slate-600 text-white rounded-md h-24 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              {entry ? 'Update Entry' : 'Save Entry'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Main MoodTracking component
export default function MoodTrackingPage() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMoodEntries();
  }, []);

  const loadMoodEntries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Loading mood entries...');
      
      // Use the simple list method with proper parameters
      const entries = await MoodEntry.list('created_at', false, 50);
      
      console.log('✅ Loaded entries:', entries);
      
      // DEBUG: Let's see the exact data structure
      if (entries.length > 0) {
        console.log('🔍 First entry details:', JSON.stringify(entries[0], null, 2));
        console.log('📅 created_at value:', entries[0].created_at);
        console.log('📅 created_at type:', typeof entries[0].created_at);
      }
      
      setMoodEntries(entries);
      
    } catch (error) {
      console.error("❌ Error loading mood entries:", error);
      setError(error.message || 'Failed to load mood entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      console.log('📝 Submitting mood entry:', data);
      
      if (editingEntry) {
        // Update existing entry
        const updatedEntry = await MoodEntry.update(editingEntry.id, data);
        setMoodEntries(prev => 
          prev.map(entry => entry.id === editingEntry.id ? updatedEntry : entry)
        );
        console.log('✅ Updated mood entry:', updatedEntry);
      } else {
        // Create new entry
        const newEntry = await MoodEntry.create(data);
        setMoodEntries(prev => [newEntry, ...prev]);
        console.log('✅ Created mood entry:', newEntry);
      }
      
      // Reset form state
      setEditingEntry(null);
      setShowForm(false);
      setError(null);
      
    } catch (error) {
      console.error('❌ Error submitting mood entry:', error);
      setError(error.message || 'Failed to save mood entry');
    }
  };

  const handleEdit = (entry) => {
    console.log('✏️ Editing entry:', entry);
    setEditingEntry(entry);
    setShowForm(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this mood entry?')) {
      return;
    }
    
    try {
      console.log('🗑️ Deleting entry:', id);
      await MoodEntry.delete(id);
      setMoodEntries(prev => prev.filter(entry => entry.id !== id));
      console.log('✅ Deleted mood entry');
      setError(null);
    } catch (error) {
      console.error('❌ Error deleting mood entry:', error);
      setError(error.message || 'Failed to delete mood entry');
    }
  };

  const handleCancel = () => {
    setEditingEntry(null);
    setShowForm(false);
    setError(null);
  };

  // Quick mood logging function
  const handleQuickMoodLog = async (moodScore) => {
    try {
      const quickMoodData = {
        mood_score: moodScore,
        energy_level: 5, // Default
        stress_level: 5, // Default
        trading_confidence: 5, // Default
        market_sentiment: 'NEUTRAL',
        notes: `Quick mood log: ${moodScore}/10`
      };
      
      const newEntry = await MoodEntry.create(quickMoodData);
      setMoodEntries(prev => [newEntry, ...prev]);
      console.log('✅ Quick mood logged:', newEntry);
      
    } catch (error) {
      console.error('❌ Error with quick mood log:', error);
      setError(error.message || 'Failed to log quick mood');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mood Tracking</h1>
              <p className="text-slate-400">Log and analyze your psychological state over time</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {showForm ? 'Cancel' : 'New Entry'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">❌ {error}</p>
            <Button 
              onClick={() => setError(null)} 
              variant="outline" 
              size="sm" 
              className="mt-2 text-red-400 border-red-500/30 hover:bg-red-500/10"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Quick Mood Buttons */}
        <Card className="mb-6 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3">Quick Mood Log</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                <Button
                  key={score}
                  onClick={() => handleQuickMoodLog(score)}
                  variant="outline"
                  size="sm"
                  className={`
                    ${score <= 3 ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : ''}
                    ${score >= 4 && score <= 6 ? 'border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10' : ''}
                    ${score >= 7 ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' : ''}
                  `}
                >
                  {score}
                </Button>
              ))}
            </div>
            <p className="text-slate-500 text-sm mt-2">Click a number to quickly log your mood (1=very bad, 10=excellent)</p>
          </CardContent>
        </Card>

        {/* Mood Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <SimpleMoodForm
                entry={editingEntry}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading your mood entries...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && moodEntries.length === 0 && !error && (
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Mood Entries Yet</h3>
              <p className="text-slate-400 mb-6">Start tracking your psychological state to gain insights into your trading performance</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Log Your First Mood
                </Button>
                <div className="text-slate-500 text-sm">
                  or use the quick mood buttons above
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mood History */}
        {!isLoading && moodEntries.length > 0 && (
          <SimpleMoodHistory 
            entries={moodEntries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Stats Summary */}
        {!isLoading && moodEntries.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="text-slate-400 text-sm">Total Entries</h4>
                <p className="text-2xl font-bold text-white">{moodEntries.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="text-slate-400 text-sm">Average Mood</h4>
                <p className="text-2xl font-bold text-white">
                  {moodEntries.length > 0 
                    ? (moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length).toFixed(1)
                    : '0.0'
                  }/10
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="text-slate-400 text-sm">Average Stress</h4>
                <p className="text-2xl font-bold text-white">
                  {moodEntries.length > 0 
                    ? (moodEntries.reduce((sum, entry) => sum + entry.stress_level, 0) / moodEntries.length).toFixed(1)
                    : '0.0'
                  }/10
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="text-slate-400 text-sm">Trading Confidence</h4>
                <p className="text-2xl font-bold text-white">
                  {moodEntries.length > 0 
                    ? (moodEntries.reduce((sum, entry) => sum + entry.trading_confidence, 0) / moodEntries.length).toFixed(1)
                    : '0.0'
                  }/10
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}