import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PostType } from './posts.js';
import { Context } from './context.js';
import { MemberType, MemberId, MemberIdEnum } from './members.js';
import { UUIDType } from './uuid.js';
import { UsersType } from './users.js';
import { ProfileType } from './profile.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_, args, { prisma }: Context) => await prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberId) } },
      resolve: async (_, { id }: { id: MemberIdEnum }, { prisma }) =>
        await prisma.memberType.findUnique({ where: { id } }),
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(UsersType)),
      resolve: async (_, args, { prisma }) => await prisma.user.findMany(),
    },
    user: {
      type: UsersType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }) =>
        await prisma.user.findUnique({ where: { id } }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_, args, { prisma }) => await prisma.post.findMany(),
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }) =>
        await prisma.post.findFirst({ where: { id } }),
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_, args, { prisma }) => await prisma.profile.findMany(),
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }) =>
        await prisma.profile.findUnique({ where: { id } }),
    },
  }),
});
