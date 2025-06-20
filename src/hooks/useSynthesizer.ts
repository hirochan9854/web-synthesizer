import { useRef, useCallback, useEffect, useState } from 'react';

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

export const useSynthesizer = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNotesRef = useRef<Map<string, { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode }>>(new Map());
  
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [params, setParams] = useState<SynthesizerParams>({
    volume: 0.3,
    oscillatorType: 'sawtooth',
    filterFrequency: 1000,
    filterResonance: 1,
    attack: 0.1,
    decay: 0.3,
    sustain: 0.7,
    release: 0.5,
  });

  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        
        // Resume audio context if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.connect(audioContextRef.current.destination);
        masterGainRef.current.gain.setValueAtTime(params.volume, audioContextRef.current.currentTime);
        
        setIsAudioInitialized(true);
        console.log('Audio context initialized successfully');
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    }
  }, [params.volume]);

  const noteToFrequency = useCallback((note: string): number => {
    const noteMap: Record<string, number> = {
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
      'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
      'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
      'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
      'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
    };
    return noteMap[note] || 440;
  }, []);

  const playNote = useCallback(async (note: string) => {
    if (activeNotesRef.current.has(note)) return;

    await initAudioContext();
    
    if (!audioContextRef.current || !masterGainRef.current) {
      console.error('Audio context not initialized');
      return;
    }
    
    const now = audioContextRef.current!.currentTime;
    const frequency = noteToFrequency(note);
    
    // Create oscillator
    const oscillator = audioContextRef.current!.createOscillator();
    oscillator.type = params.oscillatorType;
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // Create filter
    const filter = audioContextRef.current!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(params.filterFrequency, now);
    filter.Q.setValueAtTime(params.filterResonance, now);
    
    // Create gain node for ADSR
    const gainNode = audioContextRef.current!.createGain();
    gainNode.gain.setValueAtTime(0, now);
    
    // ADSR envelope
    gainNode.gain.linearRampToValueAtTime(1, now + params.attack);
    gainNode.gain.linearRampToValueAtTime(params.sustain, now + params.attack + params.decay);
    
    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    
    oscillator.start(now);
    
    activeNotesRef.current.set(note, { osc: oscillator, gain: gainNode, filter });
  }, [params, noteToFrequency, initAudioContext]);

  const stopNote = useCallback((note: string) => {
    const noteData = activeNotesRef.current.get(note);
    if (!noteData || !audioContextRef.current) return;

    const now = audioContextRef.current.currentTime;
    const { osc, gain } = noteData;
    
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + params.release);
    
    osc.stop(now + params.release);
    activeNotesRef.current.delete(note);
  }, [params.release]);

  const updateParams = useCallback((newParams: Partial<SynthesizerParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
    
    if (masterGainRef.current && newParams.volume !== undefined) {
      const now = audioContextRef.current?.currentTime || 0;
      masterGainRef.current.gain.setValueAtTime(newParams.volume, now);
    }
    
    // Update active notes
    activeNotesRef.current.forEach(({ filter }) => {
      if (audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        if (newParams.filterFrequency !== undefined) {
          filter.frequency.setValueAtTime(newParams.filterFrequency, now);
        }
        if (newParams.filterResonance !== undefined) {
          filter.Q.setValueAtTime(newParams.filterResonance, now);
        }
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      const activeNotes = activeNotesRef.current;
      activeNotes.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch {
          // Ignore errors when stopping already stopped oscillators
        }
      });
      activeNotes.clear();
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playNote,
    stopNote,
    updateParams,
    params,
    isAudioInitialized,
    initAudioContext,
  };
};