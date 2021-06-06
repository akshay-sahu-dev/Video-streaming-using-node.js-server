const express = require('express');
const app = express();
const fs = require("fs");

const PORT = process.env.PORT || 5555;

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', function (req,res){
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Requires Range header!");
    }

    const videoPath = "trailer1.mp4";
    const videoSize = fs.statSync("trailer1.mp4").size;
    console.log("Videosize:", videoSize);

    //Parse Range.
    //Example: "bytes=33322-"
    const CHUNK_SIZE = 10 ** 6; //1mb
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(res)



});

app.listen(PORT, ()=> {
    console.log(`Listening to http://localhost:${PORT}`);
})