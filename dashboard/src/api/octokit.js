import { Octokit } from '@octokit/rest';
//import env variables from .env file
const decoded_token_a = fromBinary(process.env.REACT_APP_HASHED_TOKEN);
// Create a new Octokit instance that uses axios as its HTTP client
const octokit = new Octokit({
    auth: decoded_token_a
});
  
function fromBinary(encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

//async funtion that will return a promise
export async function getRepos(username) {
    //perform axios request to get repos
    console.log(username);
    if (username != ''){
        const request_repo = await octokit.request('GET /users/{username}/repos', {
            username
        });
        //return the repos
    return request_repo.data;
    }
    
    return [];
}

//async function that will return the workflows given a repo
export async function getWorkflows(username,repo) {
    //perform axios request to get workflows
    //return the workflows
    const request_workflows = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
        owner: username,
        repo: repo
    });
    return request_workflows.data;
}

//async function that will return the details of a workflow
export async function getWorkflowDetails(username,repo,workflow_id) {
    //perform axios request to get workflows
    //return the workflows
    const request_workflow_details = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}', {
        owner: username,
        repo: repo,
        workflow_id: workflow_id
    });
    return request_workflow_details.data;
}

//async function that will return the status of the lastest run of a workflow
export async function getWorkflowStatus(username,repo,workflow_id) {
    //perform axios request to get workflows
    //return the workflows
    const request_workflow_status = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
        owner: username,
        repo: repo,
        workflow_id: workflow_id
    });
    return request_workflow_status.data;
}

