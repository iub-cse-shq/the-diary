const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

module.exports = router;


//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea index page
router.get('/', (req, res)=> {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
});

//Add-Idea form
router.get('/add', (req, res)=>{
    res.render('ideas/add')
});

//Edit Idea form
router.get('/edit/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
    
});

//ADD: Process form
router.post('/', (req, res)=> {
    
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
                req.flash('success_msg', 'Added Idea')
                res.redirect('/ideas');
            })
    }

});

//Edit form process
router.put('/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        
        idea.save().then(idea => {
            req.flash('success_msg', 'Updated successfully!');
            res.redirect('/ideas');
        });
    });

});

//Delete ideas
router.delete('/:id', (req, res)=>{
    Idea.remove({_id:req.params.id}).then(()=>{
        req.flash('success_msg','Video idea removed');
        res.redirect('/ideas');
    });
});
