import React, { useState } from 'react';

import { Spin, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import api from '../../apis';

import './UserInformation.scss';
import { toast } from 'react-toastify';
import routes from '../../constants/routes';
import types from '../../constants/types';

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

const UserInformation = ({ history }) => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => ({ ...state.auth }));
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinishHandler = async (form) => {
    const { name, job } = form;
    setIsLoading(true);
    try {
      const res = await api.user.updateUser(name, job);
      if (res.status === 1) {
        console.log(res);

        dispatch({
          type: types.UPDATE_USER,
          payload: {
            user: res.user,
          },
        });
        toast.success('Update user success');
        history.push(routes.HOME);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="update-form">
      <Spin spinning={isLoading}>
        <Form
          {...formItemLayout}
          onFinish={onFinishHandler}
          form={form}
          name="update"
        >
          <Form.Item
            name="name"
            label="Username"
            rules={[
              {
                type: 'string',
                message: 'Input is not a valid name',
              },
              {
                required: true,
                message: 'Please enter your name',
              },
            ]}
            initialValue={user.name}
          >
            <Input defaultValue={user.name} />
          </Form.Item>

          <Form.Item name="email" label="E-mail" initialValue={user.email}>
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="job"
            label="Job"
            initialValue={user.job}
            rules={[
              {
                required: true,
                message: 'Please enter your job',
              },
            ]}
          >
            <Input defaultValue={user.job} />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Update information
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default UserInformation;
