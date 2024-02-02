// Create web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');
var mime = require('mime');

var server = http.createServer(function(req, res) {
    if (req.url === '/comments' && req.method === 'POST') {
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            comments.create(JSON.parse(body), function(err, comment) {
                if (err) return respondError(res);
                respondJSON(res, comment);
            });
        });
    } else if (req.url === '/comments' && req.method === 'GET') {
        comments.all(function(err, comments) {
            if (err) return respondError(res);
            respondJSON(res, comments);
        });
    } else {
        var filename = req.url.slice(1);
        var type = mime.lookup(filename);
        fs.readFile(filename, function(err, data) {
            if (err) return respondError(res);
            res.setHeader('Content-Type', type);
            res.end(data);
        });
    }
});

function respondError(res) {
    res.statusCode = 500;
    res.end('Server Error');
}

function respondJSON(res, data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

server.listen(3000);