export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English',    nativeName: 'English'    },
  { code: 'es', name: 'Spanish',    nativeName: 'Español'    },
  { code: 'fr', name: 'French',     nativeName: 'Français'   },
  { code: 'de', name: 'German',     nativeName: 'Deutsch'    },
  { code: 'it', name: 'Italian',    nativeName: 'Italiano'   },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português'  },
  { code: 'ru', name: 'Russian',    nativeName: 'Русский'    },
  { code: 'ja', name: 'Japanese',   nativeName: '日本語'      },
  { code: 'ko', name: 'Korean',     nativeName: '한국어'      },
  { code: 'zh', name: 'Chinese',    nativeName: '中文'        },
  { code: 'nl', name: 'Dutch',      nativeName: 'Nederlands' },
  { code: 'el', name: 'Greek',      nativeName: 'Ελληνικά'  },
  { code: 'pl', name: 'Polish',     nativeName: 'Polski'     },
  { code: 'ar', name: 'Arabic',     nativeName: 'العربية'    },
  { code: 'tr', name: 'Turkish',    nativeName: 'Türkçe'     },
];

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
