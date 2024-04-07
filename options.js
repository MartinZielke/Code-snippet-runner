"use strict";
const isKeyOf = (key, obj) => key in obj;
const generateCodeSnippetSiteDiv = (site, siteObject, changeable = false) => {
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
const generateLanguageSelectorDiv = (site, language, selector, changeable = false) => {
    const cssLanguageSelectors = document.createElement('div');
    cssLanguageSelectors.classList.add('language-selector');
    const selectorLanguageLabel = document.createElement('label');
    selectorLanguageLabel.textContent = language;
    selectorLanguageLabel.classList.add('selector-language');
    const codeSnippetSelectorId = `selector-${site}|${language}`;
    if (!changeable) {
        selectorLanguageLabel.htmlFor = codeSnippetSelectorId;
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
    return cssLanguageSelectors;
};
const generateCodeSnippetSitesDiv = (codesnippetSites) => {
    const codesnippetSitesHtml = document.querySelector("#codesnippet-sites");
    Object.entries(codesnippetSites).forEach(([site, siteObject]) => {
        const codeSnippetSite = generateCodeSnippetSiteDiv(site, siteObject);
        codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(codeSnippetSite);
        const hr = document.createElement('hr');
        codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(hr);
    });
    const addSite = document.createElement('button');
    addSite.classList.add('add-site');
    addSite.textContent = 'Add site';
    addSite.type = 'button';
    codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(addSite);
};
const generateLanguageSite = (site, siteObject, languageToSitesDiv, selected, language, changeable = false) => {
    var _a, _b;
    const codeSnippetSite = document.createElement('div');
    codeSnippetSite.classList.add('language-site');
    const languageSiteUrl = document.createElement('div');
    languageSiteUrl.classList.add('language-site-url');
    languageSiteUrl.textContent = site;
    languageSiteUrl.contentEditable = changeable.toString();
    codeSnippetSite.appendChild(languageSiteUrl);
    languageToSitesDiv === null || languageToSitesDiv === void 0 ? void 0 : languageToSitesDiv.appendChild(codeSnippetSite);
    const runSelectorInput = document.createElement('input');
    runSelectorInput.classList.add('run-selector');
    runSelectorInput.value = (_a = siteObject.runSelector) !== null && _a !== void 0 ? _a : '';
    runSelectorInput.name = `${language}|${site}`;
    codeSnippetSite.appendChild(runSelectorInput);
    const editorSelectorInput = document.createElement('input');
    editorSelectorInput.classList.add('editor-selector');
    editorSelectorInput.value = (_b = siteObject.editorSelector) !== null && _b !== void 0 ? _b : '';
    editorSelectorInput.name = `${language}|${site}`;
    editorSelectorInput.placeholder = 'Leave empty to use a selector that should work on most sites.';
    codeSnippetSite.appendChild(editorSelectorInput);
    const selectedRadioButton = document.createElement('input');
    selectedRadioButton.classList.add('selected-site-for-language');
    selectedRadioButton.type = 'radio';
    selectedRadioButton.name = language;
    selectedRadioButton.value = site;
    if (!isKeyOf(language, selected) && !changeable) {
        return;
    }
    selectedRadioButton.checked = selected[language] === site || changeable;
    codeSnippetSite.appendChild(selectedRadioButton);
    const removeSite = document.createElement('button');
    removeSite.classList.add('remove');
    removeSite.textContent = 'Remove';
    codeSnippetSite.appendChild(removeSite);
    return codeSnippetSite;
};
const generateLanguageToSiteDiv = (language, languageObject, selected, changeable = false) => {
    const languageToSitesDiv = document.createElement('div');
    languageToSitesDiv.classList.add('language-to-sites');
    const languageHeader = document.createElement('b');
    languageHeader.textContent = language;
    languageHeader.classList.add('language-header');
    languageHeader.contentEditable = changeable.toString();
    languageToSitesDiv.appendChild(languageHeader);
    Object.entries(languageObject).forEach(([site, siteObject]) => generateLanguageSite(site, siteObject, languageToSitesDiv, selected, language, changeable));
    const addSite = document.createElement('button');
    addSite.classList.add('add-language-site');
    addSite.textContent = 'Add site';
    addSite.type = 'button';
    addSite.addEventListener('click', (e) => {
        const languageSite = generateLanguageSite('Write site here', { runSelector: '', editorSelector: '' }, languageToSitesDiv, selected, language, true);
        //insert before it self
        if (!languageSite) {
            return;
        }
        languageToSitesDiv.insertBefore(languageSite, addSite);
    });
    languageToSitesDiv.appendChild(addSite);
    return languageToSitesDiv;
};
const generateLanguageToSitesDiv = (languageToSites, selected) => {
    const languageToSitesHtml = document.querySelector("#language-sites");
    Object.entries(languageToSites).forEach(([language, languageObject]) => {
        const languageToSitesDiv = generateLanguageToSiteDiv(language, languageObject, selected);
        languageToSitesHtml === null || languageToSitesHtml === void 0 ? void 0 : languageToSitesHtml.appendChild(languageToSitesDiv);
        const hr = document.createElement('hr');
        languageToSitesHtml === null || languageToSitesHtml === void 0 ? void 0 : languageToSitesHtml.appendChild(hr);
    });
    const addLanguage = document.createElement('button');
    addLanguage.classList.add('add-language');
    addLanguage.type = 'button';
    addLanguage.textContent = 'Add language';
    languageToSitesHtml === null || languageToSitesHtml === void 0 ? void 0 : languageToSitesHtml.appendChild(addLanguage);
};
chrome.storage.sync.get(['codesnippetSites', 'languageToSites', 'selected'], (result) => {
    var _a, _b, _c;
    const defaultCodesnippetSites = {
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
    const defaultLanguageToSites = {
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
    const defaultSelected = {
        "csharp": "https://dotnetfiddle.net",
        "css": "https://codepen.io/pen/",
        "html": "https://codepen.io/pen/",
        "javascript": "https://codepen.io/pen/",
        "kotlin": "https://play.kotlinlang.org/",
        "php": "https://onlinephp.io"
    };
    const codesnippetSites = (_a = result.codesnippetSites) !== null && _a !== void 0 ? _a : defaultCodesnippetSites;
    const languageToSites = (_b = result.languageToSites) !== null && _b !== void 0 ? _b : defaultLanguageToSites;
    const selected = (_c = result.selected) !== null && _c !== void 0 ? _c : defaultSelected;
    generateCodeSnippetSitesDiv(codesnippetSites);
    generateLanguageToSitesDiv(languageToSites, selected);
    const save = () => {
        const codesnippetSitesObj = {};
        const codeSnippetSites = document.querySelectorAll('.codesnippet-site');
        codeSnippetSites.forEach(codeSnippetSite => {
            var _a;
            const languageSelectorsHtml = codeSnippetSite.querySelectorAll('.language-selector');
            const siteHeader = (_a = codeSnippetSite.querySelector('.site-header')) === null || _a === void 0 ? void 0 : _a.textContent;
            if (!siteHeader) {
                return;
            }
            codesnippetSitesObj[siteHeader] = {
                languageSelectors: Object.fromEntries([...languageSelectorsHtml].map(languageSelector => { var _a, _b; return [(_a = languageSelector.querySelector('label')) === null || _a === void 0 ? void 0 : _a.textContent, (_b = languageSelector.querySelector('input')) === null || _b === void 0 ? void 0 : _b.value]; }))
            };
        });
        const languageToSitesObj = {};
        const selectedObj = {};
        const languageToSites = document.querySelectorAll('.language-to-sites');
        languageToSites.forEach(languageToSite => {
            var _a, _b, _c;
            const languageHeader = (_a = languageToSite.querySelector('.language-header')) === null || _a === void 0 ? void 0 : _a.textContent;
            if (!languageHeader) {
                return;
            }
            const sites = languageToSite.querySelectorAll('.language-site');
            const sitesObj = Object.fromEntries([...sites].map(site => {
                var _a, _b, _c;
                return [
                    (_a = site.querySelector('.language-site-url')) === null || _a === void 0 ? void 0 : _a.textContent,
                    {
                        runSelector: (_b = site.querySelector('.run-selector')) === null || _b === void 0 ? void 0 : _b.value,
                        editorSelector: (_c = site.querySelector('.editor-selector')) === null || _c === void 0 ? void 0 : _c.value
                    }
                ];
            }));
            languageToSitesObj[languageHeader] = sitesObj;
            selectedObj[languageHeader] = (_c = (_b = languageToSite.querySelector('.selected-site-for-language:checked')) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : '';
        });
        chrome.storage.sync.set({
            'codesnippetSites': codesnippetSitesObj,
            'languageToSites': languageToSitesObj,
            'selected': selectedObj
        });
        alert('Saved');
    };
    document.addEventListener('click', (e) => {
        var _a, _b, _c;
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        if (e.target.classList.contains('add-site')) {
            const codeSnippetSite = generateCodeSnippetSiteDiv("Site", {
                languageSelectors: {
                    "Write language here": "",
                }
            }, true);
            const codesnippetSitesHtml = document.querySelector("#codesnippet-sites");
            codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(codeSnippetSite);
            const hr = document.createElement('hr');
            codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(hr);
            codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(e.target);
        }
        if (e.target.classList.contains('add-language')) {
            const languageToSitesDiv = generateLanguageToSiteDiv("Write language here", {
                "Write site here": {
                    runSelector: "",
                    editorSelector: ""
                }
            }, selected, true);
            const languageToSitesHtml = document.querySelector("#language-sites");
            languageToSitesHtml === null || languageToSitesHtml === void 0 ? void 0 : languageToSitesHtml.appendChild(languageToSitesDiv);
            const hr = document.createElement('hr');
            languageToSitesHtml === null || languageToSitesHtml === void 0 ? void 0 : languageToSitesHtml.appendChild(hr);
            languageToSitesHtml === null || languageToSitesHtml === void 0 ? void 0 : languageToSitesHtml.appendChild(e.target);
        }
        if (e.target.classList.contains('remove')) {
            const grandparentElement = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
            (_b = e.target.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
            if ((grandparentElement === null || grandparentElement === void 0 ? void 0 : grandparentElement.querySelectorAll('.remove').length) === 0) {
                //remove empty hr
                (_c = grandparentElement.nextElementSibling) === null || _c === void 0 ? void 0 : _c.remove();
                grandparentElement.remove();
            }
        }
    });
    const options = document.querySelector('#options');
    options === null || options === void 0 ? void 0 : options.addEventListener('submit', (e) => {
        e.preventDefault();
        save();
    });
    const reset = document.querySelector('#reset');
    reset === null || reset === void 0 ? void 0 : reset.addEventListener('click', () => {
        chrome.storage.sync.remove(['codesnippetSites', 'languageToSites', 'selected']);
        alert('Reset');
    });
});
