import React, { useState, useEffect } from "react";
import { PsychologyPattern } from "@/api/services";
import { BrainCircuit } from "lucide-react";
import PatternCard from "../components/psychology-patterns/PatternCard";
import PatternFilters from "../components/psychology-patterns/PatternFilters";

export default function PsychologyPatternsPage() {
  const [patterns, setPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "all",
    severity: "all"
  });

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    setIsLoading(true);
    try {
      const patternItems = await PsychologyPattern.list("-confidence");
      setPatterns(patternItems);
    } catch (error) {
      console.error("Error loading psychology patterns:", error);
    }
    setIsLoading(false);
  };

  const filteredPatterns = patterns.filter(item => {
    return (
      (filters.type === "all" || item.pattern_type === filters.type) &&
      (filters.severity === "all" || item.severity === filters.severity)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Psychology Patterns</h1>
            <p className="text-slate-400">Advanced behavioral pattern analysis and personalized insights</p>
          </div>
        </div>

        {/* Filters */}
        <PatternFilters filters={filters} setFilters={setFilters} patterns={patterns} />

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <PatternCard key={i} isLoading={true} />)
          ) : filteredPatterns.length > 0 ? (
            filteredPatterns.map(pattern => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <BrainCircuit className="w-12 h-12 mx-auto text-slate-500 mb-4"/>
              <h3 className="text-lg font-semibold text-white">No Patterns Found</h3>
              <p className="text-slate-400">Try adjusting your filters or log more mood entries to discover patterns.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}