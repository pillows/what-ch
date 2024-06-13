import { atom } from 'jotai';
import { python_code } from './constants';
// import { Language } from 'pages';

export const modeAtom = atom({
  label: 'Python',
  value: 'python'
});
export const codeAtom = atom(python_code);
export const inputAtom = atom(`` as string);
export const outputAtom = atom(``);

export const cppCompilerReadyAtom = atom(false);
