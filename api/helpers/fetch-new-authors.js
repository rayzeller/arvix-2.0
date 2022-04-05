
module.exports = {
  friendlyName: 'Fetch new authors from arVix',
  description: 'Fetch new authors from arVix.',

  fn: async function () {
    const https = require('https');
    const parseString = require('xml2js').parseString;

    // Couldn't figure out a way to include all results, so right now my search query searches for the letter a. This can be changed easily
    let url = 'https://export.arxiv.org/api/query?search_query=all:a&sortBy=submittedDate&sortOrder=descending&max_results=1000';
    // https://dev.to/isalevine/three-ways-to-retrieve-json-from-the-web-using-node-js-3c88
    // https://www.npmjs.com/package/xml2js

    const createAuthor = async (name, article) => {
      Author.findOrCreate({fullName: name}, {fullName: name})
        .exec(async(err, author) => {
          if (err) { console.log('race condition for', name); return;}
          await Article.addToCollection(article.id, 'authors', author.id);
        });

    };

    const createArticle = async (entry) => {
      //no caetgory on purpose
      const article = await Article.findOrCreate({arvixId: entry.id[0]}, {arvixId: entry.id[0], title: entry.title[0], publishedAt: Date.parse(entry.published[0])});
      if(!entry.author) {
        return;
      }
      entry.author.forEach(author => {
        createAuthor(author.name['0'], article);
      });
    };

    const saveResult = async (body) => {
      parseString(body, async (_, result) => {
        if(!result.feed.entry) {
          return;
        }
        result.feed.entry.forEach((entry) => {
          createArticle(entry);
        });
      });
    };

    const authors = await Author.find().populate('articles');
    if(authors.length === 0) {
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
    }

    return authors.sort((a, b) => b.articles.length - a.articles.length);
  }

};

