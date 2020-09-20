const port = 3000; //Should be changed in serverConfig file as well
const hostUrl = "http://127.0.0.1:" + port;
var videoUrl = {}

function parseUrl(url) {
    const playListRegex = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
    const videoIDRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
    let parsedResult = {
        isPlaylist: false,
        url: ''
    }
    const match = url.match(playListRegex);
    if (match && match[2]){
        parsedResult.isPlaylist = true;
        parsedResult.url = match[2];
        return parsedResult;
    }
    parsedResult.videoUrl = url.match(videoIDRegex);
    return parsedResult;
}

function clickDownloadButton($event) {
    const downloadType = $event.target.id;
    chrome.tabs.query({'active' : true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        const url = tabs[0].url;
        const downloadUrl = `${hostUrl}/download_chrome_ex?videoUrl=${videoUrl.url}&downloadType=${downloadType}`;
        chrome.tabs.create({url: downloadUrl});
    });
}

function createButton(buttonType) {
    let buttonDiv = document.createElement('DIV');
    buttonDiv.classList.add('download-btn');
    buttonDiv.classList.add(buttonType);
    let button = document.createElement('BUTTON');
    button.onclick = clickDownloadButton;
    button.id = buttonType;
    button.innerHTML = '<span>Download </span>' + buttonType;
    buttonDiv.appendChild(button);
    return buttonDiv;
}

window.onload = () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        const url = tabs[0].url;
        videoUrl = parseUrl(url);
        let containerDiv = document.getElementById("download-btn-container");
        let buttonTypes = ['Audio', 'Video'];
        if (videoUrl.isPlaylist) {
            buttonTypes.push('Playlist');
            document.body.style.height = 200;
        }
        buttonTypes.forEach(buttonType => containerDiv.appendChild(createButton(buttonType)));
    });
}