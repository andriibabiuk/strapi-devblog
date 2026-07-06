import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams) => ({
	url: env('RENDER_EXTERNAL_URL'),
});

export default config;
