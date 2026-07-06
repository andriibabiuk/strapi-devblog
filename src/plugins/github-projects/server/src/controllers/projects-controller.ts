import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  create: async (ctx) => {
    ctx.body = await strapi
      .plugin('github-projects')
      .service('projectsService')
      .createProject(ctx.request.body);
  },
  delete: async (ctx) => {
    const { documentId } = ctx.params;
    ctx.body = await strapi
      .plugin('github-projects')
      .service('projectsService')
      .deleteProject(documentId);
  },
  find: async (ctx) => {
    return await strapi.plugin('github-projects').service('projectsService').find(ctx.query);
  },
  findOne: async (ctx) => {
    const projectId = ctx.params.id;
    return await strapi
      .plugin('github-projects')
      .service('projectsService')
      .findOne(projectId, ctx.query);
  },
});

export default controller;
