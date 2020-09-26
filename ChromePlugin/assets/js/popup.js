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
        parsedResult.playlistID = match[2];
    }
    parsedResult.url = url.match(videoIDRegex);
    return parsedResult;
}

function clickDownloadButton($event) {
    const downloadType = $event.target.id;
    let videoUrlQuery = '';
    let isPlaylist = false;
    if (downloadType === 'Playlist' || downloadType === 'PlaylistAudio') {
        isPlaylist = true;
        videoUrlQuery = videoUrl.playlistID;
    } else {
        videoUrlQuery = videoUrl.url;
    }
    const downloadUrl = `${hostUrl}/youtube-downloader-extension?videoUrl=${videoUrlQuery}&downloadType=${downloadType}`;
    chrome.runtime.sendMessage({url: downloadUrl, isPlaylist: isPlaylist}, function(res){
        let downloadButton = document.querySelector(`button#${downloadType}`);
        downloadButton.innerHTML = `<span>${res}</span>`;
        downloadButton.disabled = true;
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
            buttonTypes.splice(1, 0, 'PlaylistAudio')
            buttonTypes.push('Playlist');
            document.body.style.height = 260;
        }
        buttonTypes.forEach(buttonType => containerDiv.appendChild(createButton(buttonType)));
    });
}