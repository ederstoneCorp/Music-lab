/**
 * CodeMtaani Anthem Data & Audio Processing Logic
 * "Think. Build. Transform."
 */

export interface LyricLine {
  id: string;
  time: number; // in seconds
  duration: number; // in seconds
  speaker: 'Narrator' | 'Lead Duet' | 'Male Lead' | 'Female Lead' | 'African Choir' | 'Full Ensemble';
  text: string;
  subtext?: string;
}

export interface SongSection {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  vocalArrangement: string;
  musicalFocus: string;
  lines: LyricLine[];
}

export interface StemTrack {
  id: 'vocals' | 'drums' | 'synths' | 'orchestra';
  name: string;
  icon: string;
  role: string;
  description: string;
  color: string;
  defaultVolume: number;
}

export const STEM_TRACKS: StemTrack[] = [
  {
    id: 'vocals',
    name: 'Lead & Choir Vocals',
    icon: 'mic',
    role: 'Spoken, Harmonies, Stadium Chants',
    description: 'Cinematic narrator, dynamic male & female vocal duet, uplifting African choir call-and-response.',
    color: '#F59E0B',
    defaultVolume: 0.9,
  },
  {
    id: 'drums',
    name: 'Afro-Peractive Percussion',
    icon: 'drum',
    role: 'Log Drums, Shekere, Talking Drums',
    description: 'Crisp contemporary Afrobeats groove, organic shaker syncopation, and punchy Amapiano log drum bass.',
    color: '#EF4444',
    defaultVolume: 0.85,
  },
  {
    id: 'synths',
    name: 'Afro-Futuristic Synths',
    icon: 'activity',
    role: 'Cyber Arpeggios, Kalimba Melodies',
    description: 'Lush atmospheric poly-synths, electrified kalimba plucks, and soaring futuristic synth leads.',
    color: '#06B6D4',
    defaultVolume: 0.8,
  },
  {
    id: 'orchestra',
    name: 'Cinematic Orchestra & Sub',
    icon: 'sparkles',
    role: 'Epic Brass, Strings & 808 Sub-Bass',
    description: 'Stadium-scale horn fanfare, emotive soaring strings, and earthquake sub-bass power.',
    color: '#8B5CF6',
    defaultVolume: 0.85,
  },
];

export const ANTHEM_SECTIONS: SongSection[] = [
  {
    id: 'intro',
    name: 'Intro',
    startTime: 0,
    endTime: 16,
    vocalArrangement: 'Spoken, Cinematic & Resonant',
    musicalFocus: 'Ambient atmospheric synth pads, distant talking drum rolls, subtle electric kalimba plucks.',
    lines: [
      { id: 'i1', time: 1.5, duration: 3.0, speaker: 'Narrator', text: 'From an idea to a vision,' },
      { id: 'i2', time: 4.8, duration: 3.2, speaker: 'Narrator', text: 'From a vision to creation.' },
      { id: 'i3', time: 8.2, duration: 3.5, speaker: 'Narrator', text: "The future isn't somewhere we wait for." },
      { id: 'i4', time: 12.0, duration: 2.8, speaker: 'Narrator', text: "It's something we build." },
      { id: 'i5', time: 14.8, duration: 1.2, speaker: 'Full Ensemble', text: 'CodeMtaani!' },
    ],
  },
  {
    id: 'verse1',
    name: 'Verse 1',
    startTime: 16,
    endTime: 38,
    vocalArrangement: 'Confident Male Lead with Smooth Female Counter-Melody',
    musicalFocus: 'Punchy 112 BPM Afrobeats groove enters with crisp shekere, syncopated snare, and warm rolling bass.',
    lines: [
      { id: 'v1_1', time: 16.5, duration: 5.0, speaker: 'Male Lead', text: 'We came with a dream and a reason to rise,' },
      { id: 'v1_2', time: 21.8, duration: 5.2, speaker: 'Female Lead', text: 'A world full of problems, we see possibilities.' },
      { id: 'v1_3', time: 27.2, duration: 5.2, speaker: 'Male Lead', text: 'From the streets to the screens, let the innovation flow,' },
      { id: 'v1_4', time: 32.6, duration: 5.0, speaker: 'Lead Duet', text: 'Every line of code takes us where we want to go.' },
      { id: 'v1_5', time: 38.0, duration: 4.5, speaker: 'Male Lead', text: 'Different minds, one ambition, turning challenges into innovation.' },
      { id: 'v1_6', time: 42.8, duration: 4.8, speaker: 'Lead Duet', text: 'No limits to the things we can create, shaping tomorrow’s fate.' },
    ],
  },
  {
    id: 'prechorus1',
    name: 'Pre-Chorus',
    startTime: 38,
    endTime: 56,
    vocalArrangement: 'Layered Male & Female Harmonies building in urgency',
    musicalFocus: 'Percussion filters sweep open, rising arpeggiators and sub-bass swells.',
    lines: [
      { id: 'pc1_1', time: 48.0, duration: 3.8, speaker: 'Lead Duet', text: 'We think beyond the ordinary,' },
      { id: 'pc1_2', time: 52.0, duration: 3.8, speaker: 'Lead Duet', text: 'Build what others only imagine.' },
      { id: 'pc1_3', time: 56.0, duration: 3.8, speaker: 'Lead Duet', text: 'Every setback, every challenge,' },
      { id: 'pc1_4', time: 60.0, duration: 4.2, speaker: 'Full Ensemble', text: 'Is another chance to make it happen!' },
    ],
  },
  {
    id: 'chorus1',
    name: 'Chorus',
    startTime: 56,
    endTime: 84,
    vocalArrangement: 'Stadium-Sized Chant with Explosive Call-and-Response',
    musicalFocus: 'Explosive Afropop drop, stadium horns, heavy log drum, thumping 808 and triumphant synth leads.',
    lines: [
      { id: 'c1_1', time: 64.5, duration: 4.5, speaker: 'Full Ensemble', text: 'Think! Build! Transform! We’re creating something more.' },
      { id: 'c1_2', time: 69.2, duration: 4.8, speaker: 'Full Ensemble', text: 'CodeMtaani, hear the call, building futures for us all!' },
      { id: 'c1_3', time: 74.2, duration: 4.8, speaker: 'Full Ensemble', text: 'Think! Build! Transform! Let innovation lead the way.' },
      { id: 'c1_4', time: 79.2, duration: 4.8, speaker: 'Full Ensemble', text: 'From Africa to the world, we’re the change of a new day!' },
    ],
  },
  {
    id: 'verse2',
    name: 'Verse 2',
    startTime: 84,
    endTime: 108,
    vocalArrangement: 'Dynamic Female Lead with Male Callouts & Ad-libs',
    musicalFocus: 'Groove shifts into a tighter pocket with afro-electronic arpeggio syncopation and talking drum fills.',
    lines: [
      { id: 'v2_1', time: 84.5, duration: 4.8, speaker: 'Female Lead', text: 'Ideas becoming reality, technology driving possibility.' },
      { id: 'v2_2', time: 89.5, duration: 4.8, speaker: 'Male Lead', text: 'Young innovators, fearless minds, breaking barriers, redefining times.' },
      { id: 'v2_3', time: 94.5, duration: 4.8, speaker: 'Female Lead', text: 'We don’t just follow, we create the way, building solutions for a better day.' },
      { id: 'v2_4', time: 99.5, duration: 5.2, speaker: 'Lead Duet', text: 'One community, one purpose, one dream, together we’re stronger than we’ve ever been.' },
    ],
  },
  {
    id: 'bridge',
    name: 'Bridge',
    startTime: 108,
    endTime: 136,
    vocalArrangement: 'Rich Multi-Part African Choir with Soulful Lead Ad-libs',
    musicalFocus: 'Emotional breakdown: warm Rhodes, traditional djembe heartbeat, acoustic kora harmonics swelling into full orchestra.',
    lines: [
      { id: 'b1', time: 108.5, duration: 3.5, speaker: 'African Choir', text: 'One vision! (One future!)', subtext: 'Call and response' },
      { id: 'b2', time: 112.2, duration: 3.5, speaker: 'African Choir', text: 'One mission! (Together!)', subtext: 'Harmonized choir' },
      { id: 'b3', time: 116.0, duration: 4.0, speaker: 'African Choir', text: 'Through innovation, we rise forever.' },
      { id: 'b4', time: 120.2, duration: 4.0, speaker: 'Lead Duet', text: 'From the ground up, we make it happen.' },
      { id: 'b5', time: 124.5, duration: 5.5, speaker: 'Full Ensemble', text: 'The future is ours, and we’re not backing down!' },
    ],
  },
  {
    id: 'final_chorus',
    name: 'Final Chorus',
    startTime: 136,
    endTime: 168,
    vocalArrangement: 'Explosive Stadium Choral Ensemble & High Energy Lead Ad-libs',
    musicalFocus: 'Maximalist climax with brass fanfares, stadium claps, high-energy Afrobeats rhythms and soaring vocal riffs.',
    lines: [
      { id: 'fc1', time: 136.5, duration: 4.8, speaker: 'Full Ensemble', text: 'Think! Build! Transform! Let the whole world know our name.' },
      { id: 'fc2', time: 141.5, duration: 4.8, speaker: 'Full Ensemble', text: 'CodeMtaani, we’re moving forward, innovation is our flame!' },
      { id: 'fc3', time: 146.5, duration: 4.8, speaker: 'Full Ensemble', text: 'Think! Build! Transform! Every dream can find its way.' },
      { id: 'fc4', time: 151.5, duration: 5.5, speaker: 'Full Ensemble', text: 'From Africa to the world, we’re building a brighter day!' },
    ],
  },
  {
    id: 'outro',
    name: 'Outro',
    startTime: 168,
    endTime: 188,
    vocalArrangement: 'Cinematic Spoken Outro with Tape Echo & Reverb Dissolve',
    musicalFocus: 'Gentle synth arpeggios, distant log drum echo, warm ambient sunset pad settling to silence.',
    lines: [
      { id: 'o1', time: 168.5, duration: 3.2, speaker: 'Narrator', text: 'This is more than technology.' },
      { id: 'o2', time: 172.0, duration: 3.0, speaker: 'Narrator', text: 'This is a movement.' },
      { id: 'o3', time: 175.2, duration: 3.0, speaker: 'Narrator', text: 'This is a generation.' },
      { id: 'o4', time: 178.5, duration: 2.5, speaker: 'Narrator', text: 'CodeMtaani.' },
      { id: 'o5', time: 181.5, duration: 4.5, speaker: 'Full Ensemble', text: 'Think. Build. Transform.' },
    ],
  },
];

export const TOTAL_DURATION = 188; // 3:08 full studio track

/**
 * Soundboard samples for instant stadium interactive playback
 */
export interface SoundboardDrop {
  id: string;
  label: string;
  subtitle: string;
  category: 'chant' | 'slogan' | 'movement';
  frequencyBase: number;
}

export const SOUNDBOARD_DROPS: SoundboardDrop[] = [
  { id: 'drop-tbt', label: 'THINK! BUILD! TRANSFORM!', subtitle: 'Official Core Motto', category: 'slogan', frequencyBase: 330 },
  { id: 'drop-cm', label: 'CODEMTAANI!', subtitle: 'Community Rally Cry', category: 'chant', frequencyBase: 440 },
  { id: 'drop-world', label: 'From Africa to the World!', subtitle: 'Global Ambition Drop', category: 'movement', frequencyBase: 392 },
  { id: 'drop-future', label: 'One Vision! One Future!', subtitle: 'Choir Harmony Drop', category: 'chant', frequencyBase: 523 },
  { id: 'drop-build', label: 'It’s Something We Build.', subtitle: 'Cinematic Voice Drop', category: 'slogan', frequencyBase: 261 },
  { id: 'drop-flame', label: 'Innovation is Our Flame!', subtitle: 'Stadium Climax', category: 'movement', frequencyBase: 493 },
];

/**
 * Music generation presets for Lyria
 */
export interface LyriaPreset {
  id: string;
  name: string;
  model: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  tempo: string;
  vibe: string;
  description: string;
  promptSnippet: string;
}

export const LYRIA_PRESETS: LyriaPreset[] = [
  {
    id: 'anthem-full',
    name: 'Full Afro-Futuristic Stadium Anthem',
    model: 'lyria-3-pro-preview',
    tempo: '112 BPM',
    vibe: 'Euphoric & Globally Competitive',
    description: 'Full-length radio-ready production with layered vocals, African choir, heavy log drums, and brass fanfares.',
    promptSnippet: 'A premium, radio-ready Afro-futuristic Afropop anthem titled "Think. Build. Transform." by CodeMtaani. Contemporary Afrobeats percussion, log drums, cinematic electronic synthesizers, inspiring African choir harmonies, and anthemic stadium vocals.',
  },
  {
    id: 'stadium-chant-clip',
    name: '30s Stadium Chant & Drop (Lyria Clip)',
    model: 'lyria-3-clip-preview',
    tempo: '116 BPM',
    vibe: 'High Energy Climax',
    description: 'A 30-second explosive festival clip focusing on the "Think! Build! Transform!" hook and thumping drums.',
    promptSnippet: 'A 30-second high-energy stadium Afrobeats chant clip: "Think! Build! Transform! CodeMtaani, hear the call, building futures for us all!" Explosive Afro-electronic drops, heavy bass, crowd chants, and brass.',
  },
  {
    id: 'acoustic-fusion',
    name: 'Afro-Fusion Acoustic & Kora Remix',
    model: 'lyria-3-pro-preview',
    tempo: '104 BPM',
    vibe: 'Soulful & Organic',
    description: 'Organic West African kora, acoustic guitar, calabash percussion, and warm vocal harmonies.',
    promptSnippet: 'An uplifting Afro-fusion track with acoustic kora melodies, warm Rhodes piano, gentle djembe rhythms, and soulful African choral harmonies singing "Think. Build. Transform."',
  },
  {
    id: 'cyber-electronic',
    name: 'Afro-Electronic Club / Tech Launch',
    model: 'lyria-3-clip-preview',
    tempo: '122 BPM',
    vibe: 'Futuristic & Club-Ready',
    description: '30s high-velocity tech showcase track with rolling Amapiano basslines and synth arpeggios.',
    promptSnippet: 'A 30-second futuristic Afro-house and electronic track with driving basslines, high-tech synthesizer sequences, and confident African vocal shouts celebrating innovation and code.',
  },
];

/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Determine which song section corresponds to a given timestamp
 */
export function getActiveSection(currentTime: number, sections: SongSection[] = ANTHEM_SECTIONS): SongSection {
  const clamped = Math.max(0, Math.min(currentTime, TOTAL_DURATION));
  const found = sections.find((s) => clamped >= s.startTime && clamped < s.endTime);
  return found || sections[sections.length - 1];
}

/**
 * Determine active lyric line at a given timestamp
 */
export function getActiveLyric(currentTime: number, sections: SongSection[] = ANTHEM_SECTIONS): LyricLine | null {
  for (const section of sections) {
    for (const line of section.lines) {
      if (currentTime >= line.time && currentTime < line.time + line.duration) {
        return line;
      }
    }
  }
  return null;
}

/**
 * Calculate effective stem gain with mute/solo logic
 */
export function calculateStemGain(
  trackVolume: number,
  isMuted: boolean,
  isSoloed: boolean,
  anySoloActive: boolean
): number {
  if (isMuted) return 0;
  if (anySoloActive && !isSoloed) return 0;
  return Math.max(0, Math.min(trackVolume, 1));
}

/**
 * Build rich Lyria prompt incorporating user parameters and lyrics
 */
export function buildLyriaPrompt(options: {
  model: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  styleName: string;
  customNotes?: string;
  includeLyrics?: boolean;
  tempo?: string;
}): string {
  const duration = options.model === 'lyria-3-clip-preview' ? '30-second' : 'full-length radio-ready';
  let prompt = `Generate a ${duration} Afro-futuristic Afropop anthem for the CodeMtaani tech and innovation community titled "Think. Build. Transform."\n`;
  prompt += `Musical style: ${options.styleName}. Blend contemporary Afrobeats, Afro-fusion, cinematic electronic music, lush poly-synths, heavy Amapiano log drum bass, and uplifting orchestral brass.\n`;
  prompt += `Vocals: Confident, youthful male and female lead vocals with rich African choral harmonies and anthemic stadium call-and-response chants.\n`;
  if (options.tempo) {
    prompt += `Tempo: ${options.tempo}.\n`;
  }
  if (options.customNotes && options.customNotes.trim().length > 0) {
    prompt += `Production notes: ${options.customNotes.trim()}.\n`;
  }
  if (options.includeLyrics) {
    prompt += `Lyrics to incorporate:
"Think! Build! Transform! We're creating something more.
CodeMtaani, hear the call, building futures for us all.
Think! Build! Transform! Let innovation lead the way.
From Africa to the world, we're the change of a new day!"`;
  }
  return prompt;
}
