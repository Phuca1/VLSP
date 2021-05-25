import { Progress, Table } from 'antd';
import React from 'react';

const EvaluatorDetail = (props) => {
  const { allUsersInTestDetail } = props;

  return (
    <div>
      <Table
        dataSource={allUsersInTestDetail}
        columns={[
          {
            title: 'Người tham gia',
            dataIndex: 'name',
          },
          {
            title: 'E-mail',
            dataIndex: 'email',
          },
          {
            title: 'Tiến trình thí nghiệm',
            dataIndex: 'audioToEvaluate',
            render: (audioList) => {
              const percent =
                audioList.filter((audio) => audio.evaluated).length /
                audioList.length;
              return (
                <Progress percent={Math.floor(percent * 100)} size="small" />
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default EvaluatorDetail;
