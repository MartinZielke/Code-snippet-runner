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
    const fromSites = {
        'https://www.php.net': {
            selector: '.phpcode code',
        },
        'https://learn.microsoft.com': {
            selector: '.lang-csharp'
        },
        'https://developer.mozilla.org': {
            selector: '.code-example code'
        }
    };
    const toSites = {
        'https://onlinephp.io': {
            runSelector: '#sandboxform [type="submit"]'
        },
        'https://dotnetfiddle.net': {
            runSelector: '#run-button'
        },
        'https://3v4l.org': {
            runSelector: '#newForm > input[type=submit]'
        },
        'https://jsfiddle.net': {
            runSelector: '#run'
        },
        'https://www.w3schools.com/php/phptryit.asp?filename=tryphp_compiler': {
            runSelector: '#runbtn'
        },
        'https://onecompiler.com/php': {
            runSelector: '.jss48 .MuiButton-containedSecondary > .MuiButton-label'
        },
        'https://codepen.io/pen/': {
            runSelector: ''
        },
        'https://www.onlinegdb.com/online_csharp_compiler': {
            runSelector: '#control-btn-run'
        },
        'https://developer.mozilla.org/en-US/play': {
            runSelector: '#run > span'
        }
    };
    const fromSiteToSite = {
        'https://www.php.net': 'https://onlinephp.io',
        'https://learn.microsoft.com': 'https://dotnetfiddle.net',
        // 'https://www.php.net': 'https://3v4l.org',
        // 'https://developer.mozilla.org': 'https://jsfiddle.net',
        // 'https://www.php.net': 'https://www.w3schools.com/php/phptryit.asp?filename=tryphp_compiler'
        // 'https://www.php.net': 'https://onecompiler.com/php',
        // 'https://developer.mozilla.org': 'https://codepen.io/pen/',
        // 'https://learn.microsoft.com': 'https://www.onlinegdb.com/online_csharp_compiler',
        'https://developer.mozilla.org': 'https://developer.mozilla.org/en-US/play'
    };
    const storage = yield chrome.storage.sync.get('toSite');
    const toSite = storage.toSite || 'null';
    if (location.href.startsWith(toSite)) {
        window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!isKeyOf(toSite, toSites)) {
                return;
            }
            //Select to
            const text = yield navigator.clipboard.readText();
            const to = document.querySelector("[autocorrect='off'][autocapitalize='off'][spellcheck='false']");
            if (!to) {
                return;
            }
            to.focus();
            //Click Ctrl + A programmatically
            const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 65, ctrlKey: true });
            to.dispatchEvent(event);
            document.execCommand('delete');
            document.execCommand('insertText', false, text);
            const run = document.querySelector(toSites[toSite].runSelector);
            run === null || run === void 0 ? void 0 : run.click();
        });
    }
    yield chrome.storage.sync.set({ 'toSite': 'null' });
    if (!isKeyOf(location.origin, fromSites)) {
        return;
    }
    const inputs = document.querySelectorAll(fromSites[location.origin].selector);
    inputs.forEach(input => {
        const button = document.createElement('button');
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
            if (!isKeyOf(location.origin, fromSites)) {
                return;
            }
            //Save in storage
            yield chrome.storage.sync.set({ 'toSite': fromSiteToSite[location.origin] });
            window.open(fromSiteToSite[location.origin]);
        }));
        input.after(button);
        //INsert inside input, in start
        //                                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/></svg>
        // button.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 448 512\'%3E%3Cpath d=\'M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z\'/%3E%3C/svg%3E")';
        button.style.position = 'sticky';
        button.style.left = '95%';
        button.style.bottom = '90%';
        // input.parentElement?.insertAdjacentElement('afterbegin', button);
    });
}))();
