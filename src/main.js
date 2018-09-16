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

const files = {
    enable: {
        inactive: `src/enable.js`,
        active: `src/enable-animate.js`,
    },
    disable: {
        inactive: `src/disable.js`,
        active: `src/disable.js`,
    },
};

function injectNitefilter(tab) {
    chrome.storage.sync.get('isEnabled', (isEnabled) => {
        const file = isEnabled ? files.enable : files.disable;

        // use inactive aka. no animation
        chrome.tabs.executeScript(tab.id, { file: file.inactive });
    });
}

function toggleEnabledState(cb) {
    chrome.storage.sync.get('isEnabled', (prev) => {
        chrome.storage.sync.set({ isEnabled: !prev.isEnabled });

        cb(!prev.isEnabled);
    });
}
function toggleNitefilter() {
    toggleEnabledState(toBeEnabled => {
        const file = toBeEnabled ? files.enable : files.disable;

        // Exectute in active tab
        chrome.tabs.executeScript({ file: file.active });

        // Execute in all inactive tabs
        chrome.tabs.query({active: false}, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs.executeScript(tab.id, { file: file.inactive });
            });
        });
    });
}

chrome.tabs.onCreated.addListener((tab) => {
    // logger(tab.id)('onCreated');
    // logger(tab.id)('tab', tab);

    injectNitefilter(tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // logger(tab.id)('onUpdated');
    // logger(tab.id)('changeInfo', changeInfo);
    // logger(tab.id)('tab', tab);

    if (
        changeInfo.status === 'lading' ||
        changeInfo.status === 'complete'
    ) {
        injectNitefilter(tab);
    }
});

chrome.browserAction.onClicked.addListener(toggleNitefilter);
