/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    if(req.user.isAdmin){
      return res.redirect('/admin');
    }
    var state = req.user.state;

    if(state !== "none"){
      return req.user.getPartner()
      .then(function(partner){
        return res.view('homepage',{state:state,partner:partner});
      })
    }
    return res.view('homepage',{state:state});
  },
  livecheck: function(req, res) {
    return res.send(200);
  }
};

