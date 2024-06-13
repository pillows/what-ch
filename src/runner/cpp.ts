interface CustomGlobalThis extends Window {
  CPP_OUTPUT: string;
}

declare const globalThis: CustomGlobalThis;

async function runCode(code: string, setOutput: (output: string) => void) {
  try {
    await globalThis['CPP' as keyof typeof globalThis].compileLinkRun(code);
  } catch {
  } finally {
    setOutput('code failed');
  }
}

export const runCpp = async (
  code: string,
  setOutput: (output: string) => void
) => {
  globalThis['CPP_OUTPUT'] = '';
  await runCode(code, setOutput);
  setOutput(await globalThis['CPP_OUTPUT']);
};