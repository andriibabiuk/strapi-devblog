import type { Core } from '@strapi/strapi';

export default () => {
	const handler: Core.MiddlewareHandler = async (ctx, next) => {
		const start = Date.now();

		await next();

		const delta = Math.ceil(Date.now() - start);
		ctx.set('X-Response-Time', delta + 'ms');
	};

	return handler;
};
