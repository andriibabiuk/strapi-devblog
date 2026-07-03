/**
 * post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', {
	async exampleAction(ctx) {
		await strapi.service('api::post.post').exampleService();
		try {
			ctx.body = 'ok';
		} catch (err) {
			ctx.body = err;
		}
	},

	async find(ctx) {
		const filters = ctx.query.filters as
			| { premium?: { $eq?: string } }
			| undefined;
		const isRequestingNonPremium =
			filters && filters.premium?.['$eq'] == 'false';
		if (ctx.state.user || isRequestingNonPremium) return await super.find(ctx);
		const publicPosts = await strapi
			.service('api::post.post')
			.findPublic(ctx.query);
		const sanitizedPosts = await this.sanitizeOutput!(publicPosts, ctx);
		return this.transformResponse!(sanitizedPosts);
	},
	async findOne(ctx) {
		if (ctx.state.user) return await super.findOne(ctx);
		const { id } = ctx.params;
		const { query } = ctx;
		const postIfPublic = await strapi
			.service('api::post.post')
			.findOneIfPublic({ id, query });
		const sanitizedEntity = await this.sanitizeOutput!(postIfPublic, ctx);
		return this.transformResponse!(sanitizedEntity);
	},
});
