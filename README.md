To use this repo locally create .env.development & .env.test files with the following contents
.env.development - PGDATABASE=DEV_DB
.env.test  - PGDATABASE=DEV_TEST_DB

- /api/topics - Returns Topics with Slugs & their descriptions 
- /api/articles/:articleId - Returns articles with the given article ID