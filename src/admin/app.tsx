import type { StrapiApp } from '@strapi/strapi/admin';

export default {
	config: {
		locales: ['uk'],
	},
	bootstrap(app: StrapiApp) {
		console.log(app);
	},
};
