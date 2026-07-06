import { Core } from '@strapi/strapi';

module.exports = ({ env }: Core.Config.Shared.ConfigParams) => ({
	// ...
	email: {
		config: {
			provider: 'nodemailer',
			providerOptions: {
				host: env('SMTP_HOST', 'smtp.example.com'),
				port: env('SMTP_PORT', 587),
				auth: {
					user: env('SMTP_USERNAME'),
					pass: env('SMTP_PASSWORD'),
				},
				secure: true,
			},
			settings: {
				defaultFrom: 'info@devblog.com',
				defaultReplyTo: 'info@devblog.com',
			},
		},
	},
});
