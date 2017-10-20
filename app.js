const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

//connect mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot-dev', {
	useMongoClient: true
})
.then(() => {
	console.log('Se conecto a mongo');
	app.listen(port, () => {
		console.log(`Server running on port: ${port}!`);
	});
})
.catch(err => console.log(err));

//Load idea model
require('./models/idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//index route
app.get('/', (req, res) => {
	const title = 'Welcome!!';
	res.render('index', {
		title
	});
});

//about route
app.get('/about', (req, res) => {
	res.render('about');
});

//Ideas form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});



