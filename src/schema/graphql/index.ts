

import Repository from "./repository";

const Query = `#graphql
  type Query {
    listRepo: [Repository]
    repoDetails(repoName: String!): Repository
  }
`;

export default [Query, Repository];