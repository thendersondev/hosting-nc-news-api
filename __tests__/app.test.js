const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { string } = require("pg-format");

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
});
