// import { getQuickJS } from 'quickjs-emscripten';

// export const runJavascript = async (
//   code: string,
//   setOutput: (output: string) => void
// ) => {
//   setOutput('');
//   const QuickJS = await getQuickJS();
//   const vm = QuickJS.newContext();
//   const logs: string[] = [];
//   const logHandle = vm.newFunction('log', (...args) => {
//     const nativeArgs = args.map(vm.dump);
//     const output = JSON.stringify(nativeArgs);
//     setOutput(output);
//     logs.push(nativeArgs.toString());
//     setOutput(logs.join('\n'));
//   });
//   const consoleHandle = vm.newObject();
//   vm.setProp(consoleHandle, 'log', logHandle);
//   vm.setProp(vm.global, 'console', consoleHandle);
//   consoleHandle.dispose();
//   logHandle.dispose();

//   const fetchHandle = vm.newFunction('fetch', (urlHandle) => {
//     const url = vm.getString(urlHandle);
//     const promise = vm.newPromise();

//     fetch(url)
//       .then((res) => res.text())
//       .then((txt) => promise.resolve(vm.newString(txt || '')));

//     promise.settled.then(vm.runtime.executePendingJobs);
//     return promise.handle;
//   });
//   fetchHandle.consume((handle) => vm.setProp(vm.global, 'fetch', handle));

//   const result = vm.evalCode(code);
//   const promiseHandle = vm.unwrapResult(result);

//   await vm.resolvePromise(promiseHandle);
//   promiseHandle.dispose();
//   vm.dispose();
// };

import { quickJS } from '@sebastianwessel/quickjs'
import { set } from 'nprogress'

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