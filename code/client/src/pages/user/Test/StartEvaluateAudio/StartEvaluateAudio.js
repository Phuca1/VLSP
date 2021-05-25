import { Button, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { RightOutlined } from '@ant-design/icons';
import apis from '../../../../apis';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import routes from '../../../../constants/routes';

const StartEvaluateAudio = ({ history }) => {
  const { testId } = useParams();
  const { user } = useSelector((state) => ({ ...state.auth }));
  const [test, setTest] = useState();
  const [userInTest, setUserInTest] = useState();

  useEffect(() => {
    const fetchTest = async () => {
      const responseData = await apis.user.getTestById(testId);
      console.log('test infor: ', responseData);
      if (responseData.status === 1) {
        setTest(responseData.test);
      } else {
        toast.error(responseData.message);
      }
    };
    fetchTest();
  }, [testId]);

  useEffect(() => {
    const fetchUserInTest = async () => {
      const responseData = await apis.user.getOneUserInTest({
        userId: user.id,
        testId: testId,
      });
      console.log('user in test info: ', responseData);
      if (responseData.status === 1) {
        if (responseData.userInTest) {
          const audioToEvaluate = responseData.userInTest.audioToEvaluate;
          if (
            audioToEvaluate.filter((el) => el.evaluated).length ===
            audioToEvaluate.length
          ) {
            history.push(routes.USER_EVALUATE_COMPLETE);
          }

          setUserInTest(responseData.userInTest);
        } else {
          setUserInTest(1);
        }
      }
    };
    fetchUserInTest();
  }, [testId]);

  const onStartEvaluateAudio = (userInTestId) => {
    history.push(
      routes.USER_EVALUATE_AUDIO.replace('/:uitId', `/${userInTestId}`),
    );
  };

  const onJoinPublicTestAndStartEvaluate = async (userId, testId) => {
    try {
      const responseData = await apis.user.joinPublicTest({ userId, testId });
      console.log(responseData);
      if (responseData.status === 1) {
        const userInTest = responseData.userInTest;
        toast.success(responseData.message);
        history.push(
          routes.USER_EVALUATE_AUDIO.replace('/:uitId', `/${userInTest.id}`),
        );
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container" style={{ background: 'white' }}>
      <h2
        style={{
          textAlign: 'center',
          fontFamily: 'sans-serif',
          paddingTop: '2rem',
        }}
      >
        Hướng dẫn đánh giá audio
      </h2>
      <Divider />
      <div className="container-fluid" style={{ minHeight: '400px' }}></div>

      {userInTest && userInTest === 1 && test && test.access === 'public' && (
        <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
          <h5 style={{ fontFamily: 'sans-serif', padding: '1rem 0 1rem 0' }}>
            Bạn chưa tham gia bài thí nghiệm này
          </h5>
          <Button
            icon={<RightOutlined />}
            shape="round"
            type="primary"
            style={{ textAlign: 'center', height: '45px', width: '300px' }}
            onClick={() => onJoinPublicTestAndStartEvaluate(user.id, test.id)}
          >
            Tham gia bài thí nghiệm
          </Button>
        </div>
      )}

      {userInTest && userInTest !== 1 && (
        <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
          <h5 style={{ fontFamily: 'sans-serif', padding: '1rem 0 1rem 0' }}>
            Bạn đã đánh giá được{' '}
            {
              userInTest.audioToEvaluate.filter((audio) => audio.evaluated)
                .length
            }{' '}
            / {userInTest.audioToEvaluate.length} audios
          </h5>
          <Button
            icon={<RightOutlined />}
            shape="round"
            type="primary"
            style={{ textAlign: 'center', height: '45px', width: '300px' }}
            onClick={() => onStartEvaluateAudio(userInTest.id)}
          >
            Tiếp tục bài thí nghiệm
          </Button>
        </div>
      )}
    </div>
  );
};

export default StartEvaluateAudio;
