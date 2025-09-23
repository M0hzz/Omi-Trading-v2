import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketSentiment({ marketNews, isLoading }) {
  const getSentimentIcon = (score) => {
    if (score > 0.3) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (score < -0.3) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-yellow-400" />;
  };

  const getSentimentColor = (score) => {
    if (score > 0.3) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (score < -0.3) return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  const getSentimentLabel = (score) => {
    if (score > 0.3) return "Positive";
    if (score < -0.3) return "Negative";
    return "Neutral";
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "LOW": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Market Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full bg-slate-800" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 bg-slate-800" />
                  <Skeleton className="h-6 w-16 bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Market Intelligence (Latest {marketNews.length} Articles)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {marketNews.map((news, index) => (
            <div key={index} className="border-b border-slate-700/50 pb-4 last:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm leading-5 mb-2">
                    {news.headline}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className={getSentimentColor(news.sentiment_score)}>
                      {getSentimentIcon(news.sentiment_score)}
                      {getSentimentLabel(news.sentiment_score)}
                    </Badge>
                    <Badge className={getImpactColor(news.impact_level)}>
                      {news.impact_level}
                    </Badge>
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      {news.sector}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{news.source}</span>
                    <span>{format(new Date(news.created_date), 'MMM dd, HH:mm')}</span>
                  </div>
                </div>
                {news.url && (
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              {news.tickers_mentioned && news.tickers_mentioned.length > 0 && (
                <div className="mt-2">
                  <span className="text-slate-400 text-xs">Tickers: </span>
                  {news.tickers_mentioned.map((ticker, i) => (
                    <Badge key={i} variant="outline" className="text-xs mr-1 text-slate-300 border-slate-600">
                      {ticker}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}