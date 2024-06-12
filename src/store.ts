import { Atom, atom } from 'jotai';
import { python_code } from './constants';
import { Language } from 'pages';

export const modeAtom: Atom<Language | null> = atom({
  label: 'Python',
  value: 'python'
});
export const codeAtom: Atom<string | null> = atom(python_code);
export const inputAtom: Atom<string | null> = atom(``);
export const outputAtom: Atom<string | null> = atom(``);

export const cppCompilerReadyAtom: Atom<boolean | null> = atom(false);
