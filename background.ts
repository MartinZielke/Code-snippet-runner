chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) { // listener for tab opens
    if (changeInfo.status == 'loading') { // when the page is loading (you can do info.status === 'complete' but you will see the page for a second or two)

        console.log(tab.url);
    }
})