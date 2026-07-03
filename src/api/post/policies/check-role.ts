/**
 * check-role policy
 */

import type { Core } from '@strapi/strapi';

type AuthenticatedPolicyContext = Core.PolicyContext & {
	state: { user?: { role?: { name: string } } };
};

type CheckRoleConfig = { userRole: string };

export default (
	policyContext: AuthenticatedPolicyContext,
	config: CheckRoleConfig,
	{ strapi }: { strapi: Core.Strapi },
) => {
	const { userRole } = config;
	const isEligible =
		policyContext.state.user && policyContext.state.user.role?.name == userRole;
	if (isEligible) {
		return true;
	}

	return false;
};
