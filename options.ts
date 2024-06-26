type codesnippetSitesObj = {
    [key: string]: {
        languageSelectors: {
            [key: string]: string
        }
    }
}

type LanguageToSitesObj = {
    [key: string]: LanguageObject
}

type SelectedObj = {
    [key: string]: string
}

type LanguageObject = {
    [key: string]: SiteObject
}

type SiteObject = {
    runSelector?: string | undefined;
    editorSelector?: string | undefined;
}

const isKeyOf = <T extends Object>(key: keyof any, obj: T): key is keyof T => key in obj;

const generateCodeSnippetSiteDiv = (site: string, siteObject: { languageSelectors: { [key: string]: string } }, changeable = false) => {
    const codeSnippetSite = document.createElement('div');
    codeSnippetSite.classList.add('codesnippet-site');

    const siteHeader = document.createElement('b');
    siteHeader.classList.add('site-header');
    siteHeader.textContent = site;
    siteHeader.contentEditable = changeable.toString();
    codeSnippetSite.appendChild(siteHeader);

    Object.entries(siteObject.languageSelectors).forEach(([language, selector]) => {
        const cssLanguageSelectors = generateLanguageSelectorDiv(site, language, selector, changeable);
        codeSnippetSite.appendChild(cssLanguageSelectors);
    });
    const addLanguageSelector = document.createElement('button');
    addLanguageSelector.textContent = 'Add language selector';
    addLanguageSelector.type = 'button';
    addLanguageSelector.addEventListener('click', (e) => {
        const languageSelector = generateLanguageSelectorDiv(site, 'Write language here', '', true);
        //insert before it self
        codeSnippetSite.insertBefore(languageSelector, addLanguageSelector);
    });
    codeSnippetSite.appendChild(addLanguageSelector);

    return codeSnippetSite;
};

const generateLanguageSelectorDiv = (site: string, language: string, selector: string, changeable = false) => {
    const cssLanguageSelectors = document.createElement('div');
    cssLanguageSelectors.classList.add('language-selector');


    const selectorLanguageLabel = document.createElement('label');
    selectorLanguageLabel.textContent = language;
    selectorLanguageLabel.classList.add('selector-language');
    const codeSnippetSelectorId = `selector-${site}|${language}`;

    if (!changeable) {
        selectorLanguageLabel.htmlFor = codeSnippetSelectorId
    }

    selectorLanguageLabel.contentEditable = changeable.toString();

    const codeSnippetSelector = document.createElement('input');

    codeSnippetSelector.classList.add('codesnippet-selector');
    codeSnippetSelector.value = selector;
    codeSnippetSelector.name = codeSnippetSelectorId;
    codeSnippetSelector.placeholder = 'Leave empty to use code tag as selector';
    codeSnippetSelector.id = codeSnippetSelectorId;

    const removeSite = document.createElement('button');
    removeSite.classList.add('remove');
    removeSite.textContent = 'Remove';

    cssLanguageSelectors.appendChild(selectorLanguageLabel);
    cssLanguageSelectors.appendChild(codeSnippetSelector);
    cssLanguageSelectors.appendChild(removeSite);

    return cssLanguageSelectors
};

const generateCodeSnippetSitesDiv = (codesnippetSites: codesnippetSitesObj) => {
    const codesnippetSitesHtml = document.querySelector<HTMLDivElement>("#codesnippet-sites");
    Object.entries(codesnippetSites).forEach(([site, siteObject]) => {

        const codeSnippetSite = generateCodeSnippetSiteDiv(site, siteObject);

        codesnippetSitesHtml?.appendChild(codeSnippetSite);

        const hr = document.createElement('hr');
        codesnippetSitesHtml?.appendChild(hr);
    })

    const addSite = document.createElement('button');
    addSite.classList.add('add-site');
    addSite.textContent = 'Add site';
    addSite.type = 'button';
    codesnippetSitesHtml?.appendChild(addSite);
};


const generateLanguageSite = (site: string, siteObject: SiteObject, languageToSitesDiv: HTMLDivElement, selected: SelectedObj, language: string, changeable = false) => {
    const codeSnippetSite = document.createElement('div')
    codeSnippetSite.classList.add('language-site')

    const languageSiteUrl = document.createElement('div')
    languageSiteUrl.classList.add('language-site-url')
    languageSiteUrl.textContent = site
    languageSiteUrl.contentEditable = changeable.toString();


    codeSnippetSite.appendChild(languageSiteUrl)

    languageToSitesDiv?.appendChild(codeSnippetSite)

    const runSelectorInput = document.createElement('input')
    runSelectorInput.classList.add('run-selector')
    runSelectorInput.value = siteObject.runSelector ?? ''
    runSelectorInput.name = `${language}|${site}`

    codeSnippetSite.appendChild(runSelectorInput)

    const editorSelectorInput = document.createElement('input')
    editorSelectorInput.classList.add('editor-selector')
    editorSelectorInput.value = siteObject.editorSelector ?? ''
    editorSelectorInput.name = `${language}|${site}`
    editorSelectorInput.placeholder = 'Leave empty to use a selector that should work on most sites.'
    codeSnippetSite.appendChild(editorSelectorInput)

    const selectedRadioButton = document.createElement('input')
    selectedRadioButton.classList.add('selected-site-for-language')
    selectedRadioButton.type = 'radio'
    selectedRadioButton.name = language
    selectedRadioButton.value = site

    if (!isKeyOf(language, selected) && !changeable) {
        return
    }

    selectedRadioButton.checked = selected[language] === site || changeable;

    codeSnippetSite.appendChild(selectedRadioButton)

    const removeSite = document.createElement('button')
    removeSite.classList.add('remove')
    removeSite.textContent = 'Remove'
    codeSnippetSite.appendChild(removeSite)

    return codeSnippetSite;


}


const generateLanguageToSiteDiv = (language: string, languageObject: LanguageObject, selected: SelectedObj, changeable = false): HTMLDivElement => {
    const languageToSitesDiv = document.createElement('div')
    languageToSitesDiv.classList.add('language-to-sites')

    const languageHeader = document.createElement('b')
    languageHeader.textContent = language
    languageHeader.classList.add('language-header')
    languageHeader.contentEditable = changeable.toString();

    languageToSitesDiv.appendChild(languageHeader)

    Object.entries(languageObject).forEach(([site, siteObject]) => generateLanguageSite(site, siteObject, languageToSitesDiv, selected, language, changeable))

    const addSite = document.createElement('button')
    addSite.classList.add('add-language-site')
    addSite.textContent = 'Add site'
    addSite.type = 'button'

    addSite.addEventListener('click', (e) => {
        const languageSite = generateLanguageSite('Write site here', { runSelector: '', editorSelector: '' }, languageToSitesDiv, selected, language, true)
        //insert before it self
        if (!languageSite) {
            return;
        }
        languageToSitesDiv.insertBefore(languageSite, addSite)
    });

    languageToSitesDiv.appendChild(addSite)

    return languageToSitesDiv;

}

const generateLanguageToSitesDiv = (languageToSites: LanguageToSitesObj, selected: SelectedObj) => {
    const languageToSitesHtml = document.querySelector<HTMLDivElement>("#language-sites");

    Object.entries(languageToSites).forEach(([language, languageObject]) => {
        const languageToSitesDiv = generateLanguageToSiteDiv(language, languageObject, selected);
        languageToSitesHtml?.appendChild(languageToSitesDiv)
        const hr = document.createElement('hr')
        languageToSitesHtml?.appendChild(hr)
    })

    const addLanguage = document.createElement('button');
    addLanguage.classList.add('add-language');
    addLanguage.type = 'button';
    addLanguage.textContent = 'Add language';
    languageToSitesHtml?.appendChild(addLanguage);
}

chrome.storage.sync.get(['codesnippetSites', 'languageToSites', 'selected'], (result) => {

    const defaultCodesnippetSites: codesnippetSitesObj = {
        "https://chat.openai.com": {
            "languageSelectors": {
                "csharp": "code.language-csharp",
                "javascript": "code.language-javascript",
                "php": "code.language-php"
            }
        },
        "https://claude.ai": {
            "languageSelectors": {
                "javascript": "code.language-javascript"
            }
        },
        "https://developer.mozilla.org": {
            "languageSelectors": {
                "css": ".css code",
                "html": ".html code",
                "javascript": ".js code"
            }
        },
        "https://kotlinlang.org": {
            "languageSelectors": {
                "kotlin": ".language-kotlin > code"
            }
        },
        "https://learn.microsoft.com": {
            "languageSelectors": {
                "csharp": "code.lang-csharp"
            }
        },
        "https://stackoverflow.com": {
            "languageSelectors": {
                "javascript": "code.language-javascript",
                "php": "code.language-php"
            }
        },
        "https://www.php.net": {
            "languageSelectors": {
                "php": ".phpcode code"
            }
        },
        "https://www.w3schools.com": {
            "languageSelectors": {
                "javascript": ".jscolor",
                "kotlin": "code.language-kotlin",
                "php": ".language-php > code"
            }
        }
    };
    const defaultLanguageToSites: LanguageToSitesObj = {
        "csharp": {
            "https://dotnetfiddle.net": {
                "editorSelector": "",
                "runSelector": "#run-button"
            },
            "https://www.onlinegdb.com/online_csharp_compiler": {
                "editorSelector": "",
                "runSelector": "#control-btn-run"
            }
        },
        "css": {
            "https://codepen.io/pen/": {
                "editorSelector": "#box-css [autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": ""
            },
            "https://developer.mozilla.org/en-US/play": {
                "editorSelector": "[data-language='css'][autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": "#run > span"
            },
            "https://jsfiddle.net": {
                "editorSelector": ":has( >#id_code_css) [autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": "#run"
            }
        },
        "html": {
            "https://codepen.io/pen/": {
                "editorSelector": "#box-html [autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": ""
            },
            "https://developer.mozilla.org/en-US/play": {
                "editorSelector": "[data-language='html'][autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": "#run > span"
            },
            "https://jsfiddle.net": {
                "editorSelector": ":has( >#id_code_html) [autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": "#run"
            }
        },
        "javascript": {
            "https://codepen.io/pen/": {
                "editorSelector": "#box-js [autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": ""
            },
            "https://developer.mozilla.org/en-US/play": {
                "editorSelector": "[data-language='javascript'][autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": "#run > span"
            },
            "https://jsfiddle.net": {
                "editorSelector": ":has( >#id_code_js) [autocorrect='off'][autocapitalize='off'][spellcheck='false']",
                "runSelector": "#run"
            }
        },
        "kotlin": {
            "https://play.kotlinlang.org/": {
                "editorSelector": "",
                "runSelector": "[data-test='run-button']"
            },
            "https://www.w3schools.com/kotlin/trykotlin.php?filename=demo_helloworld": {
                "editorSelector": "",
                "runSelector": "#runbtn"
            }
        },
        "php": {
            "https://3v4l.org": {
                "editorSelector": "",
                "runSelector": "#newForm > input[type=submit]"
            },
            "https://onecompiler.com/php": {
                "editorSelector": "",
                "runSelector": ".jss48 .MuiButton-containedSecondary > .MuiButton-label"
            },
            "https://onlinephp.io": {
                "editorSelector": "",
                "runSelector": "#sandboxform [type=\"submit\"]"
            },
            "https://www.w3schools.com/php/phptryit.asp?filename=tryphp_compiler": {
                "editorSelector": "",
                "runSelector": "#runbtn"
            }
        }
    };
    const defaultSelected: SelectedObj = {
        "csharp": "https://dotnetfiddle.net",
        "css": "https://codepen.io/pen/",
        "html": "https://codepen.io/pen/",
        "javascript": "https://codepen.io/pen/",
        "kotlin": "https://play.kotlinlang.org/",
        "php": "https://onlinephp.io"
    };

    const codesnippetSites: codesnippetSitesObj = result.codesnippetSites ?? defaultCodesnippetSites;
    const languageToSites: LanguageToSitesObj = result.languageToSites ?? defaultLanguageToSites;
    const selected: SelectedObj = result.selected ?? defaultSelected;

    generateCodeSnippetSitesDiv(codesnippetSites);
    generateLanguageToSitesDiv(languageToSites, selected);


    const save = () => {

        const codesnippetSitesObj: codesnippetSitesObj = {};
        const codeSnippetSites = document.querySelectorAll('.codesnippet-site');
        codeSnippetSites.forEach(codeSnippetSite => {
            const languageSelectorsHtml = codeSnippetSite.querySelectorAll('.language-selector');
            const siteHeader = codeSnippetSite.querySelector('.site-header')?.textContent;

            if (!siteHeader) {
                return;
            }

            codesnippetSitesObj[siteHeader] = {
                languageSelectors: Object.fromEntries([...languageSelectorsHtml].map(languageSelector => [languageSelector.querySelector('label')?.textContent, languageSelector.querySelector('input')?.value]))

            }

        })

        const languageToSitesObj: LanguageToSitesObj = {};
        const selectedObj: SelectedObj = {};
        const languageToSites = document.querySelectorAll('.language-to-sites');
        languageToSites.forEach(languageToSite => {
            const languageHeader = languageToSite.querySelector('.language-header')?.textContent;

            if (!languageHeader) {
                return;
            }

            const sites = languageToSite.querySelectorAll('.language-site');
            const sitesObj = Object.fromEntries([...sites].map(site => [
                site.querySelector('.language-site-url')?.textContent,
                {
                    runSelector: site.querySelector<HTMLInputElement>('.run-selector')?.value,
                    editorSelector: site.querySelector<HTMLInputElement>('.editor-selector')?.value
                }
            ]));

            languageToSitesObj[languageHeader] = sitesObj;

            selectedObj[languageHeader] = languageToSite.querySelector<HTMLInputElement>('.selected-site-for-language:checked')?.value ?? '';
        });

        chrome.storage.sync.set({
            'codesnippetSites': codesnippetSitesObj,
            'languageToSites': languageToSitesObj,
            'selected': selectedObj
        })

        alert('Saved');


    }

    document.addEventListener('click', (e) => {

        if (!(e.target instanceof HTMLElement)) {
            return;
        }

        if (e.target.classList.contains('add-site')) {
            const codeSnippetSite = generateCodeSnippetSiteDiv("Site", {
                languageSelectors: {
                    "Write language here": "",
                }
            }, true);
            const codesnippetSitesHtml = document.querySelector<HTMLDivElement>("#codesnippet-sites");

            codesnippetSitesHtml?.appendChild(codeSnippetSite);
            const hr = document.createElement('hr');
            codesnippetSitesHtml?.appendChild(hr);
            codesnippetSitesHtml?.appendChild(e.target);

        }

        if (e.target.classList.contains('add-language')) {
            const languageToSitesDiv = generateLanguageToSiteDiv("Write language here", {
                "Write site here": {
                    runSelector: "",
                    editorSelector: ""
                }
            }, selected, true);
            const languageToSitesHtml = document.querySelector<HTMLDivElement>("#language-sites");
            languageToSitesHtml?.appendChild(languageToSitesDiv);
            const hr = document.createElement('hr');
            languageToSitesHtml?.appendChild(hr);
            languageToSitesHtml?.appendChild(e.target);
        }

        if (e.target.classList.contains('remove')) {
            const grandparentElement = e.target.parentElement?.parentElement;

            e.target.parentElement?.remove();
            if (grandparentElement?.querySelectorAll('.remove').length === 0) {
                //remove empty hr
                grandparentElement.nextElementSibling?.remove();
                grandparentElement.remove();


            }

        }
    });

    const options = document.querySelector<HTMLFormElement>('#options');
    options?.addEventListener('submit', (e) => {
        e.preventDefault();
        save();
    })

    const reset = document.querySelector<HTMLButtonElement>('#reset');
    reset?.addEventListener('click', () => {
        chrome.storage.sync.remove(['codesnippetSites', 'languageToSites', 'selected']);
        alert('Reset');
    })


});


