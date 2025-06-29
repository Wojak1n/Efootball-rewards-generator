// Types for the spinning wheel application
export interface WheelItem {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export interface SpinResult {
  item: WheelItem;
  rotation: number;
}

export type AppState = 'input' | 'spinning' | 'result';