'use client';

import { useCallback, useEffect } from 'react';

interface KeyboardProps {
  onNotePress: (note: string) => void;
  onNoteRelease: (note: string) => void;
}

const whiteKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];
const blackKeys = [
  { note: 'C#4', position: 1 },
  { note: 'D#4', position: 2 },
  { note: 'F#4', position: 4 },
  { note: 'G#4', position: 5 },
  { note: 'A#4', position: 6 },
  { note: 'C#5', position: 8 },
  { note: 'D#5', position: 9 },
  { note: 'F#5', position: 11 },
  { note: 'G#5', position: 12 },
  { note: 'A#5', position: 13 },
];

const keyMap: Record<string, string> = {
  'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4', 'f': 'F4',
  't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
  'k': 'C5', 'o': 'C#5', 'l': 'D5', 'p': 'D#5', ';': 'E5', "'": 'F5',
  ']': 'F#5', '\\': 'G5',
};

// Reverse mapping to find keyboard key for each note
const noteToKeyMap: Record<string, string> = Object.fromEntries(
  Object.entries(keyMap).map(([key, note]) => [note, key.toUpperCase()])
);

export default function Keyboard({ onNotePress, onNoteRelease }: KeyboardProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return;
    const note = keyMap[event.key.toLowerCase()];
    if (note) {
      onNotePress(note);
    }
  }, [onNotePress]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const note = keyMap[event.key.toLowerCase()];
    if (note) {
      onNoteRelease(note);
    }
  }, [onNoteRelease]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* White keys */}
        <div className="flex">
          {whiteKeys.map((note) => (
            <button
              key={note}
              className="w-12 h-48 bg-white border border-gray-300 rounded-b-lg shadow-lg transition-all duration-75 hover:bg-gray-100 active:bg-gray-200 active:shadow-inner relative flex flex-col justify-end items-center pb-4"
              onMouseDown={() => onNotePress(note)}
              onMouseUp={() => onNoteRelease(note)}
              onMouseLeave={() => onNoteRelease(note)}
            >
              <div className="text-center">
                <div className="text-xs text-gray-800 font-bold mb-1">
                  {noteToKeyMap[note] || ''}
                </div>
                <div className="text-xs text-gray-600 font-mono">
                  {note}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Black keys */}
        <div className="absolute top-0 flex">
          {blackKeys.map(({ note, position }) => (
            <button
              key={note}
              className="w-8 h-32 bg-gray-900 rounded-b-lg shadow-lg transition-all duration-75 hover:bg-gray-800 active:bg-gray-700 active:shadow-inner relative flex flex-col justify-end items-center pb-3"
              style={{ 
                marginLeft: position === 1 ? '2rem' : '0.5rem',
                marginRight: position === 6 || position === 13 ? '1.5rem' : '0.5rem'
              }}
              onMouseDown={() => onNotePress(note)}
              onMouseUp={() => onNoteRelease(note)}
              onMouseLeave={() => onNoteRelease(note)}
            >
              <div className="text-center">
                <div className="text-xs text-white font-bold mb-1">
                  {noteToKeyMap[note] || ''}
                </div>
                <div className="text-xs text-gray-300 font-mono">
                  {note.replace('4', '').replace('5', '')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}