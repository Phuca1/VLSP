import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Menu, Layout, Row, Col, Button } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import {
  FundOutlined,
  LineOutlined,
  LogoutOutlined,
  SettingOutlined,
  TabletOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';

// import './NavBarStyle.scss';

import routes from '../../../constants/routes';
import types from '../../../constants/types';

const { SubMenu, Item } = Menu;
const { Header } = Layout;

const NavBar = (props) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({
      type: types.LOGOUT,
      payload: null,
    });
    history.push(routes.LOGIN);
  };

  return (
    <Header className="header">
      <Row>
        <Col flex={1}>
          <Link to={routes.HOME}>
            <h1
              style={{
                color: 'white',
                fontFamily: 'fantasy',
                fontWeight: 'bold',
                marginTop: '5px',
              }}
            >
              VLSP
            </h1>
          </Link>
        </Col>
        <Col flex={6}>
          {isAuthenticated && user.role === 'user' && (
            <Button
              icon={
                <FundOutlined
                  style={{
                    marginRight: '10px',
                    color: 'rgba(255, 255, 255, 0.65)',
                  }}
                />
              }
              style={{
                height: '100%',
                backgroundColor: '#001529',
                border: 'hidden',
                fontSize: '17px',
                textAlign: 'center',
                marginBottom: '10px',
                marginLeft: '20px',
                color: 'rgba(255, 255, 255, 0.65)',
              }}
              onClick={() => {
                history.push(routes.VIEW_LIST_COMPETITION);
              }}
            >
              Cuộc thi
            </Button>
          )}
          )}
        </Col>
        <Col flex={2}>
          <Menu mode="horizontal" theme="dark">
            {!isAuthenticated && (
              <Item className="float-right" icon={<UserAddOutlined />}>
                <Link to={routes.SIGNUP}>SIGNUP</Link>
              </Item>
            )}
            {!isAuthenticated && (
              <Item className="float-right" icon={<UserOutlined />}>
                <Link to={routes.LOGIN}>LOGIN</Link>
              </Item>
            )}
            {isAuthenticated && (
              <SubMenu
                className="float-right"
                title={`User`}
                icon={<SettingOutlined />}
              >
                <Item icon={<TabletOutlined />}>
                  <Link to={routes.USER_INFORMATION}>Information</Link>
                </Item>
                <Item icon={<LineOutlined />}>
                  <Link to={routes.CHANGE_PASSWORD}>Change password</Link>
                </Item>
                <Item icon={<LogoutOutlined />} onClick={logout}>
                  Logout
                </Item>
              </SubMenu>
            )}
          </Menu>
        </Col>
      </Row>
    </Header>
  );
};

export default NavBar;
