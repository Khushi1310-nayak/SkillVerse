import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  delay: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, desc, delay }) => (
  <div className={`bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 rounded-2xl p-6 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 group animate-fade-in-up ${delay}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primaryLight group-hover:scale-110 transition-transform duration-300">
        <Icon size={24} />
      </div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-textMuted bg-white/50 dark:bg-white/5 px-2 py-1 rounded-full border border-black/20 dark:border-white/5">Feature</div>
    </div>
    <h3 className="text-lg font-bold text-textMain mb-2 group-hover:text-primaryLight transition-colors">{title}</h3>
    <p className="text-sm text-textMuted mb-4 leading-relaxed">{desc}</p>
    
    {/* Mock Dashboard Preview */}
    <div className="w-full h-24 bg-white/50 dark:bg-[#0B1220] rounded-lg border border-black/20 dark:border-white/5 overflow-hidden relative opacity-60 group-hover:opacity-100 transition-opacity">
      <div className="absolute top-0 w-full h-4 bg-black/5 dark:bg-white/5 border-b border-black/20 dark:border-white/5 flex items-center px-2 gap-1">
         <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
         <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
         <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
      </div>
      <div className="flex h-full pt-4">
         <div className="w-1/4 h-full border-r border-black/20 dark:border-white/5 p-1 space-y-1">
            <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded" />
            <div className="w-2/3 h-1.5 bg-black/10 dark:bg-white/10 rounded" />
            <div className="w-3/4 h-1.5 bg-black/10 dark:bg-white/10 rounded" />
         </div>
         <div className="w-3/4 h-full p-2 space-y-2">
            <div className="flex gap-2">
               <div className="w-1/2 h-8 bg-black/5 dark:bg-white/5 rounded" />
               <div className="w-1/2 h-8 bg-black/5 dark:bg-white/5 rounded" />
            </div>
            <div className="w-full h-8 bg-black/5 dark:bg-white/5 rounded" />
         </div>
      </div>
    </div>
  </div>
);
