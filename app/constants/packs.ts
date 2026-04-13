// Each pack contains two Opus-MT model directions: xx→en and en→xx
// HF model IDs are used during development via the HF Inference API.
// Replace urls with your CDN paths when moving to on-device ONNX models.

export interface PackModel {
  direction: string;         // e.g. "es-en"
  hfModelId: string;         // HuggingFace model ID for dev/API mode
  filename: string;          // local filename once downloaded
  size_mb: number;
}

export interface Pack {
  code: string;              // language code e.g. "es"
  name: string;
  nativeName: string;
  version: string;
  total_size_mb: number;
  models: PackModel[];
}

export const PACKS: Pack[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    version: '1.0.0',
    total_size_mb: 298,
    models: [
      { direction: 'es-en', hfModelId: 'Helsinki-NLP/opus-mt-es-en', filename: 'es-en.onnx', size_mb: 149 },
      { direction: 'en-es', hfModelId: 'Helsinki-NLP/opus-mt-en-es', filename: 'en-es.onnx', size_mb: 149 },
    ],
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    version: '1.0.0',
    total_size_mb: 302,
    models: [
      { direction: 'fr-en', hfModelId: 'Helsinki-NLP/opus-mt-fr-en', filename: 'fr-en.onnx', size_mb: 151 },
      { direction: 'en-fr', hfModelId: 'Helsinki-NLP/opus-mt-en-fr', filename: 'en-fr.onnx', size_mb: 151 },
    ],
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    version: '1.0.0',
    total_size_mb: 298,
    models: [
      { direction: 'de-en', hfModelId: 'Helsinki-NLP/opus-mt-de-en', filename: 'de-en.onnx', size_mb: 149 },
      { direction: 'en-de', hfModelId: 'Helsinki-NLP/opus-mt-en-de', filename: 'en-de.onnx', size_mb: 149 },
    ],
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    version: '1.0.0',
    total_size_mb: 298,
    models: [
      { direction: 'it-en', hfModelId: 'Helsinki-NLP/opus-mt-it-en', filename: 'it-en.onnx', size_mb: 149 },
      { direction: 'en-it', hfModelId: 'Helsinki-NLP/opus-mt-en-it', filename: 'en-it.onnx', size_mb: 149 },
    ],
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    version: '1.0.0',
    total_size_mb: 300,
    models: [
      { direction: 'pt-en', hfModelId: 'Helsinki-NLP/opus-mt-tc-big-pt-en', filename: 'pt-en.onnx', size_mb: 150 },
      { direction: 'en-pt', hfModelId: 'Helsinki-NLP/opus-mt-tc-big-en-pt', filename: 'en-pt.onnx', size_mb: 150 },
    ],
  },
];

export function getPack(code: string): Pack | undefined {
  return PACKS.find((p) => p.code === code);
}
