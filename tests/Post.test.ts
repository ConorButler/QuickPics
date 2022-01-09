import { startTestServer } from "./testServer";
import gql from "graphql-tag";
import { context } from "../src/context";
const { prisma } = context;

beforeAll(async () => {
  await prisma.post.createMany({
    data: [
      {
        caption: "testing",
      },
      {
        caption: "another test",
      },
      {
        caption: "third test post",
      },
    ],
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

export const postsQuery = gql`
  query {
    posts {
      id
      caption
    }
  }
`;

describe("Posts", () => {
  test("listing all posts", async () => {
    const { server } = await startTestServer({
      context: () => ({ prisma }),
    });

    const res = await server.executeOperation({
      query: postsQuery,
    });

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "posts": Array [
            Object {
              "caption": "testing",
              "id": "1",
            },
            Object {
              "caption": "another test",
              "id": "2",
            },
            Object {
              "caption": "third test post",
              "id": "3",
            },
          ],
        },
        "errors": undefined,
        "extensions": undefined,
        "http": Object {
          "headers": Headers {
            Symbol(map): Object {},
          },
        },
      }
    `);
  });
});
