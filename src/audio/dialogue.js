import part0 from './dialogue/part0.js';
import part1 from './dialogue/part1.js';
import part2 from './dialogue/part2.js';
import part3 from './dialogue/part3.js';
import part4 from './dialogue/part4.js';
import part5 from './dialogue/part5.js';
import part6 from './dialogue/part6.js';
import part7 from './dialogue/part7.js';
import part8 from './dialogue/part8.js';
import part9 from './dialogue/part9.js';

export const DIALOGUE_DURATION = 58.435875;

let dialogueUrl = null;

export function getDialogueUrl() {
  if (dialogueUrl) return dialogueUrl;

  const encoded = part0 + part1 + part2 + part3 + part4 + part5 + part6 + part7 + part8 + part9;
  const binary = window.atob(encoded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  dialogueUrl = URL.createObjectURL(new Blob([bytes], { type: 'audio/ogg; codecs=opus' }));
  return dialogueUrl;
}

export function releaseDialogueUrl() {
  if (!dialogueUrl) return;
  URL.revokeObjectURL(dialogueUrl);
  dialogueUrl = null;
}
