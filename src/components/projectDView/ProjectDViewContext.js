import React from 'react';

// Create context for ProjectDView and export for child components
export const ProjectDViewContext = React.createContext();

// For class based child components
export const ProjectDViewProvider = ProjectDViewContext.Provider;
export const ProjectDViewConsumer = ProjectDViewContext.Consumer;

// For functional based child components
export const useProjectDViewContext = () => {
    return React.useContext(ProjectDViewContext);
};

export default ProjectDViewContext;