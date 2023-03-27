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


