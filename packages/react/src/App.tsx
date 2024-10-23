import { useRef, useState, useEffect, type KeyboardEvent } from 'react';
import './App.css';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function App() {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
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
  function handleInputBoxSave(e: KeyboardEvent<HTMLInputElement>) {
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
    <div className="relative h-screen">
      <h1 className="text-3xl font-bold">TiddlyWiki</h1>
      <ContextMenu>
        <ContextMenuTrigger className="i-lucide-more-horizontal hidden">
          More
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Coming</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="absolute inset-x-0 bottom-2 flex flex-col gap-2 p-0">
        <Input
          ref={inputRef}
          type="text"
          placeholder="input..."
          className="focus-visible:ring-0 border-none input-bg"
          onKeyDown={handleInputBoxSave}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <Button
          onClick={submitInput}
          className="bg-green-500 inset-x-0 hover:bg-green-600">
          Save
        </Button>
      </div>
    </div>
  );
}

export default App;
