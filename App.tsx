
import React, { useState, useEffect } from 'react';
import RetroInterface from './components/RetroInterface';
import PixelSprite from './components/PixelSprite';
import GameCanvas from './components/GameCanvas';
import { SpriteConfig, GameState } from './types';
import { useChristmasMusic } from './hooks/useChristmasMusic';

const DEFAULT_STAFF: SpriteConfig[] = [
  {
    hairColor: 'orange', skinColor: 'pastelYellow', shirtColor: 'green', pantsColor: 'blue',
    accessory: 'glasses', name: 'David', role: 'Creative', beard: 'orange', hairType: 'thinning'
  },
  {
    hairColor: 'black', skinColor: 'pastelYellow', shirtColor: 'green', pantsColor: 'blue',
    accessory: 'none', name: 'Jordi', role: 'Management', beard: 'stubble', hairType: 'normal'
  },
  {
    hairColor: 'brightYellow', skinColor: 'pastelYellow', shirtColor: 'brightBlue', pantsColor: 'blue',
    accessory: 'glasses', name: 'Lucia', role: 'Accounts', beard: 'none', hairType: 'long'
  },
  {
    hairColor: 'black', skinColor: 'pastelYellow', shirtColor: 'mauve', pantsColor: 'blue',
    accessory: 'glasses', name: 'Lidia', role: 'Social', beard: 'none', hairType: 'bob'
  },
  {
    hairColor: 'brown', skinColor: 'pastelYellow', shirtColor: 'brightCyan', pantsColor: 'blue',
    accessory: 'none', name: 'Laura', role: 'Design', beard: 'none', hairType: 'curly-long'
  },
  {
    hairColor: 'brightYellow', skinColor: 'pastelYellow', shirtColor: 'pink', pantsColor: 'black',
    accessory: 'none', name: 'Anna', role: 'HR', beard: 'none', hairType: 'long'
  },
];

// Snowflake component
const Snowfall: React.FC = () => {
  const snowflakes = React.useMemo(() =>
    [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 4,
      opacity: 0.4 + Math.random() * 0.6
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full animate-snowfall"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Christmas lights
const ChristmasLights: React.FC = () => {
  const colors = ['#FF0000', '#00FF00', '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500'];
  return (
    <div className="absolute top-0 left-0 right-0 h-8 flex justify-around items-center z-30">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-3 h-4 rounded-full animate-twinkle"
          style={{
            backgroundColor: colors[i % colors.length],
            boxShadow: `0 0 10px ${colors[i % colors.length]}, 0 0 20px ${colors[i % colors.length]}`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

const ChristmasTree: React.FC<{ progress: number }> = ({ progress }) => {
  const ornamentColors = ['#FF0000', '#FFD700', '#00BFFF', '#FF69B4', '#32CD32', '#FFA500'];

  return (
    <div className="relative w-48 h-64 flex flex-col items-center">
      {/* Trunk */}
      {progress > 10 && (
        <div className="absolute bottom-0 w-10 h-16 bg-[#5D4037] border-4 border-black transition-all duration-500"></div>
      )}
      {/* Tiers with gradient */}
      {progress > 30 && (
        <div className="absolute bottom-12 w-48 h-24 bg-gradient-to-b from-[#2E7D32] to-[#1B5E20] clip-tree border-b-8 border-black shadow-lg transition-all duration-700"></div>
      )}
      {progress > 55 && (
        <div className="absolute bottom-28 w-36 h-20 bg-gradient-to-b from-[#43A047] to-[#2E7D32] clip-tree border-b-8 border-black shadow-lg transition-all duration-700"></div>
      )}
      {progress > 75 && (
        <div className="absolute bottom-40 w-24 h-16 bg-gradient-to-b from-[#66BB6A] to-[#43A047] clip-tree border-b-8 border-black shadow-lg transition-all duration-700"></div>
      )}
      {/* Star with glow */}
      {progress > 95 && (
        <div className="absolute -top-8 w-14 h-14 bg-yellow-400 clip-star shadow-[0_0_30px_#FFFF00,0_0_60px_#FFD700] animate-pulse-glow"></div>
      )}
      {/* Ornaments */}
      {progress > 85 && (
        <>
          {[
            { x: 10, y: 24, color: 0 }, { x: 36, y: 24, color: 1 },
            { x: 6, y: 36, color: 2 }, { x: 22, y: 32, color: 3 }, { x: 40, y: 36, color: 4 },
            { x: 2, y: 48, color: 5 }, { x: 18, y: 44, color: 0 }, { x: 30, y: 44, color: 1 }, { x: 46, y: 48, color: 2 }
          ].map((ornament, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 rounded-full animate-twinkle border-2 border-white/30"
              style={{
                left: `${ornament.x}%`,
                bottom: `${ornament.y}%`,
                backgroundColor: ornamentColors[ornament.color],
                boxShadow: `0 0 8px ${ornamentColors[ornament.color]}`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </>
      )}
      {/* Tinsel/Garland */}
      {progress > 90 && (
        <div className="absolute bottom-16 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60"></div>
      )}
      <style>{`
        .clip-tree { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
        .clip-star { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [staff, setStaff] = useState<SpriteConfig[]>(DEFAULT_STAFF);
  const [storyStep, setStoryStep] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Christmas music - "A Betlem m'en vull anar"
  useChristmasMusic(musicEnabled && gameState === GameState.GAME);

  useEffect(() => {
    const timer = setTimeout(() => setGameState(GameState.MENU), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (gameState === GameState.GAME) {
      const interval = setInterval(() => {
        setStoryStep(prev => prev < 1800 ? prev + 1 : prev);
      }, 25);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const resetStory = () => {
    setStoryStep(0);
    setGameState(GameState.GAME);
  };

  if (gameState === GameState.LOADING) {
    return (
      <RetroInterface title="BOOTING SYSTEM...">
        <div className="flex flex-col items-center gap-6 py-10">
          <div className="w-64 h-6 bg-blue-900 border-4 border-yellow-400 overflow-hidden p-1">
            <div className="h-full bg-yellow-400 animate-[loading_2s_linear_infinite]" style={{ width: '40%' }}></div>
          </div>
          <p className="text-yellow-400 text-xs font-mono tracking-widest uppercase text-center">Iniciant Experiència Nadalenca<br/>Eixos Creativa v2.0</p>
        </div>
      </RetroInterface>
    );
  }

  return (
    <RetroInterface title="THE XMAS ADVENTURE">
      {gameState === GameState.MENU && (
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl text-white font-bold tracking-tighter shadow-sm">NADAL 8-BIT</h2>
            <p className="text-yellow-400 text-sm italic tracking-widest">WWW.EIXOSCREATIVA.COM</p>
          </div>

          <div className="flex justify-center gap-2 bg-white/5 p-4 border-y-4 border-yellow-400/50 backdrop-blur-sm w-full">
            {staff.map((member, idx) => (
              <PixelSprite key={idx} config={member} size={90} direction="front" pose="standing" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={resetStory}
              className="bg-green-600 hover:bg-green-500 text-white px-12 py-5 border-b-8 border-green-950 active:border-b-0 active:translate-y-2 transition-all text-xl font-bold shadow-xl uppercase tracking-widest"
            >
              INICIAR HISTÒRIA
            </button>
            <button
              onClick={() => setGameState(GameState.ADMIN)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 border-b-8 border-blue-950 active:border-b-0 active:translate-y-2 transition-all text-xl font-bold opacity-80 uppercase tracking-widest"
            >
              STAFF
            </button>
          </div>
        </div>
      )}

      {gameState === GameState.GAME && (
        <div className="relative h-[550px] w-full overflow-hidden bg-gradient-to-b from-[#0a0a2e] via-[#000030] to-[#001050] border-8 border-yellow-400 shadow-2xl">
          {/* Christmas Lights at top */}
          <ChristmasLights />

          {/* Snowfall effect */}
          <Snowfall />

          {/* Parallax Stars */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-twinkle"
                style={{
                  left: `${(i * 17 + i * 3) % 100}%`,
                  top: `${(i * 13) % 50}%`,
                  width: `${1 + (i % 3)}px`,
                  height: `${1 + (i % 3)}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* UNIFIED GAME CANVAS - Tree and Characters all in one */}
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <GameCanvas
              width={850}
              height={420}
              staff={staff}
              storyStep={storyStep}
            />
          </div>

          {/* Narrative UI */}
          <div className="absolute top-12 w-full flex justify-center px-4 z-40">
            <div className="bg-black/95 border-4 border-yellow-400 p-5 max-w-2xl w-full text-center shadow-[6px_6px_0px_#FFD700] animate-slideDown">
               <p className="text-yellow-400 text-base tracking-wide uppercase font-mono leading-relaxed">
                  {storyStep < 300 && "🎮 L'EQUIP D'EIXOS ARRIBA AMB REGALS..."}
                  {storyStep >= 300 && storyStep < 550 && "🎄 CAMINANT CAP A L'ARBRE DE NADAL..."}
                  {storyStep >= 550 && storyStep < 800 && "🎁 DEIXANT ELS REGALS SOTA L'ARBRE!"}
                  {storyStep >= 800 && storyStep < 1050 && "⭐ TOTS JUNTS PER A LA FOTO!"}
                  {storyStep >= 1050 && storyStep < 1400 && "🏆 FELICITANT LES FESTES!"}
                  {storyStep >= 1400 && "✨ BONES FESTES I FELIÇ 2026!"}
               </p>
               <div className="mt-3 w-full h-2 bg-blue-900 border border-yellow-400/50">
                 <div
                   className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 transition-all duration-300"
                   style={{ width: `${Math.min(100, storyStep / 18)}%` }}
                 />
               </div>
            </div>
          </div>

          {/* Final Message Overlay */}
          {storyStep >= 1550 && (
             <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-900/95 to-purple-900/95 z-50 animate-fadeIn">
                <Snowfall />
                <div className="text-center p-12 border-8 border-yellow-400 bg-black/90 shadow-[0_0_60px_#FFD700] animate-scaleIn relative overflow-hidden">
                   <div className="absolute inset-0 overflow-hidden">
                     {[...Array(20)].map((_, i) => (
                       <div key={i} className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"
                         style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.2}s` }} />
                     ))}
                   </div>
                   <h1 className="text-5xl md:text-7xl text-yellow-400 mb-6 font-black tracking-tight animate-pulse-glow relative z-10">BONES FESTES</h1>
                   <p className="text-white text-xl md:text-2xl mb-4 tracking-widest font-bold relative z-10">EIXOS CREATIVA</p>
                   <p className="text-yellow-300 text-lg mb-10 tracking-[0.3em] relative z-10">US DESITJA UN FELIÇ 2026</p>
                   <div className="flex gap-6 justify-center relative z-10">
                      <button onClick={resetStory} className="bg-green-600 text-white px-10 py-5 font-bold border-b-6 border-green-950 active:translate-y-1 hover:bg-green-500 transition-all text-lg hover:shadow-[0_0_20px_#22C55E]">🔄 REPETIR</button>
                      <button onClick={() => setGameState(GameState.MENU)} className="bg-red-600 text-white px-10 py-5 font-bold border-b-6 border-red-950 active:translate-y-1 hover:bg-red-500 transition-all text-lg hover:shadow-[0_0_20px_#EF4444]">🏠 MENÚ</button>
                   </div>
                </div>
             </div>
          )}

          {/* Music toggle button */}
          <button
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`absolute bottom-4 left-4 px-4 py-2 text-xs border-2 transition-all font-bold z-30 hover:scale-105 ${
              musicEnabled
                ? 'bg-green-600 text-white border-green-400 hover:bg-green-500'
                : 'bg-black/80 text-white border-yellow-400/50 hover:bg-yellow-700'
            }`}
          >
            {musicEnabled ? '🎵 MÚSICA ON' : '🔇 MÚSICA OFF'}
          </button>

          <button
            onClick={() => setGameState(GameState.MENU)}
            className="absolute bottom-4 right-4 bg-black/80 text-white px-4 py-2 text-xs border-2 border-yellow-400/50 hover:bg-red-700 hover:border-red-400 transition-all font-bold z-30 hover:scale-105"
          >
            ⏭ SALTAR-SE
          </button>
        </div>
      )}

      {gameState === GameState.ADMIN && (
        <div className="flex flex-col items-center gap-6 py-6">
          <h2 className="text-2xl text-yellow-400 font-bold border-b-4 border-yellow-400 pb-2 uppercase tracking-widest">L'Equip</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 w-full p-8 bg-white/5 border-2 border-white/10">
            {staff.map((s, i) => (
              <div key={i} className="flex flex-col items-center p-4 hover:bg-white/10 transition-all cursor-help border-2 border-transparent hover:border-yellow-400/50 shadow-inner">
                <PixelSprite config={s} size={100} />
                <span className="text-[10px] text-yellow-400 mt-3 font-mono uppercase font-bold text-center">{s.name}<br/><span className="opacity-50 text-[8px]">{s.role}</span></span>
              </div>
            ))}
          </div>

          <button onClick={() => setGameState(GameState.MENU)} className="mt-4 text-yellow-400 hover:text-white transition-colors uppercase text-sm border-2 border-yellow-400/30 px-6 py-2">
            TORNAR AL MENÚ
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }

        @keyframes snowfall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(620px) rotate(360deg); opacity: 0.3; }
        }
        .animate-snowfall {
          animation: snowfall linear infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        .animate-twinkle {
          animation: twinkle 1.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FFFF00); }
          50% { filter: drop-shadow(0 0 30px #FFD700) drop-shadow(0 0 60px #FFFF00); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes message-pop {
          0% { transform: translateX(-50%) scale(0); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.1); }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        .animate-message-pop {
          animation: message-pop 0.3s ease-out forwards;
        }

        @keyframes slideDown {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }

        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </RetroInterface>
  );
};

export default App;
