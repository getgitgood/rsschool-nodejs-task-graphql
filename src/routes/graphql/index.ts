import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { Context } from './types/context.js';
import depthLimit from 'graphql-depth-limit';
import { RootQueryType } from './types/query.js';
import { Mutations } from './types/mutation.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const appSchema = new GraphQLSchema({
        query: RootQueryType,
        mutation: Mutations,
      });
      const parsedQuery = parse(query);
      const validationRules = [depthLimit(5)];

      try {
        const validationErrors = validate(appSchema, parsedQuery, validationRules);
        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        return await graphql({
          schema: appSchema,
          source: query,
          variableValues: variables,
          contextValue: { prisma },
        });
      } catch (error) {
        fastify.log.error(error);
        return { errors: [error] };
      }
    },
  });
};

export default plugin;
