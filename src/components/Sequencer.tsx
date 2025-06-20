'use client';

import { useState } from 'react';
import InstrumentSelector from './InstrumentSelector';
import { useInstruments, InstrumentPreset } from '@/hooks/useInstruments';

interface Note {
  id: string;
  note: string | number;
  startTime: number;
  duration: number;
  velocity?: number;
}

interface Track {
  id: string;
  name: string;
  notes: Note[];
  isRecording: boolean;
  isMuted: boolean;
  volume: number;
  color: string;
  instrumentId?: string;
}

interface SequencerProps {
  tracks: Track[];
  isPlaying: boolean;
  isRecording: boolean;
  currentTime: number;
  bpm: number;
  selectedTrackId: string | null;
  onPlay: () => void;
  onStop: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCreateTrack: () => void;
  onDeleteTrack: (trackId: string) => void;
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void;
  onSelectTrack: (trackId: string) => void;
  onClearTrack: (trackId: string) => void;
  onSetBpm: (bpm: number) => void;
  getTotalDuration: () => number;
}

export default function Sequencer({
  tracks,
  isPlaying,
  isRecording,
  currentTime,
  bpm,
  selectedTrackId,
  onPlay,
  onStop,
  onStartRecording,
  onStopRecording,
  onCreateTrack,
  onDeleteTrack,
  onUpdateTrack,
  onSelectTrack,
  onClearTrack,
  onSetBpm,
  getTotalDuration,
}: SequencerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInstrumentSelector, setShowInstrumentSelector] = useState(false);
  const [instrumentSelectTrackId, setInstrumentSelectTrackId] = useState<string | null>(null);
  
  const { getInstrumentById } = useInstruments();
  const totalDuration = getTotalDuration();
  const timelineWidth = Math.max(800, totalDuration * 50); // 50px per second

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNoteDisplayName = (note: string | number) => {
    if (typeof note === 'number') {
      const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const octave = Math.floor(note / 12) - 1;
      const noteIndex = note % 12;
      return `${noteNames[noteIndex]}${octave}`;
    }
    return note;
  };

  const handleInstrumentSelect = (trackId: string) => {
    setInstrumentSelectTrackId(trackId);
    setShowInstrumentSelector(true);
  };

  const handleInstrumentConfirm = (instrument: InstrumentPreset) => {
    if (instrumentSelectTrackId) {
      onUpdateTrack(instrumentSelectTrackId, {
        instrumentId: instrument.id,
        color: instrument.color,
        name: instrument.name,
      });
    }
    setShowInstrumentSelector(false);
    setInstrumentSelectTrackId(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-300"
          >
            <span className="text-xl">🎼</span>
          </button>
          <h3 className="text-lg font-bold">シーケンサー</h3>
          <span className="text-sm text-gray-400">
            ({tracks.length} トラック)
          </span>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Transport Controls */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={isPlaying ? onStop : onPlay}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : tracks.reduce((sum, track) => sum + track.notes.length, 0) > 0
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-500 cursor-not-allowed'
                }`}
                title={
                  isPlaying 
                    ? '停止' 
                    : tracks.reduce((sum, track) => sum + track.notes.length, 0) > 0
                      ? '再生'
                      : '録音されたノートがありません'
                }
                disabled={!isPlaying && tracks.reduce((sum, track) => sum + track.notes.length, 0) === 0}
              >
                {isPlaying ? '⏹' : '▶️'}
              </button>
              
              <button
                onClick={isRecording ? onStopRecording : onStartRecording}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-lg shadow-red-500/50' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                title={isRecording ? '録音停止' : '録音開始'}
              >
                ⏺
              </button>
              
              {isRecording && (
                <div className="flex items-center gap-2 text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">録音中...</span>
                  {selectedTrackId && (
                    <span className="text-xs bg-red-900/30 px-2 py-1 rounded">
                      Track {tracks.findIndex(t => t.id === selectedTrackId) + 1}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-sm">
              <div>時間: {formatTime(currentTime)}</div>
              <div className="text-gray-400">BPM: {bpm}</div>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm">BPM:</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => onSetBpm(Number(e.target.value))}
                min="60"
                max="200"
                className="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
              />
            </div>
            
            <button
              onClick={onCreateTrack}
              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors border border-gray-500"
            >
              + トラック追加
            </button>
            
            {tracks.length > 0 && (
              <div className="text-xs text-gray-400">
                総ノート数: {tracks.reduce((sum, track) => sum + track.notes.length, 0)}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="mb-4">
            <div className="relative bg-gray-900 rounded-lg p-2 overflow-x-auto">
              <div className="relative" style={{ width: timelineWidth }}>
                {/* Time markers */}
                <div className="flex text-xs text-gray-400 mb-2">
                  {Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{ left: `${(i / totalDuration) * 100}%` }}
                    >
                      {formatTime(i)}
                    </div>
                  ))}
                </div>
                
                {/* Current time indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                />
                
                {/* Tracks */}
                <div className="space-y-2 mt-6">
                  {tracks.map((track) => (
                    <div key={track.id} className="relative">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => onSelectTrack(track.id)}
                          className={`w-4 h-4 rounded border-2 transition-colors ${
                            selectedTrackId === track.id
                              ? 'border-gray-300 bg-gray-300'
                              : 'border-gray-500 hover:border-gray-400'
                          }`}
                          title={selectedTrackId === track.id ? '選択中のトラック' : 'クリックして選択'}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: track.color }}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            value={track.name}
                            onChange={(e) => onUpdateTrack(track.id, { name: e.target.value })}
                            className="bg-transparent text-sm font-medium flex-1"
                          />
                          {track.instrumentId && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {getInstrumentById(track.instrumentId)?.icon}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleInstrumentSelect(track.id)}
                          className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
                          title="楽器を選択"
                        >
                          {track.instrumentId ? '変更' : '楽器'}
                        </button>
                        <button
                          onClick={() => onUpdateTrack(track.id, { isMuted: !track.isMuted })}
                          className={`text-xs px-2 py-1 rounded ${
                            track.isMuted 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-600 text-gray-300'
                          }`}
                        >
                          {track.isMuted ? 'MUTE' : 'PLAY'}
                        </button>
                        <button
                          onClick={() => onClearTrack(track.id)}
                          className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
                        >
                          クリア
                        </button>
                        <button
                          onClick={() => onDeleteTrack(track.id)}
                          className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
                        >
                          削除
                        </button>
                      </div>
                      
                      {/* Track notes */}
                      <div 
                        className="relative h-12 bg-gray-800 rounded border"
                        style={{ 
                          borderColor: selectedTrackId === track.id ? track.color : 'transparent',
                          borderWidth: selectedTrackId === track.id ? '2px' : '1px'
                        }}
                      >
                        {track.notes.map((note) => (
                          <div
                            key={note.id}
                            className="absolute top-1 bottom-1 rounded opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                            style={{
                              left: `${(note.startTime / totalDuration) * 100}%`,
                              width: `${(note.duration / totalDuration) * 100}%`,
                              backgroundColor: track.color,
                              minWidth: '2px',
                            }}
                            title={`${getNoteDisplayName(note.note)} - ${note.duration.toFixed(2)}s`}
                          >
                            <div className="text-xs text-white px-1 truncate">
                              {getNoteDisplayName(note.note)}
                            </div>
                          </div>
                        ))}
                        
                        {/* Recording indicator */}
                        {track.isRecording && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-400 bg-gray-700 rounded p-3">
            {tracks.length === 0 ? (
              <div className="text-center">
                <p className="text-yellow-400 mb-2">🎵 まずはトラックを作成しましょう！</p>
                <p>「+ トラック追加」ボタンをクリックして最初のトラックを作成してください</p>
              </div>
            ) : (
              <>
                <p><strong>使い方:</strong></p>
                <p>1. 録音したいトラックを選択（チェックボックスをクリック）</p>
                <p>2. 「⏺」ボタンで録音開始</p>
                <p>3. キーボードやMIDIで演奏すると自動で録音</p>
                <p>4. 「▶️」ボタンで録音内容を再生</p>
                {selectedTrackId && (
                  <p className="text-gray-300 mt-2">
                    ✓ Track {tracks.findIndex(t => t.id === selectedTrackId) + 1} が選択されています
                  </p>
                )}
              </>
            )}
          </div>
        </>
      )}
      
      {/* Instrument Selector Modal */}
      {showInstrumentSelector && (
        <InstrumentSelector
          selectedInstrument={
            instrumentSelectTrackId 
              ? getInstrumentById(tracks.find(t => t.id === instrumentSelectTrackId)?.instrumentId || '') || null
              : null
          }
          onInstrumentSelect={handleInstrumentConfirm}
          onClose={() => {
            setShowInstrumentSelector(false);
            setInstrumentSelectTrackId(null);
          }}
        />
      )}
    </div>
  );
}