import React from 'react';
import { Container } from 'reactstrap';
import axios from 'axios'
 
import ProjectDViewHeader from './ProjectDViewHeader.components';
import ProjectDViewGantt from './ProjectDViewGantt.components';
// import ProjectDViewRaci from './ProjectDViewRaci.components';
// import ProjectDViewProjectDashboard from './ProjectDViewProjectDashboard.components';
import TransparentFooter from '../TransparentFooter';
 
import { ProjectDViewProvider } from './ProjectDViewContext';
import { useAuthContext, fetchUserProfile } from "../../services/AuthReducer";
import { dateStrToJSDate } from '../../services/dateServices';
 
function ProjectDView(props) {
    const auth = useAuthContext();
    const [projectData, setProjectData] = React.useState("");;
    const [userData, setUserData] = React.useState("")
    let pageHeader = React.createRef();
 
    let tasks = [];
    let taskTypes = [];
    let features = [];

    if (projectData) {
        projectData.features.forEach((feature, index) => {
            let featureIndex = index;
            features.push(
                {
                    name: feature.name,
                    index: featureIndex
                });

            feature.tasks.forEach(task => {
                task.startDate = dateStrToJSDate(task.startDate);
                task.endDate = dateStrToJSDate(task.endDate);
                task.featureIndex = featureIndex;
                tasks.push(task);
            });
        });

        taskTypes = tasks.map((task) => {
            return task.name;
        });
    };

    // const renderDiagramInitialState = "Select your chart."
 
    // Switch case for graph rendering
    // const renderDiagram = (state, action) => {
    //     switch (action.type) {
    //         case 'Gantt Chart':
    //             return <ProjectDViewGantt tasks={tasks} taskTypes={taskTypes}/>;
    //         case 'RACI Matrix':
    //             return <ProjectDViewRaci />;
    //         case 'Project Dashboard':
    //             return <ProjectDViewProjectDashboard />;
    //         default:
    //             return state;
    //     }
    // };
 
    // const [renderDiagramState, renderDiagramDispatch] = React.useReducer(renderDiagram, renderDiagramInitialState);
 
    // const renderDiagramGantt = () => {
    //     renderDiagramDispatch({type: 'Gantt Chart'});
    // };
    // const renderDiagramRaci = () => {
    //     renderDiagramDispatch({type: 'RACI Matrix'});
    // };
    // const renderProjectDashboard = () => {
    //     renderDiagramDispatch({type: 'Project Dashboard'});
    // };
 
    React.useEffect(() => {
        // Fetch projectData
        const source = axios.CancelToken.source(); // Generate cancellation token
        (async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_SERVER_URL}/projects/find/${props.match.params.projectName}`, 
                {
                    withCredentials: true,
                    cancelToken: source.token
                }
                );
 
                if (!res.data.error) {
                    setProjectData(res.data);
                };
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("axios call cancelled")
                } else {
                    throw err;
                }
            };
        })();
        
        // Fetch userData
        (async () => {
            if (auth.state.isAuthenticated) {
              const user = await fetchUserProfile(auth);
              setUserData({
                'username': user.username,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'position': user.position,
                'projects': user.projects
              });
            }
          })();
        
        document.body.classList.add("sidebar-collapse");
        document.body.classList.add("login-page");
        document.documentElement.classList.remove("nav-open");
      }, [auth, props.match.params.projectName]);
 
    return (
    <>
    <div className="page-header clear-filter" filter-color="blue">
        <div className="page-header-image" style={{backgroundImage: "url(" + require("../../assets/img/header.jpg") + ")"}} ref={pageHeader}></div>
        <ProjectDViewProvider value={{
            projectData,
            userData,
            // renderDiagramGantt, 
            // renderDiagramRaci,
            // renderProjectDashboard
            }}>
            <Container 
            style={{
                marginBottom:"30px"
            }}>
                <ProjectDViewHeader />
            </Container>
            <Container 
            style={{
                paddingTop:"40px"}}>
                <ProjectDViewGantt
                tasks={tasks}
                taskTypes={taskTypes} 
                features={features} />
                {/* Uncomment with other views are functioning */}
                {/* {renderDiagramState} */}
            </Container>
        </ProjectDViewProvider>
        <TransparentFooter />
    </div>
    </>
    )
};
 
export default ProjectDView;