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
            .then(({ body }) => {
                const articles = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(Object.keys(articles[0])).toHaveLength(9);
                expect(articles).toBeSortedBy("created_at", { descending: true });
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

describe("GET /api/articles/:article_id/comments", () => {
    test("responds with an array of comments for the given article_id", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((result) => {
                const comments = result.body;
                expect(Array.isArray(comments)).toBe(true);
                expect(Object.keys(comments[0])).toHaveLength(6);
                expect(comments).toBeSortedBy("created_at", { descending: true });
                comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id", expect.any(Number));
                    expect(comment).toHaveProperty("body", expect.any(String));
                    expect(comment).toHaveProperty("article_id", expect.any(Number));
                    expect(comment).toHaveProperty("author", expect.any(String));
                    expect(comment).toHaveProperty("votes", expect.any(Number));
                    expect(comment).toHaveProperty("created_at", expect.any(String));
                });
            });
    })

    test("Respond with custom 200 error when an article exists but there is no comments for that article", () => {
        return request(app)
            .get("/api/articles/7/comments")
            .expect(200)
            .then((result) => {
                expect(result.body).toEqual({ message: "No comments found for this article" });
            });
    })
    test("Handles valid but non existant article_id and lets the user know the article doesn't exist", () => {
        return request(app)
            .get("/api/articles/7000/comments")
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body).toEqual({ message: "Article not found" });
            });
    });
    test("Handles invalid article_id", () => {
        return request(app)
            .get("/api/articles/banana/comments")
            .then((result) => {
                expect(result.status).toBe(400);
                expect(result.body).toEqual({ message: "Invalid Article ID" });
            });
    })

    test("Handles invalid endpoint", () => {
        return request(app)
            .get("/api/articles/1/reviews")
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body).toEqual({ message: "Not found" });
            });
    })
})
describe("POST /api/articles/:article_id/comments", () => {
    test("responds with the posted comment", () => {
        const newComment = {
            author: "butter_bridge",
            body: "This is a test comment."
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                console.log(body.postedComment);
                expect(body.postedComment).toEqual(expect.objectContaining({
                    article_id: 1,
                    author: "butter_bridge",
                    body: "This is a test comment.",
                    comment_id: 19,
                    created_at: expect.any(String),
                    votes: 0
                })
                )
            });
    })
    test("Returns an error if either author or body property isn't provided", () => {
        const commentNoBody = {
            author: "butter_bridge",
        };
        const commentNoAuthor =
        {
            body: "The Little Sheep"
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(commentNoBody)
            .expect(400)
            .then((result) => {
                expect(result.body).toEqual({ message: "A comment & author must be provided" });

                return request(app)
                    .post("/api/articles/1/comments")
                    .send(commentNoAuthor)
                    .expect(400)
                    .then((result) => {
                        expect(result.body).toEqual({ message: "A comment & author must be provided" })
                    })
            })
    })

    test("Returns an custom error if the comment or author values are blank", () => {
        const authorNoValue =
        {
            author: "",
            body: "The Little Sheep"
        }
        const commentNoValue =
        {
            author: "butter_bridge",
            body: ""
        }
        return request(app)
            .post("/api/articles/1/comments")
            .send(authorNoValue)
            .expect(400)
            .then((result) => {
                expect(result.body).toEqual({ message: "The comment body & author value must be at least 1 character in length" })
                return request(app)
                    .post("/api/articles/1/comments")
                    .send(commentNoValue)
                    .expect(400)
                    .then((result) => {
                        expect(result.body).toEqual({ message: "The comment body & author value must be at least 1 character in length" })
                    })
            })
    })
})
describe("PATCH /api/articles/:article_id", () => {
    test("Responds with update article", () => {
        const updatedArticle = {
            inc_votes: 1
        };
        return request(app)
            .patch("/api/articles/1")
            .send(updatedArticle)
            .expect(200)
            .then(({ body }) => {
                console.log(body.updatedComment);
                expect(body.updatedComment).toEqual(expect.objectContaining({
                    article_id: 1,
                    author: "butter_bridge",
                    body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                    comment_id: 2,
                    created_at: expect.any(String),
                    votes: 15
                })
                )
            });
    });
    test("Allows for a negative value to be passed in to decrement the votes", () => {
        const updatedArticle = {
            inc_votes: -100
        };
        return request(app)
            .patch("/api/articles/1")
            .send(updatedArticle)
            .expect(200)
            .then(({ body }) => {
                console.log(body.updatedComment);
                expect(body.updatedComment).toEqual(expect.objectContaining({
                    article_id: 1,
                    author: "butter_bridge",
                    body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                    comment_id: 2,
                    created_at: expect.any(String),
                    votes: -86
                })
                )
            });
    })
    test("Returns an error if the inc_votes property isn't provided", () => {
        const updatedArticle = {
            inc_votes: ""
        };
        return request(app)
            .patch("/api/articles/1")
            .send(updatedArticle)
            .expect(400)
            .then((result) => {
                expect(result.body).toEqual({ message: "An inc_votes value must be provided" });
            })
    })
});
