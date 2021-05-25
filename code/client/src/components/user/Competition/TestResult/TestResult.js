import { Button, Card, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import routes from '../../../../constants/routes';

const TestResult = (props) => {
  const { team } = props;
  const [tests, setTests] = useState();
  const history = useHistory();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const responseData = await apis.user.getTestForTeam(team.id);
        console.log('tests info', responseData);
        if (responseData.status === 1) {
          setTests(responseData.tests);
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTests();
  }, [team]);

  const onViewTestResultDetail = (testId) => {
    history.push(
      routes.TEAM_VIEW_TEST_RESULT_DETAIL.replace(
        '/:teamId',
        `/${team.id}`,
      ).replace('/:testId', `/${testId}`),
    );
  };

  return (
    <div>
      {tests && (
        <Card title={<h3>Danh sách các bài thí nghiệm</h3>}>
          <Table
            dataSource={tests}
            columns={[
              {
                title: 'Tên bài thí nghiệm',
                dataIndex: 'name',
              },
              {
                title: 'Chỉ định truy cập',
                dataIndex: 'access',
              },
              {
                title: 'Loại bài thí nghiệm',
                dataIndex: 'type',
              },
              {
                title: 'Xem kết quả',
                render: (_, record) => {
                  return (
                    <Button onClick={() => onViewTestResultDetail(record.id)}>
                      Xem chi tiết
                    </Button>
                  );
                },
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default TestResult;
