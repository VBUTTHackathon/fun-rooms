/**
 * Room.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    capactity:{
      type:'integer',
      required: true
    },
     mates: {
      collection: 'user',
       via: 'room'
    },
    confirmed: {
      type: 'boolean',
      defaultsTo: 'false'
    }
  }
};

