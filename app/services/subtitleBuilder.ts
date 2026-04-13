import { Segment } from './whisperService';

export interface SubtitleLine {
  index: number;
  start: number;
  end: number;
  original: string;
  translated: string;
}

// Time formatters

function toSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function toAssTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = (seconds % 60).toFixed(2);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(5, '0')}`;
}

// Segment regrouping

export function regroupSegments(segments: Segment[], maxChars: number = 60): Segment[] {
  const grouped: Segment[] = [];
  let current: Segment = { start: 0, end: 0, text: '', words: [] };

  for (const seg of segments) {
    for (const w of seg.words) {
      if (current.words.length === 0) {
        current.start = w.start;
      }
      if (current.text.length + w.word.length + 1 < maxChars) {
        current.text += (current.text ? ' ' : '') + w.word;
        current.end = w.end;
        current.words.push(w);
      } else {
        if (current.words.length > 0) grouped.push({ ...current });
        current = { start: w.start, end: w.end, text: w.word, words: [w] };
      }
    }
  }

  if (current.words.length > 0) grouped.push(current);
  return grouped;
}

// .SRT builder

export function buildSrt(lines: SubtitleLine[]): string {
  return lines
    .map(
      (l) =>
        `${l.index}\n${toSrtTime(l.start)} --> ${toSrtTime(l.end)}\n${l.original}\n${l.translated}`,
    )
    .join('\n\n');
}

// .ASS builder

function buildKaraokeLine(seg: Segment): string {
  return seg.words
    .map((w) => {
      const duration = Math.round((w.end - w.start) * 100);
      return `{\\k${duration}}${w.word} `;
    })
    .join('');
}

export function buildAss(segments: Segment[], translations: string[]): string {
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,48,&H00FFFFFF,&H0000FFFF,&H00000000,&H64000000,0,0,1,2,0,2,10,10,40,1

[Events]
Format: Layer, Start, End, Style, Text`;

  const events = segments
    .map((seg, i) => {
      const start = toAssTime(seg.start);
      const end = toAssTime(seg.end);
      const karaoke = buildKaraokeLine(seg);
      const translation = translations[i] ?? '';
      return `Dialogue: 0,${start},${end},Default,${karaoke}\\N{\\fs36}${translation}`;
    })
    .join('\n');

  return `${header}\n${events}`;
}

// Main: combine segments + translations into SubtitleLines

export function buildSubtitleLines(
  segments: Segment[],
  translations: string[],
): SubtitleLine[] {
  return segments.map((seg, i) => ({
    index: i + 1,
    start: seg.start,
    end: seg.end,
    original: seg.text,
    translated: translations[i] ?? '',
  }));
}
