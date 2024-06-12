import { PhpWeb as PHP } from 'php-wasm/PhpWeb';

export const runPhp = async (
  code: string,
  output: string,
  inputs: string[],
  setOutput: never
) => {
  const php = new PHP();

  php.addEventListener('ready', async () => {
    await php.run(code);
  });

  php.addEventListener('output', (event) => {
    setOutput(event.detail[0]);
  });
};
