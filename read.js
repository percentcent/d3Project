var http = require('http')
var fs = require("fs");

/*var data = fs.readFileSync('save.txt');

console.log(data.toString());
*/
fs.readFile('save.txt',function(err,data){
	if(err) return console.error(err);
	console.log(data.toString());
});

var event = require("events");
var eventEmitter = new events.EventEmitter();

/*fs.readFile('./tweet.html', function (err, html) {
    if (err) {
        return console.error(err);
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});*/