// Test file to ensure polyfills are working correctly
export function testPolyfills() {
  console.log('Testing polyfills...');

  // Test Buffer
  if (typeof window !== 'undefined' && (window as any).Buffer) {
    const buf = (window as any).Buffer.from('hello');
    console.log('✅ Buffer polyfill working:', buf);
  } else {
    console.error('❌ Buffer polyfill failed');
  }

  // Test process
  if (typeof window !== 'undefined' && (window as any).process) {
    console.log('✅ Process polyfill working:', (window as any).process.version || 'browser');
  } else {
    console.error('❌ Process polyfill failed');
  }

  // Test global
  if (typeof window !== 'undefined' && (window as any).global === window) {
    console.log('✅ Global polyfill working');
  } else {
    console.error('❌ Global polyfill failed');
  }

  // Test ArrayBuffer.slice
  if (ArrayBuffer.prototype.slice) {
    const buffer = new ArrayBuffer(10);
    const slice = buffer.slice(0, 5);
    console.log('✅ ArrayBuffer.slice polyfill working:', slice.byteLength === 5);
  } else {
    console.error('❌ ArrayBuffer.slice polyfill failed');
  }
}