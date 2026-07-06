export default () => ({
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/repos',
      handler: 'getReposController.index',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: [
                'plugin::github-projects.repos.read',
                'plugin::github-projects.projects.read',
              ],
            },
          },
        ],
      },
    },
    {
      method: 'POST',
      path: '/project',
      handler: 'projectsController.create',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::github-projects.projects.create'],
            },
          },
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/project/:documentId',
      handler: 'projectsController.delete',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::github-projects.projects.delete'],
            },
          },
        ],
      },
    },
  ],
});
