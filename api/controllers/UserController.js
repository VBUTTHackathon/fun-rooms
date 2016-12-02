/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
  users: function (req, res){
    return User.find({state:"none"})
          .then(function(users){
            res.json({data:users.filter(function(user){
              return user.id != req.user.id && !user.isAdmin;
            })});
          });
  }
};
