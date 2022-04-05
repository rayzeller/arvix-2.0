module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'pages/authors',
    }
  },

  fn: async function (_, exits) {
    const authors = await sails.helpers.fetchNewAuthors();
    return exits.success({authors});
  }
};



