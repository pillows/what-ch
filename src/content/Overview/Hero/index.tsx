import { Container, Grid } from '@mui/material';

import Editor from '@/components/Editor';
import { inputUnavailable, unavailable } from '@/constants';
import { useAtomValue } from 'jotai';
import { Language } from 'pages';
import { modeAtom } from '@/store';

function Hero() {
  const mode = useAtomValue<Language>(modeAtom);
  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Grid
        // spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={0} mx="auto">
          <Grid container spacing={1}>
            <Grid item>
              <Editor
                id="code"
                size="60"
                readOnly={unavailable.includes(mode.value)}
                placeholder={
                  unavailable.includes(mode.value) ? 'N/A' : 'Type code here'
                }
              />
            </Grid>
            <Grid item xs={4}>
              <Editor
                id="input"
                size="30"
                readOnly={inputUnavailable.includes(mode.value)}
                placeholder={
                  inputUnavailable.includes(mode.value) ||
                  unavailable.includes(mode.value)
                    ? 'N/A'
                    : 'input'
                }
              />
              <Editor
                id="output"
                size="30"
                readOnly={unavailable.includes(mode.value)}
                placeholder={
                  unavailable.includes(mode.value) ? 'N/A' : 'output'
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
