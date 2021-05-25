import { RightOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Progress, Upload } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PUBLIC_DOMAIN } from '../../../../../configs';

const dummyReq = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const ShareData = (props) => {
  const token = localStorage.getItem('token');
  const { competition, reload, setReload } = props;
  const [form] = Form.useForm();
  const [uploadPercentage, setUploadPercentage] = useState();

  const onShareDataHandler = async (form) => {
    console.log(form);
    if (!form.data) {
      toast.error('Hãy upload file zip audio');
      return;
    }
    if (form.data.fileList.length !== 1) {
      toast.error('Chỉ upload 1 file zip duy nhất');
      return;
    }
    if (form.data.fileList[0].type !== 'application/zip') {
      toast.error('Dữ liệu chỉ được upload file zip');
      return;
    }

    if (!form.commitmentTemplate) {
      toast.error('Hãy upload bản cam kết pdf');
      return;
    }
    if (form.commitmentTemplate.fileList.length !== 1) {
      toast.error('Chỉ upload 1 file pdf duy nhất');
      return;
    }
    if (form.commitmentTemplate.fileList[0].type !== 'application/pdf') {
      toast.error('Bản cam kết chỉ được upload file pdf');
      return;
    }

    const bodyData = new FormData();
    bodyData.append('data', form.data.fileList[0].originFileObj);
    bodyData.append(
      'commitmentTemplate',
      form.commitmentTemplate.fileList[0].originFileObj,
    );
    bodyData.append('competitionId', competition.id);
    bodyData.append('dataDescription', form.dataDescription);
    try {
      // const responseData = await apis.manager.shareData(bodyData);
      const res = await axios.post(
        `${PUBLIC_DOMAIN}/api/competition/share-data`,
        bodyData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total),
              ),
            );
          },
        },
      );
      const responseData = res.data;
      // console.log(res);
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setReload(!reload);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    setUploadPercentage(null);
  };

  return (
    <Form
      labelCol={{ span: 6, offset: 0 }}
      wrapperCol={{ span: 18, offset: 0 }}
      style={{ marginTop: '1rem' }}
      form={form}
      name="share-data"
      onFinish={onShareDataHandler}
    >
      <Form.Item name="dataDescription" label="Mô tả dữ liệu" initialValue="">
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Tải lên file zip dữ liệu huấn luyện" name="data">
        <Upload name="file" customRequest={dummyReq}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Tải lên bản pdf mẫu cam kết" name="commitmentTemplate">
        <Upload name="file" customRequest={dummyReq}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      {uploadPercentage && <Progress percent={uploadPercentage} />}

      <Form.Item
        labelCol={{ span: 16, offset: 1 }}
        wrapperCol={{ span: 5, offset: 9 }}
      >
        <Button
          icon={<RightOutlined />}
          type="default"
          htmlType="submit"
          block={true}
          style={{ height: '45px', marginTop: '3rem' }}
        >
          Tạo công việc
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ShareData;
