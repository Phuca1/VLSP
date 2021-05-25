import React from 'react';
import CreateTaskSubmission from './CreateTaskSubmission/CreateTaskSubmission';

import TaskSubmissionDetail from './TaskSubmissionDetail/TaskSubmissionDetail';

const TaskSubmission = (props) => {
  const { competition, reload, setReload } = props;
  // console.log('at task submission:', competition);

  return (
    <div className="container-fluid">
      {competition &&
        (!competition.taskSubmitResult ||
          !competition.taskSubmitResult.submitDescription) && (
          <CreateTaskSubmission
            competition={competition}
            reload={reload}
            setReload={setReload}
          />
        )}
      {competition && competition.taskSubmitResult.submitDescription && (
        <TaskSubmissionDetail
          competition={competition}
          reload={reload}
          setReload={setReload}
        />
      )}
    </div>
  );
};

export default TaskSubmission;
