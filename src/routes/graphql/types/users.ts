import {
  GraphQLFieldConfigMap,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Post, PostType } from './posts.js';
import { Profile, ProfileType } from './profile.js';
import { Context } from './context.js';

type Users = {
  id: string;
  name: string;
  balance: number;
  profile: Profile;
  posts: Post;
  userSubscribedTo: Users[];
  subscribedToUser: Users[];
};

export type CreateUser = {
  dto: {
    name: string;
    balance: number;
  };
};

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const UsersType = new GraphQLObjectType<Users, Context>({
  name: 'User',
  fields: (): GraphQLFieldConfigMap<Users, Context> => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (user, _, { prisma }) =>
        await prisma.profile.findFirst({ where: { userId: user.id } }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user, _, { prisma }) =>
        await prisma.post.findMany({ where: { authorId: user.id } }),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UsersType))),
      resolve: async (user, _, { prisma }: Context) =>
        (
          await prisma.subscribersOnAuthors.findMany({
            where: { subscriberId: user.id },
            include: { author: true },
          })
        ).map(({ author }) => author),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UsersType))),
      resolve: async (user, _, { prisma }: Context) =>
        (
          await prisma.subscribersOnAuthors.findMany({
            where: { authorId: user.id },
            include: { subscriber: true },
          })
        ).map(({ subscriber }) => subscriber),
    },
  }),
});
