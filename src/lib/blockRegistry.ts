import type { ComponentType } from 'react';
import type { BlockType } from '../types/block';

export type BlockCategory = 'text' | 'mechanics' | 'data' | 'decorative' | 'structure';

export interface BlockMeta {
  type: BlockType;
  category: BlockCategory;
  labelKey: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const registry = new Map<BlockType, BlockMeta>();

export function registerBlock(meta: BlockMeta): void {
  registry.set(meta.type, meta);
}

export function getBlockMeta(type: BlockType): BlockMeta | undefined {
  return registry.get(type);
}

export function getAllBlockMetas(): BlockMeta[] {
  return Array.from(registry.values());
}

export function getBlocksByCategory(category: BlockCategory): BlockMeta[] {
  return getAllBlockMetas().filter((m) => m.category === category);
}
