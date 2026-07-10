import type { Block, BlockType } from '../types/block';
import type { BlockStyle } from '../types/style';
import { DEFAULT_BLOCK_STYLE } from '../types/style';
import { DEFAULT_IMAGE_BLOCK_DATA } from '../types/image';

function makeId(): string {
  return crypto.randomUUID();
}

const DEFAULT_STYLE: BlockStyle = { ...DEFAULT_BLOCK_STYLE };

export function createBlock(type: BlockType, overrides?: Partial<Block>): Block {
  const id = overrides?.id ?? makeId();
  const style: BlockStyle = { ...DEFAULT_STYLE, ...(overrides?.style ?? {}) };

  let data: Block['data'];

  switch (type) {
    case 'text':
      data = { html: '<p>Scrivi qui il tuo testo…</p>' };
      break;
    case 'heading':
      data = { level: 'h2', text: 'Titolo', showDropCap: false };
      break;
    case 'statblock-dnd5e':
      data = {
        name: 'Goblin',
        size: 'Piccola', type: 'Umanoide', subtype: 'goblinoide',
        alignment: 'Neutrale Malvagio',
        ac: 15, acType: 'armatura di cuoio, scudo',
        hp: 7, hpFormula: '2d6',
        speed: { walk: 9, fly: 0, swim: 0, burrow: 0, climb: 0 },
        str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8,
        savingThrows: [], skills: ['Furtività +6'],
        damageVulnerabilities: [], damageResistances: [], damageImmunities: [],
        conditionImmunities: [],
        senses: 'Scurovisione 18 m, Percezione passiva 9',
        languages: 'Comune, Goblin', cr: '1/4',
        traits: [{ name: 'Fuga Agile', desc: 'Il goblin può effettuare l\'azione di Disimpegno o Nascondersi come azione bonus in ciascuno dei suoi turni.' }],
        actions: [{ name: 'Scimitarra', desc: 'Attacco con arma da mischia: +4 al tiro per colpire, portata 1,5 m, un bersaglio. Colpito: 5 (1d6 + 2) danni taglienti.' }],
        bonusActions: [], reactions: [], legendaryActions: [], lairActions: [], regionalEffects: [],
        flavorText: '',
      };
      break;
    case 'note':
      data = { variant: 'info', title: 'Nota', html: '<p>Testo della nota…</p>', customColor: '#3b82f6', customIcon: '' };
      break;
    case 'image':
      data = { ...DEFAULT_IMAGE_BLOCK_DATA };
      break;
    case 'divider':
      data = { style: 'floral', color: 'currentColor', thickness: 1 };
      break;
    case 'spacer':
      data = { height: 24 };
      break;
    case 'page-break':
    case 'column-break':
      data = {};
      break;
    case 'cover-page':
      data = { title: 'Il Mio Supplemento', subtitle: '', author: '', system: 'D&D 5e', imageUrl: null, imageId: null };
      break;
    case 'toc':
      data = {};
      break;
    case 'table':
      data = {
        headers: ['Colonna 1', 'Colonna 2', 'Colonna 3'],
        rows: [['', '', ''], ['', '', '']],
        caption: '', striped: true, bordered: true, compact: false,
      };
      break;
    case 'custom-html':
      data = { html: '<!-- HTML personalizzato -->', css: '' };
      break;
    case 'spell':
      data = {
        name: 'Dardo Incantato', level: 1, school: 'Evocazione',
        castingTime: '1 azione', range: '36 m',
        components: 'V, S', duration: 'Istantanea',
        description: 'Crei tre dardi splendenti di forza magica…',
        atHigherLevels: 'Lanci l\'incantesimo usando uno slot da 2° livello o superiore…',
        classes: ['Mago'],
      };
      break;
    case 'item':
      data = {
        name: 'Spada Fiammeggiante', type: 'Arma (spada lunga)', rarity: 'Non comune',
        requiresAttunement: true, attunementBy: 'qualsiasi personaggio',
        properties: [],
        description: 'Puoi usare un\'azione bonus per pronunciare la parola di comando…',
        flavorText: '',
      };
      break;
    case 'quote':
      data = { quote: 'In ogni oscurità c\'è una scintilla di luce.', attribution: '— Anonimo', variant: 'pullquote' };
      break;
    case 'encounter':
      data = { title: 'Incontro', difficulty: 'Medio', xp: 0, monsters: [], description: '' };
      break;
    case 'class-feature':
      data = { name: 'Seconda opportunità', level: 1, description: '<p>Descrizione della feature…</p>' };
      break;
    case 'feat':
      data = { name: 'Allerta', prerequisite: '', description: '<p>Descrizione del talento…</p>' };
      break;
    case 'race':
      data = { name: 'Tratto razziale', description: '<p>Descrizione…</p>' };
      break;
    case 'background':
      data = { name: 'Background', description: '<p>Descrizione…</p>', proficiencies: '', languages: '', equipment: '', feature: { name: '', desc: '' } };
      break;
    case 'random-table':
      data = {
        title: 'Tabella casuale', die: 'd6',
        entries: [{ roll: '1', result: '' }, { roll: '2', result: '' }, { roll: '3', result: '' }, { roll: '4', result: '' }, { roll: '5', result: '' }, { roll: '6', result: '' }],
      };
      break;
    case 'toc':
      data = { title: 'Indice', maxDepth: 3 };
      break;
    case 'cover-page':
      data = { title: 'Il Mio Supplemento', subtitle: '', author: '', system: 'D&D 5e', imageUrl: null, imageId: null };
      break;
    case 'watermark':
      data = { assetId: 'd20-watermark', opacity: 15 };
      break;
    default:
      data = {};
  }

  return { id, type, data: overrides?.data ?? data, style };
}
