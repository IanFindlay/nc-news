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
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });
  describe("/api/topics", () => {
    describe("GET", () => {
      test("Status 200 - responds with an object with a key of topics with a value of an array of objects each with a 'slug' and 'description' property", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic) => {
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
          .then(({ body }) => {
            expect(body).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: `2020-07-09T20:11:00.000Z`,
              votes: 100,
            });
          });
      });
    });
  });
});
