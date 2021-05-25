import { Spin, Table, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../../apis';

import { SoundOutlined } from '@ant-design/icons';
import { PUBLIC_DOMAIN } from '../../../../configs';

const VerificationResult = (props) => {
  const { cid: competitionId } = useParams();
  const [audiosInCompetition, setAudiosInCompetition] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [audioLink, setAudioLink] = useState();

  const audio = useRef();

  // useEffect(() => {
  //   if (audio.current) {
  //     audio.current.pause();
  //     audio.current.load();
  //   }
  // }, [audioLink]);

  useEffect(() => {
    const fetchAudios = async () => {
      setIsLoading(true);
      try {
        const responseData = await apis.manager.getAudiosInOneCompetition(
          competitionId,
        );
        console.log('audios: ', responseData);
        if (responseData.status === 1) {
          setAudiosInCompetition(
            responseData.audiosInCompetition.map((audio, index) => {
              return {
                ...audio,
                key: index,
              };
            }),
          );
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
        {audiosInCompetition && (
          <div>
            <h1>Danh sách các audio được đưa vào thẩm định</h1>
            {audioLink && (
              <audio autoPlay ref={audio}>
                <source src={`${PUBLIC_DOMAIN}/${audioLink}`} />
              </audio>
            )}
            <Table
              dataSource={audiosInCompetition}
              columns={[
                {
                  title: 'Audio',
                  dataIndex: 'audioLink',
                  render: (link) => {
                    const dirs = link.split('/');
                    return dirs[dirs.length - 1];
                  },
                },
                {
                  title: 'Số lượt tương tác',
                  dataIndex: 'totalVerifiedTimes',
                },
                {
                  title: 'Nghe audio',
                  render: (_, record) => {
                    return (
                      <SoundOutlined
                        onClick={() => {
                          setAudioLink(record.audioLink);
                          if (audio.current) {
                            audio.current.load();
                            audio.current.play();
                          }
                        }}
                      />
                    );
                  },
                },
              ]}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      dataSource={record.sentences}
                      columns={[
                        {
                          title: 'Tên đội',
                          dataIndex: 'teamName',
                        },
                        {
                          title: 'Nội dung',
                          dataIndex: 'content',
                          render: (content) => {
                            return <Tooltip title={content}>{content}</Tooltip>;
                          },
                        },
                        {
                          title: 'Số lượt vote',
                          dataIndex: 'numberOfVotes',
                        },
                      ]}
                    />
                  );
                },
              }}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default VerificationResult;
