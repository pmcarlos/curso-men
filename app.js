const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

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

//Idea index Page
app.get('/ideas', (req, res) => {
	Idea.find({})
	    .sort({date:-1})
		.then(ideas => {
			res.render('ideas/index', {
				ideas
			});
		});
});

//Add Ideas form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

// Process form
app.post('/ideas', (req, res) => {
	let errors = [];
	if(!req.body.title) {
		errors.push({text: 'Please add a title'});
	} 
	if(!req.body.details) {
		errors.push({text: 'Please add some details'});
	} 

	if(errors.length > 0) {
		res.render('ideas/add', {
			errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details,
		}
		new Idea(newUser)
			.save()
			.then(idea => {
				res.redirect('/ideas');
			});
	}
});

//Ideas edit form
app.get('/ideas/edit/:id', (req, res) => {
	let id = req.params.id;
	Idea.findOne({
		_id: id
	})
	.then(idea => {
		res.render('ideas/edit', {
			idea
		});
	});
	
});

//Rdit form process
app.put('/ideas/:id', (req, res) => {
	let id = req.params.id;
	Idea.findOne({
		_id: id
	})
	.then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea => {
				res.redirect('/ideas');
			});
	});
});

//Delete Idea
app.delete('/ideas/:id', (req, res) => {
	let id = req.params.id;
	Idea.remove({_id: id})
		.then(() => {
			res.redirect('/ideas');
		});
});


