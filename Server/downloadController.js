const ytdl = require('ytdl-core');

downloadAudio = (url, res) => {
    var stream = ytdl(url, { filter: 'audioonly'});
    stream.on('info', (info) => {
    res.writeHead(200, {'Content-Disposition': `attachment; filename=${info.videoDetails.title}.mp3`});

    ytdl(url, {
        format: 'mp3'
        }).pipe(res);
    });
}

downloadVideo = (url, res) => {
    var stream = ytdl(url);
    stream.on('info', (info) => {
    res.writeHead(200, {'Content-Disposition': `attachment; filename=${info.videoDetails.title}.mp4`});

    ytdl(url, {
        format: 'mp4'
        }).pipe(res);
    });
}

downloadPlaylist = (url, res) => {
    //TO DO
}

beginDownload = (req, res, videoUrl, downloadType) => {
    switch (downloadType) {
        case 'Video':
            downloadVideo(videoUrl, res);
            break;
        case 'Audio':
            downloadAudio(videoUrl, res);
            break;
        case 'Playlist':
            downloadPlaylist(videoUrl, res);
            break;
        default:
            downloadVideo(videoUrl, res);
    }
}

module.exports =  beginDownload