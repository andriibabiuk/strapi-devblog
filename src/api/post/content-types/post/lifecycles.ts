import type { Event } from '@strapi/database';

module.exports = {
	beforeCreate: async ({ params }: Event) => {
		const adminUserId = params.data.createdBy;
		const author = (
			await strapi.documents('api::author.author').findMany({
				filters: {
					admin_user: {
						id: adminUserId,
					},
				},
			})
		)[0];
		params.data.author.connect = [...params.data.author.connect, author.id];
	},
};
