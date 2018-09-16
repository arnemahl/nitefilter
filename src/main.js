const logger = tabId => (...args) => {
    chrome.tabs.executeScript(tabId, {
        code: `console.log(${args.map(JSON.stringify).join(', ')})`
    });
}
function log(...args) {
    chrome.tabs.executeScript({
        code: `console.log(${args.map(JSON.stringify).join(', ')})`
    });
}

const scripts = {
    enable: {
        instant: `{document.body.classList.add('nitefilter-enabled');}`,
        smooth: `{document.body.classList.add('nitefilter-transition', 'nitefilter-enabled');}`,
    },
    disable: {
        instant: `{document.body.classList.remove('nitefilter-transition', 'nitefilter-enabled');}`,
        smooth: `{document.body.classList.remove('nitefilter-transition', 'nitefilter-enabled');}`,
        // PS: No support for smooth disabling (...yet?)
    },
};

function toggleEnabledState(cb) {
    chrome.storage.sync.get('isEnabled', (prev) => {
        chrome.storage.sync.set({ isEnabled: !prev.isEnabled });

        cb(!prev.isEnabled);
    });
}
function toggleNitefilter() {
    toggleEnabledState(toBeEnabled => {
        const setMode = toBeEnabled ? scripts.enable : scripts.disable;

        // Exectute in active tabs
        chrome.tabs.query({active: true, url: ['https://*/*', 'http://*/*']}, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs.executeScript(tab.id, { code: setMode.smooth });
            });
        });

        // Execute in all inactive tabs
        chrome.tabs.query({active: false, url: ['https://*/*', 'http://*/*']}, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs.executeScript(tab.id, { code: setMode.instant });
            });
        });
    });
}

chrome.browserAction.onClicked.addListener(toggleNitefilter);
