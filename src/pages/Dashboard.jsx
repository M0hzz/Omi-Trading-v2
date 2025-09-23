import React, { useState, useEffect } from "react";
import { MoodEntry, MarketIntelligence, PsychologyPattern } from "@/api/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  AlertTriangle,
  Zap
} from "lucide-react";
import { format } from "date-fns";

import DashboardStats from "../components/dashboard/DashboardStats";
import MoodChart from "../components/dashboard/MoodChart";
import MarketSentiment from "../components/dashboard/MarketSentiment";
import RecentPatterns from "../components/dashboard/RecentPatterns";
import QuickMoodLogger from "../components/dashboard/QuickMoodLogger";

export default function Dashboard() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [marketNews, setMarketNews] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [moods, news, psychPatterns] = await Promise.all([
        MoodEntry.list("-created_date", 50),
        MarketIntelligence.list("-created_date", 20),
        PsychologyPattern.list("-created_date", 10)
      ]);
      
      setMoodEntries(moods);
      setMarketNews(news);
      setPatterns(psychPatterns);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const handleMoodLogged = () => {
    loadDashboardData();
  };

  const getMarketMood = () => {
    if (marketNews.length === 0) return "NEUTRAL";
    const avgSentiment = marketNews.reduce((sum, news) => sum + news.sentiment_score, 0) / marketNews.length;
    if (avgSentiment > 0.3) return "BULLISH";
    if (avgSentiment < -0.3) return "BEARISH";
    return "MIXED";
  };

  const getActiveAlerts = () => {
    return patterns.filter(p => p.severity === "HIGH" && p.trend === "DECLINING");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Trading Psychology Dashboard
            </h1>
            <p className="text-slate-400">
              Your personal JARVIS for mental performance & market intelligence
            </p>
          </div>
          
          {getActiveAlerts().length > 0 && (
            <Card className="bg-red-900/20 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">
                    {getActiveAlerts().length} Psychology Alert{getActiveAlerts().length > 1 ? 's' : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Overview */}
        <DashboardStats 
          moodEntries={moodEntries}
          marketNews={marketNews}
          patterns={patterns}
          isLoading={isLoading}
        />

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Charts & Trends */}
          <div className="lg:col-span-2 space-y-6">
            <MoodChart moodEntries={moodEntries} isLoading={isLoading} />
            <MarketSentiment marketNews={marketNews} isLoading={isLoading} />
          </div>

          {/* Right Column - Quick Actions & Patterns */}
          <div className="space-y-6">
            <QuickMoodLogger onMoodLogged={handleMoodLogged} />
            <RecentPatterns patterns={patterns} isLoading={isLoading} />
            
            {/* Market Mood Widget */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Current Market Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge 
                    className={`text-lg px-4 py-2 ${
                      getMarketMood() === "BULLISH" 
                        ? "bg-green-500/20 text-green-400 border-green-500/30" 
                        : getMarketMood() === "BEARISH"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}
                  >
                    {getMarketMood() === "BULLISH" && <TrendingUp className="w-4 h-4 mr-1" />}
                    {getMarketMood() === "BEARISH" && <TrendingDown className="w-4 h-4 mr-1" />}
                    {getMarketMood() === "MIXED" && <Activity className="w-4 h-4 mr-1" />}
                    {getMarketMood()}
                  </Badge>
                  <p className="text-slate-400 text-sm mt-2">
                    Based on {marketNews.length} recent news articles
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}