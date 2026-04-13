// DEV MODE: Returns mock segments so you can test the full pipeline in Expo Go
// without a native device build or the 1.5 GB Whisper model.
//
// TODO (production): Replace the body of `transcribe()` with a call to
// whisper.rn after ejecting to bare workflow:
//
//   import { transcribe } from 'whisper.rn';
//   const result = await transcribe(audioPath, { language: sourceLang });
//   return result.segments; // already has word timestamps

export interface WordTimestamp {
  word: string;
  start: number; // seconds
  end: number;
}

export interface Segment {
  start: number;
  end: number;
  text: string;
  words: WordTimestamp[];
}

/**
 * Transcribes audio and returns segments with word-level timestamps.
 * In DEV mode this returns a realistic mock of an English sentence.
 */
export async function transcribe(
  audioPath: string,
  sourceLang: string = 'en',
): Promise<Segment[]> {
  console.log(`[whisper] transcribing ${audioPath} (lang=${sourceLang}) — MOCK`);

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 1200));

  // Mock: a few realistic English subtitle segments with word timestamps
  const mock: Segment[] = [
    {
      start: 0.0,
      end: 3.2,
      text: 'Hello and welcome to PolyTitle.',
      words: [
        { word: 'Hello',    start: 0.0, end: 0.5 },
        { word: 'and',      start: 0.6, end: 0.8 },
        { word: 'welcome',  start: 0.9, end: 1.4 },
        { word: 'to',       start: 1.5, end: 1.7 },
        { word: 'PolyTitle.', start: 1.8, end: 3.2 },
      ],
    },
    {
      start: 3.5,
      end: 7.1,
      text: 'This app creates subtitles for any video.',
      words: [
        { word: 'This',      start: 3.5, end: 3.8 },
        { word: 'app',       start: 3.9, end: 4.1 },
        { word: 'creates',   start: 4.2, end: 4.7 },
        { word: 'subtitles', start: 4.8, end: 5.4 },
        { word: 'for',       start: 5.5, end: 5.7 },
        { word: 'any',       start: 5.8, end: 6.0 },
        { word: 'video.',    start: 6.1, end: 7.1 },
      ],
    },
    {
      start: 7.5,
      end: 11.0,
      text: 'You can learn Spanish while watching your favourite shows.',
      words: [
        { word: 'You',       start: 7.5,  end: 7.7  },
        { word: 'can',       start: 7.8,  end: 8.0  },
        { word: 'learn',     start: 8.1,  end: 8.4  },
        { word: 'Spanish',   start: 8.5,  end: 9.0  },
        { word: 'while',     start: 9.1,  end: 9.4  },
        { word: 'watching',  start: 9.5,  end: 9.9  },
        { word: 'your',      start: 10.0, end: 10.2 },
        { word: 'favourite', start: 10.3, end: 10.7 },
        { word: 'shows.',    start: 10.8, end: 11.0 },
      ],
    },
  ];

  return mock;
}
