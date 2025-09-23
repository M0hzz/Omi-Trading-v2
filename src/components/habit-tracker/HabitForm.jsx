import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HabitForm({ habit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "health",
    target_frequency: "daily",
    target_value: 1,
    target_unit: "times",
    is_active: true
  });

  useEffect(() => {
    if (habit) {
      setFormData(habit);
    } else {
      setFormData({
        name: "",
        description: "",
        category: "health",
        target_frequency: "daily",
        target_value: 1,
        target_unit: "times",
        is_active: true
      });
    }
  }, [habit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-8">
      <CardHeader>
        <CardTitle className="text-white">{habit ? "Edit" : "Create"} Habit</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-slate-300">Habit Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Morning Workout"
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300">Category</label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="mental">Mental</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300">Frequency</label>
              <Select 
                value={formData.target_frequency} 
                onValueChange={(value) => handleSelectChange("target_frequency", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300">Target Value</label>
              <div className="flex gap-2">
                <Input
                  name="target_value"
                  type="number"
                  value={formData.target_value}
                  onChange={handleChange}
                  min="1"
                  className="bg-slate-800 border-slate-600 text-white flex-1"
                  required
                />
                <Input
                  name="target_unit"
                  value={formData.target_unit}
                  onChange={handleChange}
                  placeholder="times, hours, pages..."
                  className="bg-slate-800 border-slate-600 text-white flex-1"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-slate-300">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description of your habit..."
              className="bg-slate-800 border-slate-600 text-white h-20"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
            {habit ? "Update Habit" : "Create Habit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}