import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';

const FAQAccordionItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}> = ({ question, answer, isOpen, onClick }) => (
  <div className="border border-black/20 dark:border-white/10 rounded-2xl overflow-hidden bg-glass transition-all duration-300">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
    >
      <span className="font-bold text-textMain text-base md:text-lg pr-4 group-hover:text-primaryLight transition-colors">
        {question}
      </span>
      <ChevronDown
        className={`text-textMuted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        size={22}
      />
    </button>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="px-5 md:px-6 pb-5 md:pb-6 text-textMuted text-sm md:text-base leading-relaxed border-t border-black/10 dark:border-white/5 pt-4">
        {answer}
      </div>
    </div>
  </div>
);

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primaryLight text-sm font-semibold mb-4">
            <HelpCircle size={16} /> Got Questions?
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-textMain">
            Frequently Asked Questions
          </h2>
          <p className="text-textMuted text-lg">
            Everything you need to know before you get started.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map(item => (
            <FAQAccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onClick={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};