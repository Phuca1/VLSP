import { CheckOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  List,
  Radio,
  Row,
  Space,
  Spin,
  Tooltip,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../apis';
import { PUBLIC_DOMAIN } from '../../../configs';
import routes from '../../../constants/routes';

const options = [
  {
    id: 1,
    point: 5,
    text: '5 điểm - Rất tự nhiên, giống như giọng người thật.',
    tooltip:
      'Bạn hãy cho mức điểm này nếu tiếng nói nghe được rất tự nhiên, nghe giống như giọng người thu âm, không nghe thấy yếu tố nhân tạo trong đó. Có thể dùng giọng này để trao đổi, tương tác như tương tác với người.',
  },
  {
    id: 2,
    point: 4,
    text: '4 điểm - Tương đối tự nhiên, khá giống giọng người thật',
    tooltip:
      'Bạn hãy cho mức điểm này nếu tiếng nói nghe được khá tự nhiên và khá giống giọng người thu âm, có một chút yếu tố nhân tạo nhưng không đáng kể. Có thể dùng giọng này để trao đổi, tương tác được mặc dù có đôi chỗ còn chưa hoàn hảo.',
  },
  {
    id: 3,
    point: 3,
    text: '3 điểm - Hơi tự nhiên, khá nhiều yếu tố nhân tạo',
    tooltip:
      'Bạn hãy cho mức điểm này nếu tiếng nói nghe được có thể hiểu và có thể dùng để giao tiếp nhưng còn khá nhiều yếu tố nhân tạo.',
  },
  {
    id: 4,
    point: 2,
    text: '2 điểm - Kém tự nhiên, rất nhiều yếu tố nhân tạo',
    tooltip:
      'Bạn hãy cho mức điểm này nếu tiếng nói nghe được còn kém tự nhiên và có rất nhiều yếu tố nhân tạo. Để giao tiếp với tiếng nói này thì đôi chỗ còn khó nghe.',
  },
  {
    id: 5,
    point: 1,
    text: '1 điểm - Rất kém tự nhiên, hoàn toàn nhân tạo',
    tooltip:
      'Bạn hãy cho mức điểm này nếu tiếng nói nghe được rất kém tự nhiên và khó dùng để giao tiếp. Tiếng nói hoàn toàn nhân tạo và nhiều chỗ còn khó nghe.',
  },
];

const EvaluateAudio = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { uitId: userInTestId } = useParams();
  const [userInTest, setUserInTest] = useState();
  const [loadedListAudio, setLoadedListAudio] = useState();
  const [currentAudio, setCurrentAudio] = useState();
  const [currentAudioIndex, setCurrentAudioIndex] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [point, setPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilledForm, setIsFilledForm] = useState(false);
  const [reload, setReload] = useState(false);
  const [loadAudio, setLoadAudio] = useState(false);

  const audio = useRef();
  const itemPerPage = 8;

  useEffect(() => {
    const fetchUserInTest = async () => {
      setIsLoading(true);
      try {
        const responseData = await apis.user.getUserInTestById(userInTestId);
        console.log('user in test info: ', responseData);
        if (responseData.status === 1) {
          const audioToEvaluate = responseData.userInTest.audioToEvaluate;
          if (
            audioToEvaluate.filter((el) => el.evaluated).length ===
            audioToEvaluate.length
          ) {
            setIsLoading(false);
            history.push(routes.USER_EVALUATE_COMPLETE);
          }

          setUserInTest(responseData.userInTest);
          const listAudios = responseData.userInTest.audioToEvaluate.sort(
            (a, b) => a.index - b.index,
          );
          const audioIndex = listAudios.findIndex(
            (audio) => audio.evaluated === false,
          );
          setLoadedListAudio(listAudios);
          setCurrentAudioIndex(audioIndex);
          setCurrentPage(Math.floor(audioIndex / itemPerPage) + 1);
          const responseData2 = await apis.user.getAudioInTestById(
            listAudios[audioIndex].audioInTest,
          );
          console.log('audio in test info: ', responseData2);
          if (responseData2.status === 1) {
            setCurrentAudio(responseData2.audioInTest);
          } else {
            toast.error(responseData2.message);
          }
        } else {
          toast.error(responseData.message);
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
      setLoadAudio(!loadAudio);
    };

    fetchUserInTest();
  }, [userInTestId, reload]);

  useEffect(() => {
    if (!isLoading && loadedListAudio && currentPage) {
      audio.current.load();
    }
  }, [loadAudio]);

  const selectAudioHandler = async (index) => {
    const pickedAudio = loadedListAudio[index];
    setIsLoading(true);
    try {
      const responseData = await apis.user.getAudioInTestById(
        pickedAudio.audioInTest,
      );
      console.log('audio in test info: ', responseData);
      if (responseData.status === 1) {
        setCurrentAudio(responseData.audioInTest);
        setCurrentAudioIndex(index);
        if (loadedListAudio[index].evaluated) {
          setPoint(
            responseData.audioInTest.users.find(
              (el) => el.userId.toString() === user.id,
            ).point,
          );
        } else {
          setPoint(null);
        }
        setIsFilledForm(false);
        setLoadAudio(!loadAudio);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onNextAudioHandler = async () => {
    const nextAudio = loadedListAudio[currentAudioIndex + 1];
    setIsLoading(true);
    try {
      const responseData = await apis.user.getAudioInTestById(
        nextAudio.audioInTest,
      );
      console.log('audio in test info: ', responseData);
      if (responseData.status === 1) {
        setCurrentAudio(responseData.audioInTest);
        setCurrentAudioIndex(currentAudioIndex + 1);
        setPoint(null);
        setCurrentPage(Math.floor((currentAudioIndex + 1) / itemPerPage) + 1);
        audio.current.load();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onBackAudioHandler = async () => {
    const nextAudio = loadedListAudio[currentAudioIndex - 1];
    try {
      const responseData = await apis.user.getAudioInTestById(
        nextAudio.audioInTest,
      );
      console.log('audio in test info: ', responseData);
      if (responseData.status === 1) {
        setCurrentAudio(responseData.audioInTest);
        setCurrentAudioIndex(currentAudioIndex - 1);
        setCurrentPage(Math.floor((currentAudioIndex - 1) / itemPerPage) + 1);
        setPoint(null);
        audio.current.load();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitHandler = async () => {
    if (!point) {
      toast.error('Hãy điền vào form');
      return;
    }
    setIsLoading(true);
    try {
      const responseData = await apis.user.updateEvaluatingAudioInMOSTest({
        userId: user.id,
        audioInTestId: currentAudio.id,
        userInTestId: userInTestId,
        point: point,
      });
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setPoint(null);
        setIsFilledForm(false);
        setReload(!reload);
      } else {
        setIsLoading(false);
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Đã xảy ra lỗi, vui lòng thử lại');
    }
  };

  console.log('current audio:', currentAudio);
  console.log('currentAudioIndex:', currentAudioIndex);

  return (
    <div className="container" style={{ background: 'white' }}>
      <Spin spinning={isLoading}>
        {!isLoading && loadedListAudio && currentPage && (
          <Row>
            <Col span={4} offset={2}>
              <List
                header={<h5>Danh sách audio</h5>}
                dataSource={loadedListAudio}
                grid={{ column: 1, gutter: 12 }}
                renderItem={(item) => {
                  return (
                    <List.Item>
                      <Button
                        shape="round"
                        key={item.index}
                        style={{
                          background: item.evaluated
                            ? 'green'
                            : 'rgb(214, 46, 82)',
                          width: '80px',
                          height: '30px',
                        }}
                        onClick={() => selectAudioHandler(item.index)}
                      >{`Câu ${item.index + 1}`}</Button>
                    </List.Item>
                  );
                }}
                pagination={{
                  pageSize: itemPerPage,
                  current: currentPage,
                  onChange: (page) => setCurrentPage(page * 1),
                }}
              />
            </Col>
            <Col span={18}>
              {currentAudio && currentAudioIndex !== undefined && (
                <div className="container">
                  <Row>
                    <h4 style={{ textAlign: 'center', marginTop: '1rem' }}>
                      Câu {currentAudioIndex + 1}
                    </h4>
                  </Row>
                  <Row>
                    <audio
                      controls
                      style={{ width: '100%', marginTop: '1rem' }}
                      ref={audio}
                    >
                      <source
                        src={`${PUBLIC_DOMAIN}/${currentAudio.audioLink}`}
                      />
                    </audio>
                  </Row>
                  <Row>
                    <Card
                      title={<h5>Nội dung</h5>}
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      <div
                        className="container-fluid"
                        style={{ minHeight: '50px' }}
                      >
                        {currentAudio.sentence}
                      </div>
                    </Card>
                  </Row>
                  <Row style={{ marginTop: '1rem' }}>
                    <Row style={{ width: '100%' }} justify="center">
                      <h4>Đánh giá chất lượng giọng nói</h4>
                    </Row>
                    <Row style={{ width: '100%' }} justify="center">
                      <Col>
                        <Radio.Group
                          onChange={(e) => {
                            if (!isFilledForm) {
                              setIsFilledForm(true);
                            }
                            setPoint(e.target.value);
                          }}
                          value={point}
                          style={{ paddingTop: '1rem' }}
                        >
                          <Space direction="vertical">
                            {options.map((option) => (
                              <Radio value={option.point}>
                                <Tooltip title={option.tooltip}>
                                  {option.text}
                                </Tooltip>
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </Col>
                    </Row>
                  </Row>

                  <Row justify="center">
                    <Col>
                      <Button
                        type="primary"
                        shape="round"
                        icon={<CheckOutlined />}
                        style={{
                          margin: '2rem 0 2rem 0',
                          height: '40px',
                          width: '250px',
                        }}
                        onClick={onSubmitHandler}
                        disabled={!isFilledForm}
                      >
                        Xác nhận
                      </Button>
                    </Col>
                  </Row>

                  {/* <Row style={{ padding: '2rem 0 2rem 0' }}>
                    <Col span={2} offset={2}>
                      <Button
                        type="primary"
                        shape="round"
                        icon={<LeftOutlined />}
                        disabled={currentAudioIndex === 0}
                        onClick={onBackAudioHandler}
                      >
                        Câu trước
                      </Button>
                    </Col>
                    <Col span={14} />
                    <Col span={2}>
                      <Button
                        type="primary"
                        shape="round"
                        icon={<RightOutlined />}
                        onClick={onNextAudioHandler}
                      >
                        Câu sau
                      </Button>
                    </Col>
                  </Row> */}
                </div>
              )}
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default EvaluateAudio;
