'use client';

import { useState } from 'react';
import { useInstruments, InstrumentPreset } from '@/hooks/useInstruments';

interface InstrumentSelectorProps {
  selectedInstrument: InstrumentPreset | null;
  onInstrumentSelect: (instrument: InstrumentPreset) => void;
  onClose: () => void;
}

export default function InstrumentSelector({
  selectedInstrument,
  onInstrumentSelect,
  onClose,
}: InstrumentSelectorProps) {
  const { getInstrumentsByCategory, getCategories } = useInstruments();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = getCategories();
  const instruments = selectedCategory === 'all' 
    ? getInstrumentsByCategory() 
    : getInstrumentsByCategory(selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">楽器を選択</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Instrument Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instruments.map((instrument) => (
            <div
              key={instrument.id}
              onClick={() => onInstrumentSelect(instrument)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                selectedInstrument?.id === instrument.id
                  ? 'border-gray-400 bg-gray-700'
                  : 'border-gray-600 bg-gray-750 hover:border-gray-500'
              }`}
              style={{
                boxShadow: selectedInstrument?.id === instrument.id 
                  ? `0 0 0 2px ${instrument.color}20` 
                  : 'none'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{instrument.icon}</span>
                <div>
                  <h3 className="font-medium text-white">{instrument.name}</h3>
                  <p className="text-sm text-gray-400">{instrument.category}</p>
                </div>
              </div>
              
              {/* Settings Preview */}
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>波形:</span>
                  <span className="text-gray-300">
                    {instrument.settings.oscillatorType === 'sine' && 'サイン波'}
                    {instrument.settings.oscillatorType === 'sawtooth' && 'ノコギリ波'}
                    {instrument.settings.oscillatorType === 'square' && '矩形波'}
                    {instrument.settings.oscillatorType === 'triangle' && '三角波'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>音量:</span>
                  <span className="text-gray-300">{Math.round(instrument.settings.volume * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>フィルター:</span>
                  <span className="text-gray-300">{instrument.settings.filterFrequency}Hz</span>
                </div>
              </div>
              
              {/* Color indicator */}
              <div 
                className="w-full h-2 rounded-full mt-3"
                style={{ backgroundColor: instrument.color }}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
          >
            キャンセル
          </button>
          {selectedInstrument && (
            <button
              onClick={() => {
                onInstrumentSelect(selectedInstrument);
                onClose();
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded transition-colors"
            >
              選択
            </button>
          )}
        </div>
      </div>
    </div>
  );
}