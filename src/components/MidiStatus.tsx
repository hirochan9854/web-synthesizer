'use client';

interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
  state: string;
}

interface MidiStatusProps {
  isSupported: boolean;
  isEnabled: boolean;
  devices: MidiDevice[];
  connectedDevices: MidiDevice[];
  onInitMidi: () => void;
}

export default function MidiStatus({ 
  isSupported, 
  isEnabled, 
  devices, 
  connectedDevices, 
  onInitMidi 
}: MidiStatusProps) {
  if (!isSupported) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
        <div className="flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <span className="font-medium">MIDI非対応</span>
        </div>
        <p className="text-sm mt-1">
          このブラウザはWeb MIDI APIに対応していません。Chrome、Edge、またはOperaをお試しください。
        </p>
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 text-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🎹</span>
              <span className="font-medium">MIDI機能</span>
            </div>
            <p className="text-sm mt-1">
              MIDIキーボードを接続して演奏できます
            </p>
          </div>
          <button
            onClick={onInitMidi}
            className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-gray-500"
          >
            MIDIを有効化
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-400">🎹</span>
        <span className="font-medium">MIDI状態</span>
        <span className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded text-xs">
          有効
        </span>
      </div>
      
      {connectedDevices.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            接続済みデバイス ({connectedDevices.length})
          </h4>
          <div className="space-y-2">
            {connectedDevices.map((device) => (
              <div key={device.id} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="font-medium">{device.name}</span>
                <span className="text-gray-400">({device.manufacturer})</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            デバイス未接続
          </h4>
          <p className="text-sm text-gray-400">
            MIDIキーボードやコントローラーを接続してください
          </p>
          {devices.length > 0 && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                検出されたデバイス ({devices.length})
              </summary>
              <div className="mt-2 space-y-1">
                {devices.map((device) => (
                  <div key={device.id} className="flex items-center gap-2 text-xs text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${
                      device.state === 'connected' ? 'bg-gray-300' : 'bg-gray-600'
                    }`}></div>
                    <span>{device.name}</span>
                    <span>({device.state})</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}