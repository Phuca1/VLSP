import { Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import CompetitionInformation from '../../../../components/user/Competition/CompetitionInformation/CompetitionInformation';
import api from '../../../../apis';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import TeamInformation from '../../../../components/user/Competition/TeamInformation/TeamInformation';
import { useSelector } from 'react-redux';
import CompetitionTask from '../../../../components/user/Competition/CompetitionTask/CompetitionTask';
import {
  FileDoneOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  ProfileOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import SharedData from '../../../../components/user/Competition/SharedData/SharedData';
import TestResult from '../../../../components/user/Competition/TestResult/TestResult';

const { TabPane } = Tabs;

const CompetitionUser = (props) => {
  const { cid: competitionId } = useParams();
  const [loadedCompetition, setLoadedCompetition] = useState();
  const [loadedTeam, setLoadedTeam] = useState();
  const [loadedMembers, setLoadedMembers] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [sharedData, setSharedData] = useState(null);
  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const fetchCompetition = async () => {
      setIsLoading(true);
      try {
        const responseData = await api.user.getCompetitionById({
          competitionId,
        });
        console.log('competition info', responseData);
        if (responseData.status === 1) {
          setLoadedCompetition(responseData.competition);
        } else {
          toast.error(responseData.message);
        }

        const responseData2 = await api.user.getTeamInforOfUser({
          uid: user.id,
          cid: competitionId,
        });
        console.log('team info', responseData2);
        if (responseData2.status === 1) {
          setLoadedTeam(responseData2.team);
          setLoadedMembers(responseData2.members);
        } else {
          toast.error(responseData2.message);
        }

        const responseData3 = await api.user.getDataTrainingForUser({
          competitionId: responseData.competition.id,
          teamId: responseData2.team.id,
        });
        console.log('data shared info', responseData3);
        if (responseData3.status === 1) {
          setSharedData(responseData3.dataTraining);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchCompetition();
  }, [competitionId]);

  return (
    <div className="container">
      <Spin spinning={isLoading}>
        {!isLoading && loadedCompetition && loadedTeam && (
          <Tabs defaultActiveKey="1" type="line">
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined />
                  Chi tiết cuộc thi
                </span>
              }
              key="1"
            >
              <CompetitionInformation competition={loadedCompetition} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <TeamOutlined />
                  Đội của bạn
                </span>
              }
              key="2"
            >
              <TeamInformation team={loadedTeam} members={loadedMembers} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ProfileOutlined />
                  Công việc cần hoàn thành
                </span>
              }
              key="3"
            >
              <CompetitionTask
                competition={loadedCompetition}
                team={loadedTeam}
                dataTraining={sharedData}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FolderOutlined />
                  Dữ liệu được chia sẻ
                </span>
              }
              key="4"
            >
              <SharedData dataTraining={sharedData} />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FileDoneOutlined />
                  Kết quả thí nghiệm
                </span>
              }
              key="5"
            >
              <TestResult team={loadedTeam} />
            </TabPane>
          </Tabs>
        )}
      </Spin>
    </div>
  );
};

export default CompetitionUser;
