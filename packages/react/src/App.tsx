import { useRef, useState, useEffect, type KeyboardEvent } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [vscode, setVscode] = useState(null);

  useEffect(() => {
    inputRef.current?.focus();
    // @ts-expect-error
    setVscode(acquireVsCodeApi());
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
    <div className="container">
      <h1>TiddlyWiki</h1>

      <div className="input-box">
        <input
          ref={inputRef}
          type="text"
          id="inputField"
          placeholder="input..."
          onKeyDown={handleInputBoxSave}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button
          onClick={submitInput}
          className="send-wiki">
          Save
        </button>
      </div>
    </div>
  );
}

export default App;
