const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const fs = require('fs');
const path = require('path');
const contentDisposition = require('content-disposition');

replaceSpecialChar = (str) => {
    return str.replace(/[ ]/g, "_");
}

downloadAudio = (url, res) => {
    var stream = ytdl(url, { filter: 'audioonly'});
    stream.on('info', (info) => {
        const title = contentDisposition(replaceSpecialChar(info.videoDetails.title) + '.mp3');
        res.writeHead(200, {'Content-Disposition': `attachment; filename=${title}`});

        ytdl(url, {
            format: 'mp3',
            quality: 'highest'
            }).pipe(res);
    });
}

downloadVideo = (url, res) => {
    var stream = ytdl(url);
    stream.on('info', (info) => {
        const title = contentDisposition(replaceSpecialChar(info.videoDetails.title) + '.mp4');
        res.writeHead(200, {'Content-Disposition': `attachment; filename=${title}`});

        ytdl(url, {
            format: 'mp4',
            quality: 'highest'
            }).pipe(res);
    });
}

downloadPlaylist = (id, res) => {
    ytpl(id, { limit: Infinity }).then(playlist => {
        res.writeHead(200);
        res.end('Playlist Downloading...')
        const dirName = replaceSpecialChar(playlist.title);
        const filePath = path.resolve(__dirname, 'Downloads', dirName);
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.resolve('Downloads', dirName))
        }
        playlist.items.forEach((video) => {
            title = replaceSpecialChar(video.title);
            let fstream = fs.createWriteStream(path.resolve(filePath, title + '.mp4'));
           
            ytdl(video.url, { quality: 'highest'})
                .pipe(fstream);

            fstream.on('error', function(err) {
                fs.appendFileSync(path.resolve(filePath, 'errorDownloading.txt'), title);
            });
        });

    });
}

downloadPlaylistAudio = (id, res) => {
    ytpl(id, { limit: Infinity }).then(playlist => {
        res.writeHead(200);
        res.end('Playlist Downloading...')
        const dirName = replaceSpecialChar(playlist.title);
        const filePath = path.resolve(__dirname, 'Downloads', dirName);
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.resolve('Downloads', dirName))
        }
        playlist.items.forEach((video) => {
            title = replaceSpecialChar(video.title);
            let fstream = fs.createWriteStream(path.resolve(filePath, title + '.mp3'));
           
            ytdl(video.url, {filter: 'audioonly', quality: 'highestaudio'})
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
        case 'PlaylistAudio':
            downloadPlaylistAudio(videoUrl, res);
            break;
        default:
            downloadVideo(videoUrl, res);
    }
}

module.exports =  beginDownload