import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const formFields = [
  { name: "mood_score", label: "Mood" },
  { name: "energy_level", label: "Energy" },
  { name: "stress_level", label: "Stress" },
  { name: "trading_confidence", label: "Confidence" }
];

export default function MoodForm({ entry, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    mood_score: 5,
    energy_level: 5,
    stress_level: 5,
    trading_confidence: 5,
    market_sentiment: "NEUTRAL",
    notes: "",
    tags: []
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (entry) {
      setFormData({
        ...entry,
        tags: entry.tags || []
      });
    } else {
      setFormData({
        mood_score: 5, energy_level: 5, stress_level: 5,
        trading_confidence: 5, market_sentiment: "NEUTRAL",
        notes: "", tags: []
      });
    }
  }, [entry]);

  const handleSliderChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-8">
      <CardHeader>
        <CardTitle className="text-white">{entry ? "Edit" : "New"} Mood Entry</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {formFields.map(field => (
              <div key={field.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300">{field.label}</label>
                  <span className="text-white font-bold text-lg">{formData[field.name]}</span>
                </div>
                <Slider
                  value={[formData[field.name]]}
                  onValueChange={(value) => handleSliderChange(field.name, value)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-slate-300">Market Sentiment</label>
              <Select value={formData.market_sentiment} onValueChange={(value) => handleSelectChange("market_sentiment", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BULLISH">Bullish</SelectItem>
                  <SelectItem value="BEARISH">Bearish</SelectItem>
                  <SelectItem value="NEUTRAL">Neutral</SelectItem>
                  <SelectItem value="UNCERTAIN">Uncertain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder="Add tags (e.g., focused, anxious)"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-slate-300">Notes</label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific thoughts, feelings, or observations?"
              className="bg-slate-800 border-slate-600 text-white h-24"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            {entry ? "Update Entry" : "Save Entry"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}