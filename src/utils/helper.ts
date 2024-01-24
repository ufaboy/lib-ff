import { randomBytes } from 'crypto';

function generateRandomChallengeString() {
  return randomBytes(32).toString('base64');
}

function arrayBufferToBase64(arrayBuffer: Uint8Array) {
  return btoa(String.fromCharCode(...arrayBuffer));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  let binaryString = atob(base64);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export {
  generateRandomChallengeString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
};
