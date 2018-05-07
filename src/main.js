function addBackgroundNode() {
    var div = document.createElement('div');

    div.setAttribute('class', 'fixed-white-background');
    div.setAttribute('id', 'nitefilter-background');

    document.body.appendChild(div);
}

function addStyles() {
    var style = document.createElement('style');

    style.innerHTML = `
        body {
            transition: filter 2s ease;
            filter: invert(0.90) sepia(0.6) hue-rotate(-20deg) brightness(0.7);
        }
        img {
            filter: invert(1);
        }
        .fixed-white-background {
            z-index: -1337;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: white;
        }
    `;
    style.setAttribute('id', 'nitefilter-style');

    document.head.appendChild(style);
}

function enableNitefilter() {
    addBackgroundNode();
    addStyles();
}
function disableNitefilter() {
    document.getElementById('nitefilter-background').remove();
    document.getElementById('nitefilter-style').remove();
}
function isEnabled() {
    return Boolean(
        document.getElementById('nitefilter-background') &&
        document.getElementById('nitefilter-style')
    );
}

function toggleNitefilter() {
    const shouldEnable = !isEnabled();

    if (shouldEnable) {
        enableNitefilter();
    } else {
        disableNitefilter();
    }
}

const functions = [
    addBackgroundNode,
    addStyles,
    enableNitefilter,
    disableNitefilter,
    isEnabled,
    toggleNitefilter,
];

function source(functions) {
    return functions.map(String).join('\n');
}

function onClick() {
    var script = `
        (function() {
            ${source(functions)}
            toggleNitefilter();
        })();
    `;

    // See https://developer.chrome.com/extensions/tabs#method-executeScript.
    // chrome.tabs.executeScript allows us to programmatically inject JavaScript
    // into a page. Since we omit the optional first argument "tabId", the script
    // is inserted into the active tab of the current window, which serves as the
    // default.
    chrome.tabs.executeScript({
        code: script
    });
}

chrome.browserAction.onClicked.addListener(onClick);
