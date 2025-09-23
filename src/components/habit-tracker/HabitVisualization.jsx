import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Target } from "lucide-react";

export default function HabitVisualization({ habits, habitEntries }) {
  const getChartData = () => {
    const dailyHabits = habits.filter(h => h.target_frequency === 'daily');
    if (dailyHabits.length === 0) return [];
    
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    });

    return last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const completedCount = dailyHabits.filter(habit => {
        return habitEntries.some(entry => 
          entry.habit_id === habit.id && 
          entry.date === dateStr && 
          entry.completed
        );
      }).length;
      
      const progress = (completedCount / dailyHabits.length) * 100;
      
      return {
        date: format(date, 'MMM dd'),
        progress: Math.round(progress)
      };
    });
  };

  const chartData = getChartData();

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Habit Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[24.5rem]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px'
              }} 
              labelStyle={{ color: '#cbd5e1' }}
              itemStyle={{ color: '#60a5fa' }}
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
            />
            <Bar dataKey="progress" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}