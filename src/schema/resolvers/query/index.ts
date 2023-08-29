

import repository from "./repository";
const resolvers = {
    Query: {
        ...repository,
    },
};
export default resolvers;