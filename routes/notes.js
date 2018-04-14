const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

module.exports = router;


//Load Note Model
require('../models/Note');
const Note = mongoose.model('notes');

//Note index page
router.get('/', ensureAuthenticated,  (req, res)=> {
    Note.find({user: req.user.id})
        .sort({date:'desc'})
        .then(notes => {
            res.render('notes/index', {
                notes:notes
            });
        });
});

//Add-Note form
router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('notes/add');
});

//Edit note form
router.get('/edit/:id', ensureAuthenticated,  (req, res)=>{
    Note.findOne({
        _id: req.params.id
    }).then(note => {
        if(note.user != req.user.id){
          req.flash('error_msg', 'Not Authorized');
          res.redirect('/notes');
        } else {
          res.render('notes/edit', {
            note:note
          });
        }
    });
    
});

//ADD: Process form
router.post('/', ensureAuthenticated,  (req, res)=> {
    
    //Validation
    let errors = [];
    
    if(!req.body.title){
        errors.push({text:'Please add title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add details'});
    }
    if(errors.length>0){
        res.render('notes/add', {
           errors: errors,
           title: req.body.title,
           details: req.body.details 
        });
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Note(newUser)
            .save()
            .then(note => {
                req.flash('success_msg', 'Added entry');
                res.redirect('/notes');
            });
    }

});

//Edit form process
router.put('/:id', ensureAuthenticated,  (req, res)=>{
    Note.findOne({
        _id: req.params.id
    }).then(note => {
        //new values
        note.title = req.body.title;
        note.details = req.body.details;
        
        note.save().then(note => {
            req.flash('success_msg', 'Updated successfully!');
            res.redirect('/notes');
        });
    });

});

//Delete notes
router.delete('/:id', ensureAuthenticated,  (req, res)=>{
    Note.remove({_id:req.params.id}).then(()=>{
        req.flash('success_msg','Entry removed!');
        res.redirect('/notes');
    });
});

module.exports = router;