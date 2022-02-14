const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("app.js", () => {
  test("ALL /* status:404, returns path not found when invalid path entered", () => {
    return request(app)
      .get("/api/not-a-valid-url")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path not found" });
      });
  });
  describe("GET /api/topics", () => {
    test("status:200, returns an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.forEach((topic) =>
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            )
          );
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("status:200, returns an article object when passed a valid article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
            })
          );
        });
    });
    test("status:400, returns error message when passed an invalid article_id", () => {
      return request(app)
        .get("/api/articles/seven';-- yo")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid input",
            })
          );
        });
    });
    test("status:400, returns article not found when passed non-existent article_id", () => {
      return request(app)
        .get("/api/articles/1688")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
  });
});
