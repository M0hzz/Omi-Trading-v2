import React, { useState, useEffect } from "react";
import { MoodEntry } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Activity, PlusCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import MoodForm from "../components/mood-tracking/MoodForm";
import MoodHistory from "../components/mood-tracking/MoodHistory";

export default function MoodTrackingPage() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    loadMoodEntries();
  }, []);

  const loadMoodEntries = async () => {
    setIsLoading(true);
    try {
      const entries = await MoodEntry.list("-created_date");
      setMoodEntries(entries);
    } catch (error) {
      console.error("Error loading mood entries:", error);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = async (data) => {
    if (editingEntry) {
      await MoodEntry.update(editingEntry.id, data);
    } else {
      await MoodEntry.create(data);
    }
    await loadMoodEntries();
    setEditingEntry(null);
    setShowForm(false);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    await MoodEntry.delete(id);
    await loadMoodEntries();
  };

  const handleCancel = () => {
    setEditingEntry(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mood Tracking</h1>
              <p className="text-slate-400">Log and analyze your psychological state over time</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {showForm ? "Close Form" : "Log New Entry"}
          </Button>
        </div>

        {/* Mood Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <MoodForm
                entry={editingEntry}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood History */}
        <MoodHistory
          entries={moodEntries}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}