import { Card, Table } from 'antd';
import React from 'react';

const TeamInformation = (props) => {
  const { team, members } = props;

  const columns = [
    {
      title: 'Tên thành viên',
      dataIndex: 'name',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
    },
    {
      title: 'Công việc',
      dataIndex: 'job',
    },
  ];

  return (
    <div>
      {team && members && (
        <Card title={<h5>{`Thành viên trong đội ${team.name}`}</h5>}>
          <Table
            dataSource={members}
            columns={columns}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}
    </div>
  );
};

export default TeamInformation;
