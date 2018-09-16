chrome.storage.sync.get('isEnabled', ({ isEnabled }) => {

    if (isEnabled) {
        document.body.classList.add('nitefilter-enabled');
    }

    function addBackgroundNode() {
        const div = document.createElement('div');
        div.setAttribute('class', 'fixed-white-background');
        document.body.appendChild(div);
    }

    addBackgroundNode();
});
