import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import _ from 'lodash';

export default function MarketFilters({ filters, setFilters, news }) {
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const sources = _.uniq(news.map(item => item.source));
  const sectors = _.uniq(news.map(item => item.sector));
  const impacts = ["all", "HIGH", "MEDIUM", "LOW"];
  const sentiments = ["all", "positive", "neutral", "negative"];

  const filterOptions = [
    { name: "sector", label: "Sector", options: ["all", ...sectors] },
    { name: "impact", label: "Impact", options: impacts },
    { name: "sentiment", label: "Sentiment", options: sentiments },
    { name: "source", label: "Source", options: ["all", ...sources] },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </div>
          {filterOptions.map(filter => (
            <Select 
              key={filter.name}
              value={filters[filter.name]} 
              onValueChange={(value) => handleFilterChange(filter.name, value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map(option => (
                  <SelectItem key={option} value={option}>
                    {_.capitalize(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}