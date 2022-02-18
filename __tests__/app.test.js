const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { checkIfExists } = require("../models/check-exists.model");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("app.js", () => {
  test("ALL /* status:404, responds with path not found when invalid path entered", () => {
    return request(app)
      .get("/api/not-a-valid-url")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path not found" });
      });
  });
  describe("/api", () => {
    describe("GET", () => {
      test("status:200, returns a JSON listing all endpoints with an associated description", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                "GET /api": {
                  description:
                    "serves up a json representation of all the available endpoints of the api",
                },
                "GET /api/topics": {
                  description: "serves an array of all topics",
                  queries: [],
                  exampleResponse: {
                    topics: [{ slug: "football", description: "Footie!" }],
                  },
                },
                "GET /api/users": {
                  description: "serves an array of all registered users",
                  queries: [],
                  exampleResponse: {
                    users: [
                      {
                        username: "rogersop",
                        name: "paul",
                        avatar_url:
                          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                      },
                    ],
                  },
                },
                "GET /api/articles": {
                  description: "serves an array of all articles",
                  queries: ["author", "topic", "sort_by", "order"],
                  exampleResponse: {
                    articles: [
                      {
                        article_id: 5,
                        title: "UNCOVERED: catspiracy to bring down democracy",
                        topic: "cats",
                        author: "rogersop",
                        created_at: "2020-08-03T13:14:00.000Z",
                        votes: 0,
                        comment_count: 2,
                      },
                    ],
                  },
                },
                "GET /api/articles/:article_id": {
                  description: "serves the specified article_id",
                  queries: [],
                  exampleResponse: {
                    article: [
                      {
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 100,
                        comment_count: 11,
                      },
                    ],
                  },
                },
                "PATCH /api/articles/:article_id": {
                  description:
                    "increments the vote count of a specified article_id by number provided and serves the patched article",
                  queries: [],
                  exampleBody: { inc_votes: 100 },
                  exampleResponse: {
                    users: {
                      article_id: 1,
                      title: "Living in the shadow of a great man",
                      topic: "mitch",
                      author: "butter_bridge",
                      body: "I find this existence challenging",
                      created_at: "2020-07-09T20:11:00.000Z",
                      votes: 200,
                    },
                  },
                },
                "GET /api/articles/:article_id/comments": {
                  description:
                    "serves an array of comments for specified article_id",
                  queries: [],
                  exampleResponse: {
                    comments: [
                      {
                        comment_id: 2,
                        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                        article_id: 1,
                        author: "butter_bridge",
                        votes: 14,
                        created_at: "2020-10-31T03:03:00.000Z",
                      },
                    ],
                  },
                },
                "POST /api/articles/:article_id/comments": {
                  description:
                    "posts a new comment under specified article_id and serves comment as an object",
                  queries: [],
                  exampleBody: {
                    username: "icellusedkars",
                    body: "I love cheese.",
                  },
                  exampleResponse: {
                    comments: {
                      body: "I love cheese.",
                      votes: 0,
                      author: "icellusedkars",
                      article_id: 1,
                      created_at: "2020-10-31T03:03:00.000Z",
                      comment_id: 19,
                    },
                  },
                },
                "DELETE /api/comments/:comment_id": {
                  description: "deletes comment with associated comment_id",
                },
              })
            );
          });
      });
    });
  });
  describe("/api/topics", () => {
    describe("GET", () => {
      test("status:200, responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics.length).toBe(3);
            topics.forEach((topic) =>
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
  describe("/api/articles", () => {
    describe("GET", () => {
      test("status:200, responds with an array of articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
              expect(article.hasOwnProperty("body")).toBe(false);
            });
          });
      });
      test("status:200, response has key of comment_count with value of how many comments each article has", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      describe("QUERIES", () => {
        test("responds with articles sorted by date in descending order (default case)", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted({
                key: "created_at",
                descending: true,
              });
            });
        });
        test("accepts sort_by query, sorts articles by any valid column", () => {
          // testing about half of possible valid column names
          const articleSort = request(app)
            .get("/api/articles?sort_by=article_id")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted({
                key: "article_id",
                descending: true,
              });
            });
          const titleSort = request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted({ key: "title", descending: true });
            });
          const topicSort = request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted({ key: "author", descending: true });
            });
          const commentCountSort = request(app)
            .get("/api/articles?sort_by=comment_count")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted({
                key: "comment_count",
                descending: true,
              });
            });

          return Promise.all([
            articleSort,
            titleSort,
            topicSort,
            commentCountSort,
          ]);
        });
        test("accepts order query, sorts articles by asc or desc (defaulting to descending)", () => {
          const dateAsc = request(app)
            .get("/api/articles?sort_by=created_at&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted({
                key: "created_at",
                ascending: true,
              });
            });
          const authorAsc = request(app)
            .get("/api/articles?sort_by=author&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted({
                key: "author",
                ascending: true,
              });
            });
          const topicDesc = request(app)
            .get("/api/articles?sort_by=topic&order=DESC")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted({
                key: "topic",
                descending: true,
              });
            });
          return Promise.all([dateAsc, authorAsc, topicDesc]);
        });
        test("accepts topic query, filters articles by the topic value specified", () => {
          const mitchQuery = request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(11);
              articles.forEach((article) => {
                expect(article).toEqual(
                  expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: "mitch",
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number),
                  })
                );
              });
            });
          const catQuery = request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(1);
              expect(articles[0]).toEqual(
                expect.objectContaining({
                  article_id: 5,
                  title: "UNCOVERED: catspiracy to bring down democracy",
                  topic: "cats",
                  author: "rogersop",
                  created_at: expect.any(String),
                  votes: 0,
                  comment_count: 2,
                })
              );
            });

          return Promise.all([mitchQuery, catQuery]);
        });
        test("status:400, response of 'Articles can only be ordered by asc or desc' when specified order value isn't valid", () => {
          return request(app)
            .get("/api/articles?order=cats")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Articles can only be ordered asc or desc");
            });
        });
        test("status:404, response of 'article x not found' when specified values don't exist in database (sort_by and topic queries only)", () => {
          const sortQuery = request(app)
            .get("/api/articles?sort_by=beavis")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article: beavis not found");
            });
          const topicQuery = request(app)
            .get("/api/articles?topic=butthead")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("topic: butthead not found");
            });

          return Promise.all([sortQuery, topicQuery]);
        });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test("status:200, responds with an article object when passed a valid article_id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 100,
              })
            );
          });
      });
      test("status:200, response also has key of comment_count with value of how many comments an article has", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(
            ({
              body: {
                article: { comment_count },
              },
            }) => {
              expect(comment_count).toBe(11);
            }
          );
      });
      test("status:400, responds with error message when passed an invalid article_id", () => {
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
      test("status:404, responds with article not found when passed non-existent article_id", () => {
        return request(app)
          .get("/api/articles/1688")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "article: 1688 not found",
              })
            );
          });
      });
    });
    describe("PATCH", () => {
      test("status:200, updates the correct article_id with the amount of votes entered and responds with updated article object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 100 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 200,
              })
            );
          });
      });
      test("status:400, responds with invalid input when passed invalid article_id", () => {
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
      test("status:400, responds with invalid input when passed invalid patch body (invalid value)", () => {
        return request(app)
          .patch("/api/articles/8")
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
      test("status:400, responds with invalid input when passed invalid patch body (invalid key)", () => {
        return request(app)
          .patch("/api/articles/8")
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
      test("status:404, responds with article not found when passed non-existent article_id", () => {
        return request(app)
          .patch("/api/articles/1688")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "article: 1688 not found",
              })
            );
          });
      });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      test("status:200, responds with an array of comment objects for the given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  body: expect.any(String),
                  article_id: 1,
                  author: expect.any(String),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                })
              );
            });
          });
      });
      test("status:200, responds with an empty array when no comments exist for given article_id", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
          });
      });
      test("status:400, responds with invalid input when passed invalid article_id", () => {
        return request(app)
          .get("/api/articles/invalid/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "Invalid input",
              })
            );
          });
      });
      test("status:404, responds with article not found when passed non-existent article_id", () => {
        return request(app)
          .get("/api/articles/1688/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                msg: "article: 1688 not found",
              })
            );
          });
      });
    });
    describe("POST", () => {
      test("status:201, responds with posted comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "icellusedkars",
            body: "I love cheese, especially stinking bishop cheese on toast. Bocconcini hard cheese babybel cheese on toast smelly cheese roquefort everyone loves bocconcini. Stinking bishop melted cheese babybel cauliflower cheese bocconcini manchego cheese and wine danish fontina. Pecorino danish fontina manchego squirty cheese cheesy feet parmesan.",
          })
          .expect(201)
          .then(({ body: comment }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                body: "I love cheese, especially stinking bishop cheese on toast. Bocconcini hard cheese babybel cheese on toast smelly cheese roquefort everyone loves bocconcini. Stinking bishop melted cheese babybel cauliflower cheese bocconcini manchego cheese and wine danish fontina. Pecorino danish fontina manchego squirty cheese cheesy feet parmesan.",
                votes: 0,
                author: "icellusedkars",

                article_id: 1,
                created_at: expect.any(String),
                comment_id: 19,
              })
            );
          });
      });
      test("status:400, responds with invalid input with post attempt to an invalid article_id", () => {
        return request(app)
          .post("/api/articles/xzibit/comments")
          .send({
            username: "icellusedkars",
            body: "Checkmate... Did he just throw my cat out of the window? You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager? I gave it a cold? I gave it a virus. A computer virus. Yeah, but John, if The Pirates of the Caribbean breaks down, the pirates don’t eat the tourists.",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });
      });

      test("status:400, responds with invalid input when body is missing", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "icellusedkars",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });
      });
      test("status:404, responds with username not found when passed an unregistered username", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "jeff",
            body: "Jaguar shark! So tell me - does it really exist? So you two dig up, dig up dinosaurs? You really think you can fly that thing? Life finds a way. Hey, you know how I'm, like, always trying to save the planet? Here's my chance. You know what? It is beets. I've crashed into a beet truck.",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user: jeff not found");
          });
      });
      test("status:404, responds with article not found when passed non-existent article_id", () => {
        return request(app)
          .post("/api/articles/1688/comments")
          .send({
            username: "icellusedkars",
            body: "Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Jaguar shark! So tell me - does it really exist? Did he just throw my cat out of the window? Life finds a way. Life finds a way. Hey, take a look at the earthlings. Goodbye!",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("article: 1688 not found");
          });
      });
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      test("status:204, empty response body", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(({ body }) => {
            expect(body).toEqual({});
          });
      });
      test("status:400, returns invalid input when passsed an invalid comment_id", () => {
        return request(app)
          .delete("/api/comments/jeff-bezos")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid input");
          });
      });
      test("status:404, returns comment: x not found when passed a non-existent comment_id", () => {
        return request(app)
          .delete("/api/comments/1688")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("comment: 1688 not found");
          });
      });
    });
  });
  describe("checkExists utility model", () => {
    test("Returns true if a given property exists in a given table in the database", () => {
      const topicCheck = checkIfExists("topics", "slug").then((result) => {
        expect(result).toBe(true);
      });
      const articleIdCheck = checkIfExists("articles", "topic").then(
        (result) => {
          expect(result).toBe(true);
        }
      );

      return Promise.all([topicCheck, articleIdCheck]);
    });
    test("Returns of {status: 404, msg: property not found } if given a property that doesn't exist in a given table", () => {
      const topicCheck = checkIfExists("topics", "aliens")
        .then((result) => {
          expect(result).toBe(undefined);
        })
        .catch((err) => {
          expect(err).toEqual(
            expect.objectContaining({
              status: 404,
              msg: "topic: aliens not found",
            })
          );
        });
      const articleIdCheck = checkIfExists("articles", 100)
        .then((result) => {
          expect(result).toBe(undefined);
        })
        .catch((err) => {
          expect(err).toEqual(
            expect.objectContaining({
              status: 404,
              msg: "article: 100 not found",
            })
          );
        });

      return Promise.all([topicCheck, articleIdCheck]);
    });
    test("Takes an optional third parameter (column) to allow for searching of only the specified column", () => {
      const articleIdCheck = checkIfExists("articles", 100, "votes").then(
        (result) => {
          expect(result).toBe(true);
        }
      );
      const articleIdCheckWithColumn = checkIfExists(
        "articles",
        100,
        "article_id"
      )
        .then((result) => {
          expect(result).toBe(undefined);
        })
        .catch((err) => {
          expect(err).toEqual(
            expect.objectContaining({
              status: 404,
              msg: "article: 100 not found",
            })
          );
        });

      return Promise.all([articleIdCheck, articleIdCheckWithColumn]);
    });
  });
});
