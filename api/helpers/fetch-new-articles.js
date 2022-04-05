
module.exports = {
  friendlyName: 'Fetch new articles from arVix',
  description: 'Fetch new articles from arVix.',

  fn: async function () {
    const https = require('https');
    const parseString = require('xml2js').parseString;
    let url = 'https://export.arxiv.org/api/query?search_query=all:psychiatry+OR+all:therapy+OR+all:machine+learning+OR+all:data+science&sortBy=submittedDate&sortOrder=descending&max_results=100';
    // https://dev.to/isalevine/three-ways-to-retrieve-json-from-the-web-using-node-js-3c88
    // https://www.npmjs.com/package/xml2js

    const createArticle = async (entry) => {
      await Article.findOrCreate({arvixId: entry.id[0]}, {arvixId: entry.id[0], category: 'Relevant', title: entry.title[0], publishedAt: Date.parse(entry.published[0])});
    };

    const saveResult = async (body) => {
      parseString(body, async (_, result) => {
        result.feed.entry.forEach((entry) => {
          createArticle(entry);
        });
      });
    };


    https.get(url,(res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          saveResult(body);
        } catch (error) {
          console.error(error.message);
        }
      });

    }).on('error', (error) => {
      console.error(error.message);
    });

    // Right now, I'm "remembering" which articles were queried via the more specific data science/ machine learning / etc query
    // In a future implementation, I might (1) figure out how to set a better sounding category or
    // (2) Only bother to save the relevant articles in the database, removing the need for this extra query

    // Update: I am no longer saving unneeded articles in the database, but I kept the comments in
    const articles = await Article.find().where({category: 'Relevant'});
    return articles;
  }

};
