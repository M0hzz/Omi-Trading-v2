import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import _ from 'lodash';

export default function PatternFilters({ filters, setFilters, patterns }) {
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const types = _.uniq(patterns.map(item => item.pattern_type));
  const severities = ["all", "HIGH", "MEDIUM", "LOW"];

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-300 font-semibold md:col-span-1">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </div>
          <div className="md:col-span-1">
            <Select 
              value={filters.type} 
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Pattern Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(option => (
                  <SelectItem key={option} value={option}>
                    {_.startCase(_.toLower(option.replace(/_/g, ' ')))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
            <Select 
              value={filters.severity} 
              onValueChange={(value) => handleFilterChange("severity", value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                {severities.map(option => (
                  <SelectItem key={option} value={option}>
                    {_.capitalize(option)} Severity
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}