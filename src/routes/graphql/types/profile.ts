import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypes, Member } from './members.js';
import { Context } from './context.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export type Profile = {
  memberTypeId: MemberTypeId;
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: Member;
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
