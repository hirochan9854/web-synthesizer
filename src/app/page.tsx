'use client';

import { useSynthesizer } from '@/hooks/useSynthesizer';
import Keyboard from '@/components/Keyboard';
import Controls from '@/components/Controls';

export default function Home() {
  const { playNote, stopNote, updateParams, params, isAudioInitialized, initAudioContext } = useSynthesizer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ウェブシンセサイザー</h1>
          <p className="text-gray-300">キーボードやマウスで音楽を演奏しよう</p>
        </header>

        <div className="space-y-8">
          {!isAudioInitialized && (
            <div className="text-center">
              <button
                onClick={initAudioContext}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🎵 オーディオを有効にする
              </button>
              <p className="text-gray-400 text-sm mt-2">クリックして音声再生を有効にしてください</p>
            </div>
          )}
          
          {isAudioInitialized && (
            <>
              <Controls params={params} onParamsChange={updateParams} />
              
              <div className="flex justify-center">
                <Keyboard onNotePress={playNote} onNoteRelease={stopNote} />
              </div>
            </>
          )}

          <div className="text-center text-gray-400 text-sm">
            <p>コンピューターキーボードを使用：白鍵はA-Lキー、黒鍵はW-Pキー</p>
            <p>またはマウスでピアノの鍵盤をクリックしてください</p>
          </div>
        </div>
      </div>
    </div>
  );
}
