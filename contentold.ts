(async () => {

    const isKeyOf = <T extends Object>(key: keyof any, obj: T): key is keyof T => key in obj;

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
            runSelector : ''
        },
        'https://www.onlinegdb.com/online_csharp_compiler': {
            runSelector: '#control-btn-run'
        },
        'https://developer.mozilla.org/en-US/play': {
            runSelector: '#run > span'
        }
     };

    type FromSiteToSite = {
        [index in keyof typeof fromSites]: keyof typeof toSites;
    };

    const fromSiteToSite: FromSiteToSite = {
        'https://www.php.net': 'https://onlinephp.io',
        'https://learn.microsoft.com': 'https://dotnetfiddle.net',   
        // 'https://www.php.net': 'https://3v4l.org',
        // 'https://developer.mozilla.org': 'https://jsfiddle.net',
        // 'https://www.php.net': 'https://www.w3schools.com/php/phptryit.asp?filename=tryphp_compiler'
        // 'https://www.php.net': 'https://onecompiler.com/php',
        // 'https://developer.mozilla.org': 'https://codepen.io/pen/',
        // 'https://learn.microsoft.com': 'https://www.onlinegdb.com/online_csharp_compiler',
        'https://developer.mozilla.org': 'https://developer.mozilla.org/en-US/play'
    }

    const storage = await chrome.storage.sync.get('toSite');
    const toSite = storage.toSite || 'null';

    if (location.href.startsWith(toSite)) {
        window.onload = async () => {
            if (!isKeyOf(toSite, toSites)) {
                return;
            }
    
            //Select to
            const text = await navigator.clipboard.readText();
            const to = document.querySelector<HTMLElement>("[autocorrect='off'][autocapitalize='off'][spellcheck='false']");
    
            if (!to) {
                return;
            }
    
            to.focus();
            //Click Ctrl + A programmatically
            const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 65, ctrlKey: true });
            to.dispatchEvent(event);
    
            document.execCommand('delete');
            document.execCommand('insertText', false, text);
    
            const run = document.querySelector<HTMLElement>(toSites[toSite].runSelector);
            run?.click()

        }

    }

    await chrome.storage.sync.set({ 'toSite': 'null' });


    if (!isKeyOf(location.origin, fromSites)) {
        return;
    }

    const inputs = document.querySelectorAll(fromSites[location.origin].selector);
    inputs.forEach(input => {
        const button = document.createElement('button');
        button.textContent = 'Run';
        button.addEventListener('click', async () => {
            const selection = window.getSelection();
            if (!selection) {
                return;
            };
            selection.selectAllChildren(input);
            await navigator.clipboard.writeText(selection.toString());
            selection.removeAllRanges();

            if (!isKeyOf(location.origin, fromSites)) {
                return;
            }
            //Save in storage
            await chrome.storage.sync.set({ 'toSite': fromSiteToSite[location.origin] });

            window.open(fromSiteToSite[location.origin]);

        })
        input.after(button);
        //INsert inside input, in start

        //                                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/></svg>
        // button.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 448 512\'%3E%3Cpath d=\'M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z\'/%3E%3C/svg%3E")';
        button.style.position = 'sticky';
        button.style.left = '95%';
        button.style.bottom = '90%';
        // input.parentElement?.insertAdjacentElement('afterbegin', button);
    });
})();