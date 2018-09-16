{
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
                filter: invert(0.90) sepia(0.6) hue-rotate(-20deg) brightness(0.7);
            }
            img,
            video {
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

    enableNitefilter();
}
