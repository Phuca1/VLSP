import React from 'react';
import NavBar from './Navbar/NavBar';

import './index.scss';
import { Col, Divider, Row } from 'antd';

const Layout = (props) => {
  return (
    <div className="layout">
      <div className="navBar">
        <NavBar />
      </div>
      <div className="content">
        <Row>
          <Col flex={1} style={{ backgroundColor: 'grey' }} />
          <Col flex={8}>{props.children}</Col>
          <Col flex={1} style={{ backgroundColor: 'grey' }} />
        </Row>
      </div>
    </div>
  );
};

export default Layout;
