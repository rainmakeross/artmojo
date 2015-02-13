
/*
 * GET users listing.
 */
var transaction       = require('../models/transaction')
  , utils      = require('../helpers/utils')
  , config     = require('../../config/config')
  , fs         = require('fs')
  , errorLog   = config.webroot + '/logs/'
  , template = "transactions/"
  , email_template = "emailtpl/"
  , artistTemplate = "artists/";

//set up admin email

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Transactions. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.listall = function(req, res){
    transaction.listall(function(data){
        res.send(data);
    });
}