
import React, { useEffect, useRef } from 'react';
import { SpriteConfig, AMSTRAD_PALETTE, SpriteDirection, SpritePose, GIFT_COLORS } from '../types';

interface PixelSpriteProps {
  config: SpriteConfig;
  size?: number;
  direction?: SpriteDirection;
  pose?: SpritePose;
  giftIndex?: number;
  showGift?: boolean;
}

const PixelSprite: React.FC<PixelSpriteProps> = ({
  config,
  size = 80,
  direction = 'front',
  pose = 'standing',
  giftIndex = 0,
  showGift = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const p = size / 24; // pixel size

      const drawPixel = (x: number, y: number, color: string) => {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(x * p), Math.floor(y * p), Math.ceil(p) + 0.5, Math.ceil(p) + 0.5);
      };

      const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < h; j++) {
            drawPixel(x + i, y + j, color);
          }
        }
      };

      const getPaletteColor = (colorName: string) => {
        const normalized = colorName.toLowerCase();
        const entry = Object.entries(AMSTRAD_PALETTE).find(([key]) => key.toLowerCase() === normalized);
        return entry ? entry[1] : AMSTRAD_PALETTE.black;
      };

      const { hairColor, skinColor, shirtColor, pantsColor, accessory, name, beard, hairType } = config;
      const hColor = getPaletteColor(hairColor);
      const sColor = getPaletteColor(skinColor);
      const tColor = getPaletteColor(shirtColor);
      const lColor = getPaletteColor(pantsColor);
      const giftColor = GIFT_COLORS[giftIndex % GIFT_COLORS.length];

      const time = Date.now();
      const walkCycle = pose === 'walking' ? Math.floor(time / 150) % 4 : 0;
      const bounce = pose === 'walking' ? Math.sin(time / 150 * Math.PI) * 0.5 : 0;

      const cx = 12;
      const startY = 4 + bounce; // Adjusted so feet touch bottom of canvas (feet end at y=23)

      if (direction === 'side') {
        // ============ SIDE VIEW (Profile) ============

        // Hair
        const hairTop = startY;
        if (hairType === 'thinning') {
          drawRect(cx - 2, hairTop, 5, 2, hColor);
          drawRect(cx - 3, hairTop + 2, 2, 3, hColor);
        } else if (hairType === 'curly' || hairType === 'curly-long') {
          // Curly hair with pixel texture
          drawRect(cx - 3, hairTop, 7, 3, hColor);
          // Left side curls
          drawRect(cx - 4, hairTop + 1, 2, 3, hColor);
          drawPixel(cx - 5, hairTop + 2, hColor);
          drawPixel(cx - 5, hairTop + 4, hColor);
          drawRect(cx - 4, hairTop + 4, 2, 3, hColor);
          drawPixel(cx - 5, hairTop + 6, hColor);
          if (hairType === 'curly-long') {
            // Long curly - more volume
            drawRect(cx - 4, hairTop + 7, 2, 4, hColor);
            drawPixel(cx - 5, hairTop + 8, hColor);
            drawPixel(cx - 5, hairTop + 10, hColor);
            drawPixel(cx - 4, hairTop + 11, hColor);
            // Right side curls
            drawRect(cx + 3, hairTop + 2, 2, 6, hColor);
            drawPixel(cx + 5, hairTop + 3, hColor);
            drawPixel(cx + 5, hairTop + 5, hColor);
            drawPixel(cx + 5, hairTop + 7, hColor);
          }
        } else if (hairType === 'long') {
          drawRect(cx - 3, hairTop, 6, 2, hColor);
          drawRect(cx - 4, hairTop + 1, 2, 10, hColor);
          drawRect(cx + 2, hairTop + 1, 2, 8, hColor);
        } else if (hairType === 'bob') {
          // Bob/melena corta
          drawRect(cx - 3, hairTop, 6, 3, hColor);
          drawRect(cx - 4, hairTop + 1, 2, 6, hColor);
          drawRect(cx + 2, hairTop + 2, 2, 5, hColor);
        } else {
          drawRect(cx - 3, hairTop, 6, 2, hColor);
          drawRect(cx - 3, hairTop + 2, 2, 2, hColor);
        }

        // Head (side view - more narrow)
        const headTop = startY + 2;
        drawRect(cx - 2, headTop, 5, 6, sColor);
        // Nose
        drawPixel(cx + 3, headTop + 2, sColor);

        // Eye (side - just one)
        drawPixel(cx + 1, headTop + 2, '#000000');

        // Glasses side view
        if (accessory === 'glasses' || ['David', 'Lucia', 'Lidia'].includes(name)) {
          drawPixel(cx, headTop + 2, '#333333');
          drawPixel(cx + 2, headTop + 2, '#333333');
        }

        // Beard side
        if (beard === 'red' || beard === 'orange') {
          const bColor = beard === 'orange' ? AMSTRAD_PALETTE.orange : AMSTRAD_PALETTE.brightRed;
          drawRect(cx, headTop + 4, 3, 2, bColor);
          drawRect(cx + 1, headTop + 6, 2, 1, bColor);
        } else if (beard === 'stubble') {
          drawRect(cx, headTop + 4, 3, 2, '#666666');
        }

        // Body side
        const bodyTop = headTop + 6;
        drawRect(cx - 2, bodyTop, 5, 5, tColor);

        // Arms side (one arm visible, maybe holding gift)
        if (showGift && (pose === 'walking' || pose === 'holding-gift')) {
          // Arm extended holding gift
          drawRect(cx + 3, bodyTop + 1, 3, 2, sColor);
          // Gift box
          drawRect(cx + 5, bodyTop, 4, 3, giftColor);
          drawRect(cx + 6, bodyTop - 1, 2, 1, '#FFD700'); // ribbon
          drawPixel(cx + 7, bodyTop - 2, '#FFD700'); // bow
        } else {
          const armSwing = pose === 'walking' ? Math.sin(time / 150) * 2 : 0;
          drawRect(cx + 2, bodyTop + 1 + armSwing, 2, 4, sColor);
        }

        // Legs side (walking animation)
        const legTop = bodyTop + 5;
        if (pose === 'walking') {
          const leg1 = walkCycle < 2 ? 2 : -2;
          const leg2 = walkCycle < 2 ? -2 : 2;
          drawRect(cx - 1 + leg1, legTop, 2, 5, lColor);
          drawRect(cx + 1 + leg2, legTop, 2, 5, lColor);
        } else {
          drawRect(cx - 1, legTop, 2, 5, lColor);
          drawRect(cx + 1, legTop, 2, 5, lColor);
        }

        // Shoes
        drawRect(cx - 1, legTop + 5, 3, 1, '#222222');
        drawRect(cx + 1, legTop + 5, 3, 1, '#222222');

      } else {
        // ============ FRONT VIEW ============

        // Hair
        const hairTop = startY;
        if (hairType === 'thinning') {
          drawRect(cx - 4, hairTop + 1, 2, 4, hColor);
          drawRect(cx + 2, hairTop + 1, 2, 4, hColor);
          drawPixel(cx - 1, hairTop, hColor);
          drawPixel(cx + 1, hairTop, hColor);
        } else if (hairType === 'curly' || hairType === 'curly-long') {
          // Curly hair front - with pixel texture for curls
          drawRect(cx - 4, hairTop, 8, 3, hColor);
          // Left curls with texture
          drawRect(cx - 5, hairTop + 1, 2, 4, hColor);
          drawPixel(cx - 6, hairTop + 2, hColor);
          drawPixel(cx - 6, hairTop + 4, hColor);
          drawRect(cx - 5, hairTop + 5, 2, 3, hColor);
          drawPixel(cx - 6, hairTop + 6, hColor);
          // Right curls with texture
          drawRect(cx + 3, hairTop + 1, 2, 4, hColor);
          drawPixel(cx + 5, hairTop + 2, hColor);
          drawPixel(cx + 5, hairTop + 4, hColor);
          drawRect(cx + 3, hairTop + 5, 2, 3, hColor);
          drawPixel(cx + 5, hairTop + 6, hColor);
          if (hairType === 'curly-long') {
            // Longer curls
            drawRect(cx - 5, hairTop + 8, 2, 4, hColor);
            drawPixel(cx - 6, hairTop + 9, hColor);
            drawPixel(cx - 6, hairTop + 11, hColor);
            drawRect(cx + 3, hairTop + 8, 2, 4, hColor);
            drawPixel(cx + 5, hairTop + 9, hColor);
            drawPixel(cx + 5, hairTop + 11, hColor);
          }
        } else if (hairType === 'long') {
          drawRect(cx - 4, hairTop, 8, 2, hColor);
          drawRect(cx - 5, hairTop + 1, 2, 10, hColor);
          drawRect(cx + 3, hairTop + 1, 2, 10, hColor);
        } else if (hairType === 'bob') {
          // Bob/melena corta (front)
          drawRect(cx - 4, hairTop, 8, 3, hColor);
          drawRect(cx - 5, hairTop + 1, 2, 6, hColor);
          drawRect(cx + 3, hairTop + 1, 2, 6, hColor);
        } else {
          drawRect(cx - 4, hairTop, 8, 2, hColor);
          drawRect(cx - 4, hairTop + 2, 1, 2, hColor);
          drawRect(cx + 3, hairTop + 2, 1, 2, hColor);
        }

        // Head front
        const headTop = startY + 2;
        drawRect(cx - 3, headTop, 6, 6, sColor);

        // Eyes
        const eyeY = headTop + 2;
        drawPixel(cx - 2, eyeY, '#FFFFFF');
        drawPixel(cx + 1, eyeY, '#FFFFFF');
        drawPixel(cx - 2, eyeY + 1, '#000000');
        drawPixel(cx + 1, eyeY + 1, '#000000');

        // Glasses front
        if (accessory === 'glasses' || ['David', 'Lucia', 'Lidia'].includes(name)) {
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = p * 0.5;
          ctx.strokeRect((cx - 3) * p, eyeY * p, 3 * p, 2 * p);
          ctx.strokeRect(cx * p, eyeY * p, 3 * p, 2 * p);
        }

        // Mouth
        drawPixel(cx - 1, headTop + 4, '#CC6666');
        drawPixel(cx, headTop + 4, '#CC6666');

        // Beard front
        if (beard === 'red' || beard === 'orange') {
          const bColor = beard === 'orange' ? AMSTRAD_PALETTE.orange : AMSTRAD_PALETTE.brightRed;
          drawRect(cx - 2, headTop + 4, 4, 2, bColor);
          drawRect(cx - 1, headTop + 6, 2, 1, bColor);
        } else if (beard === 'stubble') {
          drawRect(cx - 2, headTop + 4, 4, 2, '#666666');
        }

        // Body front
        const bodyTop = headTop + 6;
        drawRect(cx - 3, bodyTop, 6, 5, tColor);

        // Arms front
        if (pose === 'waving') {
          // Left arm normal
          drawRect(cx - 5, bodyTop, 2, 4, sColor);
          // Right arm raised
          drawRect(cx + 3, bodyTop - 3, 2, 4, sColor);
          // Hand waving
          const wave = Math.sin(time / 100) > 0 ? -1 : 1;
          drawRect(cx + 3 + wave, bodyTop - 4, 2, 2, sColor);
        } else if (showGift && pose === 'holding-gift') {
          // Both arms holding gift in front
          drawRect(cx - 5, bodyTop + 1, 2, 3, sColor);
          drawRect(cx + 3, bodyTop + 1, 2, 3, sColor);
          // Gift in front
          drawRect(cx - 2, bodyTop + 3, 4, 3, giftColor);
          drawRect(cx - 1, bodyTop + 2, 2, 1, '#FFD700');
          drawPixel(cx, bodyTop + 1, '#FFD700');
        } else {
          drawRect(cx - 5, bodyTop, 2, 4, sColor);
          drawRect(cx + 3, bodyTop, 2, 4, sColor);
        }

        // Legs front
        const legTop = bodyTop + 5;
        drawRect(cx - 3, legTop, 2, 5, lColor);
        drawRect(cx + 1, legTop, 2, 5, lColor);

        // Shoes
        drawRect(cx - 4, legTop + 5, 3, 1, '#222222');
        drawRect(cx + 1, legTop + 5, 3, 1, '#222222');
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, size, direction, pose, giftIndex, showGift]);

  const canvasHeight = Math.floor(size * 1.2); // Enough space for full character

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={canvasHeight}
        className="relative z-10"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="bg-black/40 rounded-full blur-sm w-6 h-1 -mt-1"></div>
      <div className="mt-0 bg-yellow-400 text-black px-2 py-0.5 font-bold text-[8px] border border-black shadow-[1px_1px_0px_#000] uppercase">
        {config.name}
      </div>
    </div>
  );
};

export default PixelSprite;
