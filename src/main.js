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
        inactive: `{document.body.classList.add('nitefilter-enabled');}`,
        active: `{document.body.classList.add('nitefilter-transition', 'nitefilter-enabled');}`,
    },
    disable: {
        inactive: `{document.body.classList.remove('nitefilter-transition', 'nitefilter-enabled');}`,
        active: `{document.body.classList.remove('nitefilter-transition', 'nitefilter-enabled');}`,
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
        const script = toBeEnabled ? scripts.enable : scripts.disable;

        // Exectute in active tab
        chrome.tabs.executeScript({ code: script.active });

        // Execute in all inactive tabs
        chrome.tabs.query({active: false, url: ['https://*/*', 'http://*/*']}, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs.executeScript(tab.id, { code: script.inactive });
            });
        });
    });
}

chrome.browserAction.onClicked.addListener(toggleNitefilter);
