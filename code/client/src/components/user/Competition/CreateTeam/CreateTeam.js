import { RightOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import React from 'react';
import { toast } from 'react-toastify';
import { validateEmail } from '../../../../utils/validateString';

const CreateTeam = (props) => {
  const [form] = Form.useForm();

  const onFinish = async (form) => {
    const { name, emails } = form;
    props.onSubmitTeam({ name, emails });
  };

  return (
    <Card
      title={<h4>Bạn cần tạo đội để tham gia cuộc thi</h4>}
      style={{ marginTop: '3rem' }}
    >
      <Form
        labelCol={{ span: 5, offset: 0 }}
        wrapperCol={{ span: 16 }}
        name="team-creation"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          label="Tên đội"
          name="name"
          rules={[
            {
              required: true,
              message: 'Hãy nghĩ cho đội của bạn một cái tên',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="E-mail các thành viên" name="emails">
          <Input.TextArea placeholder="Nhập email của các thành viên cách nhau bởi dấu chấm phẩy, tối đa 8 thành viên" />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 10 }}>
          <Button type="default" htmlType="submit" icon={<RightOutlined />}>
            Xác nhận đội
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateTeam;
