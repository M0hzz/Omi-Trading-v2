import React, { useState } from 'react';
import { MoodEntry } from "@/api/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, CheckCircle } from "lucide-react";

export default function QuickMoodLogger({ onMoodLogged }) {
  const [isLogging, setIsLogging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quickMood, setQuickMood] = useState({
    mood_score: 5,
    energy_level: 5,
    stress_level: 5,
    trading_confidence: 5,
    market_sentiment: "NEUTRAL"
  });

  const handleQuickLog = async () => {
    setIsLogging(true);
    try {
      await MoodEntry.create(quickMood);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onMoodLogged();
      }, 2000);
    } catch (error) {
      console.error("Error logging mood:", error);
    }
    setIsLogging(false);
  };

  if (showSuccess) {
    return (
      <Card className="bg-green-900/20 border-green-500/30">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">Mood Logged!</h3>
          <p className="text-green-400 text-sm">Your psychological state has been recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Quick Mood Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Mood</label>
            <Select
              value={quickMood.mood_score.toString()}
              onValueChange={(value) => setQuickMood(prev => ({...prev, mood_score: parseInt(value)}))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Energy</label>
            <Select
              value={quickMood.energy_level.toString()}
              onValueChange={(value) => setQuickMood(prev => ({...prev, energy_level: parseInt(value)}))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Stress</label>
            <Select
              value={quickMood.stress_level.toString()}
              onValueChange={(value) => setQuickMood(prev => ({...prev, stress_level: parseInt(value)}))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Confidence</label>
            <Select
              value={quickMood.trading_confidence.toString()}
              onValueChange={(value) => setQuickMood(prev => ({...prev, trading_confidence: parseInt(value)}))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm mb-1 block">Market Sentiment</label>
          <Select
            value={quickMood.market_sentiment}
            onValueChange={(value) => setQuickMood(prev => ({...prev, market_sentiment: value}))}
          >
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BULLISH">Bullish</SelectItem>
              <SelectItem value="BEARISH">Bearish</SelectItem>
              <SelectItem value="NEUTRAL">Neutral</SelectItem>
              <SelectItem value="UNCERTAIN">Uncertain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleQuickLog}
          disabled={isLogging}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLogging ? "Logging..." : "Log Mood State"}
        </Button>
      </CardContent>
    </Card>
  );
}