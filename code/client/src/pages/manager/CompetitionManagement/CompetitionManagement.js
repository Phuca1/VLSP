import Moment from 'react-moment';
import { Button, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes';
import apis from '../../../apis';
import { toast } from 'react-toastify';

const CompetitionManagement = (props) => {
  const [loadedCompetitions, setLoadedCompetitions] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompetitions = async () => {
      setIsLoading(true);
      try {
        const responseData = await apis.user.getListCompetitions();
        if (responseData.status === 1) {
          setLoadedCompetitions(responseData.competitions);
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchCompetitions();
  }, []);

  const columns = [
    {
      title: 'Cuộc thi',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <Link
            to={routes.COMPETITION_MANAGER.replace('/:cid', `/${record.id}`)}
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: 'Ngày bắt đầu tham gia',
      dataIndex: 'joinCompetitionStartDate',
      render: (date) => {
        return <Moment format="DD/MM/YYYY">{date}</Moment>;
      },
    },
    {
      title: 'Ngày kết thúc tham gia',
      dataIndex: 'joinCompetitionEndDate',
      render: (date) => {
        return <Moment format="DD/MM/YYYY">{date}</Moment>;
      },
    },
  ];

  return (
    <div>
      <Spin spinning={isLoading}>
        <div className="container-fluid" style={{ display: 'block' }}>
          <Button
            className="float-right"
            style={{ marginTop: '2rem', marginRight: '10rem' }}
          >
            <Link to={routes.CREATE_COMPETITION}>Tạo cuộc thi</Link>
          </Button>
        </div>
        <div
          className="container"
          style={{ display: 'block', paddingTop: '5rem' }}
        >
          <Table
            columns={columns}
            dataSource={loadedCompetitions}
            bordered
            style={{ width: '100%' }}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Spin>
    </div>
  );
};

export default CompetitionManagement;
