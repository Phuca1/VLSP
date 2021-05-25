import { Col, Divider, Row } from 'antd';
import React from 'react';

const TestInformation = (props) => {
  const { test } = props;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Thông tin bài thí nghiệm</h2>
      <Divider />
      <Row>
        <Col span={7}>
          <h5 style={{ float: 'right' }}>Tên bài thí nghiệm:</h5>
        </Col>
        <Col span={15} offset={1}>
          <h5>{test.name}</h5>
        </Col>
      </Row>
      <Row>
        <Col span={7}>
          <h5 style={{ float: 'right' }}>Loại bài thí nghiệm:</h5>
        </Col>
        <Col span={15} offset={1}>
          <h5>{test.type}</h5>
        </Col>
      </Row>
      <Row>
        <Col span={7}>
          <h5 style={{ float: 'right' }}>
            Số lượt nghe ít nhất cho mỗi audio:
          </h5>
        </Col>
        <Col span={15} offset={1}>
          <h5>{test.usersListenPerAudio}</h5>
        </Col>
      </Row>
      <Row>
        <Col span={7}>
          <h5 style={{ float: 'right' }}>Số bộ test:</h5>
        </Col>
        <Col span={15} offset={1}>
          <h5>{test.numberOfTestSet}</h5>
        </Col>
      </Row>
      <Row>
        <Col span={7}>
          <h5 style={{ float: 'right' }}>Chỉ định truy cập:</h5>
        </Col>
        <Col span={15} offset={1}>
          <h5>{test.access}</h5>
        </Col>
      </Row>
    </div>
  );
};

export default TestInformation;
