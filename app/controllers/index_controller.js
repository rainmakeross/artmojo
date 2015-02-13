
/*
 * Courses controller uses course model
 */
var course = require('../models/course');
//var template = "courses/";
exports.index = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render('index', { 
        title: 'Artmojo.co | Your one source to find Artists, Art Classes, Art Schools, Art Events and Art Jobs.',
        meta_keyword: 'Art Mojo, ArtMojo, Art Classes, Artists, Art Classes, Art Schools, Art Events and Art Jobs, Art Classes for Children, Art and Craft Classes',
        meta_description: 'Artmojo is a unique space built just for art seekers like you to find mentors, pick up a new hobby, collaborate or play in. Our goal is to turn Art mainstream... Everybody is an artist. We are here to help you find what you are looking for.',
        loggedUser: loggedUser
    });
};