import React, { useState, useEffect } from "react";
import { MarketIntelligence as MarketIntelligenceEntity } from "@/api/entities";
import { TrendingUp, Newspaper } from "lucide-react";

import MarketFilters from "../components/market-intelligence/MarketFilters";
import NewsFeed from "../components/market-intelligence/NewsFeed";
import SentimentCharts from "../components/market-intelligence/SentimentCharts";

export default function MarketIntelligencePage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    sector: "all",
    impact: "all",
    sentiment: "all",
    source: "all"
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const newsItems = await MarketIntelligenceEntity.list("-created_date");
      setNews(newsItems);
    } catch (error) {
      console.error("Error loading market intelligence:", error);
    }
    setIsLoading(false);
  };

  const filteredNews = news.filter(item => {
    return (
      (filters.sector === "all" || item.sector === filters.sector) &&
      (filters.impact === "all" || item.impact_level === filters.impact) &&
      (filters.source === "all" || item.source === filters.source) &&
      (filters.sentiment === "all" || 
        (filters.sentiment === "positive" && item.sentiment_score > 0.3) ||
        (filters.sentiment === "negative" && item.sentiment_score < -0.3) ||
        (filters.sentiment === "neutral" && item.sentiment_score >= -0.3 && item.sentiment_score <= 0.3)
      )
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Market Intelligence</h1>
            <p className="text-slate-400">24/7 news monitoring and real-time sentiment analysis</p>
          </div>
        </div>

        {/* Charts & Filters */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-3">
            <SentimentCharts news={news} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-3">
             <MarketFilters filters={filters} setFilters={setFilters} news={news} />
          </div>
        </div>

        {/* News Feed */}
        <div className="flex items-center gap-2 text-xl font-bold text-white mb-4">
          <Newspaper className="w-6 h-6 text-blue-400" />
          <h2>News Feed ({filteredNews.length} articles)</h2>
        </div>
        <NewsFeed news={filteredNews} isLoading={isLoading} />
      </div>
    </div>
  );
}