import { Button, DatePicker, Form, Spin } from 'antd';
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RightOutlined } from '@ant-design/icons';
import apis from '../../../../../apis';
import { toast } from 'react-toastify';

const CreateTaskSubmission = (props) => {
  const { competition, reload, setReload } = props;
  const [form] = Form.useForm();
  const [submitDescription, setSubmitDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onCreateTaskSubmission = async (data) => {
    setIsLoading(true);
    try {
      const responseData = await apis.manager.createTaskSubmission({
        competitionId: competition.id,
        taskSubmissionInfo: {
          submitDescription: submitDescription,
          submitResultStartDate: new Date(
            data.submitResultStartDate + 1000 * 60 * 60 * 24,
          ).toISOString(),
          submitResultEndDate: new Date(
            data.submitResultEndDate + 1000 * 60 * 60 * 24,
          ).toISOString(),
        },
      });
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setReload(!reload);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Spin spinning={isLoading}>
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={onCreateTaskSubmission}
          form={form}
          name="create-task-submission"
        >
          <Form.Item name="submitDescription" label="Hướng dẫn nộp kết quả">
            <CKEditor
              editor={ClassicEditor}
              data={submitDescription}
              onReady={(editor) => {
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setSubmitDescription(data);
              }}
            />
          </Form.Item>

          <Form.Item
            name="submitResultStartDate"
            label="Ngày bắt đầu nộp kết quả"
            rules={[
              {
                required: true,
                message: 'Bạn cần nhập ngày vào',
              },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="submitResultEndDate"
            label="Ngày kết thúc nộp kết quả"
            rules={[
              {
                required: true,
                message: 'Bạn cần nhập ngày vào',
              },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 5, offset: 8 }}>
            <Button
              icon={<RightOutlined />}
              type="default"
              htmlType="submit"
              block={true}
              style={{ height: '45px' }}
            >
              Tạo công việc
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateTaskSubmission;
