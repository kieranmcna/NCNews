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
    it("responds with an article for a valid ID", () => {
        let expectedArticle = testData.articleData[0];
        const createdAtTimestamp = expectedArticle.created_at;
        const adjustedTimestamp = createdAtTimestamp - (3600 * 1000);
        const adjustedCreatedAt = new Date(adjustedTimestamp).toJSON();
        //adjust the timestamp from BST to match the format of the timestamp in the database which is UTC
        expectedArticle = { ...expectedArticle, created_at: adjustedCreatedAt };
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .expect("Content-Type", /json/)
            .then((result) => {
                expect(Object.keys(result.body)).toHaveLength(8);
                expect(result.body).toMatchObject(expectedArticle);
            });
    });

    it("returns a custom 404 error for a valid but non-existent article ID", () => {
        return request(app)
            .get('/api/articles/100000')
            .expect(404)
            .expect("Content-Type", /json/)
            .then((result) => {
                expect(result.body).toEqual({ message: "Article not found" });
            });
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
