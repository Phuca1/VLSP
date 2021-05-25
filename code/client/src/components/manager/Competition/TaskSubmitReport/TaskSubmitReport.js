import React from 'react';
import TaskSubmissionDetail from '../TaskSubmission/TaskSubmissionDetail/TaskSubmissionDetail';
import CreateTaskSubmitReport from './CreateTaskSubmitReport/CreateTaskSubmitReport';
import TaskSubmitReportDetail from './TaskSubmitReportDetail/TaskSubmitReportDetail';

const TaskSubmitReport = (props) => {
  const { competition, reload, setReload } = props;

  console.log('at task submit result, ', competition);

  return (
    <div className="container-fluid">
      {competition &&
        (!competition.taskSubmitReport ||
          !competition.taskSubmitReport.submitReportStartDate) && (
          <CreateTaskSubmitReport
            competition={competition}
            reload={reload}
            setReload={setReload}
          />
        )}
      {competition && competition.taskSubmitReport.submitReportStartDate && (
        <TaskSubmitReportDetail
          competition={competition}
          reload={reload}
          setReload={setReload}
        />
      )}
    </div>
  );
};

export default TaskSubmitReport;
