"use strict";
chrome.storage.sync.get(['codesnippetSites', 'languageToSites', 'selected'], (result) => {
    const codesnippetSites = result.codesnippetSites;
    const languageToSites = result.languageToSites;
    const selected = result.selected;
    const isKeyOf = (key, obj) => key in obj;
    const codesnippetSitesHtml = document.querySelector("#codesnippet-sites");
    Object.entries(codesnippetSites).forEach(([site, siteObject]) => {
        const codeSnippetSite = document.createElement('div');
        codeSnippetSite.classList.add('codesnippet-site');
        const siteHeader = document.createElement('b');
        siteHeader.classList.add('site-header');
        siteHeader.textContent = site;
        codeSnippetSite.appendChild(siteHeader);
        codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(codeSnippetSite);
        Object.entries(siteObject.languageSelectors).forEach(([language, selector]) => {
            const cssLanguageSelectors = document.createElement('div');
            cssLanguageSelectors.classList.add('language-selector');
            const selectorLanguageLabel = document.createElement('label');
            selectorLanguageLabel.textContent = language;
            selectorLanguageLabel.classList.add('selector-language');
            const codeSnippetSelectorId = `selector-${site}|${language}`;
            selectorLanguageLabel.htmlFor = codeSnippetSelectorId;
            const codeSnippetSelector = document.createElement('input');
            codeSnippetSelector.classList.add('codesnippet-selector');
            codeSnippetSelector.value = selector;
            codeSnippetSelector.name = codeSnippetSelectorId;
            codeSnippetSelector.placeholder = 'Leave empty to use code tag as selector';
            codeSnippetSelector.id = codeSnippetSelectorId;
            const removeSite = document.createElement('button');
            removeSite.textContent = 'Remove';
            cssLanguageSelectors.appendChild(selectorLanguageLabel);
            cssLanguageSelectors.appendChild(codeSnippetSelector);
            cssLanguageSelectors.appendChild(removeSite);
            codeSnippetSite.appendChild(cssLanguageSelectors);
        });
        const addLanguageSelector = document.createElement('button');
        addLanguageSelector.textContent = 'Add language selector';
        codeSnippetSite.appendChild(addLanguageSelector);
        const hr = document.createElement('hr');
        codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(hr);
    });
    const addSite = document.createElement('button');
    addSite.textContent = 'Add site';
    codesnippetSitesHtml === null || codesnippetSitesHtml === void 0 ? void 0 : codesnippetSitesHtml.appendChild(addSite);
    const languageToSitesHtml = document.querySelector("#language-sites");
    Object.entries(languageToSites).forEach(([language, languageObject]) => {
        const languageToSitesDiv = document.createElement('div');
        languageToSitesDiv.classList.add('language-to-sites');
        const languageHeader = document.createElement('b');
        languageHeader.textContent = language;
        languageHeader.classList.add('language-header');
        languageToSitesDiv.appendChild(languageHeader);
        languageToSitesHtml === null || languageToSitesHtml === void 0 ? void 0 : languageToSitesHtml.appendChild(languageToSitesDiv);
        Object.entries(languageObject).forEach(([site, siteObject]) => {
            var _a, _b;
            const codeSnippetSite = document.createElement('div');
            codeSnippetSite.classList.add('language-site');
            const languageSiteUrl = document.createElement('div');
            languageSiteUrl.classList.add('language-site-url');
            languageSiteUrl.textContent = site;
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
            if (!isKeyOf(language, selected)) {
                return;
            }
            if (selected[language] === site) {
                selectedRadioButton.checked = true;
            }
            codeSnippetSite.appendChild(selectedRadioButton);
            const removeSite = document.createElement('button');
            removeSite.textContent = 'Remove';
            codeSnippetSite.appendChild(removeSite);
        });
        const hr = document.createElement('hr');
        languageToSitesDiv === null || languageToSitesDiv === void 0 ? void 0 : languageToSitesDiv.appendChild(hr);
    });
    const addLanguage = document.createElement('button');
    addLanguage.textContent = 'Add language';
    languageToSitesHtml === null || languageToSitesHtml === void 0 ? void 0 : languageToSitesHtml.appendChild(addLanguage);
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
    };
    const options = document.querySelector('#options');
    options === null || options === void 0 ? void 0 : options.addEventListener('submit', (e) => {
        e.preventDefault();
        save();
    });
});
