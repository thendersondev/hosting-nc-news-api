const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/helpers/utils");

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
  describe("/api/topics", () => {
    describe("GET", () => {
      test("status:200, returns an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(3);
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
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test("status:200, returns an article object when passed a valid article_id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(convertTimestampToDate(body)).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(Date),
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
      test("status:404, returns article not found when passed non-existent article_id", () => {
        return request(app)
          .get("/api/articles/1688")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "Article not found",
              })
            );
          });
      });
    });
    describe("PATCH", () => {
      test("status:200, updates the correct article_id with the amount of votes entered and returns updated article object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 100 })
          .expect(200)
          .then(({ body }) => {
            expect(convertTimestampToDate(body)).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(Date),
                votes: 200,
              })
            );
          });
      });
      test("status:400, returns invalid input when passed invalid article_id", () => {
        return request(app)
          .patch("/api/articles/eight")
          .send({ inc_votes: 100 })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "Invalid input",
              })
            );
          });
      });
      test("status:400, returns invalid input when passed invalid patch body (invalid value)", () => {
        return request(app)
          .patch("/api/articles/eight")
          .send({ inc_votes: "not-a-valid-value" })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "Invalid input",
              })
            );
          });
      });
      test("status:400, returns invalid inputwhen passed invalid patch body (invalid key)", () => {
        return request(app)
          .patch("/api/articles/eight")
          .send({ "not a valid key": 100 })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "Invalid input",
              })
            );
          });
      });
      test("status:404, returns article not found when passed non-existent article_id", () => {
        return request(app)
          .patch("/api/articles/1688")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "Article not found",
              })
            );
          });
      });
    });
  });
});
