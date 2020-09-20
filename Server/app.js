const ytdl = require('ytdl-core');
const http = require('http');
const serverConf = require('./serverConfig');

const app = http.createServer((req, res) => {
    res.write('hello there');
    res.end();
}).listen(serverConf.port, () => {
    console.log('Server Started on ', serverConf.port);
});