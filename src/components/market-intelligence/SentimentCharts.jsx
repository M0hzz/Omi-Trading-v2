import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import _ from 'lodash';

export default function SentimentCharts({ news, isLoading }) {
  const sentimentBySector = _.chain(news)
    .groupBy('sector')
    .map((items, sector) => ({
      sector,
      avgSentiment: _.meanBy(items, 'sentiment_score')
    }))
    .sortBy('avgSentiment')
    .value();

  const newsBySource = _.countBy(news, 'source');

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#14b8a6'];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader><Skeleton className="h-6 w-48 bg-slate-800" /></CardHeader>
          <CardContent><Skeleton className="h-64 w-full bg-slate-800" /></CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader><Skeleton className="h-6 w-48 bg-slate-800" /></CardHeader>
          <CardContent><Skeleton className="h-64 w-full bg-slate-800" /></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Sentiment by Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentBySector} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={12} domain={[-1, 1]} />
                <YAxis type="category" dataKey="sector" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Bar dataKey="avgSentiment">
                  {sentimentBySector.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.avgSentiment > 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">News by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={Object.entries(newsBySource).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {Object.keys(newsBySource).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}