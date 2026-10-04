import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  FileSearch,
} from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../../data/mockAi';
import { aiService } from '../../services/aiService';

export const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      isStructured: true,
      structured: {
        summary:
          'Welcome to CloudNexus Intelligence. I continuously analyze your AWS Transit Gateway hub, spoke VPC route tables (DEV, TEST, PROD), security groups, and workload connectivity.',
        evidence:
          'Enterprise-TGW operates in us-east-1 with 3 active attachments. Dynamic route propagation is verified across 10.10.0.0/16, 10.20.0.0/16, and 10.30.0.0/16.',
        possibleCause: 'System baseline initialized in optimal state.',
        recommendedChecks: [
          'Select a suggested question below or enter a custom query to evaluate multi-VPC routing rules.',
          'Review Security Center to examine Dev-App-SG broad ingress and Prod-App-SG isolation policies.',
        ],
        recommendedAction:
          'Ask any question regarding cross-VPC reachability, security posture, or Transit Gateway topology.',
        model: 'CloudNexus-EvidenceEngine-v1',
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const responseData = await aiService.analyzeNetwork(query, { source: 'ChatInterface' });
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        isStructured: true,
        structured: responseData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        isStructured: false,
        text: `Diagnostic error: ${err.message || 'Unable to connect to backend AI analysis service.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Suggested Questions (p2.txt: Suggested Questions) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Suggested Questions</h3>
          </div>
          <p className="text-xs text-slate-500">
            Click any prompt to ask the AI engine about routing, security, or topology:
          </p>

          <div className="space-y-2">
            {SUGGESTED_QUESTIONS.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(question)}
                disabled={loading}
                className="w-full p-2.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 border border-slate-200 hover:border-purple-300 rounded-xl text-xs font-medium text-left transition-all flex items-center justify-between group shadow-2xs"
              >
                <span>{question}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1.5" />
              </button>
            ))}
          </div>
        </div>

        {/* AI Engine Status Card */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Diagnostic Engine Ready (Dev Mode)
            </span>
          </div>
          <p className="text-xs text-purple-100 leading-relaxed">
            CloudNexus-MockAI-v1 provides structured diagnostic reasoning based on simulated AWS Transit Gateway routing rules, RFC 1918 VPC segmentation, and security group isolation policies.
          </p>
        </div>
      </div>

      {/* Right Column: Chat Conversation Area */}
      <div className="lg:col-span-8 flex flex-col h-[700px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 to-indigo-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">CloudNexus Intelligence</h3>
              <p className="text-xs text-purple-700 font-medium">Diagnostic network analysis &amp; policy guidance (Mock Backend Engine)</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white border border-purple-200 rounded-full text-[11px] font-bold text-purple-700 shadow-2xs">
            CloudNexus-MockAI-v1
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white shadow-purple-500/20'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble / Structured AI Response Card */}
              {msg.sender === 'user' ? (
                <div className="max-w-[80%] rounded-2xl rounded-tr-none px-4 py-3 bg-blue-600 text-white text-xs leading-relaxed shadow-sm">
                  <p className="font-medium">{msg.text}</p>
                  <div className="text-[10px] mt-1 text-blue-200">{msg.timestamp}</div>
                </div>
              ) : (
                /* AI Structured Response Card (p2.txt: Summary, Evidence, Possible Cause, Recommended Checks, Recommended Action) */
                <div className="max-w-[90%] rounded-2xl rounded-tl-none bg-slate-50/70 border border-purple-200/70 p-5 space-y-4 shadow-sm text-xs">
                  {/* 1. Summary */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      Summary
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-xl border border-purple-100">
                      {msg.structured?.summary || msg.text}
                    </p>
                  </div>

                  {/* 2. Evidence */}
                  {msg.structured?.evidence && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                        <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                        Evidence
                      </span>
                      <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
                        {msg.structured.evidence}
                      </div>
                    </div>
                  )}

                  {/* 3. Possible Cause */}
                  {msg.structured?.possibleCause && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        Possible Cause
                      </span>
                      <p className="text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 text-xs">
                        {msg.structured.possibleCause}
                      </p>
                    </div>
                  )}

                  {/* 4. Recommended Checks */}
                  {msg.structured?.recommendedChecks && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Recommended Checks
                      </span>
                      <ul className="space-y-1.5 text-slate-700 bg-white p-3 rounded-xl border border-slate-200/70">
                        {msg.structured.recommendedChecks.map((check, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                            <span>{check}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 5. Recommended Action */}
                  {msg.structured?.recommendedAction && (
                    <div className="pt-2 border-t border-purple-100 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-900 block mb-0.5">Recommended Action:</span>
                        <p className="text-purple-800 text-xs">{msg.structured.recommendedAction}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-purple-50">
                    <span className="font-mono text-purple-600 font-medium">
                      {msg.structured?.model || 'CloudNexus-MockAI-v1'} {msg.structured?.confidence ? `(${Math.round(msg.structured.confidence * 100)}% match)` : ''}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-purple-50/80 border border-purple-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2.5 text-xs text-purple-800 font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>Analyzing network route tables, Transit Gateway attachments, and security rules...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cross-VPC reachability, route tables, or security findings..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-500/20 transition-colors"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
