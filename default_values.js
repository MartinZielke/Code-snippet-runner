const getDefaults = () => {
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
        }
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
    const selected = {
        'php': 'https://onlinephp.io',
        'csharp': 'https://dotnetfiddle.net',
        'javascript': 'https://jsfiddle.net',
        'html': 'https://jsfiddle.net',
        'css': 'https://jsfiddle.net',
    };
    return [defaultSites, defaultLanguageToSites, selected];
};
export default getDefaults;
