import type { Core } from '@strapi/strapi';
import { parse } from 'pg-connection-string';
const config = ({
	env,
}: Core.Config.Shared.ConfigParams): Core.Config.Database => {
	const connectionString = env('DATABASE_URL');

	if (!connectionString) {
		throw new Error('DATABASE_URL must be set in production');
	}

	const { host, port, database, user, password } = parse(connectionString);

	return {
		connection: {
			client: 'postgres',
			connection: {
				host: host ?? 'localhost',
				port: port ? Number(port) : 5432,
				database: database ?? 'strapi',
				user: user ?? 'strapi',
				password: password ?? 'strapi',
				ssl: env.bool('DATABASE_SSL', true) && {
					rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
				},
			},
			debug: false,
		},
	};
};

export default config;
