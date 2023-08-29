
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerErrorCode } from '@apollo/server/errors';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs, resolvers } from "./schema";

const port = 4000;
const app = express();
const httpServer = http.createServer(app);

export async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        formatError: (formattedError) => {
            if (
                formattedError.extensions?.code ===
                ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
            ) {
                return {
                    ...formattedError,
                    message: "Your query doesn't match the schema. Try double-checking it!",
                };
            }
            return formattedError;
        },
    });

    await server.start();

    app.use(cors(), bodyParser.json(), expressMiddleware(server));

    await new Promise<void>((resolve) => {
        httpServer.listen({ port }, () => {
            console.log(`🚀 Server ready at http://localhost:${port}`);
            resolve();
        });
    });
}

