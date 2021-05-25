import { Button, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apis from '../../../../../apis';
import { PUBLIC_DOMAIN } from '../../../../../configs';

const ConfirmShareData = (props) => {
  const { competition } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [requestTeam, setRequestTeam] = useState();
  const [change, setChange] = useState(false);

  useEffect(() => {
    const fetchRequestTeams = async () => {
      const responseData = await apis.manager.getRequestTeam(competition.id);
      console.log(responseData);
      if (responseData.status === 1) {
        setRequestTeam(responseData.requestTeams);
      } else {
        toast.error(responseData.message);
      }
    };
    setIsLoading(true);
    if (competition) {
      fetchRequestTeams();
    }
    setIsLoading(false);
  }, [change, competition]);

  const columns = [
    {
      title: 'Tên đội',
      dataIndex: 'name',
    },
    {
      title: 'Bản cam kết',
      dataIndex: 'commitmentLink',
      render: (link) => {
        return (
          <a href={`${PUBLIC_DOMAIN}/${link}`} target="blank">
            Bản pdf
          </a>
        );
      },
    },
    {
      title: 'Chia sẻ dữ liệu',
      render: (_, record) => {
        if (record.accepted) {
          return <Button disabled>Đã xác nhận</Button>;
        } else {
          return (
            <Button onClick={() => confirmShareDataHandler(record.id)}>
              Xác nhận
            </Button>
          );
        }
      },
    },
  ];

  const confirmShareDataHandler = async (teamId) => {
    console.log(teamId);
    try {
      const responseData = await apis.manager.confirmShareData({
        competitionId: competition.id,
        teamId,
      });
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setChange(!change);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container-fluid">
      <h2 style={{ margin: '0 0 2rem 0' }}>
        Danh sách các đội yêu cầu dữ liệu huấn luyện
      </h2>
      <Spin spinning={isLoading}>
        {!isLoading && requestTeam && (
          <Table
            dataSource={requestTeam}
            columns={columns}
            pagination={{ pageSize: 4 }}
          />
        )}
      </Spin>
    </div>
  );
};

export default ConfirmShareData;
