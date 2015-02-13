var User = require('User');
exports.list = function(req, res){
    User.findAll().success(function(users) {
        res.send(users);
      })
};
