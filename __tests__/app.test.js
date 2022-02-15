const app = require("../app");
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
});
