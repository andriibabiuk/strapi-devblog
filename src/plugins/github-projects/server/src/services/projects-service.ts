import type { Core } from '@strapi/strapi';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  createProject: async (repo) => {
    const { id, name, shortDescription, url, longDescription } = repo;
    return strapi.documents('plugin::github-projects.project').create({
      data: {
        repositoryId: String(id),
        title: name,
        shortDescription,
        repositoryUrl: url,
        longDescription,
      },
    });
  },
  deleteProject: async (documentId: string) => {
    return strapi.documents('plugin::github-projects.project').delete({ documentId });
  },
});

export default service;
