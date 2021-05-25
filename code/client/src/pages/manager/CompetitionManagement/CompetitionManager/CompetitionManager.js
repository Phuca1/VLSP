import { Collapse, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import apis from '../../../../apis';
import CompetitionDetail from '../../../../components/manager/Competition/CompetitionDetail/CompetitionDetail';
import TaskSubmission from '../../../../components/manager/Competition/TaskSubmission/TaskSubmission';
import ShareDataTraining from '../../../../components/manager/Competition/ShareDataTraining/ShareTrainingData';
import TeamVerifyData from '../../../../components/manager/Competition/TaskVerifyData/TaskVerifyData';
import TestManagement from '../../../../components/manager/Competition/TestManagement/TestManagement';
import TaskSubmitReport from '../../../../components/manager/Competition/TaskSubmitReport/TaskSubmitReport';

const { Panel } = Collapse;

const CompetitionManager = (props) => {
  const { cid: competitionId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedCompetition, setLoadedCompetition] = useState();

  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchCompetition = async () => {
      setIsLoading(true);
      const responseData = await apis.user.getCompetitionById({
        competitionId,
      });
      console.log(responseData);
      setLoadedCompetition(responseData.competition);
      setIsLoading(false);
    };
    fetchCompetition();
  }, [reload]);

  return (
    <div>
      <Spin spinning={isLoading}>
        {!isLoading && loadedCompetition && (
          <React.Fragment>
            <h2 style={{ margin: '1rem 1rem 2rem 2rem' }}>
              Cuộc thi {loadedCompetition.name}
            </h2>
            <Collapse
              defaultActiveKey={['1', '2', '3', '4', '5', '6']}
              style={{ width: '94%', marginLeft: '2rem' }}
            >
              <Panel key="1" header="Chi tiết cuộc thi">
                <CompetitionDetail
                  competition={loadedCompetition}
                  reload={reload}
                  setReload={setReload}
                />
              </Panel>

              {loadedCompetition.timeline.verifyData && (
                <Panel key="2" header="Công việc thẩm định dữ liệu">
                  <TeamVerifyData
                    competition={loadedCompetition}
                    setReload={setReload}
                    reload={reload}
                  />
                </Panel>
              )}

              {loadedCompetition.timeline.shareTrainingData && (
                <Panel key="3" header="Chia sẻ dữ liệu huấn luyện">
                  <ShareDataTraining
                    competition={loadedCompetition}
                    reload={reload}
                    setReload={setReload}
                  />
                </Panel>
              )}

              {loadedCompetition.timeline.submitResult && (
                <Panel key="4" header="Tạo công việc nộp kết quả">
                  <TaskSubmission
                    competition={loadedCompetition}
                    reload={reload}
                    setReload={setReload}
                  />
                </Panel>
              )}

              {loadedCompetition.timeline.test && (
                <Panel key="5" header="Tạo bài thí nghiệm">
                  <TestManagement
                    competition={loadedCompetition}
                    reload={reload}
                    setReload={setReload}
                  />
                </Panel>
              )}

              {loadedCompetition.timeline.submitReport && (
                <Panel key="6" header="Công việc nộp báo cáo">
                  <TaskSubmitReport
                    competition={loadedCompetition}
                    reload={reload}
                    setReload={setReload}
                  />
                </Panel>
              )}
            </Collapse>
          </React.Fragment>
        )}
      </Spin>
    </div>
  );
};

export default CompetitionManager;
