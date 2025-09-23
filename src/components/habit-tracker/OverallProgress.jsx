import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp } from "lucide-react";
import { startOfYear, startOfMonth, startOfWeek, endOfYear, endOfMonth, endOfWeek, eachDayOfInterval } from 'date-fns';

export default function OverallProgress({ habits, habitEntries }) {
  const calculateProgress = (startDate, endDate) => {
    const dailyHabits = habits.filter(h => h.target_frequency === 'daily');
    if (dailyHabits.length === 0) return 0;
    
    const intervalDays = eachDayOfInterval({ start: startDate, end: endDate });
    const totalPossibleCompletions = intervalDays.length * dailyHabits.length;
    
    const actualCompletions = habitEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.completed && entryDate >= startDate && entryDate <= endDate && dailyHabits.some(h => h.id === entry.habit_id);
    }).length;

    return totalPossibleCompletions > 0 ? (actualCompletions / totalPossibleCompletions) * 100 : 0;
  };
  
  const now = new Date();
  const yearProgress = calculateProgress(startOfYear(now), endOfYear(now));
  const monthProgress = calculateProgress(startOfMonth(now), endOfMonth(now));
  const weekProgress = calculateProgress(startOfWeek(now), endOfWeek(now));

  const progressData = [
    { label: "Year", value: yearProgress },
    { label: "Month", value: monthProgress },
    { label: "Week", value: weekProgress },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Overall Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {progressData.map(item => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className="text-sm font-medium text-white">{Math.round(item.value)}%</span>
            </div>
            <Progress value={item.value} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}