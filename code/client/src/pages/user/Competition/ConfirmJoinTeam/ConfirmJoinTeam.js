import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import React from 'react';

import { useParams } from 'react-router';
import { toast } from 'react-toastify';

import api from '../../../../apis';
import routes from '../../../../constants/routes';

const ConfirmJoinTeam = ({ history }) => {
  const { token } = useParams();
  // console.log(token);

  const onAcceptHandler = async () => {
    try {
      const responseData = await api.user.confirmJoinTeam({ token });
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        history.push(routes.HOME);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onCanelHandler = () => {};

  return (
    <div className="container">
      <Row style={{ marginTop: '2rem' }}>
        <h2>Bạn có chấp nhận đồng ý vào đội:</h2>
      </Row>
      <Row style={{ marginTop: '4rem' }}>
        <div className="container-fluid" style={{ textAlign: 'center' }}>
          <Button
            icon={<CheckOutlined />}
            type="primary"
            style={{ display: 'inline-block', height: '60px', width: '600px' }}
            onClick={onAcceptHandler}
          >
            Chấp nhận
          </Button>
        </div>
      </Row>
      <Row style={{ marginTop: '2rem' }}>
        <div className="container-fluid" style={{ textAlign: 'center' }}>
          <Button
            icon={<CloseOutlined />}
            style={{ display: 'inline-block', height: '60px', width: '600px' }}
            onClick={onCanelHandler}
          >
            Từ chối
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default ConfirmJoinTeam;
