export const runJavascript = async (
  code: string,
  setOutput: (output: string) => void
) => {
  setOutput('');

  // Custom log to capture output
  const outputLogs: string[] = [];
  const customLog = (...args: any[]) => {
    outputLogs.push(args.join(' '));
  };

  // Create a new function with a custom console object
  const saferFasterEval = (input: string) => {
    const customConsole = { log: customLog };
    const functionBody = `
      const console = arguments[0];
      "use strict";
      ${input}
    `;
    return Function(functionBody).call(null, customConsole);
  };

  try {
    saferFasterEval(code);
  } catch (error) {
    customLog(error.toString());
  }

  // Set output
  setOutput(outputLogs.join('\n'));
};