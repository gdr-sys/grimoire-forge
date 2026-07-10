import { DND5E_CR_TABLE } from './constants';

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function crToXp(cr: string): number {
  return DND5E_CR_TABLE[cr]?.xp ?? 0;
}

export function crToProfBonus(cr: string): number {
  return DND5E_CR_TABLE[cr]?.profBonus ?? 2;
}

export function hpFormulaToAverage(formula: string): number {
  const match = formula.match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/);
  if (!match) return 0;
  const [, diceCount, dieSize, bonus] = match;
  return Math.floor(Number(diceCount) * ((Number(dieSize) + 1) / 2)) + Number(bonus ?? 0);
}
