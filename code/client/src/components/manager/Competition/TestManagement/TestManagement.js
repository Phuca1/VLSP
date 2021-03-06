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
    //   toast.error('Vui vui l??ng ki???m tra l???i d??? li???u b???n ???? nh???p');
    //   return;
    // }

    if (!file) {
      toast.error('H??y t???i l??n file zip');
      return;
    }

    if (file.fileList.length !== 1) {
      toast.error('Ch??? upload 1 file duy nh???t');
      return;
    }

    if (file.fileList[0].name.split('.')[1] !== 'zip') {
      toast.error('Ch??? ???????c ph??p upload file zip');
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
            T???o b??i th?? nghi???m
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
                T???o b??i th?? nghi???m n??y
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
                ????ng
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
                label="T??n b??i th?? nghi???m"
                rules={[
                  {
                    required: true,
                    message: 'H??y nh???p t??n b??i th?? nghi???m',
                  },
                ]}
              >
                <Input placeholder="ABC" />
              </Item>

              <Item
                name="type"
                label="Lo???i b??i th?? nghi???m"
                rules={[
                  {
                    required: true,
                    message: 'H??y ch???n lo???i b??i th?? nghi???m',
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
                label="Ch??? ?????nh truy c???p"
                rules={[
                  {
                    required: true,
                    message: 'H??y ch???n ch??? ?????nh try c???p',
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
                label="S??? l?????t th???m ?????nh t???i thi???u m???i audio"
                rules={[
                  {
                    required: true,
                    message: 'H??y ch???n ch??? ?????nh try c???p',
                  },
                ]}
              >
                <Input placeholder="10" />
              </Item> */}

              {access === 'public' && (
                <Item
                  name="numberOfTestSet"
                  label="S??? b??? test (v???i public test)"
                  rules={[
                    {
                      required: true,
                      message: 'H??y nh???p v??o s??? b??i test',
                    },
                  ]}
                >
                  <Input placeholder="10" />
                </Item>
              )}

              {access === 'private' && (
                <Item
                  name="emailUserList"
                  label="Ch??? ?????nh ng?????i tham gia (v???i private test)"
                  rules={[
                    {
                      required: true,
                      message: 'H??y nh???p email nh???ng ng?????i tham gia test',
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

              <Item label="T???i l??n d??? li???u file zip" name="file">
                <Upload customRequest={dummyReq}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Item>

              <Item
                label="Ng??y b???t ?????u th?? nghi???m"
                name="dateOpened"
                rules={[
                  {
                    required: true,
                    message: 'B???n c???n nh???p ng??y v??o',
                  },
                ]}
              >
                <DatePicker />
              </Item>

              <Item
                label="Ng??y b???t ?????u th?? nghi???m"
                name="dateClosed"
                rules={[
                  {
                    required: true,
                    message: 'B???n c???n nh???p ng??y v??o',
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
                  T???o b??i th?? nghi???m
                </Button>
              </Item>
            </Form>
          )}
        </div>
        {loadedTest && (
          <div>
            <h2 style={{ margin: '2rem 0 0 1rem' }}>
              Danh s??ch b??i th?? nghi???m
            </h2>
            <Table
              style={{ marginTop: '3rem' }}
              dataSource={loadedTest}
              columns={[
                {
                  title: 'T??n b??i th?? nghi???m',
                  dataIndex: 'name',
                },
                {
                  title: 'Ch??? ?????nh truy c???p',
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
                  title: 'Ph??n lo???i',
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
                  title: 'Xem chi ti???t',
                  render: (_, record) => {
                    return (
                      <Button
                        onClick={() => onViewTestDetailHandler(record.id)}
                      >
                        Xem chi ti???t
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
