const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//How to connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(()=>{
    console.log("mongoDB connected");
}).catch(err => {
    console.log(`ERROR CONNECTING MONGODB ${err}`);
});


//How middleware works
// app.use((req, res, next)=>{
//     //console.log(Date.now());
//     req.name='Zoha';
//     next();   
// });

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}) );
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder (Public)
app.use(express.static(path.join(__dirname, 'public')));

// override with POST having ?_method=DELETE
// express method-override middleware
app.use(methodOverride('_method'));

//Express-session middleware
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
//  cookie: { secure: true }
}))

//Flash middleware
app.use( flash() );

//Global variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Index route
app.get('/', (req, res)=>{
    const title = 'Hello There';    
    res.render('index', {
        title:title,
    });
});

//ABOUT route
app.get('/about', (req, res)=> {
    res.render('about');
});




//specify default route for ideas
app.use('/ideas', ideas);

//specify default route for users
app.use('/users', users);

const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
    
});