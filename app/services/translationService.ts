// DEV MODE: Returns realistic mock translations so you can test the full
// subtitle pipeline (transcribe → translate → build SRT/ASS) in Expo Go
// without any external API or on-device model.
//
// PRODUCTION TODO: Replace mockTranslate() with on-device ONNX inference.
// Each language pack contains two .onnx files (xx→en and en→xx).
// Load them with react-native-executorch:
//
//   import { ETModel } from 'react-native-executorch';
//   const model = await ETModel.load(pathToOnnxFile);
//   const result = await model.forward({ input_ids: tokenized });
//
// The translateBatch() signature stays exactly the same — only the
// internals of mockTranslate() change.

// Realistic mock translations keyed by [sourceLang-targetLang][original text].
const MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
  'en-es': {
    'Hello and welcome to PolyTitle.':
      'Hola y bienvenido a PolyTitle.',
    'This app creates subtitles for any video.':
      'Esta aplicación crea subtítulos para cualquier vídeo.',
    'You can learn Spanish while watching your favourite shows.':
      'Puedes aprender español mientras ves tus programas favoritos.',
  },
  'en-fr': {
    'Hello and welcome to PolyTitle.':
      'Bonjour et bienvenue sur PolyTitle.',
    'This app creates subtitles for any video.':
      'Cette application crée des sous-titres pour n\'importe quelle vidéo.',
    'You can learn Spanish while watching your favourite shows.':
      'Vous pouvez apprendre l\'espagnol en regardant vos émissions préférées.',
  },
  'en-de': {
    'Hello and welcome to PolyTitle.':
      'Hallo und willkommen bei PolyTitle.',
    'This app creates subtitles for any video.':
      'Diese App erstellt Untertitel für jedes Video.',
    'You can learn Spanish while watching your favourite shows.':
      'Sie können Spanisch lernen, während Sie Ihre Lieblingssendungen sehen.',
  },
  'en-it': {
    'Hello and welcome to PolyTitle.':
      'Ciao e benvenuto a PolyTitle.',
    'This app creates subtitles for any video.':
      'Questa app crea sottotitoli per qualsiasi video.',
    'You can learn Spanish while watching your favourite shows.':
      'Puoi imparare lo spagnolo guardando le tue serie preferite.',
  },
};

/**
 * Returns a mock translation for a single text segment.
 * Falls back gracefully with a [MOCK: xx→yy] prefix if no entry exists.
 */
function mockTranslate(text: string, sourceLang: string, targetLang: string): string {
  const key = `${sourceLang}-${targetLang}`;
  const table = MOCK_TRANSLATIONS[key];
  if (table && table[text]) return table[text];
  // Fallback — makes it obvious in the UI that this is a mock
  return `[MOCK ${sourceLang}→${targetLang}] ${text}`;
}

/**
 * Simulates translation latency so the UI progress states are testable.
 */
async function simulateDelay(ms: number = 400): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

/**
 * Translates an array of subtitle text segments.
 *
 * - sourceLang === targetLang, so just returns unchanged (no translation needed)
 * - sourceLang === 'en', one pass: en → target
 * - otherwise, two passes: source → en → target (English pivot)
 *
 * onProgress callback updates the UI label during each step.
 */
export async function translateBatch(
  texts: string[],
  sourceLang: string,
  targetLang: string,
  onProgress?: (step: string) => void,
): Promise<string[]> {
  if (sourceLang === targetLang) return texts;

  let intermediate = texts;

  // Step 1: source, English pivot (skip if source is already English)
  if (sourceLang !== 'en') {
    onProgress?.(`Translating ${sourceLang.toUpperCase()} → EN… (${texts.length} segments)`);
    await simulateDelay(600);
    intermediate = texts.map((t) => mockTranslate(t, sourceLang, 'en'));
  }

  // Step 2: English, target (skip if target is English)
  if (targetLang !== 'en') {
    onProgress?.(`Translating EN → ${targetLang.toUpperCase()}… (${intermediate.length} segments)`);
    await simulateDelay(600);
    intermediate = intermediate.map((t) => mockTranslate(t, 'en', targetLang));
  }

  return intermediate;
}