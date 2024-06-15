import type { ReactElement, ReactNode } from 'react';
import type {
  NextComponentType,
  NextPageContext
} from 'next/dist/shared/lib/utils';
import { Pyodide } from '@run-wasm/python';

declare module 'next' {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P
  > & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}

declare module '@run-wasm/python' {
  export function createPythonClient(pyodide: Pyodide): any; // Replace `any` with more specific types if known
  // Declare other exports from the module here, if necessary
}
