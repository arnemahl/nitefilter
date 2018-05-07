function runTheScript() {
    var script = `
        (function() {
            function addBackgroundNode() {
                var d = document.createElement('div');

                d.setAttribute('class', 'fixed-white-background');

                document.body.appendChild(d);
            }

            function addStyles() {
                var style = document.createElement('style');

                style.innerHTML = \`
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
                \`;

                document.head.appendChild(style);
            }

            addBackgroundNode();
            addStyles();
        })()
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

chrome.browserAction.onClicked.addListener(() => {
    runTheScript();
});
