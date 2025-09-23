import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, TrendingUp, TrendingDown, Minus, CheckCircle } from "lucide-react";

export default function PatternCard({ pattern, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader><Skeleton className="h-6 w-3/4 bg-slate-800" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full bg-slate-800" />
          <Skeleton className="h-4 w-5/6 bg-slate-800" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 bg-slate-800" />
            <Skeleton className="h-6 w-24 bg-slate-800" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "IMPROVING": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "DECLINING": return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-yellow-400" />;
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

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className={`text-lg font-bold ${getPatternTypeColor(pattern.pattern_type)}`}>
          {pattern.pattern_type.replace(/_/g, ' ')}
        </CardTitle>
        <div className="flex items-center gap-1">
          {getTrendIcon(pattern.trend)}
          <span className="text-xs text-slate-400">{pattern.trend}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-slate-300 text-sm mb-4">{pattern.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getSeverityColor(pattern.severity)}>{pattern.severity} Severity</Badge>
          <Badge variant="outline" className="text-slate-400 border-slate-600">
            {Math.round(pattern.confidence * 100)}% Confidence
          </Badge>
          <Badge variant="outline" className="text-slate-400 border-slate-600">
            {pattern.data_points} Data Points
          </Badge>
        </div>
        {pattern.trigger_conditions && pattern.trigger_conditions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-400 mb-1">TRIGGERS:</h4>
            <div className="flex flex-wrap gap-1">
              {pattern.trigger_conditions.map(trigger => <Badge key={trigger} variant="secondary" className="text-xs">{trigger}</Badge>)}
            </div>
          </div>
        )}
        {pattern.recommendation && (
          <div className="mt-auto p-3 bg-slate-800/70 rounded-lg">
            <h4 className="font-semibold text-blue-400 text-sm mb-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4"/>
              Actionable Recommendation
            </h4>
            <p className="text-slate-300 text-xs">{pattern.recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}