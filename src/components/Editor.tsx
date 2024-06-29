import React, { useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { useAtom } from 'jotai';
import { codeAtom, inputAtom, modeAtom, outputAtom } from '@/store';
import { codeTemplates } from '@/constants';

type Props = {
  id: string;
  size: string;
  placeholder: string;
  readOnly?: boolean;
};

const langObj: { [key: string]: string } = {
  c_cpp: 'c_cpp',
  'c++': 'c_cpp',
  python: 'python',
  java: 'java',
  golang: 'golang',
  php: 'php',
  javascript: 'javascript'
};

const Editor: React.FC<Props> = (props) => {
  const { id, size, placeholder, readOnly } = props;
  const [mode] = useAtom(modeAtom);

  const [code, setCode] = useAtom(codeAtom);
  const [input, setInput] = useAtom(inputAtom);
  const [output, setOutput] = useAtom(outputAtom);

  useEffect(() => {
    const language: string = langObj[mode.value];
    setCode(codeTemplates[language as keyof typeof codeTemplates]);
  }, [mode]);

  const onChange = (newValue: string) => {
    switch (id) {
      case 'input':
        setInput(newValue);
        break;
      case 'output':
        setOutput(newValue);
        break;
      default:
        setCode(newValue);
    }
  };

  return (
    <AceEditor
      placeholder={placeholder}
      mode={mode ? mode.value : 'python'}
      theme="monokai"
      name={id}
      onChange={onChange}
      showPrintMargin={true}
      showGutter={true}
      fontSize={16}
      highlightActiveLine={true}
      height={`calc(${size}vh)`}
      value={id === 'input' ? input : id === 'output' ? output : code}
      editorProps={{ $blockScrolling: true }}
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      // enableSnippets={true}
      readOnly={readOnly}
    />
  );
};

export default Editor;
