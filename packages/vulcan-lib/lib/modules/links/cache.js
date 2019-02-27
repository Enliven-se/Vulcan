import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache()
  //ssr
  .restore(Meteor.isClient ? window.__APOLLO_STATE__ : {});
export default cache;
