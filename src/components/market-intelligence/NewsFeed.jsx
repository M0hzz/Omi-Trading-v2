import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ExternalLink, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsFeed({ news, isLoading }) {
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
  
  const getImpactColor = (impact) => {
    switch (impact) {
      case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-full bg-slate-800" />
              <Skeleton className="h-4 w-3/4 bg-slate-800" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 bg-slate-800" />
                <Skeleton className="h-6 w-16 bg-slate-800" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (news.length === 0) {
    return (
       <Card className="bg-slate-900/50 border-slate-700/50 text-center py-10">
          <Newspaper className="w-12 h-12 mx-auto text-slate-500 mb-4"/>
          <h3 className="text-lg font-semibold text-white">No News Found</h3>
          <p className="text-slate-400">Try adjusting your filters or check back later.</p>
       </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <Card key={item.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-white leading-tight flex-1">{item.headline}</h3>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-slate-400 text-sm mb-3">{item.summary}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getSentimentColor(item.sentiment_score)}>
                {getSentimentIcon(item.sentiment_score)}
                {item.sentiment_score > 0.3 ? 'Positive' : item.sentiment_score < -0.3 ? 'Negative' : 'Neutral'}
              </Badge>
              <Badge className={getImpactColor(item.impact_level)}>{item.impact_level} Impact</Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-600">{item.sector}</Badge>
            </div>
            {item.tickers_mentioned?.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-slate-500">Tickers: </span>
                {item.tickers_mentioned.map(ticker => <Badge key={ticker} variant="secondary" className="mr-1 text-xs">{ticker}</Badge>)}
              </div>
            )}
            <div className="text-xs text-slate-500 flex justify-between">
              <span>{item.source}</span>
              <span>{format(new Date(item.created_date), 'MMM dd, HH:mm')}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}