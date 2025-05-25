import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export type Member = {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
};

export enum MemberIdEnum {
  BUSINESS = 'BUSINESS',
  BASIC = 'BASIC',
}

const MemberTypesFields = {
  id: { type: new GraphQLNonNull(MemberId) },
  discount: { type: new GraphQLNonNull(GraphQLFloat) },
  postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
};

export const MemberTypes = new GraphQLObjectType({
  name: 'MemberTypes',
  fields: MemberTypesFields,
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: MemberTypesFields,
});
