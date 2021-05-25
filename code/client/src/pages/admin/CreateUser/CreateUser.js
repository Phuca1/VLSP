import React, { useState } from 'react';
import { Button, Form, Input, Radio, Space, Spin } from 'antd';
import apis from '../../../apis';
import { toast } from 'react-toastify';

const CreateUser = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const onCreateUserHandler = async (data) => {
    console.log(data);
    setIsLoading(true);
    try {
      const responseData = await apis.admin.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      if (responseData.status === 1) {
        toast.success(responseData.message);
        form.resetFields();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container" style={{ background: 'white' }}>
      <h1
        style={{
          textAlign: 'center',
          fontFamily: 'sans-serif',
          padding: '1rem 0 1rem 0',
        }}
      >
        Tạo tài khoản người dùng
      </h1>
      <Spin spinning={isLoading}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          onFinish={onCreateUserHandler}
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
                message: 'Hãy nhập tên người dùng vào',
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
                message: 'Hãy nhập E-mail người dùng vào',
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
            name="role"
            label="Vai trò"
            rules={[
              {
                required: true,
                message: 'Bạn cần đánh dấu vào',
              },
            ]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="user">Người dùng (user)</Radio>
                <Radio value="manager">Người quản lý (manager)</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 5, offset: 9 }}>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              style={{
                width: '300px',
                height: '45px',
                margin: '1rem 0 2rem 0',
              }}
            >
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateUser;
