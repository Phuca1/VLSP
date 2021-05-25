import { RightOutlined } from '@ant-design/icons';
import { Button, Divider, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import routes from '../../../../constants/routes';

const StartVerifyAudio = ({ history }) => {
  const { tid: teamId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTeam, setLoadedTeam] = useState();

  useEffect(() => {
    setIsLoading(true);
    const fetchTeam = async () => {
      try {
        const responseData = await apis.user.getTeamById(teamId);
        console.log(responseData);
        if (responseData.status === 1) {
          setLoadedTeam(responseData.team);
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTeam();
    setIsLoading(false);
  }, []);

  const onClickVerifyAudioHandler = () => {
    history.push(routes.TEAM_VERIFY_AUDIO.replace('/:tid', `/${teamId}`));
  };

  if (
    loadedTeam &&
    loadedTeam.audiosVerifiedId.length >= loadedTeam.numberOfAudiotoVerify
  ) {
    return <div>Bạn đã hoàn thành công việc thẩm định</div>;
  }

  return (
    <div
      className="container"
      style={{ paddingTop: '2rem', background: 'white' }}
    >
      <Spin spinning={isLoading}>
        {!isLoading && loadedTeam && (
          <>
            <h4 style={{ textAlign: 'center' }}>
              Bạn đã thẩm định được {loadedTeam.audiosVerifiedId.length}/
              {loadedTeam.numberOfAudiotoVerify} audios
            </h4>
            <Divider />

            <Row justify="center" style={{ paddingBottom: '2rem' }}>
              <Button
                onClick={onClickVerifyAudioHandler}
                type="primary"
                shape="round"
                style={{ height: '45px', width: '300px' }}
                icon={<RightOutlined />}
              >
                Thẩm định
              </Button>
            </Row>
          </>
        )}
      </Spin>
    </div>
  );
};

export default StartVerifyAudio;
