import { loadPyodide } from 'pyodide';

export class StdinHandler {
  results: string[] = []; // Update the type of 'results' to 'string[]' and initialize it as an empty array
  idx = 0;
  constructor(results: string[], options: {}) { // Update the type of 'results' parameter to 'string[]'
    this.results = results;
    this.idx = 0;
    Object.assign(this, options);
  }

  stdin() {
    return this.results[this.idx++];
  }
}

export const runPython = (
  code: string,
  inputs: string[],
  setOutput: (output: string) => void
) => {
  setOutput('');
  let stdout = '';
  const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full';

  loadPyodide({
    indexURL: PYODIDE_BASE_URL
  }).then((pyodide) => {
    // globalThis.pyodide = pyodide; // so you can access anywhere in the scope
    pyodide.setStdin(new StdinHandler(inputs, {}));
    pyodide.setStdout({
      batched: (text) => {
        stdout += text + '\n';
      }
    });
    pyodide.loadPackage([]).then(() => {
      pyodide.runPython(code);
      setOutput(stdout);
      console.timeEnd('execute');
    });
  });
};

// import { setOptions } from 'client-side-python-runner';

// setOptions({
//   output: console.log, // Output from print(...)-functions
//   error: null, // Throws an exception unless this is set to a function
//   input: prompt, // How to feed the input(...)-function
//   pythonVersion: 3, // Preferred version
//   loadVariablesBeforeRun: true,
//   storeVariablesAfterRun: true,
//   onLoading: (engine, isFirst) => {},
//   onLoaded: (engine, isLast) => {},
// });

// export const runPython = async (code: string, inputs: string[], setOutput: (output: string) => void): Promise<string> => {
//   // await loadEngine('pyodide', { version: '0.26.1' }); // Set engine version
//   // await runCode(`print("printed from pyodide")`);
//   return '';
// }