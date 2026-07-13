import React from 'react';
import { Check } from 'lucide-react';

interface CheckItemProps {
  met: boolean;
  label: string;
}

export const CheckItem: React.FC<CheckItemProps> = ({ met, label }) => (
  <div className={`flex items-center gap-1.5 transition-colors duration-300 ${met ? 'text-green-400' : 'text-textMuted'}`}>
    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300 ${met ? 'bg-green-400/20' : 'bg-white/5'}`}>
      {met ? <Check size={10} className="text-green-400" /> : <div className="w-1 h-1 rounded-full bg-white/20" />}
    </div>
    {label}
  </div>
);
