import { getQuickJS } from 'quickjs-emscripten';

export const runJavascript = async (
  code: string,
  setOutput: (output: string) => void
) => {
  setOutput('');

  const QuickJS = await getQuickJS();
  const vm = QuickJS.newContext();

  const logHandle = vm.newFunction('log', (...args) => {
    const nativeArgs = args.map(vm.dump);
    const output = nativeArgs.join(' ') + '\n';
    setOutput(output);
  });
  const consoleHandle = vm.newObject();
  vm.setProp(consoleHandle, 'log', logHandle);
  vm.setProp(vm.global, 'console', consoleHandle);
  consoleHandle.dispose();
  logHandle.dispose();

  const fetchHandle = vm.newFunction('fetch', (urlHandle) => {
    const url = vm.getString(urlHandle);
    const promise = vm.newPromise();

    fetch(url)
      .then((res) => res.text())
      .then((txt) => promise.resolve(vm.newString(txt || '')));

    promise.settled.then(vm.runtime.executePendingJobs);
    return promise.handle;
  });
  fetchHandle.consume((handle) => vm.setProp(vm.global, 'fetch', handle));

  const result = vm.evalCode(code);
  const promiseHandle = vm.unwrapResult(result);

  await vm.resolvePromise(promiseHandle);
  promiseHandle.dispose();
  vm.dispose();
};
