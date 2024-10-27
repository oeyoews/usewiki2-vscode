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
import twsvg from '../../../res/tw.svg';
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
import { getLinks } from './links';
import { useTranslation } from 'react-i18next';
import { ILanguage } from './i18n';

const vscode =
  // @ts-expect-error
  typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;

const messenger = new WebviewMessenger({ vscode });
function App() {
  const { t, i18n } = useTranslation();
  const { t: t2 } = useTranslation('links');
  const cards = getLinks(t2);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [placeholder, setPlaceholder] = useState(t('placeholder'));

  function changeLanguage(lang: ILanguage) {
    i18n.changeLanguage(lang);
  }

  function openLink(link: string) {
    if (vscode) {
      messenger.send('openLink', { link });
    } else {
      window.open(link.toString(), '_blank');
    }
  }

  function updateInputValue(value: string) {
    setInputValue(value);
    localStorage.setItem('text', value);
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
    localStorage.removeItem('text');
    inputRef.current?.focus();
  }

  useEffect(() => {
    if (localStorage.getItem('text')) {
      setInputValue(localStorage.getItem('text')!);
    }
  }, []);

  useEffect(() => {
    messenger.on('playSound', () => {
      playSound();
    });

    // messenger.send('placeholder');
    // messenger.on('placeholder', ({ text }) => {
    //   if (text) {
    //     setPlaceholder(text);
    //   }
    // });

    messenger.on('edit', ({ text }) => {
      setInputValue(text);
      inputRef.current?.focus();
    });

    // language

    messenger.on('changeLanguage', ({ text }) => {
      changeLanguage(text);
      // 由于切换lang的情况过多， 暂时不支持用户自定义placeholder
      setPlaceholder(t('placeholder'));
    });
  }, []);

  function showVsCodeLanguageInputBox() {
    console.log('showVsCodeLanguageInputBox');
    messenger.send('showVsCodeLanguageInputBox');
  }

  // if (!vscode) {
  //   return (
  //     <div className="relative h-screen p-3 antialiased">
  //       <h1 className="text-xl font-bold">UseWiki2</h1>
  //       <p className="text-sm">Please use VS Code.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="relative h-screen p-3 antialiased">
      <h1 className="text-xl font-bold">
        {t('app_name')}
        <img
          src={twsvg}
          className="inline align-baseline mx-1"
          alt=""
        />
        <span
          className="i-lucide-languages size-4 cursor-pointer hover:scale-125 transition-all"
          onClick={showVsCodeLanguageInputBox}></span>
      </h1>
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
            {t('relatedLinks')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 min-[540px]:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {cards.map((card) => (
                <Card
                  className={`rounded-sm shadow-none border-none cursor-pointer ${card.class}`}
                  onClick={() => openLink(card.link)}>
                  <CardHeader className="p-3">
                    <CardTitle className="">
                      <span className="i-lucide-link text-sm mr-1 align-top"></span>
                      {card.title}
                    </CardTitle>
                    <CardDescription
                      className={`text-[12px] line-clamp-2 ${card.class
                        .split(' ')
                        .pop()}`}>
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
          rows={6}
          placeholder={placeholder}
          className="focus-visible:ring-0 border-none input-bg resize-none"
          onChange={(e) => updateInputValue(e.target.value)}
          value={inputValue}
        />
        <Button
          onClick={submitInput}
          className="bg-green-500 hover:bg-green-600">
          <span className="i-lucide-send"></span>
          {t('sendToTiddlywiki')}
        </Button>
      </div>
    </div>
  );
}

export default App;
