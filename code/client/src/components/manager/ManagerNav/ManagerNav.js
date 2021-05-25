import { Layout, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes';

const { Sider } = Layout;
const { Item } = Menu;

const ManagerNav = (props) => {
  return (
    <Sider width={200}>
      <Menu
        mode="vertical-left"
        style={{ height: '100%', minHeight: '1000px', borderRight: 0 }}
      >
        <Item>
          <Link to={routes.USER_MANAGEMENT}>User management</Link>
        </Item>
        <Item>
          <Link to={routes.COMPETITION_MANAGEMENT}>Competition management</Link>
        </Item>
      </Menu>
    </Sider>
  );
};

export default ManagerNav;
