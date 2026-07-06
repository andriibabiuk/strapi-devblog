import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams) => ({
	url: env('PUBLIC_ADMIN_URL', '/dashboard'),
	serveAdminPanel: env('PUBLIC_ADMIN_URL') == undefined,
});

export default config;
