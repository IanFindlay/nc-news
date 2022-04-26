exports.getEndpoints = (_, res, next) => {
  res.status(200).send({
    "GET /api": {
      description:
        "Responds with a JSON object detailing the available endpoints",
    },

    "GET /api/topics": {
      description: "Responds with an array of topics",
      queries: [],
      expectedStatus: 200,
      exampleResponse: {
        topics: [{ slug: "topic", description: "description of topic" }],
      },
    },

    "POST /api/topics": {
      description:
        "Adds a new topic to the database responding with an object representing the newly created topic",
      queries: [],
      expectedStatus: 201,
      exampleResponse: {
        topic: [
          {
            slug: "new topic",
            description: "Optional description of the new topic",
          },
        ],
      },
    },

    "GET /api/users": {
      description: "Responds with an array of users",
      queries: [],
      expectedStatus: 200,
      exampleResponse: {
        users: [{ username: "username" }],
      },
    },

    "GET /api/users/:username": {
      description:
        "Responds with a user object matching the username parameter",
      queries: [],
      expectedStatus: 200,
      exampleResponse: {
        user: [
          {
            username: "username",
            name: "name",
            avatar_url: "Link to avatar picture",
          },
        ],
      },
    },

    "GET /api/articles": {
      description:
        "Responds with an array of paginated articles and a total_count of all the articles matching the filter",
      queries: [
        "sort_by (author | title | article_id | topic | votes | date | comment_count )",
        "order (asc | desc)",
        "filter (topic - exact match required)",
        "limit - number of articles to display per page (defaults to 10)",
        "p - which page of results to retrieve (defaults to 1)",
      ],
      expectedStatus: 200,
      exampleResponse: {
        articles: [
          {
            article_id: "number",
            author: "author",
            title: "title",
            created_at: "date",
            topic: "topic",
            votes: "number",
            comment_count: "number of comments on this article",
          },
        ],
      },
      total_count: 20,
    },

    "POST /api/articles": {
      description:
        "Post a new article - responds with an object representing the newly added article",
      queries: [],
      expectedStatus: 200,
      exampleRequest: {
        author: "author (must already be in the users table)",
        title: "title",
        body: "Contents of article",
        topic: "topic (must already be in the topics table)",
      },
      exampleResponse: {
        articles: [
          {
            article_id: "number",
            author: "author",
            title: "title",
            body: "Contents of article",
            created_at: "date",
            topic: "topic",
            votes: "number",
            comment_count: "number of comments on this article",
          },
        ],
      },
    },

    "GET /api/articles/:article_id": {
      description:
        "Responds with an article object matching the article_id parameter",
      queries: [],
      expectedStatus: 200,
      exampleResponse: {
        article: {
          article_id: "number",
          author: "author",
          title: "title",
          created_at: "date",
          topic: "topic",
          votes: "number",
          comment_count: "number of comments on this article",
          body: "The content of the article",
        },
      },
    },

    "PATCH /api/articles/:article_id": {
      description:
        "Changes the 'votes' for the article at the article_id parameter by the value (positive or negative integer) specified in the request body's inc_votes property and returns the updated article.",
      queries: [],
      expectedStatus: 200,
      exampleRequest: { inc_votes: -10 },
      exampleResponse: {
        article: {
          article_id: "number",
          author: "author",
          title: "title",
          created_at: "date",
          topic: "topic",
          votes: "previous number -10",
          comment_count: "number of comments on this article",
          body: "the content of the article",
        },
      },
    },

    "DELETE /api/articles/:article_id": {
      description:
        "Removes the article specified from the database and all of the comments associated with it",
      queries: [],
      expectedStatus: 204,
      exampleResponse: {},
    },

    "GET /api/articles/:article_id/comments": {
      description:
        "Responds with an array of all of the comments associated with the article specified in the article_id parameter sorted from newest to oldest",
      queries: [
        "limit - number of articles to display per page (defaults to 10)",
        "p - which page of results to retrieve (defaults to 1)",
      ],
      expectedStatus: 200,
      exampleResponse: {
        comments: [
          {
            comment_id: "number",
            author: "author",
            created_at: "date",
            votes: "number",
            body: "the content of the comment",
          },
        ],
      },
    },

    "POST /api/articles/:article_id/comments": {
      description:
        "Adds a new comment associated with the article_id parameter and responds with an object representing the newly added comment - comment requires a username and a body",
      queries: [],
      expectedStatus: 201,
      exampleRequest: { username: "user", body: "comment content" },
      exampleResponse: {
        comment: [
          {
            comment_id: "number",
            author: "author",
            created_at: "date",
            votes: "number",
            body: "the content of the comment",
          },
        ],
      },
    },

    "GET /api/articles/random": {
      description: "Responds with a randomly chosen article object",
      queries: [],
      expectedStatus: 200,
      exampleResponse: {
        article: {
          article_id: "number",
          author: "author",
          title: "title",
          created_at: "date",
          topic: "topic",
          votes: "number",
          comment_count: "number of comments on this article",
          body: "The content of the article",
        },
      },
    },

    "DELETE /api/comments/:comment_id": {
      description: "Deletes the comment matching the comment_id parameter",
      queries: [],
      expectedStatus: 204,
      exampleResponse: {},
    },

    "PATCH /api/comments/:comment_id": {
      description:
        "Changes the 'votes' for the comment at the comment_id parameter by the value (positive or negative integer) specified in the request body's inc_votes property and returns the updated comment.",
      queries: [],
      expectedStatus: 204,
      exampleRequest: { inc_votes: -10 },
      exampleResponse: {
        comment_id: "integer",
        article_id: "integer",
        created_at: "date",
        author: "author",
        votes: "integer",
        body: "the content of the comment",
      },
    },
  });
};
