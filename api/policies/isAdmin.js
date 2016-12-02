module.exports = function(req, res, next) {
  if (req.user.isAdmin) {
    return next();
  }
  else{
    return res.redirect('/');
  }
};
