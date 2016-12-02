/**
 * DuoController
 *
 * @description :: Server-side logic for managing Duos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function getUserById(id) {
  return User.findOne(id)
    .then(function (user) {
      if (!user) {
        throw new CustomError("Could not find current user.");
      }
      return user;
    });
};

module.exports = {
  duos: function (req, res) {
    return Duo.find().populate('picker').populate('picked')
      .then(function (duos) {
        res.json({
          data: duos.map(function (duo) {
            return { confirmed: duo.confirmed ? 'Yes' : 'No',
                     partnerId1: duo.picker.employeeId,
                     partnerId2: duo.picked.employeeId,
                     partnerName1: duo.picker.getFullName(),
                     partnerName2: duo.picked.getFullName() };
          })
        });
      });
  },

  confirm: function (req, res) {
    var currUserId = req.user.id;
    return User.findOne(currUserId).populate('duo')
      .then(function (currUser) {
        currUser.state = "confirmed";
        return currUser.save()
          .then(function () {
            return Duo.findOne(currUser.duo).populate('picker');
          });
      }).then(function (duo) {
        var picker = duo.picker;
        picker.state = "confirmed";
        return picker.save()
          .then(function () {
            duo.confirmed = true;
            return duo.save();
          });
      }).then(function () {
       if (req.wantsJSON) {
        return res.json(200, {
          message: "You have confirmed your Duo partner."
        });
       }
      return res.redirect('/')
      }).catch(CustomError, function (e) {
        console.log(e);
        return res.json(404, {
          error: e.message
        });
      }).catch(function (e) {
        console.log(e);
        return res.send(500);
      });;
  },
  cancel: function (req, res) {
    var currUserId = req.user.id;
    return User.findOne(currUserId).populate('duo')
      .then(function (currUser) {
        if (!currUser.duo) {
          throw new CustomError("Could not find Duo.");
        }
        var duoId = currUser.duo.id;
        currUser.state = "none";
        currUser.duo = null;
        return currUser.save()
          .then(function () {
            return Duo.findOne(duoId).populate('picked').populate('picker');
          });
      }).then(function (duo) {
        var duoId = duo.id;
        var partner = duo.picked.id === currUserId ? duo.picker : duo.picked;
        partner.state = "none";
        partner.duo = null;
        return partner.save()
          .then(function () {
            return  Duo.destroy(duoId);
          });
      }).then(function () {
      if (req.wantsJSON) {
        return res.json(200, {
          message: "You have canceled your Duo partner."
        });
      }
      return res.redirect('/')
      }).catch(CustomError, function (e) {
        console.log(e);
        return res.json(404, {
          error: e.message
        });
      }).catch(function (e) {
        console.log(e);
        return res.send(500);
      });
  },
  pickPartner: function (req, res) {
    var partnerId = req.param('id');
    var currUserId = req.user.id;

    return getUserById(currUserId)
      .then(function (currUser) {
        if (partnerId == currUserId) {
          throw new CustomError("You can't be your own partner.");
        }

        if (currUser.state === 'chose') {
          throw new CustomError("You have already picked your partner.");
        } else if (currUser.state === 'chosen') {
          throw new CustomError("You have been selected as a partner. In order to select another partner you have to cancel first.");
        } else if (currUser.state === 'confirmed') {
          throw new CustomError("Your Duo is confirmed, you can't change it now.");
        }
        return getUserById(partnerId)
          .then(function (partner) {
            if (partner.state !== 'none') {
              throw new CustomError("Your partner is already taken.");
            }
            return partner;
          }).then(function (partner) {
            return Duo.create({
                picker: currUserId,
                picked: partnerId
              })
              .then(function (duo) {
                currUser.duo = duo.id;
                currUser.state = 'chose';
                return currUser.save()
                  .then(function () {
                    partner.duo = duo.id;
                    partner.state = 'chosen';
                    return partner.save();
                  });
              }).then(function () {
              if (req.wantsJSON) {
                return res.json(200, {
                  message: "You have selected " + partner.username + " as a partner, waiting for his/her confirmation."
                });
              }
              return res.redirect('/');
              });
          });

      }).catch(CustomError, function (e) {
        console.log(e);
        return res.json(404, {
          error: e.message
        });
      }).catch(function (e) {
        console.log(e);
        return res.send(500);
      });
  }
};
