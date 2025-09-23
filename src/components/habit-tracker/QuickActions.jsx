import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Check } from "lucide-react";
import _ from 'lodash';

export default function QuickActions({ habits, onQuickLog }) {
  const [loggedHabits, setLoggedHabits] = useState([]);

  const handleLog = (habitId) => {
    onQuickLog(habitId);
    setLoggedHabits(prev => [...prev, habitId]);
    setTimeout(() => {
      setLoggedHabits(prev => prev.filter(id => id !== habitId));
    }, 2000);
  };

  const commonHabits = habits
    .filter(h => ["health", "mental", "physical", "trading"].includes(h.category))
    .slice(0, 6);

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {commonHabits.map(habit => (
            <Button
              key={habit.id}
              variant="outline"
              className={`justify-start text-left h-auto py-2 transition-all duration-300 ${
                loggedHabits.includes(habit.id) 
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => handleLog(habit.id)}
            >
              {loggedHabits.includes(habit.id) ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <div className="w-4 h-4 mr-2" /> 
              )}
              <span>{habit.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}