const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");
const sorted = require("jest-sorted");


beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end();
});

describe("GET /api/topics", () => {
    test("responds with an array of topic objects with slug and description properties", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((result) => {
                expect(result.body.length).toBe(3);
                expect(Array.isArray(result.body)).toBe(true);
                result.body.forEach((topic) => {
                    expect(topic).toHaveProperty("slug");
                    expect(typeof topic.slug).toBe("string");
                    expect(topic).toHaveProperty("description");
                    expect(typeof topic.description).toBe("string");
                });
            });
    });
});

test("responds with an array of topic objects with at least one topic", () => {
    return request(app)
        .get("/api/topics")
        .then((result) => {
            expect(result.status).toBe(200);
            expect(Array.isArray(result.body)).toBe(true);
        });
});
test("Handles invalid endpoint", () => {
    return request(app)
        .get("/api/invalid-endpoint")
        .then((result) => {
            expect(result.status).toBe(404);
            expect(result.body).toEqual({ message: "Not found" });
        });
});

describe("GET /api/articles/:id", () => {
    test("responds with an article for a valid ID", () => {
        const expectedArticle = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .expect("Content-Type", /json/)
            .then((result) => {
                expect(Object.keys(result.body)).toHaveLength(8);
                expect(result.body).toMatchObject(expectedArticle);
                expect(result.body).toEqual(expectedArticle);
            });
    });

    test("returns a custom 404 error for a valid but non-existent article ID", () => {
        return request(app)
            .get('/api/articles/100000')
            .expect(404)
            .expect("Content-Type", /json/)
            .then((result) => {
                expect(result.body).toEqual({ message: "Article not found" });
            });
    });


    test("Handles invalid endpoint", () => {
        return request(app)
            .get("/api/reviews/banana")
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body).toEqual({ message: "Not found" });
            });
    });
});

describe("GET /api/articles", () => {
    test("responds with an array of article objects", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const articles = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(Object.keys(articles[0])).toHaveLength(9);
                expect(articles).toBeSorted("created_at", { descending: true });
                articles.forEach((article) => {
                    expect(article).toHaveProperty("article_id", expect.any(Number));
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(String));
                });
            });
    })

    test("responds with correct comment count for each article", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((result) => {
                const articleId = 3;
                const commentCounts = testData.commentData.reduce((count, comment) => {
                    if (comment.article_id === articleId) {
                        return count + 1;
                    } else {
                        return count;
                    }
                }, 0);

                expect(commentCounts).toBe(Number(result.body[0].comment_count));
            });
    });
test("Handles invalid endpoint", () => {
    return request(app)
        .get("/api/arcticles")
        .then((result) => {
            expect(result.status).toBe(404);
            expect(result.body).toEqual({ message: "Not found" });
        });
});
});
