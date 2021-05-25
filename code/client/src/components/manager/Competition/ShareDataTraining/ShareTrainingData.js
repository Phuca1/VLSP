import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import { PUBLIC_DOMAIN } from '../../../../configs';
import ConfirmShareData from './ConfirmRequestData/ConfirmRequestData';
import ShareData from './ShareData/ShareData';

const ShareDataTraining = (props) => {
  const { competition, reload, setReload } = props;
  const [loadedDataTraining, setLoadedDataTraining] = useState();

  useEffect(() => {
    const fetchDataTrainingInfo = async () => {
      const responseData = await apis.manager.getDataTrainingById(
        competition.dataToShare.dataTrainingId,
      );
      console.log(responseData);
      if (responseData.status === 1) {
        setLoadedDataTraining(responseData.dataTraining);
      } else {
        toast.error(responseData.message);
      }
    };
    if (competition.dataToShare.dataTrainingId) {
      fetchDataTrainingInfo();
    }
  }, [competition]);

  return (
    <div className="container">
      {competition && !competition.dataToShare.dataTrainingId && (
        <ShareData
          competition={competition}
          reload={reload}
          setReload={setReload}
        />
      )}
      {competition &&
        competition.dataToShare.dataTrainingId &&
        loadedDataTraining && (
          <>
            <Row style={{ marginTop: '2rem' }}>
              <Col span={5}>
                <h6 style={{ paddingTop: '5px' }}>
                  Dữ liệu đã được bạn chia sẻ:
                </h6>
              </Col>
              <Col>
                <Button
                  type="primary"
                  href={`${PUBLIC_DOMAIN}/${loadedDataTraining.link}`}
                  target="blank"
                >
                  Download
                </Button>
              </Col>
            </Row>
            <Row style={{ marginTop: '2rem' }}>
              <ConfirmShareData
                competition={competition}
                reload={reload}
                setReload={setReload}
              />
            </Row>
          </>
        )}
    </div>
  );
};

export default ShareDataTraining;
