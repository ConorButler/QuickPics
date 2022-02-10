import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import path from "path";
import { PrismaClient } from "@prisma/client";

interface MockUser {
  user?: {
    id: number;
  };
}

// no query logging
const prisma = new PrismaClient();

export const startTestServer = async ({ user }: MockUser = {}) => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        path.join(__dirname, "../../src/graphql/resolvers/**/*.{ts,js}"),
      ],
    }),
    context: {
      prisma,
      req: {
        session: {
          userId: user?.id,
          destroy: () => null,
        },
      },
      res: {
        clearCookie: () => null,
        // for mocking logout
      },
    },
  });

  await server.start();
  // eslint-disable-next-line
  console.log(`Test server running...`);

  return { server };
};
