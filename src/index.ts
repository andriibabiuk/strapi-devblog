// import type { Core } from '@strapi/strapi';

import { Core } from '@strapi/strapi';

import { likePostMutation, getLikePostResolver, likePostMutationConfig } from './api/post/graphql/post';
export default {
	/**
	 * An asynchronous register function that runs before
	 * your application is initialized.
	 *
	 * This gives you an opportunity to extend code.
	 */
	register({ strapi }: { strapi: Core.Strapi }) {
		const extensionService = strapi.plugin('graphql').service('extension');
		const extension = () => ({
			// GraphQL SDL
			typeDefs: likePostMutation,
			resolvers: {
				Mutation: {
					likePost: getLikePostResolver(strapi),
				},
			},
			resolversConfig: {
				'Mutation.likePost': likePostMutationConfig,
			},
		});
		extensionService.use(extension);
	},

	/**
	 * An asynchronous bootstrap function that runs before
	 * your application gets started.
	 *
	 * This gives you an opportunity to set up your data model,
	 * run jobs, or perform some special logic.
	 */
	bootstrap({ strapi }: { strapi: Core.Strapi }) {
		strapi.db.lifecycles.subscribe({
			models: ['admin::user'],
			afterCreate: async ({ result }) => {
				const {
					id,
					firstname,
					lastname,
					email,
					username,
					createdAt,
					updatedAt,
				} = result;
				await strapi.service('api::author.author').create({
					data: {
						firstName: firstname,
						lastName: lastname,
						email,
						username,
						createdAt,
						updatedAt,
						admin_user: [id],
					},
				});
			},
			afterUpdate: async ({ result }) => {
				const correspondingAuthor = (
					await strapi.documents('api::author.author').findMany({
						populate: ['admin_user'],
						filters: {
							admin_user: {
								id: result.id,
							},
						},
					})
				)[0];
				const { id, firstname, lastname, email, username, createdAt, updatedAt } =
					result;
				const data = {
					firstName: firstname,
					lastName: lastname,
					email,
					username,
					createdAt,
					updatedAt,
				};
				if (correspondingAuthor) {
					await strapi
						.service('api::author.author')
						.update(correspondingAuthor.id, { data });
				} else {
					await strapi
						.service('api::author.author')
						.create({ data: { ...data, admin_user: [id] } });
				}
			},
		});
	},
};
