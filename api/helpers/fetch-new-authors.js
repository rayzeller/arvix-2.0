
module.exports = {
  friendlyName: 'Fetch new authors from arVix',
  description: 'Fetch new authors from arVix.',

  fn: async function () {
    const https = require('https');
    const parseString = require('xml2js').parseString;

    // Couldn't figure out a way to include all results, so right now my search query searches for the letter a. This can be changed easily
    let url = 'https://export.arxiv.org/api/query?search_query=all:a&sortBy=submittedDate&sortOrder=descending&max_results=500';
    // https://dev.to/isalevine/three-ways-to-retrieve-json-from-the-web-using-node-js-3c88
    // https://www.npmjs.com/package/xml2js

    const createAuthor = async (name, _article) => {
      // I was originally trying to save all articles as associations on the authors
      // I kept the original code in there, because I imagine it would be needed in the future
      // But the current implementation was very slow, so it made it difficult to verify real time
      Author.findOrCreate({fullName: name}, {fullName: name})
        .exec(async(err, author) => {
          // TODO: make this code more robust
          //This code can error out with race conditions. I assume it has to do with all the asyncs I am using
          if (err) { console.log('race condition for', name); return;}
          await Author.updateOne({ id: author.id }).set({articleCount: (author.articleCount || 0) + 1});

        //   await Article.addToCollection(article.id, 'authors', author.id);
        });

    };

    const createArticle = async (entry) => {
      //no category on purpose
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

        // This data format is predefined by our API
        result.feed.entry.forEach((entry) => {
          createArticle(entry);
        });
      });
    };

    const numAuthors = await Author.count();

    // This query performs on page load right now, so I try to limit how often it gets called
    if(numAuthors === 0) {
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

    // Return 50 articles and order by articleCount DESC
    // TODO: define 50 as a const, so we can specify how many authors we want
    const authors = await Author.find().sort('articleCount DESC').limit(50);
    return authors;
  }
};

