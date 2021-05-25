import { RightOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Row,
  Spin,
  Select,
  Table,
  Upload,
  DatePicker,
  Col,
  Progress,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import routes from '../../../../constants/routes';
import axios from 'axios';
import { PUBLIC_DOMAIN } from '../../../../configs';

const { Item } = Form;

const dummyReq = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const TestManagement = (props) => {
  const token = localStorage.getItem('token');
  const { competition } = props;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTest, setLoadedTest] = useState();
  const [candidates, setCandidates] = useState();
  const [access, setAccess] = useState();
  const [update, setUpdate] = useState(false);
  const createTestContainer = useRef();
  const history = useHistory();
  const [uploadPercentage, setUploadPercentage] = useState();

  useEffect(() => {
    const fetchTestAndCandidate = async () => {
      setIsLoading(true);
      try {
        const responseData = await apis.manager.getTestsInCompetition(
          competition.id,
        );
        if (responseData.status === 1) {
          setLoadedTest(responseData.tests);
        } else {
          toast.error(responseData.message);
        }
        const responseData2 = await apis.manager.getUserDoNotJoinCompetition(
          competition.id,
        );
        console.log('candidate', responseData2);
        if (responseData2.status === 1) {
          setCandidates(responseData2.candidates);
        } else {
          toast.error(responseData2.message);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchTestAndCandidate();
  }, [competition, update]);

  const onShowCreateTest = () => {
    createTestContainer.current.style.display = 'block';
  };

  const onHideCreateTest = () => {
    createTestContainer.current.style.display = 'none';
  };

  const onCreateTestSubmit = async (data) => {
    const {
      name,
      type,
      file,
      access,
      // usersListenPerAudio,
      numberOfTestSet,
      emailUserList,
      dateOpened,
      dateClosed,
    } = data;

    // if (!isInteger(usersListenPerAudio)) {
    //   toast.error('Vui vui lòng kiểm tra lại dữ liệu bạn đã nhập');
    //   return;
    // }

    if (!file) {
      toast.error('Hãy tải lên file zip');
      return;
    }

    if (file.fileList.length !== 1) {
      toast.error('Chỉ upload 1 file duy nhất');
      return;
    }

    if (file.fileList[0].name.split('.')[1] !== 'zip') {
      toast.error('Chỉ được phép upload file zip');
      return;
    }

    console.log(data);
    const bodyData = new FormData();
    bodyData.append('name', name);
    bodyData.append('type', type);
    bodyData.append('access', access);
    bodyData.append('competitionId', competition.id);
    // bodyData.append('usersListenPerAudio', usersListenPerAudio);
    bodyData.append('dateOpened', dateOpened);
    bodyData.append('dateClosed', dateClosed);
    bodyData.append('data', file.fileList[0].originFileObj);

    if (access === 'public') {
      bodyData.append('numberOfTestSet', numberOfTestSet);
    }
    if (access === 'private') {
      bodyData.append('userIdList', emailUserList);
    }

    try {
      // const responseData = await apis.manager.createTestLatinSquare(bodyData);
      const res = await axios.post(
        `${PUBLIC_DOMAIN}/api/test/create-latin-square`,
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
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        onHideCreateTest();
        form.resetFields();
        setUpdate(!update);
      } else {
        toast.error(responseData.message);
      }
      setUploadPercentage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const onPickAccessForCompetition = (data) => {
    if (data === 'public') {
      setAccess('public');
    }
    if (data === 'private') {
      setAccess('private');
    }
  };

  const onViewTestDetailHandler = (testId) => {
    history.push(routes.VIEW_TEST_DETAIL.replace('/:testId', `/${testId}`));
  };

  return (
    <div className="mt-3" style={{ background: 'white' }}>
      <Spin spinning={isLoading}>
        <Row justify="end">
          <Button
            type="primary"
            shape="round"
            style={{ marginRight: '8rem' }}
            onClick={onShowCreateTest}
          >
            Tạo bài thí nghiệm
          </Button>
        </Row>

        <div ref={createTestContainer} style={{ display: 'none' }}>
          <Row>
            <Col span={10}>
              <h2
                style={{
                  marginLeft: '2rem',
                  fontFamily: 'cursive',
                  paddingTop: '2rem',
                }}
              >
                Tạo bài thí nghiệm này
              </h2>
            </Col>
            <Col span={10} />
            <Col span={2}>
              <Button
                icon={<CloseOutlined />}
                shape="round"
                style={{ marginTop: '35px' }}
                onClick={onHideCreateTest}
                type="ghost"
              >
                Đóng
              </Button>
            </Col>
          </Row>

          {candidates && (
            <Form
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 17 }}
              onFinish={onCreateTestSubmit}
              name="create-competition"
              form={form}
              style={{ paddingTop: '2rem' }}
            >
              <Item
                name="name"
                label="Tên bài thí nghiệm"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập tên bài thí nghiệm',
                  },
                ]}
              >
                <Input placeholder="ABC" />
              </Item>

              <Item
                name="type"
                label="Loại bài thí nghiệm"
                rules={[
                  {
                    required: true,
                    message: 'Hãy chọn loại bài thí nghiệm',
                  },
                ]}
                initialValue="MOS"
              >
                <Select defaultValue="MOS" disabled>
                  <Select.Option value="MOS">MOS test</Select.Option>
                  <Select.Option value="transcript">
                    Transcript test
                  </Select.Option>
                </Select>
              </Item>

              <Item
                name="access"
                label="Chỉ định truy cập"
                rules={[
                  {
                    required: true,
                    message: 'Hãy chọn chỉ định try cập',
                  },
                ]}
              >
                <Select
                  placeholder="Public test"
                  onChange={onPickAccessForCompetition}
                >
                  <Select.Option value="public">Public test</Select.Option>
                  <Select.Option value="private">Private test</Select.Option>
                </Select>
              </Item>

              {/* <Item
                name="usersListenPerAudio"
                label="Số lượt thẩm định tối thiểu mỗi audio"
                rules={[
                  {
                    required: true,
                    message: 'Hãy chọn chỉ định try cập',
                  },
                ]}
              >
                <Input placeholder="10" />
              </Item> */}

              {access === 'public' && (
                <Item
                  name="numberOfTestSet"
                  label="Số bộ test (với public test)"
                  rules={[
                    {
                      required: true,
                      message: 'Hãy nhập vào số bài test',
                    },
                  ]}
                >
                  <Input placeholder="10" />
                </Item>
              )}

              {access === 'private' && (
                <Item
                  name="emailUserList"
                  label="Chỉ định người tham gia (với private test)"
                  rules={[
                    {
                      required: true,
                      message: 'Hãy nhập email những người tham gia test',
                    },
                  ]}
                >
                  <Select mode="multiple">
                    {candidates.map((user) => {
                      return (
                        <Select.Option value={user.id}>
                          {user.email}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Item>
              )}

              <Item label="Tải lên dữ liệu file zip" name="file">
                <Upload customRequest={dummyReq}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Item>

              <Item
                label="Ngày bắt đầu thí nghiệm"
                name="dateOpened"
                rules={[
                  {
                    required: true,
                    message: 'Bạn cần nhập ngày vào',
                  },
                ]}
              >
                <DatePicker />
              </Item>

              <Item
                label="Ngày bắt đầu thí nghiệm"
                name="dateClosed"
                rules={[
                  {
                    required: true,
                    message: 'Bạn cần nhập ngày vào',
                  },
                ]}
              >
                <DatePicker />
              </Item>

              {uploadPercentage && <Progress percent={uploadPercentage} />}

              <Item wrapperCol={{ span: 5, offset: 8 }}>
                <Button
                  icon={<RightOutlined />}
                  type="default"
                  htmlType="submit"
                  block={true}
                  style={{ height: '45px', marginBottom: '2rem' }}
                >
                  Tạo bài thí nghiệm
                </Button>
              </Item>
            </Form>
          )}
        </div>
        {loadedTest && (
          <div>
            <h2 style={{ margin: '2rem 0 0 1rem' }}>
              Danh sách bài thí nghiệm
            </h2>
            <Table
              style={{ marginTop: '3rem' }}
              dataSource={loadedTest}
              columns={[
                {
                  title: 'Tên bài thí nghiệm',
                  dataIndex: 'name',
                },
                {
                  title: 'Chỉ định truy cập',
                  dataIndex: 'access',
                  render: (item) => {
                    if (item === 'public') {
                      return 'Public test';
                    } else if (item === 'private') {
                      return 'Private test';
                    } else {
                      return null;
                    }
                  },
                },
                {
                  title: 'Phân loại',
                  dataIndex: 'type',
                  render: (type) => {
                    if (type === 'MOS') {
                      return 'MOS test';
                    }
                    if (type === 'transcript') {
                      return 'Transcript test';
                    }
                    return '';
                  },
                },
                {
                  title: 'Xem chi tiết',
                  render: (_, record) => {
                    return (
                      <Button
                        onClick={() => onViewTestDetailHandler(record.id)}
                      >
                        Xem chi tiết
                      </Button>
                    );
                  },
                },
              ]}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default TestManagement;
