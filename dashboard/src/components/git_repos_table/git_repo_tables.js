//component that will render the table from a axios call to github api

import React, { Component } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { getRepos , getWorkflows , getWorkflowDetails, getWorkflowStatus} from '../../api/octokit';

/*const here that will determine the rate of calls that can be made*/ 
const calldelayRepos = 2000; //repos

const GitReposTable = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [searched, setSearched] = useState("");
    const [timedOut, setTimedOut] = useState(false);

    //useEffect that will trigger when repos is updated
    useEffect(() => {
        //start the workflow gathering here
        if (repos.length == 0){
            return;
        }
        if(timedOut){
            return;
        }
        for (let i = 0; i < repos.length; i++) {
            if (!repos[i].workflows_loaded){
                //wait 1 second before making the next call
                setTimedOut(true);
                setTimeout(() => {
                    setTimedOut(false);
                }, calldelayRepos);
                getWorkflows(searched, repos[i].name).then((workflows) => {
                    //console.log(workflows);
                    //loop over the workflows and get the details
                    for (let j = 0; j < workflows.workflows.length; j++) {
                        workflows.workflows[j]['details_loaded'] = false;
                        getWorkflowStatus(searched, repos[i].name, workflows.workflows[j].id).then((details) => {
                            workflows.workflows[j]['details'] = details;
                            workflows.workflows[j]['details_loaded'] = true;
                            repos[i]['workflows'] = workflows;
                            console.log(repos);
                            setRepos(repos);
                        }).catch((err) => {
                            console.log(err);
                            setError(true);
                        });
                    }
                    repos[i]['workflows'] = workflows;
                    repos[i]['workflows_loaded'] = true;

                    setRepos(repos);
                }).catch((err) => {
                    console.log(err);
                    setError(true);
                });
                break;
            }
        }
    }, [timedOut,searched]);


    //function that will search for a user or org
    const searchUser = () => {
        getRepos(search).then((repos) => {
            for (let i = 0; i < repos.length; i++) {
                repos[i]['workflows_loaded'] = false; 
            }
            setRepos(repos);
            setLoading(false);
            setSearched(search);
            setSearch('');
            setTimedOut(false);
        }).catch((err) => {
            console.log(err);
            setError(true);
        }
        );
    }

    //function here that will return a value of a cell in the table
    const getWorkflowCell = (repo) => {
        if (repo.workflows_loaded){
            //check if there are any workflows
            if (repo.workflows.workflows.length == 0){
                return (<div>No workflows</div>);
            }
            return (
                <table className='workflow-table'>
                    <thead>
                        <tr>
                            <th></th>
                            {repo.workflows.workflows.map((workflow) => (
                                <th>{workflow.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>State</b></td>
                            {repo.workflows.workflows.map((workflow) => (
                                <td>{workflow.state}</td>
                            ))}
                        </tr>

                        <tr>
                            <td><b>Latest Run Details</b></td>
                            {repo.workflows.workflows.map((workflow) => {
                                //if workflow details is undefined then return loading
                                if (workflow.details == undefined){
                                    return (
                                        <td>Loading...</td>
                                    )
                                }
                                if (workflow.details_loaded){
                                    //check if there are any runs
                                    if (workflow.details.workflow_runs.length == 0){
                                        return (
                                            <td>No runs</td>
                                        )
                                    }
                                    return (
                                        <td>
                                            <ul>
                                                <li>Run ID: <a href={workflow.details.workflow_runs[0].html_url} target="_blank">{workflow.details.workflow_runs[0].id}</a></li>
                                                <li>Run Status: {workflow.details.workflow_runs[0].status}</li>
                                                <li>Run Conclusion: {workflow.details.workflow_runs[0].conclusion}</li>
                                                <li>Run Created: {workflow.details.workflow_runs[0].updated_at}</li>
                                            </ul>
                                        </td>
                                    )
                                }
                                return (
                                    <td>Loading...</td>
                                )
                            }
                            )}
                        </tr>
                    </tbody>
                </table>
            );
        }
        if (!repo.workflows_loaded){
            return(<>Loading...</>)
        }    
    }

    if (loading && searched == '') {
        return (
            <div className='table_main_page'>
                <input type="text" placeholder="Search for a user or org" onChange={e => setSearch(e.target.value)} value={search}/>
                <button onClick={e => searchUser()}>search</button>
            </div>
        );
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Something went wrong...</div>;
    }
    if (!loading && !error){
        return (
            <div className='table_main_page'>
                <input type="text" placeholder="Search for a user or org" onChange={e => setSearch(e.target.value)} value={search}/>
                <button onClick={e => searchUser()}>search</button>
                <h1>{searched} Github Repos</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Repo Name</th>
                            <th>workflows</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repos.map((repo) => (
                            <tr key={repo.id}>
                                <td><a href={repo.html_url} target="_blank">{repo.name}</a></td>
                                <td>{getWorkflowCell(repo)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        );
    }
}

export default GitReposTable; 