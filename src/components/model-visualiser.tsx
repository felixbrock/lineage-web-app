import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ModelVisualiser({
  sql 
}: { 
  sql: string 
}) {

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

  return (
    <SyntaxHighlighter
      language="sql"
      style={dracula}
      showLineNumbers={true}
      wrapLines={true}
      lineProps={(lineNumber): React.HTMLProps<HTMLElement> => {
        const style: React.CSSProperties = {
          display: 'block',
          cursor: 'pointer',
        };
        if (lineNumber === infoLineIndex + 1) {
          style.backgroundColor = '#000000';
        }
        return { style };
      }}
    >
      {lines.join('\n')}
    </SyntaxHighlighter>
  );
};