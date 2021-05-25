import { Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import routes from '../../../../constants/routes';

const EvaluateComplete = ({ history }) => {
  const [count, setCount] = useState(5);
  // const { cid: competitionId } = useParams();
  // console.log('competitionId at Redirect:', competitionId);
  useEffect(() => {
    const interval = setTimeout(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    count === 0 && history.push(routes.HOME);
  }, [count]);
  return (
    <div className="container">
      <Result
        status="success"
        title="Bạn đã hoàn thành bài thí nghiệm"
        subTitle={<h6>Cảm ơn bạn tham gia đánh giá chất lượng giọng nói</h6>}
        extra={[<h5>Quay về cuộc thi trong {count}s</h5>]}
      />
    </div>
  );
};

export default EvaluateComplete;
