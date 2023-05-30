To use this repo locally create .env.development & .env.test files with the following contents
.env.development - PGDATABASE=DEV_DB
.env.test - PGDATABASE=DEV_TEST_DB

- .get /api/topics - Returns Topics with Slugs & their descriptions
- .get /api/articles/:articleId - Returns articles with the given article ID
- .get /api/articles - Returns a list of all articles
- .get /api/articles/:articleId/comments - Returns a list of comments for that article
- .post /api/articles/:articleId/comments - Allows users to post comments
- .delete /api/comments/:commentID - Allows users to delete comments
- .get /api/users - Shows a list of users
