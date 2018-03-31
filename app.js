const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

//How to connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(()=>{
    console.log("mongoDB connected");
}).catch(err => {
    console.log(`ERROR CONNECTING MONGODB ${err}`);
});

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');


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

// override with POST having ?_method=DELETE
// express method-override middleware
app.use(methodOverride('_method'));



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


//Idea index page
app.get('/ideas', (req, res)=> {
    Idea.find({})
        .sort({date:'asc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
});

//Add Idea form
app.get('/ideas/add', (req, res)=>{
    res.render('ideas/add')
});

//Edit Idea form
app.get('/ideas/edit/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
    
});

//Process form
app.post('/ideas', (req, res)=> {
    
    //Validation
    let errors = [];
    
    if(!req.body.title){
        errors.push({text:'Please add title'})
    }
    if(!req.body.details){
        errors.push({text:'Please add details'})
    }
    if(errors.length>0){
        res.render('ideas/add', {
           errors: errors,
           title: req.body.title,
           details: req.body.details 
        })
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }

});

//Edit form process
app.put('/ideas/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        
        idea.save().then(idea => {
            res.redirect('/ideas');
        });
    });

});

//Delete ideas
app.delete('/ideas/:id', (req, res)=>{
    Idea.remove({_id:req.params.id}).then(()=>{
        res.redirect('/ideas');
    });
});

const port = 5000;

app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
    
});