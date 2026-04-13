import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LANGUAGES } from '../constants/languages';
import { PACKS, getPack } from '../constants/packs';
import { useSettingsStore } from '../store/settingsStore';
import { transcribe } from '../services/whisperService';
import { translateBatch } from '../services/translationService';
import {
  regroupSegments,
  buildSubtitleLines,
  buildSrt,
  buildAss,
} from '../services/subtitleBuilder';

type Step = 'idle' | 'transcribing' | 'translating' | 'done' | 'error';

export default function HomeScreen() {
  const router = useRouter();
  const { sourceLanguage, targetLanguage, setSourceLanguage, setTargetLanguage } =
    useSettingsStore();

  const [step, setStep] = useState<Step>('idle');
  const [stepLabel, setStepLabel] = useState('');
  const [srtOutput, setSrtOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const sourceLang = LANGUAGES.find((l) => l.code === sourceLanguage);
  const targetLang = LANGUAGES.find((l) => l.code === targetLanguage);

  const targetPackExists = !!getPack(targetLanguage) || targetLanguage === 'en';

  async function handleProcess() {
    if (sourceLanguage === targetLanguage) {
      Alert.alert('Same language', 'Source and target language must be different.');
      return;
    }

    try {
      setStep('transcribing');
      setStepLabel('Transcribing audio…');
      setSrtOutput('');
      setErrorMsg('');

      // 1. Transcribe (mocked in dev)
      const rawSegments = await transcribe('mock_audio.wav', sourceLanguage);

      // 2. Regroup into subtitle-length chunks
      const segments = regroupSegments(rawSegments);
      const texts = segments.map((s) => s.text);

      setStep('translating');

      // 3. Translate
      const translations = await translateBatch(
        texts,
        sourceLanguage,
        targetLanguage,
        (label) => setStepLabel(label),
      );

      // 4. Build outputs
      const lines = buildSubtitleLines(segments, translations);
      const srt = buildSrt(lines);
      const ass = buildAss(segments, translations);

      setSrtOutput(srt);
      setStep('done');
      setStepLabel('');

      console.log('=== SRT OUTPUT ===\n', srt);
      console.log('=== ASS OUTPUT ===\n', ass);
    } catch (e: any) {
      setStep('error');
      setStepLabel('');
      setErrorMsg(e?.message ?? 'Unknown error');
    }
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="always">
      <Text style={styles.title}>PolyTitle</Text>
      <Text style={styles.subtitle}>Offline dual-subtitle generator</Text>

      {/* Language selectors */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Language pair</Text>

        <Text style={styles.label}>Video language (source)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.chip, sourceLanguage === l.code && styles.chipActive]}
              onPress={() => setSourceLanguage(l.code)}
            >
              <Text style={[styles.chipText, sourceLanguage === l.code && styles.chipTextActive]}>
                {l.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Subtitle language (target)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.chip, targetLanguage === l.code && styles.chipActive]}
              onPress={() => setTargetLanguage(l.code)}
            >
              <Text style={[styles.chipText, targetLanguage === l.code && styles.chipTextActive]}>
                {l.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.pairPreview}>
          <Text style={styles.pairText}>
            {sourceLang?.name ?? sourceLanguage} → {targetLang?.name ?? targetLanguage}
          </Text>
          {!targetPackExists && (
            <Text style={styles.packWarning}>Pack for {targetLang?.name} not yet available</Text>
          )}
        </View>
      </View>

      {/* Process button */}
      <TouchableOpacity
        style={[styles.button, (step === 'transcribing' || step === 'translating') && styles.buttonDisabled]}
        onPress={handleProcess}
        disabled={step === 'transcribing' || step === 'translating'}
      >
        {step === 'transcribing' || step === 'translating' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Process video (mock)</Text>
        )}
      </TouchableOpacity>

      {/* Step label */}
      {stepLabel !== '' && <Text style={styles.stepLabel}>{stepLabel}</Text>}

      {/* Error */}
      {step === 'error' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMsg}>{errorMsg}</Text>
        </View>
      )}

      {/* SRT preview */}
      {step === 'done' && srtOutput !== '' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SRT output preview</Text>
          <Text style={styles.srtPreview}>{srtOutput}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 24 },

  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 12 },

  label: { fontSize: 12, color: '#888', marginBottom: 8, marginTop: 4 },
  chipRow: { flexDirection: 'row', marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: '#444',
  },
  chipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  chipText: { color: '#aaa', fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },

  pairPreview: { marginTop: 12, alignItems: 'center' },
  pairText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  packWarning: { color: '#f59e0b', fontSize: 12, marginTop: 4 },

  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  stepLabel: { color: '#888', fontSize: 13, textAlign: 'center', marginBottom: 12 },

  errorBox: {
    backgroundColor: '#2a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#e24b4a',
    marginBottom: 16,
  },
  errorTitle: { color: '#e24b4a', fontWeight: '700', marginBottom: 4 },
  errorMsg: { color: '#f09595', fontSize: 13 },

  srtPreview: {
    color: '#a3e635',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
