import { Card, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../../apis';
import routes from '../../../constants/routes';

const Competition = (props) => {
  const [loadedCompetitions, setLoadedCompetitions] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));
  console.log('user:', user);

  useEffect(() => {
    setIsLoading(true);
    const fetchCompetitions = async () => {
      const responseData = await api.user.getListCompetitions();
      console.log(responseData);
      setLoadedCompetitions(responseData.competitions);
    };
    fetchCompetitions();
    setIsLoading(false);
  }, []);

  const columns = [
    {
      title: 'Cuộc thi',
      dataIndex: 'name',
      render: (name, record) => {
        let isRegistered = false;
        user.competitions.forEach((competition) => {
          if (competition.competitionId === record.id) {
            isRegistered = true;
          }
        });
        if (isRegistered) {
          return (
            <Link
              to={routes.COMPETITION_USER.replace('/:cid', `/${record.id}`)}
            >
              {name}
            </Link>
          );
        }
        return name;
      },
    },
    {
      title: 'Ngày mở đăng kí',
      dataIndex: 'joinCompetitionStartDate',
      render: (dateString) => {
        return <Moment format="DD/MM/YYYY">{dateString}</Moment>;
      },
    },
    {
      title: 'Ngày kết thúc đăng kí',
      dataIndex: 'joinCompetitionEndDate',
      render: (dateString) => {
        return <Moment format="DD/MM/YYYY">{dateString}</Moment>;
      },
    },
    {
      title: 'Link đăng kí',
      render: (_, record) => {
        let isRegistered = false;
        user.competitions.forEach((competition) => {
          if (competition.competitionId === record.id) {
            isRegistered = true;
          }
        });
        if (isRegistered) {
          return <p>Đã đăng kí</p>;
        }
        return (
          <Link
            to={routes.REGISTER_COMPETITION.replace(':cid', `${record.id}`)}
          >
            Đăng kí
          </Link>
        );
      },
    },
  ];

  return (
    <div className="container mt-5">
      <Card title={<h4>Danh sách các cuộc thi</h4>}>
        <Spin spinning={isLoading}>
          {!isLoading && loadedCompetitions && (
            <Table
              bordered
              columns={columns}
              dataSource={loadedCompetitions}
              pagination={{ pageSize: 10 }}
              tableLayout="fixed"
            />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default Competition;
