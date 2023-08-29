import { getRepos } from "../../../modules/repository";
type repoDetails = {
    repoName: string
}
export default {
    listRepo: async () => await getRepos(),
    repoDetails: async (_: any, { repoName }: repoDetails) => await getRepos(repoName)
}