'use client';

interface SynthesizerParams {
  volume: number;
  oscillatorType: OscillatorType;
  filterFrequency: number;
  filterResonance: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

interface ControlsProps {
  params: SynthesizerParams;
  onParamsChange: (params: Partial<SynthesizerParams>) => void;
}

export default function Controls({ params, onParamsChange }: ControlsProps) {
  const handleSliderChange = (param: string, value: number) => {
    onParamsChange({ [param]: value });
  };

  const handleOscillatorChange = (type: OscillatorType) => {
    onParamsChange({ oscillatorType: type });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-bold mb-6 text-center">シンセサイザー コントロール</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Volume */}
        <div className="control-group">
          <label className="block text-sm font-medium mb-2">音量</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.volume}
            onChange={(e) => handleSliderChange('volume', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400">{Math.round(params.volume * 100)}%</span>
        </div>

        {/* Oscillator Type */}
        <div className="control-group">
          <label className="block text-sm font-medium mb-2">オシレーター</label>
          <select
            value={params.oscillatorType}
            onChange={(e) => handleOscillatorChange(e.target.value as OscillatorType)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="sine">サイン波</option>
            <option value="sawtooth">ノコギリ波</option>
            <option value="square">矩形波</option>
            <option value="triangle">三角波</option>
          </select>
        </div>

        {/* Filter Frequency */}
        <div className="control-group">
          <label className="block text-sm font-medium mb-2">フィルター周波数</label>
          <input
            type="range"
            min="100"
            max="20000"
            step="100"
            value={params.filterFrequency}
            onChange={(e) => handleSliderChange('filterFrequency', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400">{Math.round(params.filterFrequency)}Hz</span>
        </div>

        {/* Filter Resonance */}
        <div className="control-group">
          <label className="block text-sm font-medium mb-2">レゾナンス</label>
          <input
            type="range"
            min="0.1"
            max="30"
            step="0.1"
            value={params.filterResonance}
            onChange={(e) => handleSliderChange('filterResonance', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400">{params.filterResonance.toFixed(1)}</span>
        </div>

        {/* Attack */}
        <div className="control-group">
          <label className="block text-sm font-medium mb-2">アタック</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={params.attack}
            onChange={(e) => handleSliderChange('attack', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400">{params.attack.toFixed(2)}s</span>
        </div>

        {/* Decay */}
        <div className="control-group">
          <label className="block text-sm font-medium mb-2">ディケイ</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={params.decay}
            onChange={(e) => handleSliderChange('decay', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400">{params.decay.toFixed(2)}s</span>
        </div>

        {/* Sustain */}
        <div className="control-group">
          <label className="block text-sm font-medium mb-2">サスティン</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.sustain}
            onChange={(e) => handleSliderChange('sustain', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400">{Math.round(params.sustain * 100)}%</span>
        </div>

        {/* Release */}
        <div className="control-group">
          <label className="block text-sm font-medium mb-2">リリース</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.01"
            value={params.release}
            onChange={(e) => handleSliderChange('release', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400">{params.release.toFixed(2)}s</span>
        </div>
      </div>
    </div>
  );
}