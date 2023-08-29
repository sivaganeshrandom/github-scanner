import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { glob } from 'glob';

const maxParallelScans = 2;

const reposDirectory = path.join(__dirname, '../../repos');
interface RepoInfo {
    name: string;
    size: number;
    owner: string[];
    isPrivate: boolean;
    filesCount: number;
    ymlContent: any;
    webhooks: boolean;
}

const getRepoInfo = async (repoName: string): Promise<RepoInfo | null> => {
    try {
        const repoPath = path.join(reposDirectory, repoName);
        const files = await glob(path.join(repoPath, '**/*'));
        const ymlFile = files.find((file) => file.endsWith(".yml"));
        const ownersFile = files.find(file => file.includes("OWNERS"));
        return {
            name: repoName,
            size: await getFileSize(files),
            owner: ownersFile ? await getRepoOwners(ownersFile) : ["unknown"],
            isPrivate: false,
            filesCount: files.length,
            ymlContent: ymlFile ? await getYamlContent(ymlFile as string) : "",
            webhooks: false,
        };
    } catch (error) {
        console.error("Error getFileSize", error);
    }
    return null;
};

const getFileSize = async (files: string[]): Promise<number> => {
    try {
        const fileSizePromises = files.map(async file => {
            const stats = await fs.promises.stat(file);
            return stats.size;
        });
        const fileSizes = await Promise.all(fileSizePromises);
        const totalSize = fileSizes.reduce((acc, size) => acc + size, 0);
        return totalSize;
    } catch (error) {
        console.error("Error getFileSize", error);
    }
    return 0;
};


const getYamlContent = async (yamlFilePath: string): Promise<any> => {
    try {
        const yamlContent = await fs.promises.readFile(yamlFilePath, 'utf8');
        return yamlContent;
    } catch (error) {
        console.error(`Error reading YAML file '${yamlFilePath}': `, error);
    }
    return null;
};

const getRepoOwners = async (ownersFilePath: string): Promise<string[]> => {
    try {
        const ownersContent = await fs.promises.readFile(ownersFilePath, 'utf8');
        const ownersData: any = yaml.load(ownersContent);
        if (ownersData && ownersData.approvers && Array.isArray(ownersData.approvers)) {
            return ownersData.approvers as string[];
        }
    } catch (error) {
        console.error(`Error reading owners file '${ownersFilePath}': `, error);
    };
    return ['unknown'];
};

export const getRepos = async (repoName?: string): Promise<RepoInfo[] | RepoInfo | null> => {

    try {
        const repoFolders = fs.readdirSync(reposDirectory).filter(folder => fs.statSync(path.join(reposDirectory, folder)).isDirectory());

        const checkFolderExists = repoName ? repoFolders.includes(repoName) : true;

        if (!checkFolderExists) {
            console.error("requested folder is not exists");
            return [];
        }
        if (repoName) {
            return await getRepoInfo(repoName);
        }


        const repoInfoList: RepoInfo[] = [];
        const inProgress: Promise<any>[] = [];

        for (let i = 0; i < repoFolders.length; i += maxParallelScans) {
            const currentBatch = repoFolders.slice(i, i + maxParallelScans);
            const currentBatchPromises = currentBatch.map(repo =>
                getRepoInfo(repo)
                    .then(repoInfo => repoInfo && repoInfoList.push(repoInfo))
                    .catch(error => {
                        console.error(`Error scanning repository '${repo}': `, error.message);
                    })
            );
            inProgress.push(...currentBatchPromises);
            await Promise.all(inProgress);
        }

        return repoInfoList;
    } catch (error) {
        console.error('An error occurred while retrieving repositories:', error);
        return [];
    }

};
