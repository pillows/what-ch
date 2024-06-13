import { PhpWeb } from 'php-wasm/PhpWeb';

export const runPhp = async (
  code: string,
  setOutput: (output: string) => void
) => {
  const php = new PhpWeb();

  php.addEventListener('ready', async () => {
    await php.run(code);
  });

  php.addEventListener('output', (event?: { detail: string[]; }) => {
    if (event) {
      setOutput(event.detail[0]);
    }
  });
};
