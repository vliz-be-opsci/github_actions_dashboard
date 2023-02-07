import logo from './logo.svg';
import './App.css';
//import components
import GitReposTable from './components/git_repos_table/git_repo_tables';
function App() {
  return (
    <div className="App">
      {GitReposTable()}
    </div>
  );
}

export default App;
