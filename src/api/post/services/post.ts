/**
 * post service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::post.post', ({ strapi }) => ({
	async exampleService(...args) {
		console.log(args);
		let response = { okay: true };

		if (response.okay === false) {
			return { response, error: true };
		}

		return response;
	},

	async find(...args) {
		const { results, pagination } = await super.find(...args);

		results.forEach((result: { counter: number }) => {
			result.counter = 1;
		});

		return { results, pagination };
	},

	async findOne(documentId, params = {}) {
		return strapi.documents('api::post.post').findOne({
			documentId,
			...super.getFetchParams(params),
		}) as any;
	},
	async findPublic(args) {
		const newQuery = {
			...args,
			filters: {
				...args.filters,
				premium: false,
			},
		};
		const publicPosts = await strapi
			.documents('api::post.post')
			.findMany({ ...super.getFetchParams(newQuery) });
		return publicPosts;
	},
	async findOneIfPublic(args) {
		const { id, query } = args;
		const post = await strapi.documents('api::post.post').findOne({
			documentId: id,
			...super.getFetchParams(query),
		});
		return post?.premium ? null : post;
	},
}));
