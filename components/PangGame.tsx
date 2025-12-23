import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SpriteConfig } from '../types';
import PixelSprite from './PixelSprite';

// Character data with themed objects
const CHARACTER_DATA: { [key: string]: { objects: ObjectType[], description: string } } = {
  'David': {
    description: 'Programació i Robòtica',
    objects: ['scratch-block', 'scratch-cat', 'scratch-block-yellow', 'scratch-block-purple']
  },
  'Lucia': {
    description: 'Activitats Infantils',
    objects: ['gear-big', 'gear-medium', 'gear-small', 'gear-colored']
  },
  'Laura': {
    description: 'JumpingClay',
    objects: ['clay-red', 'clay-blue', 'clay-yellow', 'clay-green']
  },
  'Lidia': {
    description: 'Els Marrons',
    objects: ['rock-brown', 'box-brown', 'bag-brown', 'weight-brown']
  },
  'Anna': {
    description: 'Recursos Humans',
    objects: ['cv-paper', 'cv-folder', 'cv-stack', 'contract']
  },
  'Jordi': {
    description: 'Gestió',
    objects: ['pencil', 'sharpener', 'eraser', 'invoice']
  }
};

type ObjectType =
  | 'scratch-block' | 'scratch-cat' | 'scratch-block-yellow' | 'scratch-block-purple'
  | 'gear-big' | 'gear-medium' | 'gear-small' | 'gear-colored'
  | 'clay-red' | 'clay-blue' | 'clay-yellow' | 'clay-green'
  | 'rock-brown' | 'box-brown' | 'bag-brown' | 'weight-brown'
  | 'cv-paper' | 'cv-folder' | 'cv-stack' | 'contract'
  | 'pencil' | 'sharpener' | 'eraser' | 'invoice';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: 'large' | 'medium' | 'small' | 'tiny';
  objectType: ObjectType;
}

interface Harpoon {
  id: number;
  x: number;
  y: number;
}

interface PangGameProps {
  staff: SpriteConfig[];
  onBack: () => void;
}

const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 480;
const GROUND_Y = 440;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 50;
const HARPOON_SPEED = 8;
const GRAVITY = 0.15;
const BOUNCE_DAMPING = 0.98;

const BALL_SIZES = {
  large: { radius: 35, points: 100 },
  medium: { radius: 25, points: 200 },
  small: { radius: 18, points: 300 },
  tiny: { radius: 12, points: 500 }
};

const PangGame: React.FC<PangGameProps> = ({ staff, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gamePhase, setGamePhase] = useState<'select' | 'playing' | 'gameover' | 'win'>('select');
  const [selectedCharacter, setSelectedCharacter] = useState<SpriteConfig | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('pangHighScore');
    return saved ? parseInt(saved) : 0;
  });

  // Game state refs for animation loop
  const playerXRef = useRef(CANVAS_WIDTH / 2);
  const ballsRef = useRef<Ball[]>([]);
  const harpoonsRef = useRef<Harpoon[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean; shoot: boolean }>({ left: false, right: false, shoot: false });
  const canShootRef = useRef(true);
  const gameLoopRef = useRef<number | null>(null);
  const ballIdRef = useRef(0);
  const harpoonIdRef = useRef(0);

  // Audio context for PANG sounds
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'shoot' | 'pop' | 'hit' | 'levelup') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'shoot':
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        break;
      case 'pop':
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        break;
      case 'hit':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        break;
      case 'levelup':
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(500, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        break;
    }
  }, []);

  // Draw pixel art objects
  const drawObject = useCallback((ctx: CanvasRenderingContext2D, ball: Ball) => {
    const { x, y, size, objectType } = ball;
    const radius = BALL_SIZES[size].radius;

    ctx.save();
    ctx.translate(x, y);

    switch (objectType) {
      // DAVID - Scratch
      case 'scratch-block':
        ctx.fillStyle = '#4C97FF';
        ctx.fillRect(-radius, -radius * 0.6, radius * 2, radius * 1.2);
        ctx.fillStyle = '#3373CC';
        ctx.fillRect(-radius + 4, -radius * 0.6 + 4, radius * 0.4, radius * 0.4);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${radius * 0.5}px Arial`;
        ctx.fillText('{}', -radius * 0.3, radius * 0.2);
        break;
      case 'scratch-cat':
        ctx.fillStyle = '#FFAB19';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-radius * 0.3, -radius * 0.1, radius * 0.25, 0, Math.PI * 2);
        ctx.arc(radius * 0.3, -radius * 0.1, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-radius * 0.3, -radius * 0.1, radius * 0.1, 0, Math.PI * 2);
        ctx.arc(radius * 0.3, -radius * 0.1, radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.fillStyle = '#FFAB19';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.7, -radius * 0.5);
        ctx.lineTo(-radius * 0.4, -radius);
        ctx.lineTo(-radius * 0.2, -radius * 0.5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(radius * 0.7, -radius * 0.5);
        ctx.lineTo(radius * 0.4, -radius);
        ctx.lineTo(radius * 0.2, -radius * 0.5);
        ctx.fill();
        break;
      case 'scratch-block-yellow':
        ctx.fillStyle = '#FFBF00';
        ctx.fillRect(-radius, -radius * 0.6, radius * 2, radius * 1.2);
        ctx.fillStyle = '#CC9900';
        ctx.fillRect(-radius + 4, -radius * 0.6 + 4, radius * 0.4, radius * 0.4);
        break;
      case 'scratch-block-purple':
        ctx.fillStyle = '#9966FF';
        ctx.fillRect(-radius, -radius * 0.6, radius * 2, radius * 1.2);
        ctx.fillStyle = '#7744CC';
        ctx.fillRect(-radius + 4, -radius * 0.6 + 4, radius * 0.4, radius * 0.4);
        break;

      // LUCIA - Gears
      case 'gear-big':
      case 'gear-medium':
      case 'gear-small':
      case 'gear-colored':
        const gearColor = objectType === 'gear-colored' ? '#FF6B6B' :
                         objectType === 'gear-big' ? '#4ECDC4' :
                         objectType === 'gear-medium' ? '#45B7D1' : '#96CEB4';
        ctx.fillStyle = gearColor;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        // Gear teeth
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          ctx.fillRect(
            Math.cos(angle) * radius * 0.5 - radius * 0.15,
            Math.sin(angle) * radius * 0.5 - radius * 0.15,
            radius * 0.3,
            radius * 0.3
          );
        }
        // Center hole
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      // LAURA - Clay
      case 'clay-red':
      case 'clay-blue':
      case 'clay-yellow':
      case 'clay-green':
        const clayColor = objectType === 'clay-red' ? '#E74C3C' :
                         objectType === 'clay-blue' ? '#3498DB' :
                         objectType === 'clay-yellow' ? '#F1C40F' : '#2ECC71';
        ctx.fillStyle = clayColor;
        // Blob shape
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.quadraticCurveTo(-radius, -radius, 0, -radius * 0.8);
        ctx.quadraticCurveTo(radius, -radius, radius, 0);
        ctx.quadraticCurveTo(radius, radius * 0.8, 0, radius * 0.7);
        ctx.quadraticCurveTo(-radius, radius * 0.8, -radius, 0);
        ctx.fill();
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      // LIDIA - Brown heavy things
      case 'rock-brown':
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(-radius, radius * 0.3);
        ctx.lineTo(-radius * 0.7, -radius * 0.5);
        ctx.lineTo(0, -radius);
        ctx.lineTo(radius * 0.8, -radius * 0.4);
        ctx.lineTo(radius, radius * 0.5);
        ctx.lineTo(0, radius);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(-radius * 0.2, -radius * 0.2, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'box-brown':
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        ctx.strokeStyle = '#5D3A1A';
        ctx.lineWidth = 3;
        ctx.strokeRect(-radius, -radius, radius * 2, radius * 2);
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius, 0);
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius);
        ctx.stroke();
        break;
      case 'bag-brown':
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.8, radius);
        ctx.lineTo(-radius, -radius * 0.3);
        ctx.quadraticCurveTo(-radius * 0.5, -radius, 0, -radius * 0.8);
        ctx.quadraticCurveTo(radius * 0.5, -radius, radius, -radius * 0.3);
        ctx.lineTo(radius * 0.8, radius);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#5D3A1A';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      case 'weight-brown':
        ctx.fillStyle = '#654321';
        ctx.fillRect(-radius, -radius * 0.3, radius * 2, radius * 1.3);
        ctx.fillRect(-radius * 1.2, -radius * 0.5, radius * 0.4, radius * 0.4);
        ctx.fillRect(radius * 0.8, -radius * 0.5, radius * 0.4, radius * 0.4);
        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${radius * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('KG', 0, radius * 0.3);
        break;

      // ANNA - HR Papers
      case 'cv-paper':
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-radius * 0.7, -radius, radius * 1.4, radius * 2);
        ctx.fillStyle = '#333';
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(-radius * 0.5, -radius * 0.7 + i * radius * 0.35, radius, radius * 0.1);
        }
        ctx.fillStyle = '#3498DB';
        ctx.beginPath();
        ctx.arc(-radius * 0.3, -radius * 0.5, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'cv-folder':
        ctx.fillStyle = '#F39C12';
        ctx.fillRect(-radius, -radius * 0.8, radius * 2, radius * 1.6);
        ctx.fillStyle = '#E67E22';
        ctx.fillRect(-radius, -radius * 0.8, radius * 2, radius * 0.3);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(-radius * 0.5, 0, radius, radius * 0.1);
        break;
      case 'cv-stack':
        ctx.fillStyle = '#ECF0F1';
        ctx.fillRect(-radius * 0.6, -radius * 0.6, radius * 1.2, radius * 1.4);
        ctx.fillStyle = '#BDC3C7';
        ctx.fillRect(-radius * 0.7, -radius * 0.5, radius * 1.2, radius * 1.4);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-radius * 0.8, -radius * 0.4, radius * 1.2, radius * 1.4);
        break;
      case 'contract':
        ctx.fillStyle = '#FFFEF0';
        ctx.fillRect(-radius * 0.7, -radius, radius * 1.4, radius * 2);
        ctx.fillStyle = '#C0392B';
        ctx.beginPath();
        ctx.arc(0, radius * 0.5, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.4, radius * 0.2);
        ctx.quadraticCurveTo(0, radius * 0.5, radius * 0.4, radius * 0.2);
        ctx.stroke();
        break;

      // JORDI - Office supplies
      case 'pencil':
        ctx.save();
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#F4D03F';
        ctx.fillRect(-radius * 0.15, -radius, radius * 0.3, radius * 1.7);
        ctx.fillStyle = '#FFE4B5';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.15, -radius);
        ctx.lineTo(0, -radius * 1.3);
        ctx.lineTo(radius * 0.15, -radius);
        ctx.fill();
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.05, -radius * 1.1);
        ctx.lineTo(0, -radius * 1.3);
        ctx.lineTo(radius * 0.05, -radius * 1.1);
        ctx.fill();
        ctx.fillStyle = '#E91E63';
        ctx.fillRect(-radius * 0.15, radius * 0.5, radius * 0.3, radius * 0.3);
        ctx.restore();
        break;
      case 'sharpener':
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(-radius * 0.8, -radius * 0.5, radius * 1.6, radius);
        ctx.fillStyle = '#C0392B';
        ctx.fillRect(-radius * 0.6, -radius * 0.3, radius * 0.8, radius * 0.6);
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(-radius * 0.2, 0, radius * 0.15, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'eraser':
        ctx.fillStyle = '#E91E63';
        ctx.fillRect(-radius * 0.8, -radius * 0.4, radius * 1.6, radius * 0.8);
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(-radius * 0.8, -radius * 0.4, radius * 0.5, radius * 0.8);
        ctx.fillStyle = '#FFF';
        ctx.font = `${radius * 0.3}px Arial`;
        ctx.fillText('MILAN', -radius * 0.3, radius * 0.1);
        break;
      case 'invoice':
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-radius * 0.8, -radius, radius * 1.6, radius * 2);
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(-radius * 0.8, -radius, radius * 1.6, radius * 0.4);
        ctx.fillStyle = '#333';
        ctx.font = `${radius * 0.25}px Arial`;
        ctx.fillText('FACTURA', -radius * 0.5, -radius * 0.7);
        ctx.fillStyle = '#E74C3C';
        ctx.font = `bold ${radius * 0.4}px Arial`;
        ctx.fillText('€€€', -radius * 0.4, radius * 0.3);
        break;
    }

    ctx.restore();
  }, []);

  // Initialize level
  const initLevel = useCallback((lvl: number) => {
    if (!selectedCharacter) return;

    const charData = CHARACTER_DATA[selectedCharacter.name];
    const numBalls = Math.min(lvl, 4);
    ballsRef.current = [];

    for (let i = 0; i < numBalls; i++) {
      const objectType = charData.objects[i % charData.objects.length];
      ballsRef.current.push({
        id: ballIdRef.current++,
        x: 100 + (i * 200),
        y: 100,
        vx: (Math.random() > 0.5 ? 1 : -1) * (2 + lvl * 0.3),
        vy: 0,
        size: 'large',
        objectType
      });
    }
  }, [selectedCharacter]);

  // Start game
  const startGame = useCallback((character: SpriteConfig) => {
    setSelectedCharacter(character);
    setScore(0);
    setLives(3);
    setLevel(1);
    playerXRef.current = CANVAS_WIDTH / 2;
    harpoonsRef.current = [];
    canShootRef.current = true;
    setGamePhase('playing');
  }, []);

  // Split ball into smaller ones
  const splitBall = useCallback((ball: Ball): Ball[] => {
    const sizes: ('large' | 'medium' | 'small' | 'tiny')[] = ['large', 'medium', 'small', 'tiny'];
    const currentIndex = sizes.indexOf(ball.size);

    if (currentIndex >= sizes.length - 1) return []; // Tiny balls just disappear

    const newSize = sizes[currentIndex + 1];
    const charData = CHARACTER_DATA[selectedCharacter?.name || 'David'];

    return [
      {
        id: ballIdRef.current++,
        x: ball.x - 10,
        y: ball.y,
        vx: -Math.abs(ball.vx) * 1.1,
        vy: -4,
        size: newSize,
        objectType: charData.objects[Math.floor(Math.random() * charData.objects.length)]
      },
      {
        id: ballIdRef.current++,
        x: ball.x + 10,
        y: ball.y,
        vx: Math.abs(ball.vx) * 1.1,
        vy: -4,
        size: newSize,
        objectType: charData.objects[Math.floor(Math.random() * charData.objects.length)]
      }
    ];
  }, [selectedCharacter]);

  // Game loop
  useEffect(() => {
    if (gamePhase !== 'playing' || !selectedCharacter) return;

    initLevel(level);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw ground
      ctx.fillStyle = '#2d2d44';
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

      // Draw side walls
      ctx.fillStyle = '#3d3d5c';
      ctx.fillRect(0, 0, 10, CANVAS_HEIGHT);
      ctx.fillRect(CANVAS_WIDTH - 10, 0, 10, CANVAS_HEIGHT);

      // Move player
      const speed = 5;
      if (keysRef.current.left) {
        playerXRef.current = Math.max(PLAYER_WIDTH / 2 + 10, playerXRef.current - speed);
      }
      if (keysRef.current.right) {
        playerXRef.current = Math.min(CANVAS_WIDTH - PLAYER_WIDTH / 2 - 10, playerXRef.current + speed);
      }

      // Shoot
      if (keysRef.current.shoot && canShootRef.current && harpoonsRef.current.length < 2) {
        harpoonsRef.current.push({
          id: harpoonIdRef.current++,
          x: playerXRef.current,
          y: GROUND_Y - PLAYER_HEIGHT
        });
        canShootRef.current = false;
        playSound('shoot');
      }
      if (!keysRef.current.shoot) {
        canShootRef.current = true;
      }

      // Update and draw harpoons
      harpoonsRef.current = harpoonsRef.current.filter(harpoon => {
        harpoon.y -= HARPOON_SPEED;

        // Draw harpoon line
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(harpoon.x, GROUND_Y - PLAYER_HEIGHT);
        ctx.lineTo(harpoon.x, harpoon.y);
        ctx.stroke();

        // Draw harpoon head
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(harpoon.x - 8, harpoon.y + 15);
        ctx.lineTo(harpoon.x, harpoon.y);
        ctx.lineTo(harpoon.x + 8, harpoon.y + 15);
        ctx.closePath();
        ctx.fill();

        return harpoon.y > 0;
      });

      // Update balls
      let newBalls: Ball[] = [];
      let ballsToRemove: number[] = [];

      ballsRef.current.forEach(ball => {
        // Apply gravity
        ball.vy += GRAVITY;
        ball.x += ball.vx;
        ball.y += ball.vy;

        const radius = BALL_SIZES[ball.size].radius;

        // Bounce off walls
        if (ball.x - radius < 10) {
          ball.x = 10 + radius;
          ball.vx = Math.abs(ball.vx);
        }
        if (ball.x + radius > CANVAS_WIDTH - 10) {
          ball.x = CANVAS_WIDTH - 10 - radius;
          ball.vx = -Math.abs(ball.vx);
        }

        // Bounce off ground
        if (ball.y + radius > GROUND_Y) {
          ball.y = GROUND_Y - radius;
          ball.vy = -Math.abs(ball.vy) * BOUNCE_DAMPING;
          // Ensure minimum bounce
          if (Math.abs(ball.vy) < 5) ball.vy = -5 - ball.size.length;
        }

        // Bounce off ceiling
        if (ball.y - radius < 0) {
          ball.y = radius;
          ball.vy = Math.abs(ball.vy);
        }

        // Check collision with harpoons
        harpoonsRef.current.forEach((harpoon, hIndex) => {
          const dx = ball.x - harpoon.x;
          const dy = ball.y - harpoon.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < radius + 5) {
            ballsToRemove.push(ball.id);
            harpoonsRef.current.splice(hIndex, 1);
            newBalls.push(...splitBall(ball));
            setScore(prev => prev + BALL_SIZES[ball.size].points);
            playSound('pop');
          }
        });

        // Check collision with player
        const playerLeft = playerXRef.current - PLAYER_WIDTH / 2;
        const playerRight = playerXRef.current + PLAYER_WIDTH / 2;
        const playerTop = GROUND_Y - PLAYER_HEIGHT;

        if (
          ball.x + radius > playerLeft &&
          ball.x - radius < playerRight &&
          ball.y + radius > playerTop &&
          ball.y - radius < GROUND_Y
        ) {
          playSound('hit');
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGamePhase('gameover');
            } else {
              // Reset position after hit
              playerXRef.current = CANVAS_WIDTH / 2;
              harpoonsRef.current = [];
            }
            return newLives;
          });
        }

        // Draw ball
        drawObject(ctx, ball);
      });

      // Remove hit balls and add split ones
      ballsRef.current = ballsRef.current.filter(b => !ballsToRemove.includes(b.id));
      ballsRef.current.push(...newBalls);

      // Check win condition
      if (ballsRef.current.length === 0) {
        playSound('levelup');
        setLevel(prev => {
          const newLevel = prev + 1;
          if (newLevel > 5) {
            setGamePhase('win');
            return prev;
          }
          setTimeout(() => initLevel(newLevel), 1000);
          return newLevel;
        });
      }

      // Draw player (simple representation using character colors)
      const playerY = GROUND_Y - PLAYER_HEIGHT;
      ctx.fillStyle = '#4ECDC4';
      ctx.fillRect(playerXRef.current - PLAYER_WIDTH / 2, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

      // Player head
      ctx.fillStyle = '#FFE4C4';
      ctx.beginPath();
      ctx.arc(playerXRef.current, playerY - 5, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw UI
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`PUNTS: ${score}`, 20, 30);
      ctx.fillText(`NIVELL: ${level}`, CANVAS_WIDTH / 2 - 50, 30);
      ctx.fillText(`VIDES: ${'❤️'.repeat(lives)}`, CANVAS_WIDTH - 150, 30);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    gameLoopRef.current = animationId;

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gamePhase, selectedCharacter, level, initLevel, drawObject, splitBall, playSound, score, lives]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        keysRef.current.shoot = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp') keysRef.current.shoot = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch controls
  const handleTouchStart = (side: 'left' | 'right' | 'shoot') => {
    if (side === 'left') keysRef.current.left = true;
    else if (side === 'right') keysRef.current.right = true;
    else keysRef.current.shoot = true;
  };

  const handleTouchEnd = (side: 'left' | 'right' | 'shoot') => {
    if (side === 'left') keysRef.current.left = false;
    else if (side === 'right') keysRef.current.right = false;
    else keysRef.current.shoot = false;
  };

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('pangHighScore', score.toString());
    }
  }, [score, highScore]);

  // Character selection screen
  if (gamePhase === 'select') {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <h2 className="text-2xl text-yellow-400 font-bold border-b-4 border-yellow-400 pb-2 uppercase tracking-widest">
          SELECCIONA PERSONATGE
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full p-4 bg-white/5 border-2 border-white/10">
          {staff.map((member, i) => (
            <button
              key={i}
              onClick={() => startGame(member)}
              className="flex flex-col items-center p-4 hover:bg-yellow-400/20 transition-all cursor-pointer border-2 border-transparent hover:border-yellow-400 bg-black/30"
            >
              <PixelSprite config={member} size={80} direction="front" pose="standing" />
              <span className="text-sm text-yellow-400 mt-2 font-mono uppercase font-bold">{member.name}</span>
              <span className="text-[10px] text-white/60">{CHARACTER_DATA[member.name]?.description}</span>
            </button>
          ))}
        </div>

        <div className="text-center text-white/70 text-xs mt-2">
          <p>🎮 Controls: ← → moure | ESPAI disparar</p>
          <p>📱 Tàctil: Botons a pantalla</p>
        </div>

        <p className="text-yellow-400/60 text-sm">Rècord: {highScore} punts</p>

        <button
          onClick={onBack}
          className="mt-2 text-yellow-400 hover:text-white transition-colors uppercase text-sm border-2 border-yellow-400/30 px-6 py-2"
        >
          TORNAR AL MENÚ
        </button>
      </div>
    );
  }

  // Game over screen
  if (gamePhase === 'gameover') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        <h2 className="text-4xl text-red-500 font-bold animate-pulse">GAME OVER</h2>
        <p className="text-2xl text-yellow-400">Puntuació: {score}</p>
        {score >= highScore && <p className="text-green-400 text-lg animate-bounce">🏆 NOU RÈCORD!</p>}
        <div className="flex gap-4">
          <button
            onClick={() => startGame(selectedCharacter!)}
            className="bg-green-600 text-white px-8 py-3 font-bold hover:bg-green-500 transition-colors"
          >
            🔄 TORNAR A JUGAR
          </button>
          <button
            onClick={() => setGamePhase('select')}
            className="bg-blue-600 text-white px-8 py-3 font-bold hover:bg-blue-500 transition-colors"
          >
            👥 CANVIAR PERSONATGE
          </button>
        </div>
        <button
          onClick={onBack}
          className="text-yellow-400 hover:text-white transition-colors uppercase text-sm border-2 border-yellow-400/30 px-6 py-2"
        >
          TORNAR AL MENÚ
        </button>
      </div>
    );
  }

  // Win screen
  if (gamePhase === 'win') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        <h2 className="text-4xl text-green-400 font-bold animate-pulse">🎉 HAS GUANYAT!</h2>
        <p className="text-2xl text-yellow-400">Puntuació final: {score}</p>
        {score >= highScore && <p className="text-green-400 text-lg animate-bounce">🏆 NOU RÈCORD!</p>}
        <div className="flex gap-4">
          <button
            onClick={() => startGame(selectedCharacter!)}
            className="bg-green-600 text-white px-8 py-3 font-bold hover:bg-green-500 transition-colors"
          >
            🔄 JUGAR DE NOU
          </button>
          <button
            onClick={() => setGamePhase('select')}
            className="bg-blue-600 text-white px-8 py-3 font-bold hover:bg-blue-500 transition-colors"
          >
            👥 CANVIAR PERSONATGE
          </button>
        </div>
        <button
          onClick={onBack}
          className="text-yellow-400 hover:text-white transition-colors uppercase text-sm border-2 border-yellow-400/30 px-6 py-2"
        >
          TORNAR AL MENÚ
        </button>
      </div>
    );
  }

  // Playing screen
  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-yellow-400 bg-[#1a1a2e]"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      {/* Touch controls */}
      <div className="flex justify-between w-full max-w-[850px] mt-2 px-2 sm:hidden">
        <button
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={() => handleTouchEnd('left')}
          onMouseDown={() => handleTouchStart('left')}
          onMouseUp={() => handleTouchEnd('left')}
          className="bg-yellow-400/80 text-black w-16 h-16 text-2xl font-bold rounded-lg active:bg-yellow-300"
        >
          ◀
        </button>
        <button
          onTouchStart={() => handleTouchStart('shoot')}
          onTouchEnd={() => handleTouchEnd('shoot')}
          onMouseDown={() => handleTouchStart('shoot')}
          onMouseUp={() => handleTouchEnd('shoot')}
          className="bg-red-500/80 text-white w-20 h-16 text-lg font-bold rounded-lg active:bg-red-400"
        >
          🎯 TIR
        </button>
        <button
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={() => handleTouchEnd('right')}
          onMouseDown={() => handleTouchStart('right')}
          onMouseUp={() => handleTouchEnd('right')}
          className="bg-yellow-400/80 text-black w-16 h-16 text-2xl font-bold rounded-lg active:bg-yellow-300"
        >
          ▶
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-yellow-400 hover:text-white transition-colors uppercase text-xs border border-yellow-400/30 px-4 py-1"
      >
        ✕ SORTIR
      </button>
    </div>
  );
};

export default PangGame;
