import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import './App.css';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from './components/ui/textarea';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { sound } from './sound';
import { WebviewMessenger } from './utils/WebViewMessenger';

// @ts-expect-error
const vscode = acquireVsCodeApi();
const messenger = new WebviewMessenger({ vscode });
function App() {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [placeholder, setPlaceholder] = useState('');

  const cards = [
    {
      title: '太微官网',
      description: 'a non-linear personal web notebook',
      link: 'https://tiddlywiki.com',
      class: 'bg-green-300/15',
    },
    {
      title: '太微 GitHub',
      description: 'The TiddlyWiki5 source code',
      link: 'https://github.com/TiddlyWiki/TiddlyWiki5',
      class: 'bg-rose-300/15',
    },
    {
      title: '太微官方论坛',
      description: 'The official TiddlyWiki5 forum',
      link: 'https://talk.tiddlywiki.org',
      class: 'bg-yellow-300/15',
    },
    {
      title: '中文太微文档',
      description: 'The TiddlyWiki5 Chinese documentation',
      link: 'https://bramchen.github.io/tw5-docs/zh-Hans',
      class: 'bg-purple-300/15',
    },
    {
      title: '中文太微教程',
      description: 'The TiddlyWiki5 Chinese tutorial',
      link: 'https://tw-cn.netlify.app',
      class: 'bg-orange-300/15',
    },
  ];

  // function test() {
  //   messenger.send('ping', { text: 'Ping from Webview!' });
  //   messenger.on('pong', (data) => {
  //     console.log(data);
  //   });
  // }

  function openLink(link: string) {
    if (vscode) {
      messenger.send('openLink', { link });
    } else {
      window.open(link.toString(), '_blank');
    }
  }

  function playSound() {
    const currentAudio = new Audio('data:audio/mp3;base64,' + sound);
    currentAudio.volume = 0.9;
    currentAudio.play();
  }

  // support ctrl enter to save
  function handleInputBoxSave(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.ctrlKey && e.key === 'Enter') {
      submitInput();
    }
  }

  function submitInput() {
    if (!inputValue) return;
    messenger.send('sendWiki', { text: inputValue });
    setInputValue('');
    inputRef.current?.focus();
  }

  useEffect(() => {
    messenger.on('playSound', () => {
      playSound();
    });
    messenger.send('placeholder');
    messenger.on('placeholder', ({ text }) => setPlaceholder(text));
  }, []);

  return (
    // vscode-dark
    <div className="relative h-screen p-3 antialiased">
      <h1 className="text-3xl font-bold">TiddlyWiki5</h1>
      <ContextMenu>
        <ContextMenuTrigger className="i-lucide-more-horizontal hidden"></ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Coming</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* https://talks.antfu.me/2024/vue-fes-japan/15?clicks=6 */}
      <Accordion
        type="single"
        collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline">
            Realted Links
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {cards.map((card) => (
                <Card
                  className={`rounded-sm shadow-none border-none cursor-pointer ${card.class}`}
                  onClick={() => openLink(card.link)}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-blue-400">
                      <span className="i-lucide-link text-sm mr-1 align-top"></span>
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2 p-0">
        <Textarea
          ref={inputRef}
          autoFocus
          onKeyDown={handleInputBoxSave}
          rows={5}
          placeholder={placeholder}
          className="focus-visible:ring-0 border-none input-bg resize-none"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <Button
          onClick={submitInput}
          className="bg-green-500 hover:bg-green-600">
          <span className="i-lucide-send"></span>
          Save To TiddlyWiki
        </Button>
      </div>
    </div>
  );
}

export default App;
