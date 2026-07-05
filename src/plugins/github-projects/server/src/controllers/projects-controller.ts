import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  create: async (ctx) => {
    ctx.body = await strapi.plugin('github-projects').service('projectsService').createProject(ctx.request.body);
  },
  delete: async (ctx) => {
    const { documentId } = ctx.params;
    ctx.body = await strapi.plugin('github-projects').service('projectsService').deleteProject(documentId);
  },
});

export default controller;
