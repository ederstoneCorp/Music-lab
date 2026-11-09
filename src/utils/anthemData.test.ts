import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTime,
  getActiveSection,
  getActiveLyric,
  calculateStemGain,
  buildLyriaPrompt,
  ANTHEM_SECTIONS,
  TOTAL_DURATION,
} from './anthemData';

test('formatTime formats seconds properly', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(124), '2:04');
  assert.equal(formatTime(-5), '0:00');
  assert.equal(formatTime(NaN), '0:00');
});

test('getActiveSection returns correct section based on timestamp', () => {
  const intro = getActiveSection(5);
  assert.equal(intro.id, 'intro');

  const verse1 = getActiveSection(20);
  assert.equal(verse1.id, 'verse1');

  const chorus1 = getActiveSection(60);
  assert.equal(chorus1.id, 'chorus1');

  const bridge = getActiveSection(115);
  assert.equal(bridge.id, 'bridge');

  const outro = getActiveSection(175);
  assert.equal(outro.id, 'outro');

  // boundary clamping
  const beyondEnd = getActiveSection(999);
  assert.equal(beyondEnd.id, 'outro');
});

test('calculateStemGain respects solo and mute rules', () => {
  // Normal state
  assert.equal(calculateStemGain(0.8, false, false, false), 0.8);

  // Muted track
  assert.equal(calculateStemGain(0.8, true, false, false), 0);

  // Another track is soloed, this one is not
  assert.equal(calculateStemGain(0.8, false, false, true), 0);

  // This track is soloed while solo is active
  assert.equal(calculateStemGain(0.8, false, true, true), 0.8);

  // Even if soloed, if muted it should be 0
  assert.equal(calculateStemGain(0.8, true, true, true), 0);
});

test('buildLyriaPrompt builds detailed prompt for clip and pro models', () => {
  const clipPrompt = buildLyriaPrompt({
    model: 'lyria-3-clip-preview',
    styleName: 'Afro-Futuristic Afropop',
    tempo: '112 BPM',
    includeLyrics: true,
  });
  assert.match(clipPrompt, /30-second/);
  assert.match(clipPrompt, /Think! Build! Transform!/);
  assert.match(clipPrompt, /112 BPM/);

  const proPrompt = buildLyriaPrompt({
    model: 'lyria-3-pro-preview',
    styleName: 'Stadium Afrobeats',
    customNotes: 'Heavy brass horns and African choir',
  });
  assert.match(proPrompt, /full-length radio-ready/);
  assert.match(proPrompt, /Heavy brass horns/);
});

test('total duration matches anthem length expectation', () => {
  assert.ok(TOTAL_DURATION > 120);
  assert.equal(ANTHEM_SECTIONS.length, 8);
});
