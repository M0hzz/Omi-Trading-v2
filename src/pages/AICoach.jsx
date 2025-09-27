import React, { useState, useRef, useEffect } from "react";
import { InvokeLLM, MoodEntry, MarketIntelligence, PsychologyPattern } from "@/api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, User, Loader2, Brain, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function AICoach() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadContextData();
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadContextData = async () => {
    try {
      const [moods, news, patterns] = await Promise.all([
        MoodEntry.list("-created_date", 10),
        MarketIntelligence.list("-created_date", 10),
        PsychologyPattern.list("-created_date", 5)
      ]);
      
      setContextData({ moods, news, patterns });
    } catch (error) {
      console.error("Error loading context data:", error);
    }
  };

  const addWelcomeMessage = () => {
    setMessages([{
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI Trading Psychology Coach. I'm here to help you understand your psychological patterns, manage trading stress, and optimize your mental performance.\n\nI have access to your mood history, current market sentiment, and behavioral patterns. What would you like to discuss today?",
      timestamp: new Date().toISOString()
    }]);
  };

  const buildContextPrompt = (userQuestion) => {
    if (!contextData) return userQuestion;

    const { moods, news, patterns } = contextData;
    
    // Recent mood analysis
    const recentMoodAvg = moods.length > 0 
      ? moods.reduce((sum, m) => sum + m.mood_score, 0) / moods.length 
      : 0;
    const recentStressAvg = moods.length > 0 
      ? moods.reduce((sum, m) => sum + m.stress_level, 0) / moods.length 
      : 0;
    
    // Market sentiment analysis
    const marketSentiment = news.length > 0 
      ? news.reduce((sum, n) => sum + n.sentiment_score, 0) / news.length 
      : 0;

    const contextPrompt = `You are an expert AI Trading Psychology Coach. Here's the current psychological and market context:

RECENT PSYCHOLOGICAL STATE (${moods.length} recent entries):
- Average Mood Score: ${recentMoodAvg.toFixed(1)}/10
- Average Stress Level: ${recentStressAvg.toFixed(1)}/10
- Recent Mood Entries: ${moods.slice(0, 3).map(m => `${format(new Date(m.created_date), 'MM/dd HH:mm')}: Mood ${m.mood_score}, Stress ${m.stress_level}, Confidence ${m.trading_confidence}`).join('; ')}

CURRENT MARKET CONDITIONS:
- Market Sentiment Score: ${marketSentiment.toFixed(2)} (from recent news analysis)
- Recent Headlines: ${news.slice(0, 3).map(n => n.headline).join('; ')}

DETECTED PSYCHOLOGICAL PATTERNS:
${patterns.map(p => `- ${p.pattern_type}: ${p.description} (Severity: ${p.severity}, Confidence: ${Math.round(p.confidence * 100)}%)`).join('\n')}

COACHING GUIDELINES:
1. Provide personalized advice based on the user's psychological patterns
2. Correlate market conditions with psychological state
3. Give specific, actionable recommendations
4. Be supportive but realistic about trading psychology challenges
5. Help identify triggers and suggest coping strategies
6. Use the detected patterns to provide insights

User Question: ${userQuestion}

Respond as their personal trading psychology coach with specific insights based on this data.`;

    return contextPrompt;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const contextualPrompt = buildContextPrompt(inputMessage.trim());
      
      const response = await InvokeLLM({
        prompt: contextualPrompt,
        add_context_from_internet: false
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "How is my current psychological state affecting my trading?",
    "What patterns have you noticed in my mood data?",
    "How should I adjust my trading based on market sentiment?",
    "Give me stress management techniques for trading",
    "What's the best time of day for me to make trading decisions?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Trading Psychology Coach</h1>
            <p className="text-slate-400">Your personal JARVIS for mental performance optimization</p>
          </div>
        </div>

        {/* Context Status */}
        {contextData && (
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">
                    {contextData.moods.length} mood entries analyzed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300">
                    {contextData.news.length} market signals active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">
                    {contextData.patterns.length} patterns detected
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Area */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white">AI Coaching Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-slate-800/30 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-2">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-700 text-slate-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Analyzing your psychological data...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="mb-4">
              <h4 className="text-slate-400 text-sm mb-2">Quick prompts:</h4>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 text-slate-300 border-slate-600 transition-colors"
                    onClick={() => setInputMessage(prompt)}
                  >
                    {prompt}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your trading psychology, patterns, or get coaching advice..."
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}