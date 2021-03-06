import React, { useEffect, useState } from 'react';
import { Spin, Button, Form, Input, Card, Select } from 'antd';
import { useParams } from 'react-router';
import api from '../../../../apis';

import CompetitionInformation from '../../../../components/user/Competition/CompetitionInformation/CompetitionInformation';

import { toast } from 'react-toastify';
import { RightOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import types from '../../../../constants/types';
import routes from '../../../../constants/routes';

const RegisterCompetition = ({ history }) => {
  const { cid: competitionId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedCompetition, setLoadedCompetition] = useState();
  const [loadedAllEmails, setLoadedAllEmails] = useState();
  const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCompetition = async () => {
      setIsLoading(true);
      try {
        const responseData = await api.user.getCompetitionById({
          competitionId,
        });
        console.log('competition info', responseData);
        if (responseData.status === 1) {
          setLoadedCompetition(responseData.competition);
        } else {
          toast.error(responseData.message);
        }

        const responseData2 = await api.user.getAllUserEmails();
        console.log('all emails data ', responseData2);
        if (responseData2.status === 1) {
          setLoadedAllEmails(responseData2.listEmails);
        } else {
          toast.error(responseData2.message);
        }

        setIsLoading(false);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchCompetition();
  }, [competitionId]);

  const onRegisterCompetition = async (data) => {
    console.log(data);
    let { name, emails: listEmail } = data;
    // console.log('list email', listEmail);
    if (!listEmail) {
      listEmail = [];
    }
    if (listEmail.length > 7) {
      toast.error('M???i ?????i kh??ng ???????c c?? qu?? 8 ng?????i');
      return;
    }

    setIsLoading(true);

    const emailsString = listEmail.join(';').toString();

    try {
      const responseData = await api.user.verifyListEmails(
        emailsString,
        competitionId,
      );
      if (responseData.status === 1) {
        // toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.message);
      return;
    }

    try {
      const responseData = await api.user.createTeam({
        competitionId: loadedCompetition.id,
        teamInfo: {
          name: name,
          emailsString: emailsString,
          leaderId: user.id,
        },
      });
      console.log('create team info:', responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        const currentUser = await api.user.getUserById(user.id);
        if (currentUser.status === 1) {
          dispatch({
            type: types.UPDATE_USER,
            payload: {
              user: currentUser.user,
            },
          });
        } else {
          toast.error(currentUser.message);
        }
        history.push(routes.HOME);
      } else {
        toast.error(responseData.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <Spin spinning={isLoading}>
        {!isLoading && loadedCompetition && loadedAllEmails && (
          <CompetitionInformation loadedCompetition={loadedCompetition} />
        )}

        {!isLoading && loadedCompetition && (
          <Card
            title={<h4>B???n c???n t???o ?????i ????? tham gia cu???c thi</h4>}
            style={{ marginTop: '3rem' }}
          >
            <Form
              labelCol={{ span: 5, offset: 0 }}
              wrapperCol={{ span: 16 }}
              name="team-creation"
              onFinish={onRegisterCompetition}
              form={form}
            >
              <Form.Item
                label="T??n ?????i"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'H??y ngh?? cho ?????i c???a b???n m???t c??i t??n',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="E-mail c??c th??nh vi??n" name="emails">
                <Select
                  mode="multiple"
                  placeholder="Nh???p email c??c th??nh vi??n"
                  listHeight={200}
                >
                  {loadedAllEmails.map((email) => {
                    return <Select.Option value={email}>{email}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
              <h6 style={{ textAlign: 'center' }}>
                <strong>L??u ??:</strong> Nh???p email c??c th??nh vi??n c??ch nhau b???i
                d???u ch???m ph???y, m???i ?????i t???i ??a 8 th??nh vi??n, kh??ng c???n nh???p email
                c???a ?????i tr?????ng.
              </h6>
              <Form.Item wrapperCol={{ span: 16, offset: 9 }}>
                <Button
                  type="default"
                  htmlType="submit"
                  icon={<RightOutlined />}
                  style={{
                    width: 200,
                    height: 50,
                    marginTop: '3rem',
                  }}
                >
                  ????ng k?? tham gia
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        <div
          className="container"
          style={{ display: 'flex', marginTop: '3rem' }}
        ></div>
      </Spin>
    </div>
  );
};

export default RegisterCompetition;

{
  /* <div className="container mt-5">
      <Spin spinning={isLoading}>
        {!isLoading && loadedCompetition && loadedAllEmails && (
          <CompetitionInformation loadedCompetition={loadedCompetition} />
        )}

        {!isLoading && loadedCompetition && (
          <Card
            title={<h4>B???n c???n t???o ?????i ????? tham gia cu???c thi</h4>}
            style={{ marginTop: '3rem' }}
          >
            <Form
              labelCol={{ span: 5, offset: 0 }}
              wrapperCol={{ span: 16 }}
              name="team-creation"
              onFinish={onRegisterCompetition}
              form={form}
            >
              <Form.Item
                label="T??n ?????i"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'H??y ngh?? cho ?????i c???a b???n m???t c??i t??n',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="E-mail c??c th??nh vi??n" name="emails">
                <Input.TextArea placeholder="Nh???p email c???a c??c th??nh vi??n c??ch nhau b???i d???u ch???m ph???y" />
              </Form.Item>
              <h6 style={{ textAlign: 'center' }}>
                <strong>L??u ??:</strong> Nh???p email c??c th??nh vi??n c??ch nhau b???i
                d???u ch???m ph???y, m???i ?????i t???i ??a 8 th??nh vi??n, kh??ng c???n nh???p email
                c???a ?????i tr?????ng.
              </h6>
              <Form.Item wrapperCol={{ span: 16, offset: 10 }}>
                <Button
                  type="default"
                  htmlType="submit"
                  icon={<RightOutlined />}
                  style={{
                    width: 200,
                    height: 50,
                    marginTop: '3rem',
                  }}
                >
                  ????ng k?? tham gia
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        <div
          className="container"
          style={{ display: 'flex', marginTop: '3rem' }}
        ></div>
      </Spin>
    </div> */
}
