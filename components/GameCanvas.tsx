
import React, { useEffect, useRef } from 'react';
import { SpriteConfig, AMSTRAD_PALETTE, GIFT_COLORS } from '../types';

interface GameCanvasProps {
  width: number;
  height: number;
  staff: SpriteConfig[];
  storyStep: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ width, height, staff, storyStep }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // === GROUND ===
      const groundY = height - 50;
      const gradient = ctx.createLinearGradient(0, groundY, 0, height);
      gradient.addColorStop(0, '#E0F0FF');
      gradient.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, groundY, width, 50);

      const time = Date.now();

      // === SANTA'S SLEIGH WITH BANNER (drawn FIRST so it goes BEHIND tree) ===
      const sleighCycle = (time / 35) % (width + 600);
      const sleighX = -250 + sleighCycle;
      const sleighY = 200 + Math.sin(time / 500) * 8;

      if (sleighX > -100 && sleighX < width + 300) {
        // Banner FIRST (behind everything) - trails to the left - BIGGER
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(sleighX - 240, sleighY - 8, 220, 38);
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(sleighX - 240, sleighY - 8, 220, 38);
        // Banner text - BIGGER
        ctx.fillStyle = '#CC0000';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EIXOS CREATIVA', sleighX - 130, sleighY + 8);
        ctx.fillText('US DESITJA BON NADAL!', sleighX - 130, sleighY + 24);
        // Banner rope
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sleighX - 20, sleighY + 10);
        ctx.lineTo(sleighX + 5, sleighY + 8);
        ctx.stroke();

        // Sleigh
        ctx.fillStyle = '#CC0000';
        ctx.beginPath();
        ctx.moveTo(sleighX + 10, sleighY);
        ctx.lineTo(sleighX + 70, sleighY);
        ctx.lineTo(sleighX + 80, sleighY + 20);
        ctx.lineTo(sleighX, sleighY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(sleighX - 5, sleighY + 20, 95, 4);
        ctx.beginPath();
        ctx.arc(sleighX + 90, sleighY + 22, 4, 0, Math.PI * 2);
        ctx.fill();

        // Santa
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(sleighX + 25, sleighY - 20, 22, 28);
        ctx.fillStyle = '#FFCC99';
        ctx.fillRect(sleighX + 38, sleighY - 15, 10, 10);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(sleighX + 40, sleighY - 5, 10, 10);
        ctx.fillStyle = '#CC0000';
        ctx.beginPath();
        ctx.moveTo(sleighX + 38, sleighY - 15);
        ctx.lineTo(sleighX + 48, sleighY - 30);
        ctx.lineTo(sleighX + 50, sleighY - 15);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(sleighX + 48, sleighY - 30, 4, 0, Math.PI * 2);
        ctx.fill();
        const waveArm = Math.sin(time / 150) * 5;
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(sleighX + 48, sleighY - 18 + waveArm, 8, 5);
        ctx.fillStyle = '#FFCC99';
        ctx.fillRect(sleighX + 54, sleighY - 20 + waveArm, 5, 5);

        // Reins
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sleighX + 55, sleighY - 5);
        ctx.quadraticCurveTo(sleighX + 90, sleighY - 10, sleighX + 110, sleighY + 5);
        ctx.stroke();

        // Reindeer
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(sleighX + 110, sleighY, 30, 15);
        ctx.fillRect(sleighX + 140, sleighY - 5, 15, 15);
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(sleighX + 143, sleighY - 18, 3, 14);
        ctx.fillRect(sleighX + 150, sleighY - 18, 3, 14);
        ctx.fillRect(sleighX + 140, sleighY - 15, 6, 3);
        ctx.fillRect(sleighX + 148, sleighY - 15, 6, 3);
        ctx.fillStyle = '#8B4513';
        const legAnim = Math.sin(time / 80) * 4;
        ctx.fillRect(sleighX + 115, sleighY + 15 + legAnim, 4, 10);
        ctx.fillRect(sleighX + 130, sleighY + 15 - legAnim, 4, 10);
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(sleighX + 156, sleighY + 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(sleighX + 150, sleighY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // === TREE (BIGGER) ===
      const treeX = width / 2;
      const treeBaseY = groundY;

      // Trunk - bigger
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(treeX - 20, treeBaseY - 50, 40, 50);
      ctx.fillStyle = '#4E342E';
      ctx.fillRect(treeX - 15, treeBaseY - 50, 5, 50);

      // Tree tiers (bigger triangles)
      ctx.fillStyle = '#1B5E20';
      drawTriangle(ctx, treeX, treeBaseY - 50, 180, 80);
      ctx.fillStyle = '#2E7D32';
      drawTriangle(ctx, treeX, treeBaseY - 110, 140, 70);
      ctx.fillStyle = '#388E3C';
      drawTriangle(ctx, treeX, treeBaseY - 160, 100, 60);
      ctx.fillStyle = '#43A047';
      drawTriangle(ctx, treeX, treeBaseY - 200, 60, 45);

      // Star - bigger and glowing
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 20;
      drawStar(ctx, treeX, treeBaseY - 250, 25);
      ctx.shadowBlur = 0;

      // Ornaments - more and bigger
      const ornamentColors = ['#FF0000', '#FFD700', '#00BFFF', '#FF69B4', '#32CD32', '#FF6600', '#9932CC'];
      const ornaments = [
        { x: -60, y: -70 }, { x: 60, y: -70 }, { x: 0, y: -65 }, { x: -30, y: -75 }, { x: 30, y: -75 },
        { x: -45, y: -120 }, { x: 45, y: -120 }, { x: 0, y: -115 }, { x: -20, y: -125 }, { x: 20, y: -125 },
        { x: -30, y: -170 }, { x: 30, y: -170 }, { x: 0, y: -165 },
        { x: -15, y: -205 }, { x: 15, y: -205 }
      ];
      ornaments.forEach((o, i) => {
        ctx.fillStyle = ornamentColors[i % ornamentColors.length];
        ctx.shadowColor = ornamentColors[i % ornamentColors.length];
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(treeX + o.x, treeBaseY + o.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Garland
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(treeX - 70, treeBaseY - 80);
      ctx.quadraticCurveTo(treeX, treeBaseY - 60, treeX + 70, treeBaseY - 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(treeX - 50, treeBaseY - 130);
      ctx.quadraticCurveTo(treeX, treeBaseY - 110, treeX + 50, treeBaseY - 130);
      ctx.stroke();
      ctx.setLineDash([]);

      // === CHARACTERS (BIGGER - 4px per pixel unit) ===
      const characterBaseY = groundY;

      staff.forEach((member, idx) => {
        const isLeftSide = idx < 3;
        const sideIdx = isLeftSide ? idx : idx - 3;
        const delay = sideIdx * 150;
        const localStep = Math.max(0, storyStep - delay);

        const startX = isLeftSide ? -60 : width + 60;
        const treeTargetX = isLeftSide ? treeX - 100 : treeX + 100;
        const finalPositions = [
          width * 0.06, width * 0.18, width * 0.30,
          width * 0.70, width * 0.82, width * 0.94
        ];
        const finalX = finalPositions[idx];

        let xPos = startX;
        let direction: 'side' | 'front' = 'side';
        let pose: 'walking' | 'standing' | 'waving' = 'walking';
        let showGift = true;
        let facingRight = isLeftSide;

        if (localStep < 400) {
          const progress = localStep / 400;
          xPos = startX + (treeTargetX - startX) * progress;
          direction = 'side';
          pose = 'walking';
          showGift = true;
          facingRight = isLeftSide;
        } else if (localStep < 550) {
          xPos = treeTargetX;
          direction = 'side';
          pose = 'standing';
          showGift = localStep < 480;
          facingRight = isLeftSide;
        } else if (localStep < 900) {
          const progress = (localStep - 550) / 350;
          xPos = treeTargetX + (finalX - treeTargetX) * progress;
          direction = 'side';
          pose = 'walking';
          showGift = false;
          facingRight = !isLeftSide;
        } else if (localStep < 1000) {
          xPos = finalX;
          direction = 'front';
          pose = 'standing';
          showGift = false;
        } else {
          xPos = finalX;
          direction = 'front';
          pose = 'waving';
          showGift = false;
        }

        drawCharacter(ctx, xPos, characterBaseY, member, direction, pose, facingRight, showGift, idx, time);
      });

      // === GIFTS UNDER TREE ===
      if (storyStep > 600) {
        staff.forEach((_, idx) => {
          const sideIdx = idx < 3 ? idx : idx - 3;
          const giftDelay = sideIdx * 180 + 550;
          if (storyStep > giftDelay) {
            const giftX = treeX - 50 + (idx * 18);
            const giftY = groundY; // Bottom of gift touches the ground
            ctx.fillStyle = GIFT_COLORS[idx % GIFT_COLORS.length];
            ctx.fillRect(giftX - 10, giftY - 14, 20, 14);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(giftX - 2, giftY - 14, 4, 14);
            ctx.fillRect(giftX - 6, giftY - 10, 12, 3);
            // Bow
            ctx.beginPath();
            ctx.arc(giftX - 4, giftY - 16, 3, 0, Math.PI * 2);
            ctx.arc(giftX + 4, giftY - 16, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, staff, storyStep]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

function drawTriangle(ctx: CanvasRenderingContext2D, x: number, baseY: number, baseWidth: number, height: number) {
  ctx.beginPath();
  ctx.moveTo(x, baseY - height);
  ctx.lineTo(x - baseWidth / 2, baseY);
  ctx.lineTo(x + baseWidth / 2, baseY);
  ctx.closePath();
  ctx.fill();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * size;
    const py = y + Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function getPaletteColor(colorName: string): string {
  const normalized = colorName.toLowerCase();
  const entry = Object.entries(AMSTRAD_PALETTE).find(([key]) => key.toLowerCase() === normalized);
  return entry ? entry[1] : AMSTRAD_PALETTE.black;
}

// BIGGER characters with more detail (4px per unit)
function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  feetY: number,
  config: SpriteConfig,
  direction: 'side' | 'front',
  pose: 'walking' | 'standing' | 'waving',
  facingRight: boolean,
  showGift: boolean,
  giftIndex: number,
  time: number
) {
  const p = 4; // Pixel size - BIGGER
  const characterHeight = 20 * p; // 80px tall - shoes end exactly at feetY

  const drawPixel = (px: number, py: number, color: string) => {
    ctx.fillStyle = color;
    const drawX = facingRight ? x + px * p : x - px * p - p;
    ctx.fillRect(Math.floor(drawX), Math.floor(feetY - characterHeight + py * p), p, p);
  };

  const drawRect = (px: number, py: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        const drawX = facingRight ? x + (px + i) * p : x - (px + i) * p - p;
        ctx.fillRect(Math.floor(drawX), Math.floor(feetY - characterHeight + (py + j) * p), p, p);
      }
    }
  };

  const { hairColor, skinColor, shirtColor, pantsColor, name, beard, hairType } = config;
  const hColor = getPaletteColor(hairColor);
  const sColor = getPaletteColor(skinColor);
  const tColor = getPaletteColor(shirtColor);
  const lColor = getPaletteColor(pantsColor);
  const giftColor = GIFT_COLORS[giftIndex % GIFT_COLORS.length];

  const walkCycle = pose === 'walking' ? Math.floor(time / 150) % 4 : 0;
  const bounce = pose === 'walking' ? Math.sin(time / 150 * Math.PI) * 0.5 : 0;
  const startY = Math.floor(bounce);

  if (direction === 'side') {
    // === SIDE VIEW - More detailed ===

    // Hair - different styles
    if (hairType === 'thinning') {
      // David - thinning/balding
      drawRect(-1, startY, 5, 2, hColor);
      drawRect(-2, startY + 2, 2, 2, hColor);
    } else if (hairType === 'curly' || hairType === 'curly-long') {
      // Laura - curly long brown hair
      drawRect(-2, startY, 6, 3, hColor);
      drawRect(-3, startY + 1, 2, 6, hColor);
      drawPixel(-4, startY + 2, hColor);
      drawPixel(-4, startY + 4, hColor);
      drawPixel(-4, startY + 6, hColor);
      if (hairType === 'curly-long') {
        drawRect(-3, startY + 7, 2, 5, hColor);
        drawPixel(-4, startY + 8, hColor);
        drawPixel(-4, startY + 10, hColor);
      }
    } else if (hairType === 'long') {
      // Lucia/Anna - long straight hair
      drawRect(-2, startY, 6, 2, hColor);
      drawRect(-3, startY + 1, 2, 10, hColor);
      drawRect(3, startY + 2, 2, 8, hColor);
    } else if (hairType === 'bob') {
      // Lidia - short bob/melena corta
      drawRect(-2, startY, 6, 3, hColor);
      drawRect(-3, startY + 1, 2, 6, hColor);
      drawRect(3, startY + 2, 2, 5, hColor);
      drawPixel(-3, startY + 7, hColor);
      drawPixel(3, startY + 7, hColor);
    } else {
      // Normal short hair (Jordi)
      drawRect(-2, startY, 6, 3, hColor);
      drawRect(-2, startY + 3, 2, 2, hColor);
    }

    // Head
    drawRect(-1, startY + 2, 5, 6, sColor);
    drawPixel(4, startY + 4, sColor); // Nose

    // Eye
    drawPixel(2, startY + 4, '#FFFFFF');
    drawPixel(2, startY + 5, '#000000');

    // Glasses - David, Lucia, Lidia
    if (['David', 'Lucia', 'Lidia'].includes(name)) {
      drawPixel(1, startY + 4, '#333333');
      drawPixel(3, startY + 4, '#333333');
      drawPixel(1, startY + 5, '#333333');
      drawPixel(3, startY + 5, '#333333');
    }

    // Beard
    if (beard === 'orange') {
      // David - orange beard
      drawRect(1, startY + 6, 4, 2, AMSTRAD_PALETTE.orange);
      drawRect(2, startY + 8, 2, 1, AMSTRAD_PALETTE.orange);
    } else if (beard === 'stubble') {
      // Jordi - stubble
      drawRect(1, startY + 6, 3, 2, '#555555');
    }

    // Body/Shirt
    drawRect(-1, startY + 8, 5, 5, tColor);
    // Shirt detail
    ctx.fillStyle = shadeColor(tColor, -20);
    drawPixel(0, startY + 9, ctx.fillStyle);
    drawPixel(0, startY + 10, ctx.fillStyle);

    // Arms
    if (showGift) {
      drawRect(4, startY + 9, 3, 2, sColor);
      // Gift box
      drawRect(6, startY + 8, 4, 4, giftColor);
      drawRect(7, startY + 7, 2, 1, '#FFD700');
      drawPixel(8, startY + 6, '#FFD700');
    } else {
      const armSwing = pose === 'walking' ? Math.sin(time / 150) * 2 : 0;
      drawRect(3, startY + 9 + Math.floor(armSwing), 2, 4, sColor);
    }

    // Legs with walking animation
    if (pose === 'walking') {
      const leg1 = walkCycle < 2 ? 2 : -1;
      const leg2 = walkCycle < 2 ? -1 : 2;
      drawRect(0 + leg1, startY + 13, 2, 5, lColor);
      drawRect(2 + leg2, startY + 13, 2, 5, lColor);
      // Shoes
      drawRect(0 + leg1, startY + 18, 3, 2, '#1a1a1a');
      drawRect(2 + leg2, startY + 18, 3, 2, '#1a1a1a');
    } else {
      drawRect(0, startY + 13, 2, 5, lColor);
      drawRect(2, startY + 13, 2, 5, lColor);
      drawRect(0, startY + 18, 3, 2, '#1a1a1a');
      drawRect(2, startY + 18, 3, 2, '#1a1a1a');
    }

  } else {
    // === FRONT VIEW - More detailed ===

    // Hair
    if (hairType === 'thinning') {
      drawRect(-4, startY + 1, 2, 4, hColor);
      drawRect(3, startY + 1, 2, 4, hColor);
      drawPixel(-1, startY, hColor);
      drawPixel(1, startY, hColor);
    } else if (hairType === 'curly' || hairType === 'curly-long') {
      drawRect(-4, startY, 9, 3, hColor);
      drawRect(-5, startY + 1, 2, 6, hColor);
      drawRect(4, startY + 1, 2, 6, hColor);
      drawPixel(-6, startY + 2, hColor);
      drawPixel(-6, startY + 4, hColor);
      drawPixel(6, startY + 2, hColor);
      drawPixel(6, startY + 4, hColor);
      if (hairType === 'curly-long') {
        drawRect(-5, startY + 7, 2, 5, hColor);
        drawRect(4, startY + 7, 2, 5, hColor);
        drawPixel(-6, startY + 8, hColor);
        drawPixel(-6, startY + 10, hColor);
        drawPixel(6, startY + 8, hColor);
        drawPixel(6, startY + 10, hColor);
      }
    } else if (hairType === 'long') {
      drawRect(-4, startY, 9, 2, hColor);
      drawRect(-5, startY + 1, 2, 10, hColor);
      drawRect(4, startY + 1, 2, 10, hColor);
    } else if (hairType === 'bob') {
      // Lidia - bob/melena corta (front view)
      drawRect(-4, startY, 9, 3, hColor);
      drawRect(-5, startY + 1, 2, 6, hColor);
      drawRect(4, startY + 1, 2, 6, hColor);
      drawPixel(-5, startY + 7, hColor);
      drawPixel(4, startY + 7, hColor);
    } else {
      drawRect(-4, startY, 9, 3, hColor);
      drawRect(-4, startY + 3, 2, 2, hColor);
      drawRect(3, startY + 3, 2, 2, hColor);
    }

    // Head
    drawRect(-3, startY + 2, 7, 6, sColor);

    // Eyes
    drawRect(-2, startY + 4, 2, 2, '#FFFFFF');
    drawRect(1, startY + 4, 2, 2, '#FFFFFF');
    drawPixel(-1, startY + 5, '#000000');
    drawPixel(2, startY + 5, '#000000');

    // Glasses
    if (['David', 'Lucia', 'Lidia'].includes(name)) {
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      const gx = facingRight ? x - 3 * p : x - 4 * p;
      ctx.strokeRect(gx, feetY - characterHeight + (startY + 4) * p, 2.5 * p, 2.5 * p);
      ctx.strokeRect(gx + 3.5 * p, feetY - characterHeight + (startY + 4) * p, 2.5 * p, 2.5 * p);
      // Bridge
      ctx.beginPath();
      ctx.moveTo(gx + 2.5 * p, feetY - characterHeight + (startY + 5) * p);
      ctx.lineTo(gx + 3.5 * p, feetY - characterHeight + (startY + 5) * p);
      ctx.stroke();
    }

    // Mouth
    drawPixel(-1, startY + 7, '#CC6666');
    drawPixel(0, startY + 7, '#CC6666');
    drawPixel(1, startY + 7, '#CC6666');

    // Beard
    if (beard === 'orange') {
      drawRect(-2, startY + 6, 5, 2, AMSTRAD_PALETTE.orange);
      drawRect(-1, startY + 8, 3, 1, AMSTRAD_PALETTE.orange);
    } else if (beard === 'stubble') {
      drawRect(-2, startY + 6, 5, 2, '#555555');
    }

    // Body/Shirt
    drawRect(-3, startY + 8, 7, 5, tColor);
    // Shirt detail/shading
    ctx.fillStyle = shadeColor(tColor, -15);
    drawRect(-2, startY + 9, 1, 3, ctx.fillStyle);
    drawRect(2, startY + 9, 1, 3, ctx.fillStyle);

    // Arms
    if (pose === 'waving') {
      // Left arm down
      drawRect(-5, startY + 8, 2, 4, sColor);
      // Right arm UP waving
      drawRect(4, startY + 4, 2, 5, sColor);
      const wave = Math.sin(time / 100) > 0 ? -1 : 1;
      drawRect(4 + wave, startY + 2, 2, 3, sColor);
      // Hand
      drawRect(4 + wave, startY + 1, 2, 2, sColor);
    } else {
      drawRect(-5, startY + 8, 2, 4, sColor);
      drawRect(4, startY + 8, 2, 4, sColor);
    }

    // Legs
    drawRect(-3, startY + 13, 3, 5, lColor);
    drawRect(1, startY + 13, 3, 5, lColor);

    // Shoes
    drawRect(-4, startY + 18, 4, 2, '#1a1a1a');
    drawRect(1, startY + 18, 4, 2, '#1a1a1a');
  }

  // Name tag below character
  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  const tagWidth = Math.max(name.length * 6 + 8, 40);
  ctx.fillRect(x - tagWidth/2, feetY + 5, tagWidth, 14);
  ctx.strokeRect(x - tagWidth/2, feetY + 5, tagWidth, 14);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), x, feetY + 16);
}

// Helper to darken/lighten colors
function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

export default GameCanvas;
