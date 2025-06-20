import { useCallback } from 'react';

export interface InstrumentPreset {
  id: string;
  name: string;
  category: string;
  icon: string;
  settings: {
    oscillatorType: OscillatorType;
    volume: number;
    filterFrequency: number;
    filterResonance: number;
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  color: string;
}

export const INSTRUMENT_PRESETS: InstrumentPreset[] = [
  // ドラムキット
  {
    id: 'kick',
    name: 'キック',
    category: 'ドラム',
    icon: '🥁',
    settings: {
      oscillatorType: 'sine',
      volume: 0.8,
      filterFrequency: 200,
      filterResonance: 5,
      attack: 0.01,
      decay: 0.3,
      sustain: 0.1,
      release: 0.3,
    },
    color: '#ef4444',
  },
  {
    id: 'snare',
    name: 'スネア',
    category: 'ドラム',
    icon: '🥁',
    settings: {
      oscillatorType: 'square',
      volume: 0.6,
      filterFrequency: 1000,
      filterResonance: 8,
      attack: 0.01,
      decay: 0.1,
      sustain: 0.05,
      release: 0.2,
    },
    color: '#f59e0b',
  },
  {
    id: 'hihat',
    name: 'ハイハット',
    category: 'ドラム',
    icon: '🥁',
    settings: {
      oscillatorType: 'square',
      volume: 0.3,
      filterFrequency: 8000,
      filterResonance: 2,
      attack: 0.01,
      decay: 0.05,
      sustain: 0.01,
      release: 0.1,
    },
    color: '#eab308',
  },
  
  // ベース
  {
    id: 'bass_analog',
    name: 'アナログベース',
    category: 'ベース',
    icon: '🎸',
    settings: {
      oscillatorType: 'sawtooth',
      volume: 0.7,
      filterFrequency: 400,
      filterResonance: 6,
      attack: 0.01,
      decay: 0.2,
      sustain: 0.6,
      release: 0.3,
    },
    color: '#8b5cf6',
  },
  {
    id: 'bass_sub',
    name: 'サブベース',
    category: 'ベース',
    icon: '🎸',
    settings: {
      oscillatorType: 'sine',
      volume: 0.8,
      filterFrequency: 150,
      filterResonance: 3,
      attack: 0.05,
      decay: 0.3,
      sustain: 0.8,
      release: 0.4,
    },
    color: '#6366f1',
  },
  
  // リード・メロディー
  {
    id: 'lead_saw',
    name: 'リードソー',
    category: 'リード',
    icon: '🎹',
    settings: {
      oscillatorType: 'sawtooth',
      volume: 0.5,
      filterFrequency: 2000,
      filterResonance: 4,
      attack: 0.1,
      decay: 0.2,
      sustain: 0.7,
      release: 0.5,
    },
    color: '#06b6d4',
  },
  {
    id: 'lead_square',
    name: 'リードスクエア',
    category: 'リード',
    icon: '🎹',
    settings: {
      oscillatorType: 'square',
      volume: 0.4,
      filterFrequency: 1500,
      filterResonance: 6,
      attack: 0.05,
      decay: 0.3,
      sustain: 0.6,
      release: 0.6,
    },
    color: '#0891b2',
  },
  
  // パッド
  {
    id: 'pad_warm',
    name: 'ウォームパッド',
    category: 'パッド',
    icon: '🌊',
    settings: {
      oscillatorType: 'triangle',
      volume: 0.3,
      filterFrequency: 800,
      filterResonance: 2,
      attack: 0.8,
      decay: 0.5,
      sustain: 0.8,
      release: 1.2,
    },
    color: '#10b981',
  },
  {
    id: 'pad_bright',
    name: 'ブライトパッド',
    category: 'パッド',
    icon: '🌊',
    settings: {
      oscillatorType: 'sawtooth',
      volume: 0.25,
      filterFrequency: 1200,
      filterResonance: 3,
      attack: 1.0,
      decay: 0.8,
      sustain: 0.9,
      release: 1.5,
    },
    color: '#059669',
  },
  
  // プラック
  {
    id: 'pluck_bright',
    name: 'ブライトプラック',
    category: 'プラック',
    icon: '🪕',
    settings: {
      oscillatorType: 'triangle',
      volume: 0.5,
      filterFrequency: 3000,
      filterResonance: 4,
      attack: 0.01,
      decay: 0.4,
      sustain: 0.2,
      release: 0.6,
    },
    color: '#f97316',
  },
];

export const useInstruments = () => {
  const getInstrumentsByCategory = useCallback((category?: string) => {
    if (!category) return INSTRUMENT_PRESETS;
    return INSTRUMENT_PRESETS.filter(preset => preset.category === category);
  }, []);

  const getCategories = useCallback(() => {
    const categories = Array.from(new Set(INSTRUMENT_PRESETS.map(preset => preset.category)));
    return categories;
  }, []);

  const getInstrumentById = useCallback((id: string) => {
    return INSTRUMENT_PRESETS.find(preset => preset.id === id);
  }, []);

  return {
    instruments: INSTRUMENT_PRESETS,
    getInstrumentsByCategory,
    getCategories,
    getInstrumentById,
  };
};