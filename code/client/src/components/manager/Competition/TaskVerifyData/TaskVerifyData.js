import React from 'react';
import CreateTaskVerifyData from './CreateTaskVerifyData/CreateTaskVerifyData';
import TaskVerifyDataManagement from './TaskVerifyDataManagement/TaskVerifyDataManagement';

const TeamVerifyData = (props) => {
  const { competition, setReload, reload } = props;

  if (!competition.taskVerifyData) {
    return (
      <CreateTaskVerifyData
        competition={competition}
        setReload={setReload}
        reload={reload}
      />
    );
  }

  return (
    <TaskVerifyDataManagement
      competition={competition}
      setReload={setReload}
      reload={reload}
    />
  );
};

export default TeamVerifyData;
