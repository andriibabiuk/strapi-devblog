import { request } from '@octokit/request';
import type { Core } from '@strapi/strapi';
import axios from 'axios';
import md from 'markdown-it';
const markdown = md();
const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getProjectForRepo: async (repo) => {
    const { id } = repo;
    const matchingProjects = await strapi.documents('plugin::github-projects.project').findMany({
      filters: {
        repositoryId: id,
      },
    });
    if (matchingProjects.length == 1) return matchingProjects[0].id;
    return null;
  },
  getPublicRepos: async () => {
    const result = await request('GET /user/repos', {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      type: 'public',
    });
    return Promise.all(
      result.data.map(async (item) => {
        const { id, name, description, html_url, owner, default_branch } = item;
        const readmeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
        let longDescription: string | null = null;
        try {
          const response = await axios.get(readmeUrl);
          longDescription = markdown.render(response.data).replaceAll('\n', '<br/>');
        } catch (error) {
          strapi.log.warn(`Failed to fetch README for ${owner.login}/${name}: ${error.message}`);
        }
        const repo = { id, name, shortDescription: description, url: html_url, longDescription };
        const relatedProjectId = await strapi
          .plugin('github-projects')
          .service('getReposService')
          .getProjectForRepo(repo);
        return { ...repo, projectId: relatedProjectId };
      })
    );
  },
});

export default service;
