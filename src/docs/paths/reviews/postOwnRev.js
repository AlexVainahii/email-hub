module.exports = {
  post: {
    tags: ["Reviews"],
    summary: "Add new review",
    description: "Add new review",
    operationId: "postReview",
    security: [
      {
        BearerAuth: [],
      },
    ],
    requestBody: {
      description: "An example of a request object for Add new review",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["review", "rating"],
            properties: {
              review: {
                type: "string",
                description: "review",
                example: "Some review",
              },
              rating: {
                type: "string",
                description: "rating",
                enum: [1, 2, 3, 4, 5],
                example: 5,
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: "review added",
        content: {
          "application/json": {
            schema: {
              type: "object",
              allOf: [
                {
                  properties: {
                    status: {
                      type: "number",
                      example: 201,
                    },
                    data: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "ObjectId",
                          example: "64e9e9baa80ec244444c5cc5",
                        },
                        review: {
                          type: "string",
                          description: "review",
                          example: "Some review",
                        },
                        rating: {
                          type: "string",
                          description: "rating",
                          example: 5,
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      400: {
        description: "missing required fields",
      },
      401: {
        description: "Not authorization",
      },
      409: {
        description: "You can add only one review",
      },
      500: {
        description: "Server error",
      },
    },
  },
};
