// Browser polyfills for Node.js modules
import { Buffer } from 'buffer';
import process from 'process';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).process = process;
  (window as any).global = window;

  // Fix for stream-browserify issues
  if (!process.nextTick) {
    process.nextTick = function(fn: Function, ...args: any[]) {
      setTimeout(() => fn(...args), 0);
    };
  }

  // Add setImmediate polyfill
  if (typeof (window as any).setImmediate === 'undefined') {
    (window as any).setImmediate = function(fn: Function, ...args: any[]) {
      return setTimeout(() => fn(...args), 0);
    };
  }

  // Add clearImmediate polyfill
  if (typeof (window as any).clearImmediate === 'undefined') {
    (window as any).clearImmediate = function(id: any) {
      clearTimeout(id);
    };
  }

  // Fix for ArrayBuffer slice method
  if (typeof ArrayBuffer.prototype.slice === 'undefined') {
    ArrayBuffer.prototype.slice = function(start: number, end?: number) {
      const that = new Uint8Array(this);
      if (end === undefined) end = that.length;
      const result = new ArrayBuffer(end - start);
      const resultArray = new Uint8Array(result);
      for (let i = 0; i < result.byteLength; i++) {
        resultArray[i] = that[start + i];
      }
      return result;
    };
  }
}