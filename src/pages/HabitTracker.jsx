// Replace the content of src/pages/HabitTracker.jsx with this:

import React, { useState, useEffect } from "react";
import { Habit, HabitEntry } from "@/api/services"; // Changed from @/api/entities
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, Plus, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfWeek, addDays, subDays } from "date-fns";

import HabitForm from "../components/habit-tracker/HabitForm";
import WeeklyProgressCards from "../components/habit-tracker/WeeklyProgressCards";
import QuickActions from "../components/habit-tracker/QuickActions";
import HabitVisualization from "../components/habit-tracker/HabitVisualization";
import OverallProgress from "../components/habit-tracker/OverallProgress";

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState([]);
  const [habitEntries, setHabitEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  useEffect(() => {
    loadHabitsAndEntries();
  }, []);

  const loadHabitsAndEntries = async () => {
    setIsLoading(true);
    try {
      const [habitsData, entriesData] = await Promise.all([
        Habit.list("-created_date"), // Updated to use mock data method
        HabitEntry.list("-created_date", 1000)
      ]);
      
      // Filter active habits (since mock data doesn't have complex filtering)
      const activeHabits = habitsData.filter(habit => habit.is_active !== false);
      
      setHabits(activeHabits);
      setHabitEntries(entriesData);
    } catch (error) {
      console.error("Error loading habits:", error);
    }
    setIsLoading(false);
  };

  const handleHabitSubmit = async (data) => {
    if (editingHabit) {
      await Habit.update(editingHabit.id, data);
    } else {
      await Habit.create(data);
    }
    await loadHabitsAndEntries();
    setEditingHabit(null);
    setShowForm(false);
  };

  const handleQuickLog = async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const existingEntry = habitEntries.find(
      e => e.habit_id === habitId && e.date === dateStr
    );

    const newValue = habit.target_value || 1;
    const completed = true;

    if (existingEntry) {
      if (!existingEntry.completed) {
         await HabitEntry.update(existingEntry.id, { value: newValue, completed });
      }
    } else {
      await HabitEntry.create({
        habit_id: habitId,
        date: dateStr,
        value: newValue,
        completed
      });
    }
    
    await loadHabitsAndEntries();
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Habit Tracker</h1>
              <p className="text-slate-400">Build consistent habits for peak performance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Button 
              onClick={() => setShowForm(!showForm)} 
              variant="outline"
              className="bg-transparent text-white border-blue-500 hover:bg-blue-500/10 hover:text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Habit
            </Button>
          </div>
        </div>

        {/* Habit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <HabitForm
                habit={editingHabit}
                onSubmit={handleHabitSubmit}
                onCancel={() => { setShowForm(false); setEditingHabit(null); }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weekly Navigation */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Week of {format(currentWeekStart, 'MMM d, yyyy')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeekStart(subDays(currentWeekStart, 7))}
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeekStart(startOfWeek(new Date()))}
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          {habits.length > 0 && (
            <QuickActions habits={habits} onQuickLog={handleQuickLog} />
          )}
          
          {/* Overall Progress - only show if we have habits */}
          {habits.length > 0 && (
            <div className="lg:col-span-2">
              <OverallProgress habits={habits} habitEntries={habitEntries} />
            </div>
          )}
        </div>

        {/* Weekly Progress Cards */}
        {habits.length > 0 ? (
          <WeeklyProgressCards 
            habits={habits} 
            habitEntries={habitEntries}
            weekDates={weekDates}
            onQuickLog={handleQuickLog}
          />
        ) : (
          !isLoading && (
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 mx-auto text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Habits Yet</h3>
                <p className="text-slate-400 mb-6">Create your first habit to start building consistency</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Habit
                </Button>
              </CardContent>
            </Card>
          )
        )}

        {/* Habit Visualization */}
        {habits.length > 0 && (
          <div className="mt-8">
            <HabitVisualization habits={habits} habitEntries={habitEntries} />
          </div>
        )}
      </div>
    </div>
  );
}