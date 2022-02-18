const app = require("../app");
const { checkExists } = require("../db/helpers/utils");
const db = require("../db/connection");
const data = require("../db/data");
const seed = require("../db/seeds/seed");

const request = require("supertest");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("app", () => {
  describe("Invalid endpoint", () => {
    test("Status 404 - responds with a msg of 'Path not found' when an incorrect endpoint is requested", () => {
      return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });
  });

  describe("/api", () => {
    describe("GET", () => {
      test("Status 200 - responds with an object detailing the available endpoints", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(typeof body).toBe("object");
            expect(body["GET /api"]).not.toBe(undefined);
          });
      });
    });
  });

  describe("/api/topics", () => {
    describe("GET", () => {
      test("Status 200 - responds with an object with a key of topics with a value of an array of objects each with a 'slug' and 'description' property", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
    });
  });

  describe("api/articles/:article_id", () => {
    describe("GET", () => {
      test("Status 200 - responds with an article object matching the article_id requested", () => {
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
                created_at: `2020-07-09T20:11:00.000Z`,
                votes: 100,
              })
            );
          });
      });
      test("Status 200 - article object has a comment_count property with a value matching the number of comments linked to that article", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).toBe(2);
          });
      });
      test("Status 200 - comment_count is 0 for articles with no comments", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).toBe(0);
          });
      });
      test("Status 404 - responds with msg 'No article matching requested id' when article_id is valid but there isn't an article with that id currently in the database", () => {
        return request(app)
          .get("/api/articles/9999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No article matching requested id");
          });
      });
      test("Status 400 - responds with 'Bad request' if requested article_id isn't an integer", () => {
        return request(app)
          .get("/api/articles/not-an-int")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });
    describe("PATCH", () => {
      test("Status 200 - responds with an updated article object at the requested article_id with votes incremented by request body 'inc_votes' value", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: `2020-07-09T20:11:00.000Z`,
                votes: 101,
              })
            );
          });
      });
      test("Status 200 - decrements if inc_votes in request body is a negative integer", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -25 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).toBe(75);
          });
      });
      test("Status 400 - responds with msg 'Missing required field' if request body doesn't contain inc_votes property", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Missing required field");
          });
      });
      test("Status 400 - responds with msg 'Bad request' if request body contains inc_votes property but with an invalid value", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "fifty" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("Status 404 - responds with msg 'No article matching requested id' when article_id is valid but there isn't an article with that id currently in the database", () => {
        return request(app)
          .patch("/api/articles/9999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No article matching requested id");
          });
      });
    });
  });

  describe("/api/users", () => {
    describe("GET", () => {
      test("Status 200 - responds with array of user objects under the key of users each with a username property", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({ username: expect.any(String) })
              );
            });
          });
      });
    });
  });

  describe("/api/users/:username", () => {
    describe("GET", () => {
      test("Status 200 - responds with a user object under the key of user with the username specified in the paramter", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: "butter_bridge",
                avatar_url: expect.any(String),
                name: expect.any(String),
              })
            );
          });
      });
      test("Status 404 - responds with msg 'No user matching requested username' when username is valid but there isn't a user with that username currently in the database", () => {
        return request(app)
          .get("/api/users/does-not-exist")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No user matching requested username");
          });
      });
    });
  });

  describe("/api/articles", () => {
    describe("GET", () => {
      test("Status 200 - responds with an object containing a key of articles with a value of an array of article objects sorted by date (created_at) in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            expect(articles).toBeSortedBy("created_at", { descending: true });
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      test("Status 200 - article objects have a comment_count property (integer corresponding to the number of comments associated with the article)", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(typeof article.comment_count).toBe("number");
              if (article.id === 2) expect(article.comment_count).toBe(0);
            });
          });
      });
      test("Status 200 - user can decided order with order query - defaults to descending", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at");
          });
      });
      test("Status 200 - user can sort by any valid column with the sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=date")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("Status 200 - sort_by query works for comment_count", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("comment_count", {
              descending: true,
            });
          });
      });
      test("Status 200 - user can filter by topic with the topic query (exact match only)", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(11);
          });
      });
      test("Status 200 - user can combine queries", () => {
        return request(app)
          .get("/api/articles?topic=mitch&sort_by=author&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(11);
            expect(articles).toBeSortedBy("author");
          });
      });
      test("Status 404 - responds with error object with msg 'No articles found with that topic' when the topic query results in no articles", () => {
        return request(app)
          .get("/api/articles?topic=does-not-exist")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No articles found with that topic");
          });
      });
      test("Status 400 - responds with error object with msg 'Invalid order query - use 'asc' or 'desc'' when order query is invalid", () => {
        return request(app)
          .get("/api/articles?order=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid order query - use 'asc' or 'desc'");
          });
      });
      test("Status 400 - responds with error object with msg 'Invalid sort_by query' when sort_by query is invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort_by query");
          });
      });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      test("Status 200 - responds with an object with a key of comments and a value of an array of comment objects associated with the requested article_id", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(2);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
      test("Status 200 - responds with empty array if article is valid, exists in the database but doesn't have any comments associated with it", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
          });
      });
      test("Status 404 - responds with msg 'No article matching requested id' when article_id is valid but there isn't an article with that id currently in the database", () => {
        return request(app)
          .get("/api/articles/9999/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No article matching requested id");
          });
      });
      test("Status 400 - responds with 'Bad request' if requested article_id isn't an integer", () => {
        return request(app)
          .get("/api/articles/not-an-int/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });
    describe("POST", () => {
      test("Status 201 - responds with an object with a key of comment with a value of the new comment object added via the request", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "New comment" })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: "butter_bridge",
                body: "New comment",
              })
            );
          });
      });
      test("Status 400 - responds with msg 'Missing required field' if request body doesn't contain username or body property", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Missing required field");
          })
          .then(() => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ body: "No username" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Missing required field");
              });
          });
      });
      test("Status 400 - responds with msg 'Bad request' if request body contains username not currently in the users table", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "unknown_user", body: "" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("Status 400 - responds with 'Bad request' if requested article_id isn't an integer", () => {
        return request(app)
          .get("/api/articles/not-an-int")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("Status 404 - responds with msg 'No article matching requested id' when article_id is valid but there isn't an article with that id currently in the database", () => {
        return request(app)
          .post("/api/articles/9999/comments")
          .send({ username: "unknown_user", body: "" })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No article matching requested id");
          });
      });
    });
  });

  describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      test("Status 204 - no response sent back", () => {
        return request(app)
          .delete("/api/comments/2")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(10);
              });
          });
      });
      test("404 - responds with msg 'No comment matching requested id' when comment_id is valid but not currently in the database", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No comment matching requested id");
          });
      });
      test("400 - responds with 'Bad request' if requested comment_id isn't an integer", () => {
        return request(app)
          .delete("/api/comments/not-an-int")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });
    describe("PATCH", () => {
      test("Status 200 - responds with an updated comment object at the requested comment_id with votes incremented by request body 'inc_votes' value", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 4 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                created_at: expect.any(String),
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                comment_id: 1,
                article_id: 9,
                author: "butter_bridge",
                votes: 20,
              })
            );
          });
      });
      test("Status 200 - decrements if inc_votes in request body is a negative integer", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -6 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).toBe(10);
          });
      });
      test("Status 400 - responds with msg 'Missing required field' if request body doesn't contain inc_votes property", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Missing required field");
          });
      });
      test("Status 400 - responds with msg 'Bad request' if request body contains inc_votes property but with an invalid value", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "fifty" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("Status 400 - responds with 'Bad request' if requested comment_id isn't an integer", () => {
        return request(app)
          .patch("/api/comments/not-an-int")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("Status 404 - responds with msg 'No comment matching requested id' when comment_id is valid but there isn't a comment with that id currently in the database", () => {
        return request(app)
          .patch("/api/comments/9999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No comment matching requested id");
          });
      });
    });
  });
});
