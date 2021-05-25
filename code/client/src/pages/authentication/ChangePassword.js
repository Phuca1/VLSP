import React, { useState } from 'react';

import { Button, Form, Input, Spin } from 'antd';
import api from '../../apis';
import './Login.scss';
import routes from '../../constants/routes';
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
      offset: 8,
    },
  },
};

const ChangePassword = ({ history }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinishHandler = async (form) => {
    console.log('submitted ', form);
    const { password, newPassword } = form;
    setIsLoading(true);
    try {
      const responseData = await api.auth.changePassword(password, newPassword);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        history.push(routes.HOME);
      } else {
        console.log(responseData);
        toast.error(responseData.message);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  return (
    <div className="change-password-form" style={{ marginTop: '100px' }}>
      <Spin spinning={isLoading}>
        <Form
          {...formItemLayout}
          onFinish={onFinishHandler}
          form={form}
          name="login"
        >
          <Form.Item
            name="password"
            label="Old password"
            rules={[
              {
                required: true,
                message: 'Please enter your old password',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New password"
            rules={[
              {
                required: true,
                message: 'Please enter your new password',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Two password you entered do not match!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default ChangePassword;
