import { useQuery, gql } from "@apollo/client";

type PropType = {
  repoName: string;
};

type RepoDetailsType = {
  name: string;
  isPrivate: boolean;
  filesCount: number;
  owner: string[];
  size: number;
  webhooks: boolean;
  ymlContent: string;
};

const GET_REPO_DETAILS = gql`
  query RepoDetails($repoName: String!) {
    repoDetails(repoName: $repoName) {
      name
      isPrivate
      filesCount
      owner
      size
      webhooks
      ymlContent
    }
  }
`;

const RepoDetails: React.FC<PropType> = ({ repoName }): JSX.Element => {
  const { loading, error, data } = useQuery<{
    repoDetails: RepoDetailsType;
  }>(GET_REPO_DETAILS, {
    variables: { repoName },
  });

  if (loading) return <center>loading...</center>;
  if (error) return <center> Error! {error.message}</center>;

  return (
    <div>
      <h4>RepoDetails</h4>
      <table className="detail" border={1} width={20}>
        <tr>
          <td> Repo name </td> <td> {data?.repoDetails.name}</td>{" "}
        </tr>
        <tr>
          <td>Repo size : </td>
          <td>{data?.repoDetails.size}</td>
        </tr>
        <tr>
          <td>Repo owner : </td>
          <td>{data?.repoDetails.owner?.join(",")}</td>
        </tr>
        <tr>
          <td>Private\public repo : </td>
          <td>{data?.repoDetails.isPrivate ? "private" : "public"} </td>
        </tr>
        <tr>
          {" "}
          <td>Number of files in the repo : </td>{" "}
          <td>{data?.repoDetails.filesCount} </td>
        </tr>{" "}
        <tr>
          {" "}
          <td>Active webhooks : </td>{" "}
          <td>{data?.repoDetails.webhooks ? "yes" : "No"} </td>
        </tr>
        <tr>
          <td>Content of 1 yml file : </td>{" "}
          <td>
            <pre>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.repoDetails.ymlContent || "",
                }}
              />{" "}
            </pre>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default RepoDetails;
