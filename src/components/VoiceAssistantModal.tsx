import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  startVoiceRecognition, 
  stopVoiceRecognition, 
  speakText, 
  stopSpeaking,
  processVoiceQuery,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  SPEECH_LANG_MAP
} from '../utils/voiceAssistantService';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Sparkles, 
  Navigation, 
  Compass, 
  CloudRain, 
  ShieldCheck, 
  Receipt, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Radio
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRoute?: (from: string, to: string) => void;
  onNavigateToPage?: (page: string) => void;
}

interface ChatItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionType?: string;
  routeParams?: { from: string; to: string };
  suggestedActions?: string[];
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyRoute,
  onNavigateToPage
}) => {
  const { currentLanguage, t } = useLanguage();
  const langCode = currentLanguage.code;

  const [isListening, setIsListening] = useState(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatItem[]>(() => [
    {
      id: 'welcome-init',
      sender: 'assistant',
      text: langCode === 'ta'
        ? "வணக்கம்! நான் உங்கள் ஸ்மார்ட்மூவ் AI குரல் உதவியாளர். அகில இந்திய தேசிய நெடுஞ்சாலைகள், மலைப்பாதை வளைவுகள், தானியங்கி வானிலை மற்றும் நிலச்சரிவு பாதுகாப்பு குறித்த கேள்விகளை கேளுங்கள் அல்லது குரல் மூலம் பேசுங்கள்."
        : langCode === 'hi'
        ? "नमस्ते! मैं आपका स्मार्टमूव AI वॉयस असिस्टेंट हूँ। आप बोलकर या लिखकर मार्ग, मौसम, फास्टैग और सुरक्षा जोखिम के बारे में पूछ सकते हैं।"
        : "Namaste! I am your SmartMove AI Multilingual Voice Assistant. Ask me anything about Pan-India routes, mountain ghats, automated Doppler climate, or speak hands-free!",
      timestamp: 'Just now',
      suggestedActions: langCode === 'ta' 
        ? ['சென்னை ➔ பெங்களூரு வழி', 'வானிலை நிலவரம்', 'பாதுகாப்பான பாதை எது?', 'FASTag டோல்கேட் கட்டணம்']
        : langCode === 'hi'
        ? ['चेन्नई से बेंगलुरु मार्ग', 'मौसम की जानकारी', 'सबसे सुरक्षित रास्ता?', 'फास्टैग टोल कितना है?']
        : ['Route Chennai to Bengaluru', 'What is current weather?', 'Which route is safest?', 'FASTag Toll Estimate']
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    } else {
      stopVoiceRecognition();
      stopSpeaking();
      setIsListening(false);
      setIsSpeakingAudio(false);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  // Trigger speech synthesis
  const handleBotSpeak = (text: string) => {
    if (!audioEnabled) return;
    setIsSpeakingAudio(true);
    speakText(
      text,
      langCode,
      () => setIsSpeakingAudio(false),
      () => setIsSpeakingAudio(false)
    );
  };

  // Toggle Voice Input / Speech Recognition
  const handleToggleListening = () => {
    setSpeechError(null);

    if (isListening) {
      stopVoiceRecognition();
      setIsListening(false);
      return;
    }

    // Stop existing audio if playing
    stopSpeaking();
    setIsSpeakingAudio(false);

    const started = startVoiceRecognition(
      langCode,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          setIsListening(false);
          handleExecuteQuery(text);
          setTranscript('');
        }
      },
      (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  // Execute Query (either from voice or text input)
  const handleExecuteQuery = (queryText: string) => {
    const cleanQuery = queryText.trim();
    if (!cleanQuery) return;

    // Add user message
    const userMsg: ChatItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSpeechError(null);

    // Process intelligence
    setTimeout(() => {
      const result = processVoiceQuery(cleanQuery, langCode);

      const botMsg: ChatItem = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: result.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: result.actionType,
        routeParams: result.routeParams,
        suggestedActions: result.suggestedActions
      };

      setMessages(prev => [...prev, botMsg]);

      // Speak response aloud if audio is enabled
      handleBotSpeak(result.replyText);

      // If routeParams exist and user was selecting route, auto-notify
      if (result.routeParams && onApplyRoute) {
        onApplyRoute(result.routeParams.from, result.routeParams.to);
      }
    }, 450);
  };

  const handleApplyRouteDirectly = (from: string, to: string) => {
    if (onApplyRoute) {
      onApplyRoute(from, to);
    }
    if (onNavigateToPage) {
      onNavigateToPage('planner');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {isListening && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-900 animate-ping" />
              )}
              {isSpeakingAudio && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {t('va_title', 'SmartMove AI Voice Assistant')}
                </h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30 font-semibold font-mono">
                  {currentLanguage.nativeName} ({SPEECH_LANG_MAP[langCode] || 'en-IN'})
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isListening 
                  ? t('va_listening', 'Listening... Speak in your language')
                  : isSpeakingAudio
                  ? 'Speaking response...'
                  : t('va_subtitle', 'Hands-free Pan-India logistics & safe route intelligence')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Speech Output Mute Toggle */}
            <button
              onClick={() => {
                if (isSpeakingAudio) stopSpeaking();
                setAudioEnabled(!audioEnabled);
              }}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                audioEnabled 
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
              title={audioEnabled ? "Mute Speech Output" : "Enable Speech Output"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Voice Visualizer Bar (When listening) */}
        {isListening && (
          <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2.5 flex items-center justify-between animate-in slide-in-from-top duration-150">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-red-300">
                {t('va_listening', 'Listening to your voice...')}
              </span>
              {transcript && (
                <span className="text-xs text-white font-medium italic truncate max-w-xs sm:max-w-md">
                  "{transcript}"
                </span>
              )}
            </div>

            <button
              onClick={() => stopVoiceRecognition()}
              className="text-[11px] bg-red-500 hover:bg-red-600 text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            >
              {t('va_stop', 'Stop')}
            </button>
          </div>
        )}

        {/* Error message banner */}
        {speechError && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs sm:text-sm min-h-[260px] max-h-[380px]">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-md leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] opacity-75">
                  {msg.sender === 'assistant' ? (
                    <>
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span className="font-bold">SmartMove AI</span>
                    </>
                  ) : (
                    <span className="font-bold">You</span>
                  )}
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.text}</p>

                {/* Direct Action Link if route was detected */}
                {msg.routeParams && (
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{msg.routeParams.from} ➔ {msg.routeParams.to}</span>
                    </div>
                    <button
                      onClick={() => handleApplyRouteDirectly(msg.routeParams!.from, msg.routeParams!.to)}
                      className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-[11px] px-3 py-1 rounded-lg shadow cursor-pointer transition-all"
                    >
                      Open in Route Planner
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Action Chips from Assistant */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExecuteQuery(action)}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Voice Prompt Examples Pill Bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[10px] text-slate-400 font-mono shrink-0 uppercase">
            {langCode === 'ta' ? 'குரல் உதாரணங்கள்:' : 'Try Asking:'}
          </span>
          {[
            langCode === 'ta' ? 'சென்னை ➔ பெங்களூரு' : 'Chennai to Bengaluru',
            langCode === 'ta' ? 'வானிலை நிலவரம்' : 'Weather update',
            langCode === 'ta' ? 'பாதுகாப்பான பாதை' : 'Safest route',
            langCode === 'ta' ? 'FASTag டோல்' : 'FASTag tolls',
            langCode === 'ta' ? 'அவசர உதவி SOS' : 'Emergency SOS'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleExecuteQuery(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-slate-700 text-[11px] whitespace-nowrap transition-colors cursor-pointer"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Input Bar & Prominent Microphone Button */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2 sm:gap-3">
          {/* Prominent Glowing Microphone Button */}
          <button
            onClick={handleToggleListening}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg shrink-0 ${
              isListening
                ? 'bg-red-500 text-white ring-4 ring-red-500/30 animate-pulse scale-105'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105'
            }`}
            title={isListening ? "Stop Listening" : "Tap to Speak (Tamil, English, Hindi, etc.)"}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 animate-bounce" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Text Input Fallback */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteQuery(inputText);
              }}
              placeholder={
                langCode === 'ta'
                  ? 'தமிழில் பேச மைக் தொடவும் அல்லது தட்டச்சு செய்க...'
                  : langCode === 'hi'
                  ? 'बोलने के लिए माइक दबाएं या टाइप करें...'
                  : 'Tap mic to speak or type your question...'
              }
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleExecuteQuery(inputText)}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
