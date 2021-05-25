import { Button, DatePicker, Form, Spin } from 'antd';
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RightOutlined } from '@ant-design/icons';
import apis from '../../../../../apis';
import { toast } from 'react-toastify';

const CreateTaskSubmitReport = (props) => {
  const { competition, reload, setReload } = props;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onCreateTaskSubmitReport = async (data) => {
    // console.log(data.submitReportEndDate);
    setIsLoading(true);
    try {
      const responseData = await apis.manager.createTaskSubmitReport({
        competitionId: competition.id,
        taskSubmitResultInfo: {
          submitReportStartDate: new Date(
            data.submitReportStartDate + 1000 * 60 * 60 * 24,
          ).toISOString(),
          submitReportEndDate: new Date(
            data.submitReportEndDate + 1000 * 60 * 60 * 24,
          ).toISOString(),
        },
      });
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setIsLoading(false);
        setReload(!reload);
      } else {
        setIsLoading(false);
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <Spin spinning={isLoading}>
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={onCreateTaskSubmitReport}
          form={form}
        >
          <Form.Item
            name="submitReportStartDate"
            label="Ngày bắt đầu nộp báo cáo"
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
            name="submitReportEndDate"
            label="Ngày kết thúc nộp báo cáo"
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
              Tạo công việc nộp báo cáo
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateTaskSubmitReport;
