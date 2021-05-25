import { Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import {
  BarChartOutlined,
  InfoOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import apis from '../../../../apis';
import TestInformation from '../../../../components/manager/Test/TestInformation/TestInformation';
import EvaluatorDetail from '../../../../components/manager/Test/EvaluatorDetail/EvaluatorDetail';
import TestAssessment from '../../../../components/manager/Test/TestAssessment/TestAssessment';

const TestDetail = (props) => {
  const { testId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [test, setTest] = useState();
  const [allAudios, setAllAudios] = useState();
  const [allUsersInTestDetail, setAllUsersInTestDetail] = useState();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const responseData = await apis.user.getTestById(testId);
        console.log('test info: ', responseData);
        if (responseData.status === 1) {
          setTest(responseData.test);
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAudiosInTest = async () => {
      try {
        const responseData2 = await apis.user.getAudiosInTest(testId);
        console.log('all audios in test: ', responseData2);
        if (responseData2.status === 1) {
          setAllAudios(responseData2.audiosInTest);
        } else {
          toast.error(responseData2.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUsersInTestDetail = async () => {
      try {
        const responseData3 = await apis.user.getAllUsersInTestDetail(testId);
        console.log('all users in test: ', responseData3);
        if (responseData3.status === 1) {
          setAllUsersInTestDetail(responseData3.allUsersInTestDetail);
        } else {
          toast.error(responseData3.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    setIsLoading(true);
    fetchTest();
    fetchAudiosInTest();
    fetchUsersInTestDetail();
    setIsLoading(false);
  }, [testId]);

  return (
    <div className="container" style={{ background: 'white' }}>
      <Spin spinning={isLoading}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab={
              <span>
                <InfoOutlined />
                Thông tin
              </span>
            }
            key="1"
          >
            {test && <TestInformation test={test} />}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <TeamOutlined />
                Người tham gia
              </span>
            }
            key="2"
          >
            {allUsersInTestDetail && (
              <EvaluatorDetail allUsersInTestDetail={allUsersInTestDetail} />
            )}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <BarChartOutlined />
                Thống kê kết quả
              </span>
            }
            key="3"
          >
            {allAudios && <TestAssessment allAudios={allAudios} test={test} />}
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default TestDetail;
