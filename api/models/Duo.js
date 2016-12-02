/**
 * Duo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    picker: {
      model: 'user'
    },
    picked: {
      model: 'user'
    },
    state: {
      type: 'string',
      enum: ['oneside', 'twosides'],
      defaultsTo: 'oneside'
    },
    date: {
      type: 'date'
    }
  }
};
