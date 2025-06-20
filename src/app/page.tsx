"use client";

import { useSynthesizer } from "@/hooks/useSynthesizer";
import { useSequencer } from "@/hooks/useSequencer";
import { useInstruments } from "@/hooks/useInstruments";
import Keyboard from "@/components/Keyboard";
import Controls from "@/components/Controls";
import Sequencer from "@/components/Sequencer";
import { useEffect } from "react";
export default function Home() {
  const {
    playNote,
    stopNote,
    updateParams,
    params,
    isAudioInitialized,
    initAudioContext,
  } = useSynthesizer();

  const { getInstrumentById } = useInstruments();

  // Sequencer integration
  const sequencer = useSequencer({
    onPlayNote: playNote,
    onStopNote: stopNote,
  });

  // Apply instrument settings when track is selected
  useEffect(() => {
    const selectedTrack = sequencer.tracks.find(
      (t) => t.id === sequencer.selectedTrackId
    );
    if (selectedTrack?.instrumentId) {
      const instrument = getInstrumentById(selectedTrack.instrumentId);
      if (instrument) {
        updateParams(instrument.settings);
      }
    }
  }, [
    sequencer.selectedTrackId,
    sequencer.tracks,
    getInstrumentById,
    updateParams,
  ]);

  // Enhanced play/stop functions that also record to sequencer
  const handleNotePress = (note: string | number) => {
    playNote(note);
    sequencer.recordNoteOn(note);
  };

  const handleNoteRelease = (note: string | number) => {
    stopNote(note);
    sequencer.recordNoteOff(note);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Web MIDI シンセサイザー
          </h1>
          <p className="text-gray-300">キーボードやマウスで音楽を演奏しよう</p>
        </header>

        <div className="space-y-8">
          {!isAudioInitialized && (
            <div className="text-center">
              <button
                onClick={initAudioContext}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg border border-gray-500"
              >
                🎵 オーディオを有効にする
              </button>
              <p className="text-gray-400 text-sm mt-2">
                クリックして音声再生を有効にしてください
              </p>
            </div>
          )}

          {isAudioInitialized && (
            <>
              <Sequencer
                tracks={sequencer.tracks}
                isPlaying={sequencer.isPlaying}
                isRecording={sequencer.isRecording}
                currentTime={sequencer.currentTime}
                bpm={sequencer.bpm}
                selectedTrackId={sequencer.selectedTrackId}
                onPlay={sequencer.startPlayback}
                onStop={sequencer.stopPlayback}
                onStartRecording={sequencer.startRecording}
                onStopRecording={sequencer.stopRecording}
                onCreateTrack={sequencer.createTrack}
                onDeleteTrack={sequencer.deleteTrack}
                onUpdateTrack={sequencer.updateTrack}
                onSelectTrack={sequencer.setSelectedTrackId}
                onClearTrack={sequencer.clearTrack}
                onSetBpm={sequencer.setBpm}
                getTotalDuration={sequencer.getTotalDuration}
              />

              <Controls params={params} onParamsChange={updateParams} />

              <div className="flex justify-center">
                <Keyboard
                  onNotePress={handleNotePress}
                  onNoteRelease={handleNoteRelease}
                />
              </div>
            </>
          )}

          <div className="text-center text-gray-400 text-sm">
            <p>🎹 コンピューターキーボード：白鍵はA-Lキー、黒鍵はW-Pキー</p>
            <p>🖱️ マウス：画面上のピアノ鍵盤をクリック</p>
            <p>🎛️ MIDI：MIDIキーボード・コントローラーを接続して演奏</p>
            <p>🎼 シーケンサー：演奏を録音してトラックとして再生</p>
          </div>
        </div>
      </div>
    </div>
  );
}
