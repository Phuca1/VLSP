import { Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import routes from '../../../../constants/routes';

const VerifySuccess = ({ history }) => {
  const [count, setCount] = useState(5);
  const { cid: competitionId } = useParams();
  console.log('competitionId at Redirect:', competitionId);
  useEffect(() => {
    const interval = setTimeout(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    count === 0 &&
      history.push(
        routes.COMPETITION_USER.replace('/:cid', `/${competitionId}`),
      );
  }, [count]);
  return (
    <div className="container">
      <Result
        status="success"
        title="Bạn đã thẩm định xong dữ liệu"
        subTitle="Cảm ơn bạn đã tham gia thẩm định dữ liệu, bạn đã có thể yêu cầu dữ liệu huấn luyện"
        extra={[<h5>Quay về cuộc thi trong {count}s</h5>]}
      />
    </div>
  );
};

export default VerifySuccess;
