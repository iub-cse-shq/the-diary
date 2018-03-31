const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

//How to connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {})
.then(()=>{
    console.log("mongoDB connected");
}).catch(err => {
    console.log(`ERROR CONNECTING MONGODB ${err}`);
});


//How middleware works
/*app.use((req, res, next)=>{
    //console.log(Date.now());
    req.name='Zoha';
    next();
    
});
*/
//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}) );
app.set('view engine', 'handlebars');


//Index route
app.get('/', (req, res)=>{
    const title = 'ssss';    
    res.render('index', {
        title:title,
    });
});

//ABOUT route
app.get('/about', (req, res)=> {
    res.render('about');
});

const port = 5000;

app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
    
});