const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");


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
            .then((result) => {
                expect(Array.isArray(result.body)).toBe(true);
                expect(Object.keys(result.body[0])).toHaveLength(9);
                expect(result.body[0]).toEqual({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'some gifs',
                    created_at: '2020-11-03T09:12:00.000Z',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: '2'
                });
                expect(result.body[1]).toEqual({
                    article_id: 6,
                    title: 'A',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'Delicious tin of cat food',
                    created_at: '2020-10-18T01:00:00.000Z',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: '1'
                });
                expect(result.body[2]).toEqual({
                    article_id: 2,
                    title: 'Sony Vaio; or, The Laptop',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                    created_at: '2020-10-16T05:03:00.000Z',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: '0'
                });
            });
    });


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
