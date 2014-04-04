module.exports = function Route(app){
	
	var users = {};

	app.get('/', function(req, res){ //if user is trying to get to the root
		res.render('index', {}); //parameter we are passing to index.ejs file in views folder
	});

	app.io.route('session_check', function(req){
		if (users.hasOwnProperty(req.sessionID))
		{
			console.log(users);
			req.io.emit('session_result', {name: users[req.sessionID].name, color: users[req.sessionID].color});
		}
		else
		{
			req.io.emit('session_result', undefined);
		}
	});

	app.io.route('got_a_new_user', function(req){
		users[req.sessionID] = {name: req.data.name, color: req.data.color}
		req.session.name = req.data.name;
		req.session.color = req.data.color;
		app.io.broadcast('new_user', {name: req.data.name, color: req.data.color});
	});

	app.io.route('send_msg', function(req){
		app.io.broadcast('receive_msg', {name: req.data.name, color: req.data.color, message: req.data.message});
	});

	app.io.route('disconnect', function(req){
		req.io.broadcast('disconnect_user', {name: req.session.name});
		//alert everybody that a person has left the room
	});
}