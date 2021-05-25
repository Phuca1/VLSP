import { Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apis from '../../../../../apis';
import { PUBLIC_DOMAIN } from '../../../../../configs';

const dateFormat = 'YYYY/MM/DD';

const columns = [
  {
    title: 'Tên đội',
    dataIndex: 'name',
  },
  {
    title: 'Đội trưởng',
    dataIndex: 'realLeader',
    render: (leader) => {
      return leader.name;
    },
  },
  {
    title: 'Báo cáo',
    dataIndex: 'reportSubmittedLink',
    render: (link) => {
      console.log(link);
      return (
        <a href={`${PUBLIC_DOMAIN}/${link}`} target="blank">
          Bản báo cáo
        </a>
      );
    },
  },
];

const TaskSubmitReportDetail = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamSubmitted, setTeamSubmitted] = useState(null);

  const { competition } = props;

  useEffect(() => {
    const fetchTeamSubmitted = async () => {
      setIsLoading(true);
      try {
        const responseData = await apis.manager.getTeamsWhoSubmittedReport(
          competition.id,
        );
        console.log('team submitted:', responseData);
        if (responseData.status === 1) {
          setTeamSubmitted(responseData.teamSubmitted);
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    if (
      competition.taskSubmitReport &&
      competition.taskSubmitReport.submitReportStartDate
    ) {
      fetchTeamSubmitted();
    }
  }, [competition]);

  return (
    <div>
      <Spin spinning={isLoading}>
        <h3 style={{ marginTop: '1rem' }}>Danh sách các đội nộp báo cáo</h3>
        {teamSubmitted && (
          <Table
            dataSource={teamSubmitted}
            columns={columns}
            pagination={{ pageSize: 5 }}
            style={{ marginTop: '3rem' }}
          />
        )}
      </Spin>
    </div>
  );
};

export default TaskSubmitReportDetail;
