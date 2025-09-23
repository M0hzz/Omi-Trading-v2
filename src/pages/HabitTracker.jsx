import React, { useState, useEffect } from "react";
import { Habit } from "@/api/entities";
import { HabitEntry } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, Plus, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfWeek, addDays, subDays } from "date-fns";
import _ from 'lodash';

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
        Habit.filter({ is_active: true }, "-created_date"),
        HabitEntry.list("-created_date", 1000)
      ]);
      setHabits(habitsData);
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

    const newValue = habit.target_value;
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

        {/* Weekly Cards & Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400"/>
              This Week's Progress
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="bg-slate-800 border-slate-700" onClick={() => setCurrentWeekStart(subDays(currentWeekStart, 7))}>
                <ArrowLeft className="w-4 h-4"/>
              </Button>
               <Button size="icon" variant="outline" className="bg-slate-800 border-slate-700" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>
                <ArrowRight className="w-4 h-4"/>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <WeeklyProgressCards 
              weekDates={weekDates}
              habits={habits}
              habitEntries={habitEntries}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Lower Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <QuickActions habits={habits} onQuickLog={handleQuickLog} />
            <OverallProgress habits={habits} habitEntries={habitEntries} />
          </div>
          <div className="lg:col-span-2">
             <HabitVisualization habits={habits} habitEntries={habitEntries} />
          </div>
        </div>
      </div>
    </div>
  );
}