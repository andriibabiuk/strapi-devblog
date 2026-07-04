export default () => ({
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/repos",
      // name of the controller file & the method.
      handler: "getReposController.index",
      config: {
        policies: [],
				auth: false
      },
    },
  ],
});