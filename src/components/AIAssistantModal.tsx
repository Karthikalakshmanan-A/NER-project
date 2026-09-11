import React, { useState, useRef, useEffect } from 'react';
import { AI_ASSISTANT_KNOWLEDGE } from '../data/mockData';
import { ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  MessageSquare, 
  HelpCircle, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPage?: (page: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPage
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Namaste! I am your SmartMove AI Assistant. I analyze real-time road conditions, Doppler monsoon rainfall, landslide risks, and village accessibility across all 8 states of Northeast India. How can I assist your journey today?",
      timestamp: 'Just now',
      suggestedActions: [
        'Which route is safest?',
        'Is there a landslide risk?',
        'What is the fastest route?',
        'Which vehicle should be used?',
        'Is this village accessible?',
        'Where is the nearest hospital?'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulated AI response reasoning
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matchedAnswer = AI_ASSISTANT_KNOWLEDGE.find(item => 
        item.questions.some(q => lower.includes(q.toLowerCase()))
      );

      let responseText = matchedAnswer?.answer;

      if (!responseText) {
        if (lower.includes('weather') || lower.includes('rain')) {
          responseText = "Heavy monsoon rain is currently logged in Cherrapunji, Haflong (Dima Hasao), and Upper Subansiri with 8 localized heavy downpour warnings. Low-lying river approaches on NH-515 and NH-2 are experiencing water cutting.";
        } else if (lower.includes('fuel') || lower.includes('petrol')) {
          responseText = "Major highway retail outlets in Guwahati, Silchar, Dimapur, and Agartala have normal diesel and petrol stocks (>70% capacity). Remote mountain pumps in Tawang and Mechuka maintain emergency allocations.";
        } else {
          responseText = `SmartMove AI Analysis for "${query}": In Northeast India terrain, we strongly recommend prioritizing geotechnical road stability over raw travel distance. Route B (Lumding-Haflong) remains the primary all-weather green corridor today.`;
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: matchedAnswer?.relatedActions || ['Inspect Interactive Map', 'Check Route Planner']
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: string) => {
    if (action === 'Open Route Planner' || action === 'Check Route Planner' || action === 'Compare Routes') {
      if (onNavigateToPage) onNavigateToPage('planner');
      onClose();
    } else if (action === 'View Risk Intelligence' || action === 'View Landslide Warnings') {
      if (onNavigateToPage) onNavigateToPage('risk');
      onClose();
    } else if (action === 'Inspect Interactive Map') {
      if (onNavigateToPage) onNavigateToPage('dashboard');
      onClose();
    } else if (action === 'View Village X Details') {
      if (onNavigateToPage) onNavigateToPage('accessibility');
      onClose();
    } else if (action === 'View Emergency Hubs') {
      if (onNavigateToPage) onNavigateToPage('emergency');
      onClose();
    } else {
      handleSendMessage(action);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="smartmove-ai-assistant-modal" 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-1.5">
                SmartMove AI Assistant
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Online
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Trained on NER Hill Logistics, Topography & Disaster Protocols
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/60 text-xs">
          {messages.map(msg => {
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2 ${isBot ? '' : 'text-right'}`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                      isBot
                        ? 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
                        : 'bg-blue-600 text-white rounded-br-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[10px] block mt-1 ${isBot ? 'text-slate-400' : 'text-blue-200'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Suggested action chips */}
                  {isBot && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className="text-[11px] font-medium bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{action}</span>
                          <ChevronRight className="w-3 h-3 text-blue-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium pl-10">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              <span>SmartMove AI is calculating terrain probabilities...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about safe routes, landslides, village accessibility, hospitals..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
