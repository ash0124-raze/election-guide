/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Vote, 
  Calendar, 
  UserCheck, 
  BookOpen, 
  MessageSquare, 
  ArrowRight,
  CheckCircle2,
  Info,
  ChevronRight,
  Search,
  X,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ELECTION_STEPS } from './constants';
import { ElectionStep, ChatMessage } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ICON_MAP: Record<string, any> = {
  UserCheck,
  Search,
  BookOpen,
  Calendar,
  Vote,
  CheckCircle2
};

export default function App() {
  const [activeStep, setActiveStep] = useState<string>(ELECTION_STEPS[0].id);
  const [showAssistant, setShowAssistant] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentStep = ELECTION_STEPS.find(s => s.id === activeStep) || ELECTION_STEPS[0];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: inputText };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...chatMessages, userMsg].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are CivicPath AI, a neutral and helpful non-partisan assistant dedicated to helping users understand the election process and voting steps. Provide clear, accurate information based on general US election principles unless specified. Always encourage users to check their local state laws for specific deadlines. Be encouraging and civic-minded."
        }
      });

      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: response.text || "I'm sorry, I couldn't process that. Please try again."
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error("AI Error:", error);
      
      let errorMessage = "Something went wrong. Please check your connection.";
      
      // Handle the specific Quota/Rate Limit error
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('quota')) {
        errorMessage = "The assistant is currently at capacity (Rate Limit exceeded). Please wait a moment and try again, or continue exploring the timeline steps below.";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-slate-200/50 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-bottom border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Vote size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">CivicPath</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Election Guide</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Process</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Resources</a>
            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
          </nav>

          <button 
            onClick={() => setShowAssistant(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-200"
          >
            <Sparkles size={16} />
            Ask Assistant
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Timeline Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">The Civic Journey</h2>
              <p className="text-slate-500">A clear six-step path from registration to the final count.</p>
            </div>

            <div className="relative space-y-2">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200 -z-10" />
              {ELECTION_STEPS.map((step, idx) => {
                const Icon = ICON_MAP[step.icon];
                const isActive = activeStep === step.id;
                
                return (
                  <button
                    key={step.id}
                    id={`step-${step.id}`}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left ${
                      isActive 
                        ? 'bg-white shadow-sm ring-1 ring-slate-200' 
                        : 'hover:bg-slate-100/50'
                    }`}
                  >
                    <div className={`relative z-10 w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-200' 
                        : 'bg-slate-50 text-slate-400 group-hover:bg-slate-200'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                          Step {idx + 1}
                        </span>
                        {isActive && <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </div>
                      <h3 className={`font-semibold transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                        {step.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[500px] flex flex-col"
              >
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-100">
                    {currentStep.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <Clock size={14} />
                    <span>{currentStep.estimatedTime}</span>
                  </div>
                </div>

                <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                  {currentStep.title}
                </h2>
                
                <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium">
                  {currentStep.description}
                </p>

                <div className="prose prose-slate max-w-none text-slate-600 leading-loose flex-1">
                  <p>{currentStep.longDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t border-slate-100">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 flex-shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 mb-1">Key Tip</h4>
                      <p className="text-xs text-slate-500 leading-normal">Always verify through your official Secretary of State website.</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4 transition-transform hover:translate-y-[-2px] cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm border border-slate-100 flex-shrink-0">
                      <ExternalLink size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 mb-1">Official Resource</h4>
                      <p className="text-xs text-slate-500 leading-normal">Visit Vote.gov to check state requirements.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-between items-center">
                  <button 
                    disabled={activeStep === ELECTION_STEPS[0].id}
                    onClick={() => {
                      const idx = ELECTION_STEPS.findIndex(s => s.id === activeStep);
                      if (idx > 0) setActiveStep(ELECTION_STEPS[idx - 1].id);
                    }}
                    className="text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-30 flex items-center gap-2 group p-2"
                  >
                    <ArrowRight className="rotate-180 group-hover:translate-x-[-2px] transition-transform" size={18} />
                    Previous Step
                  </button>
                  <button 
                    disabled={activeStep === ELECTION_STEPS[ELECTION_STEPS.length - 1].id}
                    onClick={() => {
                      const idx = ELECTION_STEPS.findIndex(s => s.id === activeStep);
                      if (idx < ELECTION_STEPS.length - 1) setActiveStep(ELECTION_STEPS[idx + 1].id);
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                  >
                    Next Step
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* AI Assistant Overlay */}
      <AnimatePresence>
        {showAssistant && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAssistant(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
            />
            <motion.div 
              id="ai-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">CivicPath AI</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAssistant(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                      <MessageSquare size={32} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">How can I help you vote?</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                      Ask about registration, finding polls, or understanding local elections.
                    </p>
                    <div className="grid grid-cols-1 gap-2 w-full">
                      {[
                        "How do I check my registration?",
                        "What is a primary election?",
                        "Can I vote early in my state?"
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setInputText(q)}
                          className="text-left p-3 rounded-xl border border-slate-100 text-sm text-slate-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((msg, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-700 rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your civic question..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="absolute right-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
                  CivicPath AI provides general information and should be verified locally.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Vote size={18} />
              </div>
              <h3 className="font-bold text-lg">CivicPath</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering citizens with clear, accessible, and non-partisan information about the democratic process.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="https://vote.gov" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Check Your Registration</a></li>
              <li><a href="https://ballotpedia.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sample Ballot Lookup</a></li>
              <li><a href="https://www.usa.gov/voting" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">US Government Voting Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Non-Partisan Disclaimer</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              CivicPath is an educational resource. We are not affiliated with any government agency. Always confirm information with your local elections office.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} CivicPath. Built for a better democracy.
        </div>
      </footer>
    </div>
  );
}
