'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Compass, 
  ShieldAlert, 
  PhoneCall, 
  ChevronRight 
} from 'lucide-react';

export default function AIAssistant({ currentLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am your Tourist Assist AI Guide for Nashik and Kumbh Mela 2027. How can I help you today?',
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'Where is the nearest hospital to Ramkund?',
    'What are the famous Misal spots in Nashik?',
    'How do the on-ground QR codes work?',
    'When does the Ganga Aarti start at Ramkund?',
  ];

  const handleSend = (textToSend) => {
    const q = (textToSend || inputVal).trim();
    if (!q) return;

    // Add user message
    const newMsgs = [...messages, { sender: 'user', text: q }];
    setMessages(newMsgs);
    setInputVal('');

    // Formulate responsive intelligent answer
    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('hospital') || lower.includes('medical') || lower.includes('doctor') || lower.includes('emergency')) {
        reply = 'For medical emergencies, call 108 immediately. The nearest government facility to Ramkund is Civil Hospital Nashik (2.5 km away) on Trambakeshwar Rd (+91 253 257 6106). There is also a direct 24/7 First Aid & ORS camp right on the Ramkund main ghat escalator concourse.';
      } else if (lower.includes('misal') || lower.includes('food') || lower.includes('eat') || lower.includes('thali')) {
        reply = 'Nashik is famous worldwide for spicy Misal Pav! Iconic spots include Sadhana Chulivarchi Misal (Gangapur Rd), Shamsundar Misal (Satpur), and Mamacha Gaon. For satvik pure veg pilgrim thalis, visit Shree Kapaleshwar Bhojnalay opposite Meghraj Bakery near Panchavati.';
      } else if (lower.includes('qr') || lower.includes('scan') || lower.includes('code')) {
        reply = 'Physical Tourist Assist QR codes are installed across Ramkund, Trimbakeshwar, Tapovan parking, and CBS bus terminals. Point your smartphone camera at any poster to immediately access location-specific emergency calls, chilled RO water dispensers, and Sulabh toilets without installing any app!';
      } else if (lower.includes('aarti') || lower.includes('timing') || lower.includes('ramkund')) {
        reply = 'The sacred Godavari Maha Aarti at Ramkund takes place daily at sunrise (around 6:00 AM) and sunset (around 6:30 PM). Early morning 5:30 AM – 8:00 AM is recommended for a peaceful snan before peak festival crowds arrive.';
      } else if (lower.includes('trimbak') || lower.includes('jyotirlinga')) {
        reply = 'Trimbakeshwar Jyotirlinga is situated 28 km west of Nashik city. Regular municipal buses and tourist taxis operate from Old CBS. Early morning darshan between 5:30 AM and 11:30 AM is advised. Holy snan at Kushavarta Kund is also customary.';
      } else if (lower.includes('toilet') || lower.includes('water') || lower.includes('restroom')) {
        reply = 'Clean Sulabh toilet complexes are located directly behind Sita Gufa steps at Ramkund west bank and at Tapovan Sadhugram. 24/7 automated free chilled RO water refill stations are stationed on the Ramkund promenade opposite Ganga Mandir.';
      } else {
        reply = 'Tourist Assist is here to help you navigate Nashik and Kumbh Mela 2027. You can explore our verified facilities directory, browse sacred attractions on the live map, or dial 108/112 for immediate emergency dispatch.';
      }

      setMessages([...newMsgs, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-electric to-teal-400 text-slate-950 shadow-glow-cyan hover:shadow-cyan-electric/50 flex items-center gap-2 font-bold text-xs"
          aria-label="Open AI Tourist Assistant"
        >
          <Bot className="w-5 h-5 text-slate-950" />
          <span className="hidden sm:inline">AI Tourist Guide</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </motion.button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-96 h-[500px] max-h-[80vh] rounded-3xl bg-slate-900 border border-cyan-electric/30 shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-electric/20 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    Tourist Assist AI <Sparkles className="w-3 h-3 text-cyan-electric" />
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-medium">Online • Verified Nashik Knowledge</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-cyan-electric text-slate-950 font-medium rounded-br-none shadow-md'
                        : 'bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none font-light'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts Pills */}
            <div className="px-3 py-1.5 bg-slate-950/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about Nashik sights, hospitals, timings..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-electric"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-electric text-slate-950 hover:opacity-90 transition font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

