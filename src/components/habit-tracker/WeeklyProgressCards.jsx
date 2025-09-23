import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

const DailyHabitCard = ({ date, habits, habitEntries }) => {
  const dayHabits = habits.filter(h => h.target_frequency === "daily");
  const completedCount = dayHabits.filter(habit => {
    const entry = habitEntries.find(e => 
      e.habit_id === habit.id && 
      e.date === format(date, 'yyyy-MM-dd') && 
      e.completed
    );
    return !!entry;
  }).length;
  
  const progress = dayHabits.length > 0 ? (completedCount / dayHabits.length) * 100 : 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700 flex-shrink-0 w-48 h-32 flex flex-col justify-between p-4">
      <div>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{format(date, 'EEEE')}</p>
        <p className="text-xs text-slate-500">{format(date, 'MMM dd')}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-white">{Math.round(progress)}%</p>
      </div>
    </Card>
  );
};

export default function WeeklyProgressCards({ weekDates, habits, habitEntries, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex space-x-4 overflow-hidden">
        {Array(7).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 w-48 bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-4 pb-4 overflow-x-auto">
      {weekDates.map(date => (
        <DailyHabitCard 
          key={date.toString()}
          date={date}
          habits={habits}
          habitEntries={habitEntries}
        />
      ))}
    </div>
  );
}