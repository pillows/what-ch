// src/types/php-wasm.d.ts
declare module 'php-wasm/PhpWeb' {
  export class PhpWeb {
    addEventListener(event: 'ready' | 'output', callback: (event?: { detail: string[] }) => void): void;
    run(code: string): Promise<void>;
  }
}