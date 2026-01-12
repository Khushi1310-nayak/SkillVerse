import React from 'react';

export const GoldSnow: React.FC = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}px`,
            width: `${Math.random() * 3 + 2}px`,
            height: `${Math.random() * 3 + 2}px`,
            backgroundColor: '#F5C97A',
            opacity: Math.random() * 0.6 + 0.2,
            filter: 'blur(1px)',
            boxShadow: '0 0 4px #F5C97A',
            animation: `goldSnowFall ${Math.random() * 15 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes goldSnowFall {
          0% { transform: translateY(-10px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(50vh) translateX(25px) rotate(180deg); opacity: 0.6; }
          90% { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(-25px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
);