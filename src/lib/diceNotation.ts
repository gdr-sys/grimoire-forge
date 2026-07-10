const DICE_REGEX = /(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/gi;

export function parseDiceExpression(expr: string): { count: number; sides: number; modifier: number } | null {
  const match = /^(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?$/i.exec(expr.trim());
  if (!match) return null;
  const mod = match[4] ? (match[3] === '-' ? -1 : 1) * Number(match[4]) : 0;
  return { count: Number(match[1]), sides: Number(match[2]), modifier: mod };
}

export function rollDice(count: number, sides: number, modifier = 0): number {
  let total = modifier;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

export function averageRoll(count: number, sides: number, modifier = 0): number {
  return Math.floor(count * ((sides + 1) / 2)) + modifier;
}

export function highlightDiceInText(text: string): string {
  return text.replace(DICE_REGEX, (match) => `<span class="dice-notation">${match}</span>`);
}
