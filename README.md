# arxiv-2-0

a [Sails v1](https://sailsjs.com) application

## Run this APP

```
 npm install sails -g
 sails lift

```

http://localhost:1337/

## Notes

First of all, I have almost no experience in Python or NodeJS. I would have chosen Ruby on Rails, so I will use be using RoR conventions as a reference when explaining my decisions.

I opted to use SailsJS because I do know Javascript, and Sails came with some straightforward generators. I spent about 1 hour reading documentation and 4 hours coding.

I opted to nest the 3 pages under `/pages`. That seemed like a pretty sound Sails convention, and there was no need for extra folders there.

On runtime, you will notice that the data models don't appear on first page load. This was intentional. My vision for this project involved several possiblities

- (1) Gradually populate Articles and Authors through a daily/hourly/weekly (frequency is arbitrary) background task. The arVix API allows pagination, and up to 8000 results, so it looks like it would be possible to go through the data on our own time
- (2) Give the user the option to refresh data (refresh button in UI), but make sure to rate limit this on the API side

This would allow me to bootstrap the page with an initial set of authors/articles and hopefully have a better user experience.

To me, "prolific" just meant highest number of articles.

There were several things with data integrity and querying that I wanted to sift through at some point:

- (1) It appeared that authors didn't have an ID, so it made it difficult to distinguish between duplicates. I'd like to see if there's a better way to uniquify authors. I also noticed that some authors were put on papers twice. This was most likely human error, but would require some data integrity enforcement our side
- (2) I couldn't figure out how to query with completely relaxed parameters. You will notice that I included `all:a` in the author query. I imagine there is a way around this.
- (3) It is possible to query for something like "Data Science OR Machine Learning OR Therapy", but I couldn't tell which results matched which parts of that query. This affected the way I saved Articles to the database. If we wanted to show ONLY articles that matched that query, we'd need to make them (in my case I used a category field), but we need a way to be more specific. I was hoping I could fine tune the `category` at some point to something like `Data Science`, etc.

My goal with the `helpers` was to treat them like a `service`, which I would use in RoR to contain most of my business logic. This seemed like it was a Sails coding convention.

I didn't do any testing around 400s / 500s, but those would need to be handled in the controllers.

Lastly, I want to convert the database to Postgres, and I'm hoping I could figure out how to use the ORM with more complex queries because it doesn't look like Waterline comes with group bys (or any aggregate function more complex than sum/count) out of the box.

### Testing

- I didn't have a chance to write any tests, but i would put tests inside a `test` folder at the top level
- I would test my helpers (aka services) to make sure they call out to the arvix API and that they can handle any 404 or 500 from the API
- I would test my helpers to make sure they don't create duplicates. There was a lot of async logic in there, and I am not confident my code works as intended.
- I would test my helpers to make sure they return the correct data to the controllers
- I would test my controllers to make sure they return `authors` and `articles` in the format that the views are looking for
- I might have an integration test or two at the page level to make sure the app doesn't break with zero data or malformed data

### Version info

This app was originally generated on Mon Apr 04 2022 14:21:08 GMT-0600 (Mountain Daylight Time) using Sails v1.5.2.
