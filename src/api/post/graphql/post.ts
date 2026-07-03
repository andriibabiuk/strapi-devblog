import { Core } from '@strapi/strapi';
import type { GraphQLFieldResolver } from 'graphql';
import type { Context } from 'koa';

export const likePostMutation = `
          type Mutation {
              likePost(id: ID!): PostEntityResponse
          }
      `;

export const getLikePostResolver = (strapi: Core.Strapi) => {
	const resolverFunction = (async (_parentPort, args, ctx) => {
		const { id: postId } = args;
		const userId = ctx.state.user.id;
		const likedPost = await strapi
			.service('api::post.post')
			.likePost({ postId, userId });
		const { toEntityResponse } = strapi
			.plugin('graphql')
			.service('format').returnTypes;
		const formattedResponse = toEntityResponse(likedPost, {
			args,
			resourceUID: 'api::post.post',
		});
		return formattedResponse;
	}) satisfies GraphQLFieldResolver<unknown, Context, { id: string }>;
	return resolverFunction;
};

export const likePostMutationConfig = {
	auth: {
		scope: ['api::post.post.likePost'],
	},
};
