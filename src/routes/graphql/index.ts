import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { appSchema, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate, validateSchema } from 'graphql';
import { Context } from './types/context.js';
import depthLimit from 'graphql-depth-limit';

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

      const errors = validate(appSchema, parse(query), [depthLimit(5)]);

      if (errors.length) return { data: '', errors };

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
