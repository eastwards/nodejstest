var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(server);
var path = require('path');
var engine = require('ejs-locals');

app.engine('ejs', engine);
app.set('views', './views/pages');
app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
var body = "直接输入，打开这个页面的人都可以看到！！";

io.on('connection', function(socket){
	socket.emit('refresh', {body:body});
	console.log("user connected");
	socket.on('change', function(op){
		console.log(op);
		if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete'){
			socket.broadcast.emit('change', op);
		}
	})
	socket.on('disconnect', function(){
		console.log("user left");
	})
})


server.listen(port, function(){
	console.log('Server listening at port %d', port);
});

app.get('/', function(req, res, next){
	res.render('index', {titile:'coedit'});
})
