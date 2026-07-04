import type { Core } from "@strapi/strapi";

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getPublicRepos() {
    return "Welcome to Strapi 🚀";
  },
});

export default service;