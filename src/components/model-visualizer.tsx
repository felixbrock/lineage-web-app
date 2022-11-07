import { ReactElement, useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const gitBlameExamples = ['-- Oliver Morana, 12 Minutes Ago - updated according to new schema of payment gateway service', '-- Anaru Sharif , 2 days ago - removed akb-03 data lake references', '-- Ada Sawsan , 3 hours ago - Distribution anomaly - fixed revenue calculation', ]

export default ({sql}: {sql: string}): ReactElement => {
  const [infoLineIndex, setInfoLineIndex] = useState<number>(-1);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    setLines(sql.split('\n'));
  }, []);

  const handleLineClick = (lineNum: number) => {
    if (lineNum < 1) throw new Error('Unhandled');
    const lineIndex = lineNum - 1;

    if (infoLineIndex === lineIndex) return;

    const linesLocal = lines;

    // 1 to display above clicked line; 2 if previous line info occurs before clicked line
    let infoLineOffset = 0;
    if (infoLineIndex !== -1) {
      linesLocal.splice(infoLineIndex, 1);
      if (infoLineIndex < lineIndex) infoLineOffset = 1;
    }

    const infoLineIndexLocal = lineIndex - infoLineOffset;
    setInfoLineIndex(infoLineIndexLocal);

    linesLocal.splice(
      infoLineIndexLocal,
      0,
      gitBlameExamples[Math.floor(Math.random()*gitBlameExamples.length)]
    );
    setLines(linesLocal);
  };

  return (
    <SyntaxHighlighter
      language="sql"
      style={dracula}
      showLineNumbers={true}
      wrapLines={true}
      wrapLongLines={true}
      lineProps={(lineNumber) => {
        const style: {
          display: string;
          cursor: string;
          backgroundColor?: string;
          [key: string]: unknown;
        } = { display: 'block', cursor: 'pointer' };
        if (lineNumber === infoLineIndex + 1) style.backgroundColor = '#6f47ef';
        return { style, onClick: () => handleLineClick(lineNumber) };
      }}
    >
      {lines.join('\n')}
    </SyntaxHighlighter>
  );
};
