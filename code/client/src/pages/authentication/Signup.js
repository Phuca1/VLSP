import React, { useState } from 'react';

import { Button, Form, Input, Spin } from 'antd';
import api from '../../apis';
import './Signup.scss';
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

const Signup = ({ history }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinishHandler = async (form) => {
    console.log('submitted ', form);
    const { name, email, password, job } = form;
    setIsLoading(true);
    try {
      const responseData = await api.auth.signup(name, email, password, job);
      if (responseData.token) {
        dispatch({
          type: types.LOGIN_SUCCESS,
          payload: {
            user: responseData.user,
            token: responseData.token,
          },
        });
        history.push(routes.HOME);
      } else {
        console.log(responseData);
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="register-form">
      <Spin spinning={isLoading}>
        <Form
          {...formItemLayout}
          onFinish={onFinishHandler}
          form={form}
          name="register"
        >
          <Form.Item
            name="name"
            label="Tên đăng nhập"
            rules={[
              {
                type: 'string',
                message: 'Tên không hợp lệ',
              },
              {
                required: true,
                message: 'Hãy nhập tên của bạn vào',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'E-mail không hợp lệ',
              },
              {
                required: true,
                message: 'Hãy nhập E-mail của bạn vào',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: 'Hãy nhập mật khẩu vào',
              },
              {
                min: 6,
                message: 'Mật khẩu ít nhất 6 kí tự',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="job"
            label="Công việc"
            rules={[
              {
                required: true,
                message: 'Hãy nhập công việc của bạn vào',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 5, offset: 9 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '300px', height: '45px' }}
            >
              Signup
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Signup;
