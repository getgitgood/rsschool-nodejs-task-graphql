import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { appSchema, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { Context } from './types/context.js';

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

      return await graphql({
        schema: appSchema,
        source: query,
        variableValues: variables,
        contextValue: { prisma } as Context,
      });
    },
  });
};

export default plugin;
