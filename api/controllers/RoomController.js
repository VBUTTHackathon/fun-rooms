/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
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
  rooms: function (req, res) {
    return Room.find()
      .populate('mates')
      .then(function (rooms) {
        res.json({
          data: rooms.map(function (room) {
            return {
              confirmed: room.confirmed ? 'Yes' : 'No',
              roommates: room.mates.map(function(mate){
                return mate.getFullName();
              })
            }
          })
      });
    });
  }
};
