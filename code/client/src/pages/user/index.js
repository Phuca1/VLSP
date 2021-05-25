import { Divider, List, Card, Spin } from 'antd';
import Moment from 'react-moment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apis from '../../apis';
import routes from '../../constants/routes';

const User = (props) => {
  const [publicTest, setPublicTest] = useState();
  const [privateTest, setPrivateTest] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const fetchTest = async () => {
      setIsLoading(true);
      const responseData1 = await apis.user.getAllPublicTest();
      console.log('public test info: ', responseData1);
      if (responseData1.status === 1) {
        setPublicTest(responseData1.tests);
      } else {
        toast.warn('Không tìm thấy bài thí nghiệm mở');
      }

      const responseData2 = await apis.user.getPrivateTestsForUser(user.id);
      console.log('private test info: ', responseData2);
      if (responseData1.status === 1) {
        setPrivateTest(responseData2.tests);
      } else {
        toast.warn('Không tìm thấy bài thí nghiệm cá nhận');
      }
      setIsLoading(false);
    };
    fetchTest();
  }, []);

  return (
    <div className="container">
      <Spin spinning={isLoading}>
        {publicTest && privateTest && (
          <Card
            style={{ marginTop: '30px', fontSize: '30px' }}
            title={<h4>Các thí nghiệm cần thực hiện</h4>}
          >
            <List
              header={<h6>Các bài thí nghiệm mở</h6>}
              bordered
              dataSource={publicTest}
              renderItem={(item) => {
                let isJoined = false;
                if (item.joinedUser.includes(user.id)) {
                  isJoined = true;
                }
                const buttonText = isJoined
                  ? 'Vào thẩm định'
                  : 'Tham gia thẩm định';
                return (
                  <List.Item
                    actions={[
                      <Link
                        to={routes.START_EVALUATE_AUDIO.replace(
                          '/:testId',
                          `/${item.id}`,
                        )}
                      >
                        {buttonText}
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<h5>{item.name}</h5>}
                      description={`${moment(item.dateOpened).format(
                        'YYYY-MM-DD',
                      )} -
                      ${moment(item.dateClosed).format('YYYY-MM-DD')}`}
                    />
                  </List.Item>
                );
              }}
            />
            <Divider />
            <List
              header={<h6>Các bài thí nghiệm cá nhân</h6>}
              bordered
              dataSource={privateTest}
              renderItem={(item) => {
                let isJoined = false;
                if (item.joinedUser.includes(user.id)) {
                  isJoined = true;
                }
                const buttonText = isJoined
                  ? 'Vào thẩm định'
                  : 'Tham gia thẩm định';
                return (
                  <List.Item
                    actions={[
                      <Link
                        to={routes.START_EVALUATE_AUDIO.replace(
                          '/:testId',
                          `/${item.id}`,
                        )}
                      >
                        {buttonText}
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<h5>{item.name}</h5>}
                      description={`${moment(item.dateOpened).format(
                        'YYYY-MM-DD',
                      )} -
                      ${moment(item.dateClosed).format('YYYY-MM-DD')}`}
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        )}
        <Card
          title={<h4>Công việc thẩm định dữ liệu</h4>}
          style={{ marginTop: '3rem' }}
        >
          <List bordered />
        </Card>
      </Spin>
    </div>
  );
};

export default User;
