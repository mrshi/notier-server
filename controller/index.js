module.exports = [
  {
    url: '/',
    controller: async (ctx) => {
      var data = { "name": "Alan", "hometown": "Somewhere, TX",
        "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
      ctx.hbsResponse.json(data)
    }
  }
];
