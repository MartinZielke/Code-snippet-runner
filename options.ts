
chrome.storage.sync.get(['codesnippetSites', 'languageToSites', 'selected'], (result) => {
    const codesnippetSites = result.codesnippetSites;
    const languageToSites = result.languageToSites;
    const selected = result.selected;


    const isKeyOf = <T extends Object>(key: keyof any, obj: T): key is keyof T => key in obj;

    const codesnippetSitesHtml = document.querySelector<HTMLDivElement>("#codesnippet-sites");
    Object.entries(codesnippetSites).forEach(([site, siteObject]) => {
        const codeSnippetSite = document.createElement('div');
        codeSnippetSite.classList.add('codesnippet-site');

        const siteHeader = document.createElement('b');
        siteHeader.classList.add('site-header');

        siteHeader.textContent = site;
        codeSnippetSite.appendChild(siteHeader);



        codesnippetSitesHtml?.appendChild(codeSnippetSite);
        Object.entries(siteObject.languageSelectors).forEach(([language, selector]) => {
            const cssLanguageSelectors = document.createElement('div');
            cssLanguageSelectors.classList.add('language-selector');


            const selectorLanguageLabel = document.createElement('label');
            selectorLanguageLabel.textContent = language;
            selectorLanguageLabel.classList.add('selector-language');
            const codeSnippetSelectorId = `selector-${site}|${language}`;
            selectorLanguageLabel.htmlFor = codeSnippetSelectorId

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
        codesnippetSitesHtml?.appendChild(hr);
    })

    const addSite = document.createElement('button');
    addSite.textContent = 'Add site';
    codesnippetSitesHtml?.appendChild(addSite);

    const languageToSitesHtml = document.querySelector<HTMLDivElement>("#language-sites");
    Object.entries(languageToSites).forEach(([language, languageObject]) => {
        const languageToSitesDiv = document.createElement('div');
        languageToSitesDiv.classList.add('language-to-sites');

        const languageHeader = document.createElement('b');
        languageHeader.textContent = language;
        languageHeader.classList.add('language-header');

        languageToSitesDiv.appendChild(languageHeader);
        languageToSitesHtml?.appendChild(languageToSitesDiv);

        Object.entries(languageObject).forEach(([site, siteObject]) => {
            const codeSnippetSite = document.createElement('div');
            codeSnippetSite.classList.add('language-site');

            const languageSiteUrl = document.createElement('div');
            languageSiteUrl.classList.add('language-site-url');
            languageSiteUrl.textContent = site;

            codeSnippetSite.appendChild(languageSiteUrl);

            languageToSitesDiv?.appendChild(codeSnippetSite);

            const runSelectorInput = document.createElement('input');
            runSelectorInput.classList.add('run-selector');
            runSelectorInput.value = siteObject.runSelector ?? '';
            runSelectorInput.name = `${language}|${site}`;

            codeSnippetSite.appendChild(runSelectorInput);

            const editorSelectorInput = document.createElement('input');
            editorSelectorInput.classList.add('editor-selector');
            editorSelectorInput.value = siteObject.editorSelector ?? '';
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
        languageToSitesDiv?.appendChild(hr);



    })

    const addLanguage = document.createElement('button');
    addLanguage.textContent = 'Add language';
    languageToSitesHtml?.appendChild(addLanguage);


    type codesnippetSitesObj = {
        [key: string]: {
            languageSelectors: {
                [key: string]: string
            }
        }
    }

    type LanguageToSitesObj = {
        [key: string]: {
            [key: string]: {
                runSelector?: string;
                editorSelector?: string;
            }
        }
    }

    type SelectedObj = {
        [key: string]: string
    }

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


    }

    const options = document.querySelector<HTMLFormElement>('#options');
    options?.addEventListener('submit', (e) => {
        e.preventDefault();
        save();
    })
});


