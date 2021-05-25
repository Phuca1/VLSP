import { Layout, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes';

const { Sider } = Layout;
const { Item } = Menu;

const UserNav = (props) => {
  return (
    <Sider width={200}>
      <Menu
        mode="vertical-left"
        style={{ height: '100%', minHeight: '600px', borderRight: 0 }}
      >
        <Item>
          <Link to={routes.TEAM_INFO}>Team</Link>
        </Item>
        <Item>
          <Link to={routes.VIEW_LIST_COMPETITION}>Competition</Link>
        </Item>
        <Item>
          <Link to={routes.VIEW_LIST_TEST}>Test</Link>
        </Item>
      </Menu>
    </Sider>
  );
};

export default UserNav;
