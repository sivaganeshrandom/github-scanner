import { useState } from "react";
import "./App.css";
import RepoList from "./RepoList";
import RepoDetails from "./RepoDetails";

function App() {
  const [repoName, setRepoName] = useState("");
  return (
    <div className="App">
      <RepoList setRepoName={setRepoName} />
      {!!repoName && <RepoDetails repoName={repoName} />}
    </div>
  );
}

export default App;
