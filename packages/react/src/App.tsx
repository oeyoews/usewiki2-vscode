import { useRef, useState, useEffect, type KeyboardEvent } from 'react';
import './App.css';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from './components/ui/textarea';

function App() {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [vscode, setVscode] = useState(null);

  useEffect(() => {
    inputRef.current?.focus();

    // @ts-expect-error
    if (typeof acquireVsCodeApi === 'function') {
      // @ts-expect-error
      setVscode(acquireVsCodeApi());
    }
  }, []);

  // support ctrl enter to save
  function handleInputBoxSave(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.ctrlKey && e.key === 'Enter') {
      submitInput();
    }
  }

  function submitInput() {
    if (!inputValue) return;
    // @ts-expect-error
    vscode.postMessage({ type: 'sendWiki', data: { text: inputValue } });
    setInputValue('');
    inputRef.current?.focus();
  }

  return (
    // vscode-dark
    <div className="relative h-screen p-3">
      <h1 className="text-3xl font-bold">TiddlyWiki5</h1>
      <ContextMenu>
        <ContextMenuTrigger className="i-lucide-more-horizontal">
          More
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Coming</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2 p-0">
        <Textarea
          ref={inputRef}
          onKeyDown={handleInputBoxSave}
          rows={5}
          placeholder="Write something... Ctrl+Enter to save"
          className="focus-visible:ring-0 border-none input-bg resize-none"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <Button
          onClick={submitInput}
          className="bg-green-500 hover:bg-green-600">
          <span className="i-lucide-more-horizontal"></span>
          Save To TiddlyWiki
        </Button>
      </div>
    </div>
  );
}

export default App;
