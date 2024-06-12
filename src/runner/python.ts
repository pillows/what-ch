import { loadPyodide } from 'pyodide';

class StdinHandler {
  results = null;
  idx = 0;
  constructor(results, options) {
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
  output: string,
  inputs: string[],
  setOutput: never
) => {
  // const setOutput = useSetAtom(outputAtom);
  // globalThis.pyodide.runPython(code);
  setOutput('');
  let stdout = '';
  const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full';

  loadPyodide({
    indexURL: PYODIDE_BASE_URL
  }).then((pyodide) => {
    globalThis.pyodide = pyodide; // so you can access anywhere in the scope
    pyodide.setStdin(new StdinHandler(inputs, {}));
    pyodide.setStdout({
      batched: (text) => {
        stdout += text + '\n';
      }
    });
    pyodide.loadPackage([]).then(() => {
      pyodide.runPython(code);
      setOutput(stdout);
    });
  });
};
