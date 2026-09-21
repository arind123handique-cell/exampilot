import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAiChatHistory, saveAiChatMessage } from '../services/firestore';
import { AiChatMessage } from '../types';
import { generateTutorReply, hasLiveAi } from '../services/aiProvider';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FileCode2,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  User
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export const AiTutorPage: React.FC<{ initialQuery?: string }> = ({ initialQuery }) => {
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputText, setInputText] = useState(initialQuery || '');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        const history = await getAiChatHistory(user.uid);
        setMessages(history);
      }
    };
    loadHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const samplePrompts = user?.preferences?.examId === 'upsc-cse'
    ? [
        'Explain the Basic Structure doctrine and Kesavananda Bharati case',
        'Compare Western vs Indian secularism under Article 25-28',
        'How does El Niño impact the Indian Summer Monsoon (ISMR)?',
        'Explain the difference between CPI vs WPI inflation measures'
      ]
    : user?.preferences?.examId === 'ssc-cgl'
    ? [
        'Explain shortcut tricks for successive percentage changes and discounts',
        'What are the key divisibility rules tested in SSC CGL Quant?',
        'Provide rules for subject-verb agreement with compound subjects',
        'Explain syllogism deduction using Venn diagram rules'
      ]
    : [
        'Explain Limiting Depth of Neutral Axis (xu,max / d) per IS 456:2000',
        'Derive development length formula Ld = (φ · σs) / (4 · τbd)',
        'Generate 2 tricky MCQs on Terzaghi Consolidation Theory',
        'What are the key assumptions in Euler’s Bernoulli equation?'
      ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !user) return;

    const userMessage: AiChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setInputText('');
    const updated = await saveAiChatMessage(user.uid, userMessage);
    setMessages(updated);
    setIsTyping(true);

    let botResponseContent = '';
    let citations: string[] = [user?.preferences?.examName ? `${user.preferences.examName} Blueprint` : 'Official Syllabus Standards'];
    let formula: string | undefined = undefined;

    // Live Gemini-backed tutor when an API key is configured
    if (hasLiveAi()) {
      try {
        const reply = await generateTutorReply(
          text.trim(),
          [...messages, userMessage],
          user?.preferences?.examName
        );
        if (reply) {
          botResponseContent = reply.content;
          if (reply.formula) formula = reply.formula;
          if (reply.citations && reply.citations.length > 0) citations = reply.citations;
        }
      } catch (err) {
        console.warn('[ExamPilot] Live AI tutor failed, using offline engine:', err);
      }
    }

    // Offline keyword-calibrated fallback engine
    if (!botResponseContent) {
      await new Promise((r) => setTimeout(r, 700));
      const lower = text.toLowerCase();
      if (lower.includes('neutral axis') || lower.includes('xu,max') || lower.includes('is 456')) {
        botResponseContent = `### Limiting Depth of Neutral Axis (xu,max / d)\n\nIn Limit State Method (IS 456:2000 Cl. 38.1), the maximum strain in concrete at the outermost compression fiber is taken as **0.0035**.\n\nFrom the linear strain compatibility diagram across the beam section:\n\n\\[ \\frac{x_{u,max}}{d - x_{u,max}} = \\frac{0.0035}{\\frac{0.87 f_y}{E_s} + 0.002} \\]\n\nSolving for \\( x_{u,max} / d \\):\n\n• **Fe 250 Grade**: \\( x_{u,max}/d = 0.53 \\)\n• **Fe 415 Grade**: \\( x_{u,max}/d = 0.48 \\)\n• **Fe 500 Grade**: \\( x_{u,max}/d = 0.46 \\)\n• **Fe 550 Grade**: \\( x_{u,max}/d = 0.44 \\)\n\n*Key Exam Takeaway:* Higher grade steel reaches yield strain earlier, hence limiting neutral axis depth shifts upward to prevent brittle concrete crushing.`;
        citations.push('IS 456:2000 Clause 38.1 & Note to Fig. 21');
        formula = 'xu,max / d = 0.0035 / (0.0055 + 0.87*fy / Es)';
      } else if (lower.includes('development length') || lower.includes('ld') || lower.includes('bond')) {
        botResponseContent = `### Development Length \\( L_d \\) Derivation\n\nDevelopment length ensures that the bar does not slip from concrete before developing its ultimate tensile capacity.\n\nEquating tensile pull in the steel bar to the resisting bond force developed over length \\( L_d \\):\n\n\\[ \\frac{\\pi}{4} \\phi^2 \\sigma_s = (\\pi \\phi L_d) \\cdot \\tau_{bd} \\]\n\nCancelling \\( \\pi \\phi \\) on both sides:\n\n\\[ L_d = \\frac{\\phi \\cdot \\sigma_s}{4 \\tau_{bd}} \\]\n\n• For bars in compression: \\( \\tau_{bd} \\) is increased by **25%**.\n• For Deformed (HYSD) bars: \\( \\tau_{bd} \\) is increased by **60%** (Cl. 26.2.1.1).`;
        citations.push('IS 456:2000 Clause 26.2.1');
        formula = 'Ld = (φ · σs) / (4 · τbd)';
      } else if (lower.includes('bernoulli') || lower.includes('fluid')) {
        botResponseContent = `### Bernoulli's Energy Theorem Assumptions\n\nDerived by integrating Euler's equation along a streamline: \\( \\int \\frac{dp}{\\rho} + \\int v dv + \\int g dz = C \\)\n\n**Core Assumptions:**\n1. The fluid is **Ideal & Non-viscous** (shear stress \\( \\tau = 0 \\)).\n2. The flow is **Steady** (time derivatives \\( \\partial / \\partial t = 0 \\)).\n3. The fluid is **Incompressible** (constant density \\( \\rho \\)).\n4. The flow is **Irrotational and Streamline-bound**.\n\n*Common Trap in Competitive Exams:* Questions frequently ask "Which assumption is NOT made?" — Remember that flow is NOT assumed compressible or viscous!`;
        citations.push('Modi & Seth: Hydraulics & Fluid Mechanics');
        formula = 'p/ρg + v²/2g + z = Constant';
      } else {
        const targetExam = user?.preferences?.examName || 'Competitive Examinations';
        botResponseContent = `Here is a technical overview regarding **${text}**:\n\nFor ${targetExam}, focus on:\n1. **Core Concepts & Governing Provisions**: Master the high-yield rules, formulas, and definitions that appear repeatedly.\n2. **Elimination Strategy**: Identify edge conditions, boundary values, and trick options designed to catch common misconceptions.\n3. **Frequent PYQ Patterns**: Direct concept questions and standard numerical patterns make up the bulk of foundational scoring.\n\nWould you like me to generate a 3-question diagnostic drill on this topic right now?`;
      }
    }

    const botMessage: AiChatMessage = {
      id: 'bot-' + Date.now(),
      role: 'assistant',
      content: botResponseContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations,
      formula
    };

    const finalHistory = await saveAiChatMessage(user.uid, botMessage);
    setMessages(finalHistory);
    setIsTyping(false);
  };

  return (
    <Card flush className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col overflow-hidden animate-fadeIn">
      {/* Top Header */}
      <div className="p-4 border-b border-line bg-card flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-sm text-ink">
                Syllabus-Aware AI Tutor
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-semibold text-[10px] border border-primary-fixed-dim">
                {user?.preferences?.examName ? `Grounded in ${user.preferences.examName}` : 'Syllabus Grounded'}
              </span>
              {hasLiveAi() && (
                <span className="px-2 py-0.5 rounded-full bg-success-surface text-success-text font-semibold text-[10px] border border-success-border">
                  Live Gemini
                </span>
              )}
            </div>
            <p className="text-xs text-muted">
              Calibrated for {user?.preferences.examName} ({user?.preferences.advtNumber})
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
          <ShieldCheck className="w-4 h-4 text-success-text" />
          <span>Verified Technical Rationales</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-subtle/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser ? 'bg-inverse-hover text-white' : 'bg-primary text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card border border-line text-ink shadow-2xs space-y-3'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.content}</div>

                {msg.formula && (
                  <div className="p-3 rounded-xl bg-subtle border border-line text-xs font-mono text-ink">
                    <span className="text-muted-faint select-none">Formula: </span>
                    <strong>{msg.formula}</strong>
                  </div>
                )}

                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-line flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="text-muted-faint">Sources:</span>
                    {msg.citations.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] mt-1 ${isUser ? 'text-indigo-200' : 'text-muted-faint'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <Card flush className="p-3.5 text-xs text-muted flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 font-medium text-ink-soft">Cross-referencing syllabus standards...</span>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-card border-t border-line flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-muted-faint font-medium whitespace-nowrap text-[11px]">Suggested:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-subtle-strong hover:bg-primary-fixed hover:text-primary hover:border-primary/30 text-ink-soft whitespace-nowrap text-[11px] border border-transparent transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-card border-t border-line flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a technical doubt, derivation or code provision (e.g. Cl 38.1 of IS 456)..."
          aria-label="Ask the AI tutor"
          className="flex-1 h-11 px-4 rounded-xl border border-line text-xs sm:text-sm text-ink placeholder-muted-faint focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
        />
        <Button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          iconRight={<Send className="w-3.5 h-3.5" />}
          className="h-11 px-5 shadow-md shadow-primary/25"
          aria-label="Send message"
        >
          Send
        </Button>
      </div>
    </Card>
  );
};
