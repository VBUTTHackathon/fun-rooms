/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function (req, res, next) {

    passport.authenticate('ldapauth', function (err, ldapUser, info) {
      if (err) {
        return next(err);
      }
      if (!ldapUser) {
        req.flash('error', info.message);
        return res.redirect('/login');
      }
      User.findOne({
          employeeId: ldapUser.extensionAttribute2
        }).then(function (user) {
          if (!user) {
            req.flash('error', 'You are not part of the Challenge.');
            return res.redirect('/login');
          }
          if(!user.active){
             user.username = ldapUser.sAMAccountName;
             user.firstName = ldapUser.givenName;
             user.lastName = ldapUser.sn;
             user.email = ldapUser.mail;
             user.active = true;
          }
          return user.save().then(function(){
            return user;
          });
        }).then(function (user) {
          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            req.flash('success', {
              msg: 'Success! You are logged in.'
            });
            if(user.isAdmin){
              return res.redirect(req.session.returnTo || '/admin');
            } else {
              return res.redirect(req.session.returnTo || '/');
            }
          });
        })
    })(req, res, next);
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  }
};
