import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentPatterns({ patterns, isLoading }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "LOW": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "IMPROVING": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "DECLINING": return <TrendingDown className="w-4 h-4 text-red-400" />;
      case "STABLE": return <Minus className="w-4 h-4 text-yellow-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPatternTypeColor = (type) => {
    switch (type) {
      case "CIRCADIAN": return "text-blue-400";
      case "WEEKLY": return "text-purple-400";
      case "MARKET_CORRELATION": return "text-orange-400";
      case "STRESS_PATTERN": return "text-red-400";
      case "CONFIDENCE_CYCLE": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Recent Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full bg-slate-800" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 bg-slate-800" />
                  <Skeleton className="h-5 w-20 bg-slate-800" />
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
          <Brain className="w-5 h-5 text-blue-400" />
          Recent Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {patterns.length === 0 ? (
            <div className="text-center text-slate-400 py-4">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No patterns detected yet</p>
              <p className="text-xs">Log more mood entries to discover patterns</p>
            </div>
          ) : (
            patterns.map((pattern, index) => (
              <div key={index} className="border-b border-slate-700/50 pb-3 last:border-b-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className={`font-medium text-sm ${getPatternTypeColor(pattern.pattern_type)}`}>
                    {pattern.pattern_type.replace(/_/g, ' ')}
                  </h4>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(pattern.trend)}
                  </div>
                </div>
                
                <p className="text-slate-300 text-xs mb-3 leading-relaxed">
                  {pattern.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={getSeverityColor(pattern.severity)}>
                    {pattern.severity}
                  </Badge>
                  <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                    {Math.round(pattern.confidence * 100)}% confidence
                  </Badge>
                  <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                    {pattern.data_points} data points
                  </Badge>
                </div>

                {pattern.recommendation && (
                  <div className="mt-2 p-2 bg-slate-800/50 rounded text-xs text-slate-300">
                    <strong className="text-blue-400">Recommendation:</strong> {pattern.recommendation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}