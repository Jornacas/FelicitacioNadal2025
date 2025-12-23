
export interface SpriteConfig {
  hairColor: string;
  skinColor: string;
  shirtColor: string;
  pantsColor: string;
  accessory?: 'glasses' | 'santa-hat' | 'reindeer-ears' | 'none';
  name: string;
  role: string;
  beard?: 'none' | 'stubble' | 'red' | 'orange';
  hairType?: 'normal' | 'thinning' | 'curly' | 'long' | 'curly-long' | 'bob';
}

export type SpriteDirection = 'side' | 'front';
export type SpritePose = 'walking' | 'standing' | 'waving' | 'holding-gift';

export const GIFT_COLORS = ['#FF0000', '#00AA00', '#0066FF', '#FF00FF', '#FFAA00', '#00AAAA'];

export enum GameState {
  LOADING = 'LOADING',
  MENU = 'MENU',
  GAME = 'GAME',
  MINIGAME = 'MINIGAME'
}

export const AMSTRAD_PALETTE = {
  black: '#000000',
  brown: '#8B4513',
  blue: '#000080',
  brightBlue: '#0000FF',
  red: '#800000',
  magenta: '#800080',
  mauve: '#8000FF',
  brightRed: '#FF0000',
  purple: '#FF0080',
  brightMagenta: '#FF00FF',
  green: '#008000',
  cyan: '#008080',
  skyBlue: '#0080FF',
  yellow: '#808000',
  white: '#808080',
  pastelBlue: '#8080FF',
  orange: '#FF8000',
  pink: '#FF8080',
  pastelMagenta: '#FF80FF',
  brightGreen: '#00FF00',
  seaGreen: '#00FF80',
  brightCyan: '#00FFFF',
  lime: '#80FF00',
  pastelGreen: '#80FF80',
  pastelCyan: '#80FFFF',
  brightYellow: '#FFFF00',
  pastelYellow: '#FFFF80',
  brightWhite: '#FFFFFF'
};
