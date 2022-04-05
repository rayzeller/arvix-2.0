/**
 * Article.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    title: {
      type: 'string',
      required: true,
      description: 'Full representation of the article\'s title.',
      example: 'Ray Wrote a Boox'
    },

    arvixId: {
      type: 'string',
      protect: true,
      description: 'The id of the article in Arvix.',
    },

    // Used in this example to set apart Articles retrieved from our special limited query from articles retrieved from querying all articles
    category: {
      type: 'string',
      description: 'A category',
    },

    publishedAt: {
      type: 'number',
      description: 'A JS timestamp representing the publish Date.',
      example: 1502844074211
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // This isn't used right now, but I was using it at one point
    //
    authors: {
      collection: 'author',
      via: 'articles'
    }
  },

};

