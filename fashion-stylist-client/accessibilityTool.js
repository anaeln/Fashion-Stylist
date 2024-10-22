let currentScheme = 1;
const contrastSchemes = ['normal', 'blackWhite', 'blackYellow'];
let isSpeaking = false;
let autoStopTimer = null;
let previousUrl = window.location.href;
let clickDist = 0;
const maxClicksDist = 5;
let currentFontIndex = 0;
const fontClasses = ['jost', 'cursive', 'serif', 'arial'];
const fontNames = ['Jost', 'Cursive', 'Serif', 'Arial'];


function showTool() {
    const toolbarButtons = document.getElementById('toolbarButtons');
    toolbarButtons.classList.toggle('show');
}


function adjustZoom(factor) {
    const currentZoom = parseFloat(getComputedStyle(document.body).getPropertyValue('zoom')) || 1;
    let newZoom = currentZoom + factor;
    // Ensure the zoom level stays between 70% and 130%
    newZoom = Math.max(0.7, Math.min(1.3, newZoom));
    document.body.style.zoom = newZoom;

    document.getElementById('zoomInButton').disabled = false;
    document.getElementById('zoomOutButton').disabled = false;
    if (factor > 0 && newZoom > 1.29)
        document.getElementById('zoomInButton').disabled = true;
    else if (factor < 0 && newZoom < 0.71)
        document.getElementById('zoomOutButton').disabled = true;
}


function changeColors() {
    const button = document.getElementById('changeColorsButton');
    contrastSchemes.forEach(scheme => document.body.classList.remove(scheme));
    document.body.classList.add(contrastSchemes[currentScheme]);
    if (contrastSchemes[currentScheme] == 'blackWhite'){
        button.textContent = "Black And White"
    } else if (contrastSchemes[currentScheme] == 'blackYellow'){
        button.textContent = "Black And Yellow"
    }
    else{
        button.textContent = "Normal"
    }
    currentScheme = (currentScheme + 1) % contrastSchemes.length;
}


function changeFontSize(factor) {
    if (window.location.href !== previousUrl) {
        clickDist = 0;
        previousUrl = window.location.href;
    }
    
    increaseFontButton = document.getElementById('increaseFontButton');
    decreaseFontButton = document.getElementById('decreaseFontButton');

    if (factor > 0 && clickDist >= maxClicksDist) {
        increaseFontButton.disabled = true;
        return;
    } else if (factor < 0 && clickDist <= -maxClicksDist) {
        decreaseFontButton.disabled = true;
        return;
    }

    if (factor > 0) {
        clickDist++;
        if (clickDist >= maxClicksDist) {
            increaseFontButton.disabled = true;
        }
    } else if (factor < 0) {
        clickDist--;
        if (clickDist <= -maxClicksDist) {
            decreaseFontButton.disabled = true;
        }
    }

    increaseFontButton.disabled = clickDist >= maxClicksDist;
    decreaseFontButton.disabled = clickDist <= -maxClicksDist;

    const elements = document.querySelectorAll('#root .MuiTypography-root, #root .MuiButton-root, #root .MuiInputBase-input, #root .MuiFormLabel-root, #root .MuiOutlinedInput-notchedOutline');

    elements.forEach(element => {
        const parentToolbar = element.closest('.MuiToolbar-root');
        const currentSize = window.getComputedStyle(element).fontSize;
        const sizeInPx = parseFloat(currentSize);
        const newSize = sizeInPx + factor;

        if (!parentToolbar)
            element.style.fontSize = `${newSize}px`;
    });
}

function resetClickDistAndButtons() {
    clickDist = 0;
    increaseFontButton.disabled = false;
    decreaseFontButton.disabled = false;
}

// Detect page navigation or reload
(function() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
        originalPushState.apply(this, arguments);
        resetClickDistAndButtons();
    };

    history.replaceState = function(state, title, url) {
        originalReplaceState.apply(this, arguments);
        resetClickDistAndButtons();
    };

    window.addEventListener('popstate', resetClickDistAndButtons);
})();


function changeFontFamily(increment) {
    const button = document.getElementById('toggleFontButton');
    currentFontIndex = (currentFontIndex + increment + fontClasses.length) % fontClasses.length;

    fontClasses.forEach(font => {
        const fontClass = `${font}-font`;
        if (document.body.classList.contains(fontClass)) {
            document.body.classList.remove(fontClass);
        }
    });

    const newFontClass = `${fontClasses[currentFontIndex]}-font`;
    document.body.classList.add(newFontClass);

    button.textContent = `${fontNames[currentFontIndex]}`;
}


function makeTextBold() {
    let button = document.getElementById('toggleBoldButton')
    if (document.body.classList.contains('boldText')) {
        document.body.classList.remove('boldText');
        button.textContent = 'Make Text Bold';
    } else {
        document.body.classList.add('boldText');
        button.textContent = 'Remove Bold';
    }
}


function toggleCursor() {
    const html = document.documentElement;
    const body = document.body;
    const button = document.getElementById('cursorSizeButton');
    
    if (html.classList.contains('largeCursor')) {
        html.classList.remove('largeCursor');
        body.classList.remove('largeCursor');
        button.textContent = 'Make Cursor Larger';
    } else {
        html.classList.add('largeCursor');
        body.classList.add('largeCursor');
        button.textContent = 'Make Cursor Smaller';
    }
}


function toggleSpeech() {
    const audio = document.getElementById('audioPlayer');
    const button = document.getElementById('readAloudButton');

    if (isSpeaking) {
        audio.pause();
        audio.currentTime = 0;

        // Clear the timer if it's running
        if (autoStopTimer) {
            clearTimeout(autoStopTimer);
            autoStopTimer = null;
        }

        button.textContent = 'Voice Instractions';
    } else {
        audio.play();

        autoStopTimer = setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            button.textContent = 'Voice Instractions';
            isSpeaking = false;
        }, 13000);

        button.textContent = 'Stop Voice';
    }

    // Toggle the playing state
    isSpeaking = !isSpeaking;
}