import { useRef, useCallback, useState, useEffect } from 'react';

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

interface UseSequencerProps {
  onPlayNote: (note: string | number) => void;
  onStopNote: (note: string | number) => void;
}

const COLORS = ['#6b7280', '#9ca3af', '#d1d5db', '#4b5563', '#374151', '#1f2937', '#111827'];

export const useSequencer = ({ onPlayNote, onStopNote }: UseSequencerProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const recordingNotesRef = useRef<Map<string | number, number>>(new Map());
  const playingNotesRef = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Create new track
  const createTrack = useCallback(() => {
    const newTrack: Track = {
      id: Date.now().toString(),
      name: `Track ${tracks.length + 1}`,
      notes: [],
      isRecording: false,
      isMuted: false,
      volume: 1,
      color: COLORS[tracks.length % COLORS.length],
    };
    
    setTracks(prev => [...prev, newTrack]);
    setSelectedTrackId(newTrack.id);
    return newTrack.id;
  }, [tracks.length]);

  // Delete track
  const deleteTrack = useCallback((trackId: string) => {
    setTracks(prev => prev.filter(track => track.id !== trackId));
    if (selectedTrackId === trackId) {
      setSelectedTrackId(null);
    }
  }, [selectedTrackId]);

  // Update track
  const updateTrack = useCallback((trackId: string, updates: Partial<Track>) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, ...updates } : track
    ));
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    let trackId = selectedTrackId;
    
    if (!trackId) {
      trackId = createTrack();
      setSelectedTrackId(trackId);
    }
    
    setIsRecording(true);
    startTimeRef.current = Date.now();
    recordingNotesRef.current.clear();
    
    updateTrack(trackId, { isRecording: true });
    console.log('Recording started on track:', trackId);
  }, [selectedTrackId, createTrack, updateTrack]);

  // Stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    if (selectedTrackId) {
      updateTrack(selectedTrackId, { isRecording: false });
    }
    
    recordingNotesRef.current.clear();
  }, [selectedTrackId, updateTrack]);

  // Record note on
  const recordNoteOn = useCallback((note: string | number) => {
    console.log('recordNoteOn called:', { note, isRecording, selectedTrackId });
    
    if (!isRecording || !selectedTrackId) {
      console.log('Recording skipped - not recording or no track selected');
      return;
    }
    
    const currentRecordTime = (Date.now() - startTimeRef.current) / 1000;
    recordingNotesRef.current.set(note, currentRecordTime);
    console.log('Note recorded start:', note, 'at time:', currentRecordTime);
  }, [isRecording, selectedTrackId]);

  // Record note off
  const recordNoteOff = useCallback((note: string | number) => {
    console.log('recordNoteOff called:', { note, isRecording, selectedTrackId });
    
    if (!isRecording || !selectedTrackId) {
      console.log('Recording off skipped - not recording or no track selected');
      return;
    }
    
    const startTime = recordingNotesRef.current.get(note);
    if (startTime === undefined) {
      console.log('No start time found for note:', note);
      return;
    }
    
    const endTime = (Date.now() - startTimeRef.current) / 1000;
    const duration = endTime - startTime;
    
    console.log('Note duration calculated:', duration, 'seconds');
    
    if (duration > 0.05) { // Reduced minimum note duration
      const newNote: Note = {
        id: `${selectedTrackId}-${Date.now()}-${Math.random()}`,
        note,
        startTime,
        duration,
        velocity: 100,
      };
      
      console.log('Adding note to track:', newNote);
      
      setTracks(prev => {
        const updatedTracks = prev.map(track => 
          track.id === selectedTrackId 
            ? { ...track, notes: [...track.notes, newNote] }
            : track
        );
        console.log('Updated tracks:', updatedTracks);
        return updatedTracks;
      });
    } else {
      console.log('Note too short, not recorded');
    }
    
    recordingNotesRef.current.delete(note);
  }, [isRecording, selectedTrackId]);

  // Get total duration
  const getTotalDuration = useCallback(() => {
    let maxDuration = 0;
    tracks.forEach(track => {
      track.notes.forEach(note => {
        const noteDuration = note.startTime + note.duration;
        if (noteDuration > maxDuration) {
          maxDuration = noteDuration;
        }
      });
    });
    return Math.max(maxDuration, 10); // Minimum 10 seconds
  }, [tracks]);

  // Start playback
  const startPlayback = useCallback(() => {
    console.log('Starting playback with tracks:', tracks);
    
    if (tracks.length === 0) {
      console.log('No tracks to play');
      return;
    }
    
    // Count total notes
    const totalNotes = tracks.reduce((sum, track) => sum + track.notes.length, 0);
    console.log('Total notes to play:', totalNotes);
    
    if (totalNotes === 0) {
      console.log('No notes recorded in any track');
      return;
    }
    
    setIsPlaying(true);
    startTimeRef.current = Date.now();
    setCurrentTime(0);
    playingNotesRef.current.clear();
    
    const playLoop = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setCurrentTime(elapsed);
      
      // Use current tracks state instead of closure
      setTracks(currentTracks => {
        currentTracks.forEach(track => {
          if (track.isMuted) return;
          
          track.notes.forEach(note => {
            const noteKey = `${track.id}-${note.id}`;
            
            // Note should start playing
            if (elapsed >= note.startTime && elapsed < note.startTime + note.duration) {
              if (!playingNotesRef.current.has(noteKey)) {
                playingNotesRef.current.add(noteKey);
                console.log('Playing note:', note.note, 'at time:', elapsed);
                onPlayNote(note.note);
              }
            }
            // Note should stop playing
            else if (elapsed >= note.startTime + note.duration) {
              if (playingNotesRef.current.has(noteKey)) {
                playingNotesRef.current.delete(noteKey);
                console.log('Stopping note:', note.note, 'at time:', elapsed);
                onStopNote(note.note);
              }
            }
          });
        });
        
        return currentTracks; // Return unchanged
      });
      
      // Check if playback should continue
      const maxDuration = getTotalDuration();
      if (elapsed >= maxDuration) {
        console.log('Playback finished at:', elapsed, 'max duration:', maxDuration);
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }
      
      // Continue playback
      animationFrameRef.current = requestAnimationFrame(playLoop);
    };
    
    playLoop();
  }, [tracks, onPlayNote, onStopNote, getTotalDuration]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    console.log('Stopping playback');
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    
    // Stop all playing notes
    const playingNotes = Array.from(playingNotesRef.current);
    console.log('Stopping', playingNotes.length, 'playing notes');
    
    playingNotes.forEach(noteKey => {
      // Extract track ID and note ID from the key
      const parts = noteKey.split('-');
      const trackId = parts[0];
      const noteId = parts.slice(1).join('-');
      
      // Find the actual note
      const track = tracks.find(t => t.id === trackId);
      if (track) {
        const foundNote = track.notes.find(n => n.id === noteId);
        if (foundNote) {
          onStopNote(foundNote.note);
        }
      }
    });
    playingNotesRef.current.clear();
  }, [tracks, onStopNote]);

  // Clear track
  const clearTrack = useCallback((trackId: string) => {
    updateTrack(trackId, { notes: [] });
  }, [updateTrack]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    tracks,
    isPlaying,
    isRecording,
    currentTime,
    bpm,
    selectedTrackId,
    setBpm,
    setSelectedTrackId,
    createTrack,
    deleteTrack,
    updateTrack,
    startRecording,
    stopRecording,
    recordNoteOn,
    recordNoteOff,
    startPlayback,
    stopPlayback,
    clearTrack,
    getTotalDuration,
  };
};