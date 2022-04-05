module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'pages/new-articles',
    }
  },

  fn: async function (_, exits) {
    const articles = await sails.helpers.fetchNewArticles();
    return exits.success({articles});
  }
};


