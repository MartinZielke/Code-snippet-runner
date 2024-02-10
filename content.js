"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const isKeyOf = (key, obj) => key in obj;
    const defaultSites = {
        'https://www.php.net': {
            languageSelectors: {
                'php': '.phpcode code',
            }
        },
        'https://learn.microsoft.com': {
            languageSelectors: {
                'csharp': 'code.lang-csharp'
            }
        },
        'https://developer.mozilla.org': {
            languageSelectors: {
                'javascript': '.js code',
                'html': '.html code',
                'css': '.css code'
            }
        },
        'https://stackoverflow.com': {
            languageSelectors: {
                'javascript': '.lang-js > code',
            }
        },
        'https://www.w3schools.com': {
            languageSelectors: {
                'php': '.w3-code:has(.phpcolor)',
            }
        },
    };
    const defaultLanguageToSites = {
        'php': {
            'https://onlinephp.io': {
                runSelector: '#sandboxform [type="submit"]'
            },
            'https://3v4l.org': {
                runSelector: '#newForm > input[type=submit]'
            },
            'https://www.w3schools.com/php/phptryit.asp?filename=tryphp_compiler': {
                runSelector: '#run-button'
            },
            'https://onecompiler.com/php': {
                runSelector: '.jss48 .MuiButton-containedSecondary > .MuiButton-label'
            },
        },
        'csharp': {
            'https://dotnetfiddle.net': {
                runSelector: '#run-button'
            },
            'https://www.onlinegdb.com/online_csharp_compiler': {
                runSelector: '#control-btn-run'
            }
        },
        'javascript': {
            'https://jsfiddle.net': {
                runSelector: '#run',
                editorSelector: ":has( >#id_code_js) [autocorrect='off'][autocapitalize='off'][spellcheck='false']"
            },
            'https://codepen.io/pen/': {
                editorSelector: "#box-js [autocorrect='off'][autocapitalize='off'][spellcheck='false']",
            },
            'https://developer.mozilla.org/en-US/play': {
                runSelector: '#run > span',
                editorSelector: "[data-language='javascript'][autocorrect='off'][autocapitalize='off'][spellcheck='false']"
            }
        },
        'html': {
            'https://jsfiddle.net': {
                runSelector: '#run',
                editorSelector: ":has( >#id_code_html) [autocorrect='off'][autocapitalize='off'][spellcheck='false']"
            },
            'https://codepen.io/pen/': {
                editorSelector: "#box-html [autocorrect='off'][autocapitalize='off'][spellcheck='false']",
            },
            'https://developer.mozilla.org/en-US/play': {
                runSelector: '#run > span',
                editorSelector: "[data-language='html'][autocorrect='off'][autocapitalize='off'][spellcheck='false']"
            }
        },
        'css': {
            'https://jsfiddle.net': {
                runSelector: '#run',
                editorSelector: ":has( >#id_code_css) [autocorrect='off'][autocapitalize='off'][spellcheck='false']"
            },
            'https://codepen.io/pen/': {
                editorSelector: "#box-css [autocorrect='off'][autocapitalize='off'][spellcheck='false']"
            },
            'https://developer.mozilla.org/en-US/play': {
                runSelector: '#run > span',
                editorSelector: "[data-language='css'][autocorrect='off'][autocapitalize='off'][spellcheck='false']"
            }
        },
    };
    const defaultSelected = {
        'php': 'https://onlinephp.io',
        'csharp': 'https://dotnetfiddle.net',
        'javascript': 'https://jsfiddle.net',
        'html': 'https://jsfiddle.net',
        'css': 'https://jsfiddle.net',
    };
    const result = yield chrome.storage.sync.get(['language', 'codesnippetSites', 'languageToSites', 'selected']);
    const language = result.language;
    const codesnippetSites = result.codesnippetSites || defaultSites;
    const languageToSites = result.languageToSites || defaultLanguageToSites;
    const selected = result.selected || defaultSelected;
    if (language) {
        window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!isKeyOf(language, selected)) {
                return;
            }
            const url = selected[language];
            //Select to
            const text = yield navigator.clipboard.readText();
            const defaultEditorSelector = "[autocorrect='off'][autocapitalize='off'][spellcheck='false']";
            const editorSelector = languageToSites[language][url].editorSelector || defaultEditorSelector;
            const to = document.querySelector(editorSelector);
            if (!to) {
                return;
            }
            to.focus();
            //Click Ctrl + A programmatically
            const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 65, ctrlKey: true });
            to.dispatchEvent(event);
            document.execCommand('delete');
            document.execCommand('insertText', false, text);
            const run = document.querySelector((_a = languageToSites[language][url].runSelector) !== null && _a !== void 0 ? _a : '');
            run === null || run === void 0 ? void 0 : run.click();
        });
    }
    chrome.storage.sync.set({ 'language': '' });
    if (!isKeyOf(location.origin, codesnippetSites)) {
        return;
    }
    const languageSelectors = Object.entries(codesnippetSites[location.origin].languageSelectors);
    languageSelectors.forEach(([language, selector]) => {
        const inputs = document.querySelectorAll(selector);
        inputs.forEach(input => {
            const button = document.createElement('button');
            button.classList.add('code-snippet-runner-ext-button');
            button.textContent = 'Run';
            button.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
                const selection = window.getSelection();
                if (!selection) {
                    return;
                }
                ;
                selection.selectAllChildren(input);
                yield navigator.clipboard.writeText(selection.toString());
                selection.removeAllRanges();
                if (!isKeyOf(language, selected)) {
                    return;
                }
                yield chrome.storage.sync.set({ 'language': language });
                window.open(selected[language]);
            }));
            input.after(button);
        });
    });
}))();
