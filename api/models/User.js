/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        employeeId:{
          type: 'integer',
          unique: true,
          required: true
        },
        email:{
          type: 'string'
        },
        username:{
          type: 'string'
        },
        firstName:{
          type: 'string'
        },
        lastName:{
          type: 'string'
        },
        fullName:{
          type: 'string'
        },
        team:{
          type: 'string'
        },
        channel:{
          type: 'string'
        },
        category:{
          type: 'string'
        },
        isAdmin:{
          type: 'boolean',
          defaultsTo: false
        },
        active:{
          type: 'boolean',
          defaultsTo: false
        },
        state: {
            type: 'string',
            enum: ['none','chose','chosen','confirmed'],
            defaultsTo: 'none'
        },
        duo: {
            model: 'duo'
        },
        getFullName: function() {
            return this.fullName || ((this.firstName || "") + (this.lastName ? " " + this.lastName : ""));
        },
        toJSON: function() {
            var obj = this.toObject();
            return {id: obj.id,
                    username: obj.username,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    fullName: this.getFullName(),
                    team: obj.team,
                    button: '<input type="button" onClick="pickPartner('+obj.id+')" id="picker-'+obj.id+'" class="btn btn-info picker" value="Pick as a partner">'
            };
        },
        getPartner: function() {
          var self = this;
          if(self.duo){
            return Duo.findOne(self.duo)
              .populate('picker')
              .populate('picked')
              .then(function(duo){
                if(duo){
                  return self.id === duo.picker.id ? duo.picked : duo.picker;
                }
                return;
              });
          }
          return;
        }
    }
};
