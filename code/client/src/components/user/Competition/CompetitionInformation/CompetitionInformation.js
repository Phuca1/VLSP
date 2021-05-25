import React from 'react';
import Moment from 'react-moment';
import { Card, Row, Col } from 'antd';
import ReactHtmlParser from 'react-html-parser';

const CompetitionInformation = (props) => {
  const { competition } = props;
  return (
    <div>
      {competition && (
        <Card title={<h4>Thông tin chi tiết và thể lệ cuộc thi</h4>}>
          <Row style={{ marginTop: '1rem' }}>
            <Col span={5}>
              <h6>Tên cuộc thi:</h6>
            </Col>
            <Col span={19}>
              <h6>{competition.name}</h6>
            </Col>
          </Row>
          <Row style={{ marginTop: '2rem' }}>
            <Col span={5}>
              <h6>Ngày mở đăng kí:</h6>
            </Col>
            <Col span={19}>
              <h6>
                <Moment format="DD/MM/YYYY">
                  {competition.joinCompetitionStartDate}
                </Moment>
              </h6>
            </Col>
          </Row>
          <Row style={{ marginTop: '2rem' }}>
            <Col span={5}>
              <h6>Ngày kết thúc đăng kí:</h6>
            </Col>
            <Col span={19}>
              <h6>
                <Moment format="DD/MM/YYYY">
                  {competition.joinCompetitionEndDate}
                </Moment>
              </h6>
            </Col>
          </Row>
          <Row style={{ marginTop: '2rem' }}>
            <Col span={5}>
              <h6>Thể lệ cuộc thi:</h6>
            </Col>
            <Col span={19}>
              <h6 style={{ border: '1px solid', borderRadius: '5px' }}>
                {ReactHtmlParser(competition.rules)}
              </h6>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default CompetitionInformation;
