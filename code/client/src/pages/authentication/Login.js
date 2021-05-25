import React, { useState } from 'react';

import { Button, Form, Input, Spin } from 'antd';
import apis from '../../apis';
import './Login.scss';
import routes from '../../constants/routes';
import { useDispatch } from 'react-redux';
import types from '../../constants/types';
import { toast } from 'react-toastify';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 1,
    },
    sm: {
      span: 5,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 9,
    },
  },
};

const Login = ({ history }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinishHandler = async (form) => {
    const { email, password } = form;
    setIsLoading(true);
    try {
      const responseData = await apis.auth.login({ email, password });
      console.log('login info', responseData);
      if (responseData.status === 1) {
        dispatch({
          type: types.LOGIN_SUCCESS,
          payload: {
            user: responseData.user,
            token: responseData.token,
          },
        });
        history.push(routes.HOME);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="login-form">
      <Spin spinning={isLoading}>
        <Form
          {...formItemLayout}
          onFinish={onFinishHandler}
          form={form}
          name="login"
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'Input is not a valid email',
              },
              {
                required: true,
                message: 'Please enter your email',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please enter your password',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '300px', height: '45px' }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Login;
