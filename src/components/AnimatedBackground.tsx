import React from 'react';

const PARTICLE_COUNT = 18;
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#A8D8EA', '#FFAAA5'];

export const AnimatedBackground: React.FC = () => {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${8 + Math.random() * 14}s`,
    animationDelay: `${Math.random() * 10}s`,
    size: `${4 + Math.random() * 6}px`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ opacity: 0.3 }}
      aria-hidden="true"
    >
      <div className="cartoon-blob cartoon-blob-1" style={{ top: '-10%', left: '-5%' }} />
      <div className="cartoon-blob cartoon-blob-2" style={{ top: '40%', right: '-8%' }} />
      <div className="cartoon-blob cartoon-blob-3" style={{ bottom: '-5%', left: '20%' }} />
      <div className="cartoon-blob cartoon-blob-4" style={{ top: '10%', right: '15%' }} />
      {particles.map((p) => (
        <div
          key={p.id}
          className="cartoon-particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay
          }}
        />
      ))}
    </div>
  );
};
