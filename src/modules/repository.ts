import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { glob } from 'glob';

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

const getRepoInfo = async (repoName: string): Promise<RepoInfo> => {
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
};

const getFileSize = async (files: string[]): Promise<number> => {
    const fileSizePromises = files.map(async file => {
        const stats = await fs.promises.stat(file);
        return stats.size;
    });
    const fileSizes = await Promise.all(fileSizePromises);
    const totalSize = fileSizes.reduce((acc, size) => acc + size, 0);
    return totalSize;
};


const getYamlContent = async (yamlFilePath: string): Promise<any> => {
    const yamlContent = await fs.promises.readFile(yamlFilePath, 'utf8');
    try {
        // return yaml.load(yamlContent);
        return yamlContent;
    } catch (error) {
        console.error(`Error reading YAML file '${yamlFilePath}':`, error);
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
        console.error(`Error reading owners file '${ownersFilePath}':`, error);
    };
    return ['unknown'];
};

export const getRepos = async (repoName?: string): Promise<RepoInfo[] | RepoInfo> => {
    const repoFolders = fs.readdirSync(reposDirectory).filter(folder => fs.statSync(path.join(reposDirectory, folder)).isDirectory());
    const checkFolderExists = repoName ? repoFolders.includes(repoName) : true;

    if (!checkFolderExists) {
        console.error("requested folder is not exists");
        return [];
    }
    if (repoName) {
        return await getRepoInfo(repoName);
    }

    const data = await Promise.all(repoFolders.map(getRepoInfo)).catch(err => {
        console.error("get file info error", err);
        return [];
    });
    // console.log("data", data)
    return data;
};
