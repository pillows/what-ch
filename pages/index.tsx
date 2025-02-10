import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Link from 'src/components/Link';
import Head from 'next/head';

import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// import { runPython } from '@/runner/python';
import { useAtom, useAtomValue } from 'jotai';
import { codeAtom, cppCompilerReadyAtom, modeAtom, outputAtom } from '@/store';
import React, { useEffect } from 'react';
import { runCpp } from '@/runner/cpp';
import { appendScript } from '@/utils';
import { runPhp } from '@/runner/php';
import { runJavascript } from '@/runner/javascript';
import { usePyodide } from '@/providers/pyodide';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(8)};
  margin-bottom: ${theme.spacing(1)};
`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

const languagesList = [
  { label: 'Python', value: 'python' },
  { label: 'C++', value: 'c_cpp' },
  { label: 'C', value: 'c_cpp' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'PHP', value: 'php' }
];

export interface Language {
  label: string;
  value: string;
}

function Overview() {
  const [, setOutput] = useAtom(outputAtom);
  const code = useAtomValue(codeAtom);
  const [mode, setMode] = useAtom(modeAtom);
  const [compilerReady, setCompilerReady] = useAtom(cppCompilerReadyAtom);
  const { runPython, pyodideLoading } = usePyodide();

  useEffect(() => {
    setOutput('');
    if (mode.value === 'c_cpp') {
      const url = 'https://cdn.jsdelivr.net/npm/@chriskoch/cpp-wasm';
      appendScript(url, async () => {
        await (globalThis as any)['CPP_READY'];
        // isCompilerReady = true;
        setCompilerReady(true);
      });
    }
  }, [mode]);

  return (
    <OverviewWrapper>
      <Head>
        <title>RunWASM</title>
      </Head>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Autocomplete
              disablePortal
              defaultValue={languagesList[0]}
              isOptionEqualToValue={(option, value) => {
                // please stop the warning ugghhh
                return option.label === value.label;
                // return true;
              }}
              onInputChange={(_, newValue: string | null) => {
                const filtered = languagesList.filter((language) => {
                  return language.label === newValue;
                });
                setMode(filtered[0]);
              }}
              id="combo-box-demo"
              options={languagesList}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Python" />}
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box>
                <Button
                  variant="contained"
                  sx={{ ml: 2 }}
                  onClick={async () => {
                    console.time('execute');
                    if (mode.value === 'python') {
                      const output = await runPython(code);
                      setOutput(output);
                    } else if (mode.value === 'c_cpp' || mode.value === 'c')
                      runCpp(code, setOutput);
                    else if (mode.value === 'php') runPhp(code, setOutput);
                    else if (mode.value === 'javascript')
                      runJavascript(code, setOutput);
                    else {
                      console.log('not implemented');
                      alert('Not implemented');
                    }
                  }}
                >
                  {(mode.value === 'c_cpp' && !compilerReady) ||
                  (mode.value === 'python' && pyodideLoading)
                    ? 'Loading'
                    : 'Execute'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
      <Hero />
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography textAlign="center" variant="subtitle1">
          Made with ❤️ in NYC{' '}
            <Link
            href="https://cordinal.io"
            target="_blank"
            rel="noopener noreferrer"
            >
            Cordinal
            </Link>
            © 2025
        </Typography>
      </Container>
    </OverviewWrapper>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
