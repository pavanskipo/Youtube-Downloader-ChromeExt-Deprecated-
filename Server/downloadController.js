const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const fs = require('fs');
const path = require('path');

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

downloadPlaylist = (id, res) => {
    ytpl(id, { limit: Infinity }).then(playlist => {
        res.writeHead(200);
        res.end('Playlist Downloading...')
        const dirName = (playlist.title).replace(/ /g,"_");;
        const filePath = path.resolve(__dirname, 'Downloads', dirName);
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.resolve('Downloads', dirName))
        }
        playlist.items.forEach((video) => {
            title = (video.title).replace(/[ \.]/g,"_");
            let fstream = fs.createWriteStream(path.resolve(filePath, title + '.mp4'));
           
            ytdl(video.url)
                .pipe(fstream);

            fstream.on('error', function(err) {
                fs.appendFileSync(path.resolve(filePath, 'errorDownloading.txt'), title);
            });
        });

    });
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