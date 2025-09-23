import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

export default function MoodHistory({ entries, isLoading, onEdit, onDelete }) {
  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Mood Entry History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300 text-center">Mood</TableHead>
                <TableHead className="text-slate-300 text-center">Energy</TableHead>
                <TableHead className="text-slate-300 text-center">Stress</TableHead>
                <TableHead className="text-slate-300 text-center">Confidence</TableHead>
                <TableHead className="text-slate-300">Notes</TableHead>
                <TableHead className="text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-slate-800">
                    <TableCell><Skeleton className="h-4 w-24 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 mx-auto bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 mx-auto bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 mx-auto bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 mx-auto bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto bg-slate-800" /></TableCell>
                  </TableRow>
                ))
              ) : entries.length === 0 ? (
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableCell colSpan={7} className="text-center text-slate-400 py-10">
                    No mood entries found. Use the "Log New Entry" button to get started.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map(entry => (
                  <TableRow key={entry.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-slate-300">
                      {format(new Date(entry.created_date), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className={`text-center font-bold ${getScoreColor(entry.mood_score)}`}>
                      {entry.mood_score}
                    </TableCell>
                    <TableCell className={`text-center font-bold ${getScoreColor(entry.energy_level)}`}>
                      {entry.energy_level}
                    </TableCell>
                    <TableCell className={`text-center font-bold ${getScoreColor(11 - entry.stress_level)}`}>
                      {entry.stress_level}
                    </TableCell>
                    <TableCell className={`text-center font-bold ${getScoreColor(entry.trading_confidence)}`}>
                      {entry.trading_confidence}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm max-w-xs truncate">{entry.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(entry)} className="text-slate-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)} className="text-slate-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}