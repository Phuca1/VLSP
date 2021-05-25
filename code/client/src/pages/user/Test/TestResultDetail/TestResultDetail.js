import { SoundOutlined } from '@ant-design/icons';
import { Divider, Row, Spin, Table, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import { PUBLIC_DOMAIN } from '../../../../configs';

const TestResultDetail = (props) => {
  const { teamId, testId } = useParams();
  const [isLoading, setIsLoading] = useState();
  const [audiosInTest, setAudiosInTest] = useState();
  const [audioLink, setAudioLink] = useState();
  const [result, setResult] = useState();

  const audio = useRef();

  useEffect(() => {
    const fetchAudios = async () => {
      setIsLoading(true);
      try {
        const responseData = await apis.user.getAllAudiosInTestOfTeam({
          teamId,
          testId,
        });
        console.log('test result info', responseData);
        if (responseData.status === 1) {
          setAudiosInTest(responseData.audiosInTest);
          const audios = responseData.audiosInTest.filter(
            (audio) => audio.averagePoint,
          );
          const mean =
            audios.reduce((acc, cur) => {
              return acc + cur.averagePoint;
            }, 0) / audios.length;

          const deviation =
            audios.reduce((acc, cur) => {
              return acc + Math.pow(mean - cur.averagePoint, 2);
            }, 0) / Math.pow(audios.length, 2);

          setResult({
            mean,
            deviation,
          });
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchAudios();
  }, []);

  return (
    <div className="container" style={{ background: 'white' }}>
      <Spin spinning={isLoading}>
        <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
          Danh sách các audio đã được đánh giá
        </h1>
        {audiosInTest && result && (
          <div>
            <audio autoPlay ref={audio}>
              <source src={`${PUBLIC_DOMAIN}/${audioLink}`} />
            </audio>
            <Table
              style={{ marginTop: '2rem' }}
              dataSource={audiosInTest}
              columns={[
                {
                  title: 'Nghe audio',
                  render: (_, record) => {
                    return (
                      <SoundOutlined
                        onClick={() => {
                          setAudioLink(record.audioLink);
                          if (audio.current) {
                            audio.current.pause();
                            audio.current.load();
                          }
                        }}
                      />
                    );
                  },
                },
                {
                  title: 'Tên audio',
                  dataIndex: 'name',
                },
                {
                  title: 'Nội dung',
                  dataIndex: 'sentence',
                  render: (text) => {
                    return <Tooltip title={text}>{text}</Tooltip>;
                  },
                },
                {
                  title: 'Số lượt đánh giá',
                  dataIndex: 'numberOfRate',
                },
                {
                  title: 'Điểm trung bình',
                  dataIndex: 'averagePoint',
                },
              ]}
            />
            <Divider />
            <h2
              style={{
                margin: '2rem 0 2rem 0',
                textAlign: 'center',
                fontFamily: 'sans-serif',
              }}
            >
              Điểm trung bình
            </h2>
            <Row style={{ marginTop: '2rem' }}>
              <h5>
                - Phương sai và độ lệch chuẩn cho điểm của toàn bộ audio :{' '}
                <strong>
                  {result.mean} {<span>&#177;</span>}{' '}
                  {result.deviation.toFixed(3)}
                </strong>
              </h5>
            </Row>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default TestResultDetail;
