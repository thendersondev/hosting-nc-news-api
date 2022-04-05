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
                  exampleResponse: {
                    topics: [{ slug: "football", description: "Footie!" }],
                  },
                },
                "POST /api/topics": {
                  description:
                    "posts a new topic and responds with the posted body on a key of topic",
                  exampleBody: {
                    slug: "cheese",
                    description: "I love cheese.",
                  },
                  exampleResponse: {
                    topic: [
                      {
                        slug: "cheese",
                        description: "I love cheese.",
                      },
                    ],
                  },
                },
                "GET /api/users": {
                  description: "serves an array of all registered users",
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
                "GET /api/users/:username": {
                  description: "serves requested username on a key of user",
                  exampleResponse: {
                    user: [
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
                  queries: ["topic", "sort_by", "order"],
                  paginationQueries: ["limit", "p"],
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
                "POST /api/articles": {
                  description:
                    "posts a new article and responds with posted article on a key of article (author and topic must be valid)",
                  exampleBody: {
                    author: "lurker",
                    title: "wololo",
                    body: "now you blue",
                    topic: "paper",
                  },
                  exampleResponse: {
                    article: [
                      {
                        article_id: 14,
                        title: "wololo",
                        body: "now you blue",
                        topic: "paper",
                        author: "lurker",
                        created_at: "2020-08-03T13:14:00.000Z",
                        votes: 0,
                        comment_count: 0,
                      },
                    ],
                  },
                },
                "GET /api/articles/:article_id": {
                  description:
                    "serves the requested article on a key of article",
                  exampleResponse: {
                    article: {
                      article_id: 5,
                      title: "UNCOVERED: catspiracy to bring down democracy",
                      topic: "cats",
                      author: "rogersop",
                      body: "Bastet walks amongst us, and the cats are taking arms!",
                      created_at: "2020-08-03T13:14:00.000Z",
                      votes: 0,
                      comment_count: 2,
                    },
                  },
                },
                "PATCH /api/articles/:article_id": {
                  description:
                    "increments the vote count of a specified article_id by number provided and serves the patched article",
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
                "DELETE /api/articles/:article_id": {
                  description:
                    "deletes the selected article and all associated comments",
                  exampleResponse: {},
                },
                "GET /api/articles/:article_id/comments": {
                  description:
                    "serves an array of comments for specified article_id",
                  paginationQueries: ["limit", "p"],
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
                "PATCH /api/comments/:comment_id": {
                  description:
                    "increments the vote count of a specified comment_id by number provided and serves the patched comment",
                  exampleBody: { inc_votes: 20 },
                  exampleQuery: {
                    comment: {
                      comment_id: 1,
                      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                      article_id: 9,
                      author: "butter_bridge",
                      votes: 37,
                      created_at: "2020-10-31T03:03:00.000Z",
                    },
                  },
                },
                "DELETE /api/comments/:comment_id": {
                  description: "deletes comment with associated comment_id",
                  exampleResponse: {},
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
    describe("POST", () => {
      it("status:201, responds with an a newly added topic object when passed a valid body", () => {
        return request(app)
          .post("/api/topics")
          .send({
            slug: "why you should hire me",
            description: "cause I'm awesome",
          })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: "why you should hire me",
                description: "cause I'm awesome",
              })
            );
          });
      });
      it("status:400, responds with invalid input when body is missing a key", () => {
        return request(app)
          .post("/api/topics")
          .send({
            snail: "I love my shell",
            description: "the pros and cons of living in a caravan",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET", () => {
      test("status:200, responds with an array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/users/:username", () => {
    describe("GET", () => {
      test("status:200, responds with a user obejct when passed a valid username", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: "icellusedkars",
                name: "sam",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
              })
            );
          });
      });
      test("status:404, responds with user: :username not found when passed non-existent username", () => {
        return request(app)
          .get("/api/users/l33th4ck3r")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user: l33th4ck3r not found");
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
            expect(articles).toHaveLength(10);
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
              expect(articles).toHaveLength(10);
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
        test("status:404, response of 'article/topic x not found' when specified values don't exist in database (sort_by and topic queries only)", () => {
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
      describe("PAGINATION QUERIES", () => {
        it("accepts a limit query, which limits  the number of responses, defaulting to 10", () => {
          const defaultCase = request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(10);
            });

          const limitFive = request(app)
            .get("/api/articles?limit=5")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(5);
            });

          return Promise.all([defaultCase, limitFive]);
        });
        it("accepts a p query, which specifies the page at which to start based on the limit", () => {
          const limitFiveP1 = request(app)
            .get("/api/articles?sort_by=article_id&order=asc&limit=5&p=1")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(5);
              articles.forEach((article, index) => {
                expect(article).toEqual(
                  expect.objectContaining({
                    article_id: index + 1,
                  })
                );
              });
            });
          const limitFiveP2 = request(app)
            .get("/api/articles?sort_by=article_id&order=asc&limit=5&p=2")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(5);
              articles.forEach((article, index) => {
                expect(article).toEqual(
                  expect.objectContaining({
                    article_id: index + 6,
                  })
                );
              });
            });
          const limitFiveP3 = request(app)
            .get("/api/articles?sort_by=article_id&order=asc&limit=5&p=3")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(2);
              articles.forEach((article, index) => {
                expect(article).toEqual(
                  expect.objectContaining({
                    article_id: index + 11,
                  })
                );
              });
            });
          const limitFiveP4 = request(app)
            .get("/api/articles?sort_by=article_id&order=asc&limit=5&p=4")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(0);
            });

          return Promise.all([
            limitFiveP1,
            limitFiveP2,
            limitFiveP3,
            limitFiveP4,
          ]);
        });
        it("responds with a total_count property which displays the total number of articles with filters applied (discounting limit)", () => {
          return request(app)
            .get("/api/articles?limit=5&p=3")
            .expect(200)
            .then(({ body: { articles, total_count } }) => {
              expect(articles).toHaveLength(2);
              expect(total_count).toBe(12);
            });
        });
        it("status:400, responds with invalid input when passed invalid value data type", () => {
          const invalidLimit = request(app)
            .get("/api/articles?limit=marco")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input");
            });
          const invalidPage = request(app)
            .get("/api/articles?limit=5&p=polo")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input");
            });

          return Promise.all([invalidLimit, invalidPage]);
        });
      });
    });
    describe("POST", () => {
      it("status:201, responds with newly created article", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "lurker",
            title: "how do I turn this off",
            body: "people don't think it be like it is but it do",
            topic: "paper",
          })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 13,
                title: "how do I turn this off",
                topic: "paper",
                author: "lurker",
                body: "people don't think it be like it is but it do",
                created_at: expect.any(String),
                votes: 0,
                comment_count: 0,
              })
            );
          });
      });
      it("status:400, responds with invalid input when passed an invalid body", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "lurker",
            body: "people don't think it be like it is but it do",
            topic: "cats",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });
      });
      it("status:404, responds with user/topic not found when passed a non-existent user/topic", () => {
        const userNotFound = request(app)
          .post("/api/articles")
          .send({
            author: "jimmy",
            title: "how do I turn this on",
            body: "people do think it be like it is but it don't",
            topic: "cats",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user: jimmy not found");
          });

        const topicNotFound = request(app)
          .post("/api/articles")
          .send({
            author: "lurker",
            title: "have you ever had a dream?",
            body: "Have you ever had a dream that you, um, you had, your, you- you could, you'll do, you- you wants, you, you could do so, you- you'll do, you could- you, you want, you want him to do you so much you could do anything?",
            topic: "dreams",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("topic: dreams not found");
          });

        return Promise.all([userNotFound, topicNotFound]);
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
    describe("DELETE", () => {
      it("status:204, responds with no body upon successful deletion", () => {
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
          })
          .then(() => {
            return request(app).delete("/api/articles/1").expect(204);
          })
          .then(({ body }) => {
            expect(body).toEqual({});
            return request(app).get("/api/articles/1").expect(404);
          })
          .then(({ body: { msg } }) => {
            expect(msg).toBe("article: 1 not found");
          });
      });
      it("status:400, responds with invalid input when passed an invalid article_id", () => {
        return request(app)
          .delete("/api/articles/spicy-meat")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });
      });
      it("status:404, responds with article: X not found when passed a non-existent article_id", () => {
        return request(app)
          .delete("/api/articles/100")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("article: 100 not found");
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
            expect(comments).toHaveLength(10);
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
      describe("QUERIES", () => {
        test("responds with comments sorted by date in descending order (default case)", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSorted({
                key: "created_at",
                descending: true,
              });
            });
        });
        test("accepts sort_by query, sorts comments by any valid column", () => {
          // testing about half of possible valid column names
          const commentIdSort = request(app)
            .get("/api/articles/1/comments?sort_by=comment_id")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSorted({
                key: "comment_id",
                descending: true,
              });
            });
          const authorSort = request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSorted({ key: "author", descending: true });
            });
          const votesSort = request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSorted({ key: "votes", descending: true });
            });

          return Promise.all([commentIdSort, authorSort, votesSort]);
        });
        test("accepts order query, sorts comments by asc or desc (defaulting to descending)", () => {
          const dateAsc = request(app)
            .get("/api/articles/1/comments?sort_by=created_at&order=asc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSorted({
                key: "created_at",
                ascending: true,
              });
            });
          const votesAsc = request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=ASC")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSorted({
                key: "votes",
                ascending: true,
              });
            });
          const authorDesc = request(app)
            .get("/api/articles/1/comments?sort_by=author&order=DESC")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSorted({
                key: "author",
                descending: true,
              });
            });
          return Promise.all([dateAsc, votesAsc, authorDesc]);
        });

        test("status:400, response of 'Comments can only be ordered by asc or desc' when specified order value isn't valid", () => {
          return request(app)
            .get("/api/articles/1/comments?order=cats")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Comments can only be ordered asc or desc");
            });
        });
        test("status:404, response of 'comment x not found' when specified values don't exist in database", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=beavis")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("comment: beavis not found");
            });
        });
      });
      describe("PAGINATION QUERIES", () => {
        it("accepts a limit query, which limits  the number of responses, defaulting to 10", () => {
          const defaultCase = request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toHaveLength(10);
            });

          const limitFive = request(app)
            .get("/api/articles/1/comments?limit=5")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toHaveLength(5);
            });

          return Promise.all([defaultCase, limitFive]);
        });
        it("accepts a p query, which specifies the page at which to start based on the limit", () => {
          const limitFiveP1 = request(app)
            .get("/api/articles/1/comments?limit=5&p=1")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toHaveLength(5);
            });
          const limitFiveP2 = request(app)
            .get("/api/articles/1/comments?limit=5&p=2")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toHaveLength(5);
            });
          const limitFiveP3 = request(app)
            .get("/api/articles/1/comments?limit=5&p=3")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toHaveLength(1);
            });
          const limitFiveP4 = request(app)
            .get("/api/articles/1/comments?limit=5&p=4")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toHaveLength(0);
            });

          return Promise.all([
            limitFiveP1,
            limitFiveP2,
            limitFiveP3,
            limitFiveP4,
          ]);
        });
        it("status:400, responds with invalid input when passed invalid value data type", () => {
          const invalidLimit = request(app)
            .get("/api/articles/1/comments?limit=cheech&p=1")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input");
            });
          const invalidPage = request(app)
            .get("/api/articles/1/comments?limit=5&p=chong")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid input");
            });

          return Promise.all([invalidLimit, invalidPage]);
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
      test("status:204, empty response body and comment deleted from DB", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(2);
            return request(app).delete("/api/comments/1").expect(204);
          })
          .then(({ body }) => {
            expect(body).toEqual({});
            return request(app).get("/api/articles/9/comments").expect(200);
          })
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(1);
          });
      });
      test("status:400, responds with invalid input when passsed an invalid comment_id", () => {
        return request(app)
          .delete("/api/comments/jeff-bezos")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("Invalid input");
          });
      });
      test("status:404, responds with comment: x not found when passed a non-existent comment_id", () => {
        return request(app)
          .delete("/api/comments/1688")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("comment: 1688 not found");
          });
      });
    });
    describe("PATCH", () => {
      it("status:200, responds with the updated comment, accepts positive and negative numbers", () => {
        const patchIncOne = request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                article_id: 9,
                author: "butter_bridge",
                votes: 17,
                created_at: expect.any(String),
              })
            );
          });

        const patchDecOne = request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 2,
                body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                article_id: 1,
                author: "butter_bridge",
                votes: 13,
                created_at: expect.any(String),
              })
            );
          });

        const patchIncMultiple = request(app)
          .patch("/api/comments/3")
          .send({ inc_votes: 16 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 3,
                body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
                article_id: 1,
                author: "icellusedkars",
                votes: 116,
                created_at: expect.any(String),
              })
            );
          });

        const patchDecMultiple = request(app)
          .patch("/api/comments/4")
          .send({ inc_votes: -6 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 4,
                body: " I carry a log — yes. Is it funny to you? It is not to me.",
                article_id: 1,
                author: "icellusedkars",
                votes: -106,
                created_at: expect.any(String),
              })
            );
          });

        return Promise.all([
          patchIncOne,
          patchDecOne,
          patchIncMultiple,
          patchDecMultiple,
        ]);
      });
      it("status:400, responds with invalid input when body is missing or invalid key/value is used", () => {
        const emptyBody = request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });
        const invalidKey = request(app)
          .patch("/api/comments/1")
          .send({ inc: 100 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });
        const invalidValue = request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "tree-fiddy" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid input");
          });

        return Promise.all([emptyBody, invalidKey, invalidValue]);
      });
      it("status:404, responds with comment not found when passed non-existent comment_id", () => {
        return request(app)
          .patch("/api/comments/100")
          .send({
            inc_votes: 10,
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("comment: 100 not found");
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
    test("status:404, responds with msg: property not found if given a property that doesn't exist in a given table", () => {
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
