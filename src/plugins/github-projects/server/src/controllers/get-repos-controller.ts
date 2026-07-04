import type { Core } from "@strapi/strapi";

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin("github-projects")
      // the name of the service file & the method.
      .service("getReposService")
      .getPublicRepos();
  },
});

export default controller;