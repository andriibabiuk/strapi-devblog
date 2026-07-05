export default () => ({
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/repos",
      handler: "getReposController.index",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
    {
      method: "POST",
      path: "/project",
      handler: "projectsController.create",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
    {
      method: "DELETE",
      path: "/project/:documentId",
      handler: "projectsController.delete",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
  ],
});
