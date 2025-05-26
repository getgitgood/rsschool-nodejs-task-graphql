import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypes, Member, MemberId } from './members.js';
import { Context } from './context.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export type Profile = {
  memberTypeId: MemberTypeId;
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: Member;
};

export type CreateProfile = {
  dto: {
    userId: string;
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: MemberTypeId;
  };
};

export type ChangeProfile = {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: MemberTypeId;
  };
  id: string;
};
export const ProfileType = new GraphQLObjectType<Profile>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberTypes),
      resolve: async ({ memberTypeId }, _, { prisma }: Context) => {
        return await prisma.memberType.findFirst({ where: { id: memberTypeId } });
      },
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfile',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberId) },
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfile',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberId) },
  }),
});
