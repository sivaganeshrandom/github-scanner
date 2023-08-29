import React from "react";
import { useQuery, gql } from "@apollo/client";

type PropType = {
  setRepoName(name: string): void;
};

type RepoDetailsType = {
  name: string;
  isPrivate: boolean;
  filesCount: number;
  owner: string[];
  size: number;
  webhooks: string[];
  ymlContent: string;
};

const GET_REPO_DETAILS = gql`
  query listRepo {
    listRepo {
      name
      size
      owner
    }
  }
`;

const RepoList: React.FC<PropType> = ({ setRepoName }): JSX.Element => {
  const { loading, error, data } = useQuery<{
    listRepo: RepoDetailsType[];
  }>(GET_REPO_DETAILS);

  if (loading) return <center>loading...</center>;
  if (error) return <center> Error! {error.message}</center>;
  return (
    <div>
      <h4>List of repository</h4>
      <div className="list" nonce="">
        {data?.listRepo.map((d, i) => (
          <ul key={i} className="listitem" onClick={() => setRepoName(d?.name)}>
            <li>Repo name : {d?.name}</li>
            <li>Repo size : {d?.size}</li>
            <li>Repo owner : {d?.owner?.join(",")}</li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default RepoList;
