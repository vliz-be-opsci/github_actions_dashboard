//this component is used to display the statistics of the organisation in the form of a pie chart and a bar chart
import { Doughnut, Bar } from 'react-chartjs-2';
import {Chart, ArcElement, CategoryScale, registerables} from 'chart.js'
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(...registerables);

const RepoStatistics = (props) => {
    const repos = props.repos;
    //function here that will go over the repos and get the statistics
    const getStatistics = () => {
        let statistics = {
            'total_repos': repos.length,
            'total_workflows': 0,
            'workflow_categories': {'not_run':0,'failed':0,'success':0,'other':0}
        };

        //loop over the repos and get the statistics
        for (let i = 0; i < repos.length; i++) {
            //get the number of workflows
            if (repos[i].workflows_loaded){
                statistics['total_workflows'] = statistics['total_workflows'] + repos[i].workflows.workflows.length;
            }
            //get the number of jobs
            if (repos[i].workflows_loaded){
                for (let j = 0; j < repos[i].workflows.workflows.length; j++) {
                    if (repos[i].workflows.workflows[j].details_loaded){
                        if(repos[i].workflows.workflows[j].details.workflow_runs.length == 0){
                            statistics['workflow_categories']['not_run'] = statistics['workflow_categories']['not_run']+1;
                        }
                        else{
                            const conclusion = repos[i].workflows.workflows[j].details.workflow_runs[0].conclusion;
                            if (conclusion == 'success'){
                                statistics['workflow_categories']['success'] = statistics['workflow_categories']['success']+1;
                                continue;
                            }
                            if (conclusion == 'failure'){
                                statistics['workflow_categories']['failed'] = statistics['workflow_categories']['failed']+1;
                                continue;
                            }
                            statistics['workflow_categories']['other'] = statistics['workflow_categories']['other']+1;
                        }
                    }
                }
            }
        }
        console.log(statistics);
        return statistics;
    }
    const pre_formatted_stats = getStatistics();
    const data = {
        labels: [
            'Not Run',
            'Failed',
            'Success',
            'Other'
        ],
        datasets: [{
            data: [pre_formatted_stats.workflow_categories.not_run, pre_formatted_stats.workflow_categories.failed, pre_formatted_stats.workflow_categories.success, pre_formatted_stats.workflow_categories.other],
            backgroundColor: [
            '#5bc0de',
            '#d9534f',
            '#5cb85c',
            '#292b2c'
            ],
            hoverBackgroundColor: [
            '#5bc0de',
            '#d9534f',
            '#5cb85c',
            '#292b2c'
            ]
        }]
    };
    return (
        <div>
            <h1>Repo Statistics</h1>
            <div className='charts'>
                <Doughnut 
                    data={data} 
                    width={250}
                    height={250}
                    options={{
                        maintainAspectRatio: true,
                        responsive: true
                    }}
                />
            </div>
            
        </div>
    );        
}

export default RepoStatistics;