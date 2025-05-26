import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ChangeUserInput, CreateUser, CreateUserInput, UsersType } from './users.js';
import { Context } from './context.js';
import {
  ChangeProfile,
  ChangeProfileInput,
  CreateProfile,
  CreateProfileInput,
  ProfileType,
} from './profile.js';
import {
  ChangePost,
  ChangePostInput,
  CreatePost,
  CreatePostInput,
  PostType,
} from './posts.js';
import { UUIDType } from './uuid.js';

//   createUser(dto: CreateUserInput!): User!
// createProfile(dto: CreateProfileInput!): Profile!
// createPost(dto: CreatePostInput!): Post!
// changePost(id: UUID!, dto: ChangePostInput!): Post!
// changeProfile(id: UUID!, dto: ChangeProfileInput!): Profile!
// changeUser(id: UUID!, dto: ChangeUserInput!): User!
// deleteUser(id: UUID!): String!
// deletePost(id: UUID!): String!
// deleteProfile(id: UUID!): String!
// subscribeTo(userId: UUID!, authorId: UUID!): String!
// unsubscribeFrom(userId: UUID!, authorId: UUID!): String!

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(UsersType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, { dto }: CreateUser, { prisma }: Context) =>
        await prisma.user.create({ data: dto }),
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_, { dto }: CreateProfile, { prisma }: Context) =>
        await prisma.profile.create({ data: dto }),
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_, { dto }: CreatePost, { prisma }: Context) =>
        await prisma.post.create({ data: dto }),
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(ChangePostInput) },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id, dto }: ChangePost & { id: string }, { prisma }: Context) =>
        await prisma.post.update({ where: { id }, data: dto }),
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id, dto }: ChangeProfile, { prisma }: Context) =>
        await prisma.profile.update({ where: { id }, data: dto }),
    },
    changeUser: {
      type: new GraphQLNonNull(UsersType),
      args: {
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id, dto }: ChangeProfile, { prisma }: Context) =>
        await prisma.user.update({ where: { id }, data: dto }),
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, { prisma }) => {
        try {
          await prisma.user.delete({ where: { id } });

          return true;
        } catch {
          return false;
        }
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, { prisma }) => {
        try {
          await prisma.post.delete({ where: { id } });

          return true;
        } catch {
          return false;
        }
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, { prisma }) => {
        try {
          await prisma.profile.delete({ where: { id } });

          return true;
        } catch {
          return false;
        }
      },
    },
    subscribeTo: {
      type: GraphQLBoolean,
      args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma },
      ) => {
        try {
          await prisma.subscribersOnAuthors.create({
            data: { subscriberId: userId, authorId },
          });

          return true;
        } catch {
          return false;
        }
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma },
      ) => {
        try {
          await prisma.subscribersOnAuthors.deleteMany({
            where: { subscriberId: userId, authorId },
          });

          return true;
        } catch {
          return false;
        }
      },
    },
  }),
});
