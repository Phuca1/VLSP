import { RightOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Progress, Spin, Upload } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isInteger } from '../../../../../utils/validateString';
import apis from '../../../../../apis';
import axios from 'axios';
import { PUBLIC_DOMAIN } from '../../../../../configs';

const { Item } = Form;

const formInputLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const dummyReq = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const CreateTaskVerifyData = (props) => {
  const token = localStorage.getItem('token');
  const { competition, setReload, reload } = props;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState();

  const onFileChange = (event) => {
    console.log(event);
    // setSelectedFile(event.target.files)
  };

  const onCreateVerifyDataTask = async (data) => {
    console.log(data);
    const {
      audiosPerTeamToVerify,
      minVotesToAcceptAudio,
      verifyDataStartDate,
      verifyDataEndDate,
      audio,
      threshold,
    } = data;
    if (
      !(
        isInteger(audiosPerTeamToVerify) &&
        isInteger(minVotesToAcceptAudio) &&
        isInteger(threshold)
      )
    ) {
      toast.error('Hãy nhập các số chính xác');
      return;
    }
    if (threshold < 0 || threshold > 100) {
      toast.error('Ngưỡng phải lớn hơn 0 và bé hơn 100');
      return;
    }
    if (!audio) {
      toast.error('Hãy upload file zip audio');
      return;
    }
    if (audio.fileList.length > 1 || audio.fileList.length === 0) {
      toast.error('Chỉ up 1 file duy nhất');
      return;
    }
    if (audio.fileList[0].name.split('.')[1] !== 'zip') {
      toast.error('Hãy upload file zip');
      return;
    }

    const bodyData = new FormData();
    bodyData.append('competitionId', competition.id);
    bodyData.append(
      'verifyDataTaskInfo',
      JSON.stringify({
        audiosPerTeamToVerify,
        minVotesToAcceptAudio,
        verifyDataStartDate: verifyDataStartDate.toISOString(),
        verifyDataEndDate: verifyDataEndDate.toISOString(),
        threshold,
      }),
    );
    bodyData.append('audio', audio.fileList[0].originFileObj);
    // setIsLoading(true);
    try {
      // const responseData = await apis.manager.createTaskVerifyData(bodyData);
      const res = await axios.post(
        `${PUBLIC_DOMAIN}/api/competition/create-verification-task`,
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
      console.log(res);
      const responseData = res.data;
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setReload(!reload);
      } else {
        toast.error(responseData.message);
        setUploadPercentage(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setUploadPercentage(null);
    }
    // setIsLoading(false);
  };

  return (
    <div>
      <Spin spinning={isLoading}>
        <h2 style={{ textAlign: 'center', margin: '1rem 0 2rem 0' }}>
          Tạo công việc thẩm định dữ liệu
        </h2>
        <h6 style={{ textAlign: 'center', margin: '1rem 0 2rem 0' }}>
          Lưu ý: Hãy đảm bảo tất cả các đội đều đã đăng kí trước khi tạo công
          việc thẩm định dữ liệu
        </h6>
        <Form
          name="create_validation"
          {...formInputLayout}
          onFinish={onCreateVerifyDataTask}
          form={form}
        >
          <Item
            name="audiosPerTeamToVerify"
            label="Số audio mỗi đội phải thẩm định: "
            rules={[
              {
                required: true,
                message: 'Hãy nhập một số',
              },
            ]}
          >
            <Input />
          </Item>

          <Item
            name="minVotesToAcceptAudio"
            label="Số vote tối thiểu để chập nhận một audio:"
            rules={[
              {
                required: true,
                message: 'Hãy nhập vào số',
              },
            ]}
          >
            <Input />
          </Item>

          <Item
            name="threshold"
            label="Ngưỡng để đội vượt qua vòng thẩm định (%):"
            rules={[
              {
                required: true,
                message: 'Hãy nhập vào số',
              },
            ]}
          >
            <Input />
          </Item>

          <Item
            name="verifyDataStartDate"
            label="Ngày bắt đầu thẩm định:"
            rules={[
              {
                required: true,
                message: 'Hãy chọn một ngày',
              },
            ]}
          >
            <DatePicker />
          </Item>

          <Item
            name="verifyDataEndDate"
            label="Ngày kết thúc thẩm định:"
            rules={[
              {
                required: true,
                message: 'Hãy chọn một ngày',
              },
            ]}
          >
            <DatePicker />
          </Item>

          <Item label="Tải lên file zip audio" name="audio">
            <Upload
              name="file"
              customRequest={dummyReq}
              onChange={onFileChange}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Item>

          <h6 style={{ textAlign: 'center' }}>
            Lưu ý: Tải lên 1 file zip duy nhất chứa các file wav, các audio này
            sẽ được chia đều cho các đội để thẩm định
          </h6>

          {uploadPercentage && <Progress percent={uploadPercentage} />}

          <Item
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
          </Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateTaskVerifyData;
