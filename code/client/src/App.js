import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { toast, ToastContainer } from 'react-toastify';
import { Layout, Spin, Col, Row } from 'antd';
import NavBar from './components/Layout/Navbar/NavBar';

import Router from './routers';
import 'react-toastify/dist/ReactToastify.css';

import api from './apis';
import types from './constants/types';
import ManagerNav from './components/manager/ManagerNav/ManagerNav';

const { Content } = Layout;

const App = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state.auth }));
  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      dispatch({
        type: types.LOADED_USER_FAILED,
      });
      return;
    }
    const fetchUser = async () => {
      try {
        const responseData = await api.auth.verifyToken();
        console.log('verify user: ', responseData);
        if (responseData && responseData.user) {
          dispatch({
            type: types.LOADED_USER,
            payload: {
              token: token,
              user: responseData.user,
            },
          });
        } else {
          dispatch({
            type: types.LOADED_USER_FAILED,
          });
          toast.error(responseData.message);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        toast.error(error.message);
      }
    };
    fetchUser();
  }, [dispatch]);
  return (
    !isLoading && (
      <React.Fragment>
        <Spin spinning={isLoading}>
          <BrowserRouter>
            <Layout>
              <NavBar />
              <Row style={{ minHeight: '1000px' }}>
                <Col flex={1} style={{ backgroundColor: 'grey' }} />
                <Col flex={18}>
                  <Layout>
                    {user && user.role === 'manager' && <ManagerNav />}
                    <Content style={{ padding: '15px 0 10px 15px' }}>
                      <Switch>
                        <Router />
                      </Switch>
                    </Content>
                  </Layout>
                </Col>
                <Col flex={1} style={{ backgroundColor: 'grey' }} />
              </Row>
            </Layout>
          </BrowserRouter>
        </Spin>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeButton
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ marginTop: '50px', marginRight: '30px' }}
        />
      </React.Fragment>
    )
  );
};

export default App;
