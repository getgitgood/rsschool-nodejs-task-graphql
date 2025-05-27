import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, Member, MemberId } from './members.js';
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
    userId: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async ({ memberTypeId }, _, { prisma }: Context) => {
        return await prisma.memberType.findFirst({ where: { id: memberTypeId } });
      },
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberId },
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberId },
    userId: { type: UUIDType },
  }),
});
