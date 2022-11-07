import { ReactElement, 
  useEffect, 
  useState 
} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import gradientDark from 'react-syntax-highlighter/dist/esm/styles/hljs/gradient-dark';

const gitBlameExamples = [
  '-- Oliver Morana, 12 Minutes ago - payment gateway service schema adjustments',
  '-- Anaru Sharif , 2 days ago - removed akb-03 data lake references',
  '-- Ada Sawsan , 3 hours ago - anomaly - fixed revenue calculation',
];

export default ({ sql }: { sql: string }): ReactElement => {
  const [infoLineIndex, setInfoLineIndex] = useState<number>(-1);
  const [lines, setLines] = useState<string[]>([]);

  const replaceContent = () => {
    setInfoLineIndex(-1);
    setLines(sql.split('\n'));
  };

  useEffect(() => {
    replaceContent();
  }, []);

  useEffect(() => {
    replaceContent();
  }, [sql]);


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
      gitBlameExamples[Math.floor(Math.random() * gitBlameExamples.length)]
    );
    setLines(linesLocal);
  };

  return (
    <SyntaxHighlighter
      language="sql"
      style={gradientDark}
      showLineNumbers={true}
      wrapLines={true}
      wrapLongLines={true}
      lineProps={(lineNumber): React.HTMLProps<HTMLElement> => {
        const style: React.CSSProperties = { display: 'block', cursor: 'pointer' };
        if (lineNumber === infoLineIndex + 1) {style.backgroundColor = '#000000'};
        return { style, onClick: () => handleLineClick(lineNumber) };
      }}
    >
      {lines.join('\n')}
    </SyntaxHighlighter>
  );
};
