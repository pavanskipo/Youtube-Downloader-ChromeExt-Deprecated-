const http = require('http');
const url = require('url');
const serverConf = require('./serverConfig');
const downloadControl = require('./downloadController');

respondWithError = (req, res) => {
    res.writeHead(404);
    res.end('Invalid Request');
}

const app = http.createServer((req, res) => {
    const currentUrl = req.url;
    const pathname = url.parse(currentUrl, true).pathname;
    const queryData = url.parse(currentUrl, true).query;
    const videoUrl = queryData.videoUrl; 
    const downloadType = queryData.downloadType;

    if (pathname === '/youtube-downloader-extension') {
        if(videoUrl !== 'null' && videoUrl !== '' ) {
            downloadControl(req, res, videoUrl, downloadType);
        } else {
            respondWithError(req, res);
        }    
    } else {
        respondWithError(req, res);
    }
}).listen(serverConf.port, () => {
    console.log('Server Started on ', serverConf.port);
});