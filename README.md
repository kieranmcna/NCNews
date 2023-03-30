To use this repo locally create .env.development & .env.test files with the following contents
.env.development - PGDATABASE=DEV_DB
.env.test  - PGDATABASE=DEV_TEST_DB

- /api/topics - Returns Topics with Slugs & their descriptions 
- /api/articles/:articleId - Returns articles with the given article ID
- /api/articles - Returns a list of all articles
- /api/articles/:articleId/comments - Returns a list of comments for that article