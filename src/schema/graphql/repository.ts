export default `#graphql
 type Repository {
    name: String!
    size: Int!
    owner: [String]!
    isPrivate: Boolean!
    filesCount: Int!
    ymlContent: String
    webhooks: Boolean!
  }
`;