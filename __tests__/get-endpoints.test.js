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
test("handles invalid endpoints", () => {
    return request(app)
        .get("/api/invalid-endpoint")
        .then((result) => {
            expect(result.status).toBe(404);
            expect(result.body).toEqual({ message: "Not found" });
        });
});

describe("GET /api/articles/:id", () => {
    it("responds with an article for a valid ID", () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .expect("Content-Type", /json/)
            .then((result) => {
                expect(Object.keys(result.body)).toHaveLength(8);
                expect(result.body).toHaveProperty("author");
                expect(typeof result.body.author).toBe("string");
                expect(result.body).toHaveProperty("title");
                expect(typeof result.body.title).toBe("string");
                expect(result.body).toHaveProperty("article_id");
                expect(typeof result.body.article_id).toBe("number");
                expect(result.body).toHaveProperty("body");
                expect(typeof result.body.body).toBe("string");
                expect(result.body).toHaveProperty("topic");
                expect(typeof result.body.topic).toBe("string");
                expect(result.body).toHaveProperty("created_at");
                expect(typeof result.body.created_at).toBe("string");
                expect(result.body).toHaveProperty("votes");
                expect(typeof result.body.votes).toBe("number");
                expect(result.body).toHaveProperty("article_img_url");
                expect(typeof result.body.article_img_url).toBe("string");
            });
    });

    it("returns a custom 404 error for an invalid article ID", () => {
        return request(app)
            .get('/api/articles/100000')
            .expect(404)
            .expect("Content-Type", /json/)
            .then((result) => {
                expect(result.body).toEqual({ message: "Article not found" });
            });
    });
});
