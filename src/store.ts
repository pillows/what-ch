import { Atom, atom } from 'jotai';
import { python_code } from './constants';
import { Language } from 'pages';

export const modeAtom: Atom<Language> = atom({
  label: 'Python',
  value: 'python'
});
export const codeAtom: Atom<string> = atom(python_code);
export const inputAtom: Atom<string> = atom(``);
export const outputAtom: Atom<string> = atom(``);

export const cppCompilerReadyAtom: Atom<boolean> = atom(false);
