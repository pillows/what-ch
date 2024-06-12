import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled,
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Link from 'src/components/Link';
import Head from 'next/head';

import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { runPython } from '@/runner/python';
import { useAtom, useAtomValue } from 'jotai';
import {
  codeAtom,
  cppCompilerReadyAtom,
  inputAtom,
  modeAtom,
  outputAtom
} from '@/store';
import React, { useEffect } from 'react';
import { runCpp } from '@/runner/cpp';
import { appendScript } from '@/utils';
import { runPhp } from '@/runner/php';
import { runJavascript } from '@/runner/javascript';

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

// const options = ['Firefox', 'Google Chrome', 'Microsoft Edge', 'Safari', 'Opera'];
function Overview() {
  const [output, setOutput] = useAtom(outputAtom);
  const code = useAtomValue(codeAtom);
  const [value, setValue] = React.useState<string | null>(
    languagesList[0].label
  );
  const [mode, setMode] = useAtom<Language>(modeAtom);
  const stdIn = useAtomValue(inputAtom);
  const [compilerReady, setCompilerReady] =
    useAtom<boolean>(cppCompilerReadyAtom);

  useEffect(() => {
    setOutput('');
    if (mode.value === 'c_cpp') {
      const url = 'https://cdn.jsdelivr.net/npm/@chriskoch/cpp-wasm';
      appendScript(url, async () => {
        const ready = await globalThis['CPP_READY'];
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
              defaultValue={languagesList[0].label}
              // isOptionEqualToValue={(option, selectedValue) => option.value === selectedValue.value}  // <- you also need to add this code
              isOptionEqualToValue={(option, value) => {
                // please stop the warning ugghhh
                return true;
              }}
              onInputChange={(event: any, newValue: string | null) => {
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
                  onClick={() => {
                    const inputs = stdIn.split('\n');
                    if (mode.value === 'python')
                      runPython(code, output, inputs, setOutput);
                    else if (mode.value === 'c_cpp' || mode.value === 'c')
                      runCpp(code, 'N/A', inputs, setOutput);
                    else if (mode.value === 'php')
                      runPhp(code, 'N/A', inputs, setOutput);
                    else if (mode.value === 'javascript')
                      runJavascript(code, 'N/A', inputs, setOutput);
                    else {
                      console.log('not implemented');
                      alert('Not implemented')
                    }
                  }}
                >
                  {/* { compilerReady && mode.value === "c_cpp" ? "Execute" : "Loading" } */}
                  {mode.value === 'c_cpp' && !compilerReady
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
            href="https://mwong.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            mwong.io
          </Link>
        </Typography>
      </Container>
    </OverviewWrapper>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
