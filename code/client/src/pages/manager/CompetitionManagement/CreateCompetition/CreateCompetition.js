import { RightOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Spin,
  Timeline,
} from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import routes from '../../../../constants/routes';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 10,
    },
    sm: {
      span: 4,
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
    sm: {
      span: 5,
      offset: 8,
    },
  },
};

const timelineOption = [
  'verifyData',
  'shareTrainingData',
  'submitResult',
  'test',
  'submitReport',
];

const CreateCompetition = ({ history }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [rules, setRules] = useState('');

  const onSubmitHandler = async (form) => {
    console.log(form);
    const timeline = {};
    for (const val of timelineOption) {
      timeline[val] = form.timeline.includes(val);
    }
    // console.log(timeline);
    setIsLoading(true);
    try {
      const responseData = await apis.manager.createCompetition({
        name: form.name,
        rules: rules,
        timeline: timeline,
        joinCompetitionStartDate: new Date(
          form.joinCompetitionStartDate,
        ).toISOString(),
        joinCompetitionEndDate: new Date(
          form.joinCompetitionEndDate,
        ).toISOString(),
      });
      if (responseData.status === 1) {
        toast.success(responseData.message);
        const route = routes.COMPETITION_MANAGER.replace(
          '/:cid',
          `/${responseData.competition.id}`,
        );
        history.push(route);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mt-5" style={{ background: 'white' }}>
      <Spin spinning={isLoading}>
        <h1
          style={{
            paddingTop: '1rem',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          Tạo chiến dịch
        </h1>
        <Form
          {...formItemLayout}
          onFinish={onSubmitHandler}
          form={form}
          style={{ marginTop: '2rem' }}
        >
          <Item
            name="name"
            label="Tên chiến dịch"
            rules={[
              {
                required: true,
                message: 'Hãy nhập tên chiến dịch',
              },
            ]}
          >
            <Input />
          </Item>

          <Item name="rules" label="Thể lệ">
            {/* <Input.TextArea autoSize={{ minRows: 5 }} /> */}
            <CKEditor
              editor={ClassicEditor}
              data={rules}
              onReady={(editor) => {
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setRules(data);
              }}
            />
          </Item>

          <Item name="timeline" label="chiến dịch bao gồm:">
            <Checkbox.Group>
              <Timeline>
                <Timeline.Item>
                  <Checkbox value="verifyData">Thẩm định dữ liệu</Checkbox>
                </Timeline.Item>
                <Timeline.Item>
                  <Checkbox value="shareTrainingData">
                    Chia sẻ dữ liệu huấn luyện
                  </Checkbox>
                </Timeline.Item>
                <Timeline.Item>
                  <Checkbox value="submitResult">Nộp bài</Checkbox>
                </Timeline.Item>
                <Timeline.Item>
                  <Checkbox value="test">Thí nghiệm kết quả</Checkbox>
                </Timeline.Item>
                <Timeline.Item>
                  <Checkbox value="submitReport">Nộp báo cáo</Checkbox>
                </Timeline.Item>
              </Timeline>
            </Checkbox.Group>
          </Item>

          <Item
            name="joinCompetitionStartDate"
            label="Ngày mở đăng kí"
            rules={[
              {
                required: true,
                message: 'Hãy nhập ngày mở đăng kí',
              },
            ]}
          >
            <DatePicker />
          </Item>

          <Item
            name="joinCompetitionEndDate"
            label="Ngày kết thúc đăng kí"
            rules={[
              {
                required: true,
                message: 'Hãy nhập ngày kết thúc đăng kí',
              },
            ]}
          >
            <DatePicker />
          </Item>
          <Item {...tailFormItemLayout}>
            <Button
              icon={<RightOutlined />}
              type="default"
              htmlType="submit"
              block={true}
              style={{ height: '45px', marginBottom: '2rem' }}
            >
              Tạo chiến dịch
            </Button>
          </Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateCompetition;
