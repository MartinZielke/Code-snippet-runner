(async () => {

    const isKeyOf = <T extends Object>(key: keyof any, obj: T): key is keyof T => key in obj;

    const defaultSites: codesnippetSitesObj = {
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

    const defaultLanguageToSites: LanguageToSites = {
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

    interface Site {
        runSelector?: string;
        editorSelector?: string;
    }

    interface Sites {
        [key: string]: Site;
    }

    interface LanguageToSites {
        [key: string]: Sites
    }

    const defaultSelected: SelectedObj = {
        'php': 'https://onlinephp.io',
        'csharp': 'https://dotnetfiddle.net',
        'javascript': 'https://jsfiddle.net',
        'html': 'https://jsfiddle.net',
        'css': 'https://jsfiddle.net',
    };

    const result = await chrome.storage.sync.get(['language', 'codesnippetSites', 'languageToSites', 'selected']);
    const language: string = result.language;

    const codesnippetSites: codesnippetSitesObj = result.codesnippetSites || defaultSites;
    const languageToSites: LanguageToSites = result.languageToSites || defaultLanguageToSites;
    const selected: SelectedObj = result.selected || defaultSelected;

    if (language) {
        window.onload = async () => {

            if (!isKeyOf(language, selected)) {
                return;
            }

            const url = selected[language];

            //Select to
            const text = await navigator.clipboard.readText();

            const defaultEditorSelector = "[autocorrect='off'][autocapitalize='off'][spellcheck='false']";
            const editorSelector = languageToSites[language][url].editorSelector || defaultEditorSelector;
            const to = document.querySelector<HTMLElement>(editorSelector);

            if (!to) {
                return;
            }

            to.focus();
            //Click Ctrl + A programmatically
            const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 65, ctrlKey: true });
            to.dispatchEvent(event);

            document.execCommand('delete');
            document.execCommand('insertText', false, text);

            const run = document.querySelector<HTMLElement>(languageToSites[language][url].runSelector ?? '');
            run?.click()

        }

    }

    await chrome.storage.sync.set({ 'language': '' });


    if (!isKeyOf(location.origin, codesnippetSites)) {
        return;
    }

    const languageSelectors = Object.entries(codesnippetSites[location.origin].languageSelectors);

    languageSelectors.forEach(([language, selector]) => {

        let inputs = document.querySelectorAll(selector);
        createButtonForEach(inputs, language, selected);

        const callback = () => {
            inputs = document.querySelectorAll(selector);
            createButtonForEach(inputs, language, selected);

        };

        const observer = new MutationObserver(callback);

        observer.observe(document.body, { childList: true, subtree: true });

    })

    function createButtonForEach(inputs: NodeListOf<Element>, language: string, selected: SelectedObj) {
        inputs.forEach(input => {

            if (input.nextElementSibling?.classList.contains('code-snippet-runner-ext-button')) {
                return;
            }

            const button = document.createElement('button');
            button.classList.add('code-snippet-runner-ext-button');
            button.textContent = 'Run';
            button.addEventListener('click', async () => {
                const selection = window.getSelection();
                if (!selection) {
                    return;
                };
                selection.selectAllChildren(input);
                await navigator.clipboard.writeText(selection.toString());
                selection.removeAllRanges();

                if (!isKeyOf(language, selected)) {
                    return;
                }

                await chrome.storage.sync.set({ 'language': language });

                window.open(selected[language]);

            });
            input.after(button);
        });
    }

})();


