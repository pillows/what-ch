async function runCode(code: string, setOutput: never) {
  try {
    await globalThis['CPP'].compileLinkRun(code);
  } catch {
  } finally {
    setOutput('code failed');
  }
}

export const runCpp = async (
  code: string,
  output: string,
  inputs: string[],
  setOutput: never
) => {
  globalThis['CPP_OUTPUT'] = '';
  await runCode(code, setOutput);
  setOutput(await globalThis['CPP_OUTPUT']);
};
