import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index: async (ctx) => {
    ctx.body = await strapi.plugin('github-projects').service('getReposService').getPublicRepos();
  },
});

export default controller;
