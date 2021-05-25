import { Button, Card, Col, Row } from 'antd';
import React from 'react';
import { PUBLIC_DOMAIN } from '../../../../configs';

const SharedData = (props) => {
  const { dataTraining } = props;
  return (
    <div>
      <Card
        title={
          <h5 style={{ fontFamily: 'sans-serif' }}>Dữ liệu được chia sẻ</h5>
        }
      >
        {dataTraining && (
          <Row>
            <Col span={5}>Dữ liệu:</Col>
            <Col span={19}>
              <Button href={`${PUBLIC_DOMAIN}/${dataTraining.link}`}>
                Download
              </Button>
            </Col>
          </Row>
        )}
        {!dataTraining && (
          <h4 style={{ textAlign: 'center' }}>Chưa có dữ liệu được chia sẻ</h4>
        )}
      </Card>
    </div>
  );
};

export default SharedData;
