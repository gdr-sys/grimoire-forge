export interface ColorStop {
  color: string;
  position: number;
}

export interface BoxShadow {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
}

export interface Border {
  style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  color: string;
  width: number;
  radius: number;
}

export interface BlockStyle {
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  marginTop: number;
  marginBottom: number;
  background: string;
  backgroundType: 'color' | 'gradient' | 'image' | 'transparent';
  border: Border;
  decorativeBorderId: string | null;
  shadow: BoxShadow;
  opacity: number;
  width: 'auto' | '100%' | '75%' | '66%' | '50%' | '33%' | '25%' | string;
  alignment: 'auto' | 'left' | 'center' | 'right';
  float: 'none' | 'left' | 'right';
  customClass: string;
  customCss: string;
  anchorId: string;
}

export const DEFAULT_BLOCK_STYLE: BlockStyle = {
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  marginTop: 0,
  marginBottom: 8,
  background: 'transparent',
  backgroundType: 'transparent',
  border: { style: 'none', color: '#000000', width: 1, radius: 0 },
  decorativeBorderId: null,
  shadow: { enabled: false, offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: 'rgba(0,0,0,0.2)' },
  opacity: 100,
  width: 'auto',
  alignment: 'auto',
  float: 'none',
  customClass: '',
  customCss: '',
  anchorId: '',
};
