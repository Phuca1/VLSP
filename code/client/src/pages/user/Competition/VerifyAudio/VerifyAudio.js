import { Badge, Card, Col, Input, List, Progress, Row, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import apis from '../../../../apis';
import { PUBLIC_DOMAIN } from '../../../../configs';
import { LikeOutlined, SendOutlined } from '@ant-design/icons';

import './VerifyAudio.css';
import { toast } from 'react-toastify';
import routes from '../../../../constants/routes';

const VerifyAudio = ({ history }) => {
  const { tid: teamId } = useParams();
  const [loadedTeam, setLoadedTeam] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedAudio, setLoadedAudio] = useState();
  const [textContent, setTextContent] = useState('');
  const [reload, setReload] = useState(false);

  const audio = useRef();

  useEffect(() => {
    setIsLoading(true);
    const fetchTeamAndAudios = async () => {
      try {
        const responseData = await apis.user.getTeamById(teamId);
        console.log('teamInfo', responseData);
        setLoadedTeam(responseData.team);
        const responseData2 = await apis.user.getAudioForTeamToVerify(teamId);
        console.log('audio info', responseData2.audio);
        setLoadedAudio(responseData2.audio);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTeamAndAudios();
    setIsLoading(false);
  }, [reload]);

  useEffect(() => {
    onAudioChange(loadedAudio);
  }, [loadedAudio]);

  const onAudioChange = () => {
    if (loadedAudio) {
      audio.current.pause();
      audio.current.load();
    }
  };

  const onVoteHandler = async (teamGainVoteId) => {
    // console.log(voteForTeamId);
    try {
      const responseData = await apis.user.voteForAudio({
        teamId: teamId,
        audioInCompetitionId: loadedAudio.id,
        teamGainVoteId: teamGainVoteId,
      });
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setTextContent('');
        setReload(!reload);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {}
  };

  const onSendTextContentHandler = async () => {
    console.log(textContent);
    setIsLoading(true);
    try {
      const responseData = await apis.user.inputContentAudio({
        teamId: loadedTeam.id,
        audioInCompetitionId: loadedAudio.id,
        sentenceContent: textContent,
      });
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setTextContent('');
        setReload(!reload);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {}
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };
  if (
    loadedTeam &&
    loadedTeam.audiosVerifiedId.length === loadedTeam.numberOfAudiotoVerify
  ) {
    history.push(
      routes.TEAM_VERIFY_SUCCESS.replace(
        '/:cid',
        `/${loadedTeam.competitionId}`,
      ),
    );
  }

  return (
    <div
      className="container"
      style={{ background: 'white', minHeight: '600px' }}
    >
      <Spin spinning={isLoading}>
        {loadedAudio && loadedTeam && (
          <Card
            title={<h4>{`Câu ${loadedTeam.audiosVerifiedId.length + 1}`}</h4>}
            extra={
              <Progress
                type="circle"
                width={70}
                percent={
                  (100 * loadedTeam.audiosVerifiedId.length) /
                  loadedTeam.numberOfAudiotoVerify
                }
              />
            }
          >
            <Row>
              <audio controls style={{ width: '100%' }} ref={audio}>
                <source src={`${PUBLIC_DOMAIN}/${loadedAudio.audioLink}`} />
              </audio>
            </Row>
            <Row>
              <List
                itemLayout="horizontal"
                style={{ width: '100%', minHeight: '350px', marginTop: '1rem' }}
                dataSource={loadedAudio.sentences}
                renderItem={(item) => {
                  return (
                    <List.Item>
                      <Col span={22}>
                        <List.Item.Meta
                          title={
                            <h6 style={{ color: 'blue' }}>{item.teamName}</h6>
                          }
                        />
                        {item.content}
                      </Col>
                      <Col span={2}>
                        {item.teamId !== loadedTeam.id && (
                          <Badge
                            count={parseFloat(item.numberOfVotes)}
                            showZero
                            style={{
                              marginLeft: '10px',
                              marginTop: '7px',
                            }}
                          >
                            <LikeOutlined
                              className="send-outline"
                              style={{
                                textAlign: 'center',
                                fontSize: '30px',
                                paddingTop: '3px',
                              }}
                              onClick={() => onVoteHandler(item.teamId)}
                            />
                          </Badge>
                        )}
                      </Col>
                    </List.Item>
                  );
                }}
                // pagination={{ pageSize: 4 }}
              />
            </Row>
            <Row style={{ marginTop: '1rem' }}>
              <Col span={22}>
                <Input.TextArea
                  size="large"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  value={textContent}
                  placeholder="Nhập nội dung audio"
                  onChange={(event) => {
                    setTextContent(event.target.value);
                  }}
                />
              </Col>
              <Col span={2}>
                <SendOutlined
                  className="send-outline"
                  style={{
                    marginLeft: '10px',
                    marginTop: '5px',
                    textAlign: 'center',
                    fontSize: '30px',
                  }}
                  onClick={onSendTextContentHandler}
                  // disabled={loadedAudio[currentAudioIndex].verified}
                />

                <br />
                <br />
              </Col>
            </Row>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default VerifyAudio;

// import { Col, Row, List, Spin, Button, Input, Badge } from 'antd';
// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router';
// import { toast } from 'react-toastify';
// import api from '../../../../apis';
// import { PUBLIC_DOMAIN } from '../../../../configs';
// import { LikeOutlined, SendOutlined } from '@ant-design/icons';
// import './VerifyAudio.css';
// import routes from '../../../../constants/routes';

// const VerifyAudio = ({ history }) => {
//   const { tid: teamId } = useParams();
//   const [loadedTeam, setLoadedTeam] = useState();
//   const [loadedAudio, setLoadedAudio] = useState();
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentAudio, setCurrentAudio] = useState(null);
//   const [currentAudioIndex, setCurrentAudioIndex] = useState();
//   const [textContent, setTextContent] = useState();
//   const [update, setUpdate] = useState(false);

//   const audio = useRef();

//   useEffect(() => {
//     setIsLoading(true);
//     const fetchTeam = async () => {
//       try {
//         const responseData = await api.user.getTeamById(teamId);
//         // console.log(responseData);
//         if (responseData.status === 1) {
//           const newTeam = { ...responseData.team };
//           newTeam.audioToVerify = responseData.team.audioToVerify.sort(
//             (a, b) => {
//               return a.index - b.index;
//             },
//           );
//           console.log(newTeam);
//           setLoadedAudio(newTeam.audioToVerify);
//           setLoadedTeam(newTeam);
//           console.log(currentAudioIndex);
//           if (currentAudioIndex === 0 || currentAudioIndex) {
//             await selectAudioHandler(currentAudioIndex);
//           }
//         } else {
//           toast.error(responseData.message);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchTeam();
//     setIsLoading(false);
//   }, [update]);

//   const selectAudioHandler = async (index) => {
//     const pickedAudio = loadedAudio[index];
//     try {
//       const responseData = await api.user.getAudioInCompetitionById(
//         pickedAudio.audioInCompetitionId,
//       );
//       console.log(responseData);
//       if (responseData.status === 1) {
//         setCurrentAudio(responseData.audioInCompetition);
//         audio.current.load();
//         setTextContent('');
//         setCurrentAudioIndex(index);
//       } else {
//         toast.error(responseData.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onSendTextContentHandler = async () => {
//     console.log(textContent);
//     console.log('index: ', currentAudio);
//     try {
//       const responseData = await api.user.updateVerifyingAudio({
//         teamId: teamId,
//         audioIndex: currentAudioIndex,
//         sentenceContent: textContent,
//       });
//       if (responseData.status === 1) {
//         toast.success(responseData.message);
//         if (currentAudioIndex === loadedAudio.length - 1) {
//           history.push(
//             routes.TEAM_VERIFY_SUCCESS.replace(
//               '/:cid',
//               `/${loadedTeam.competitionId}`,
//             ),
//           );
//         }
//         setCurrentAudioIndex(currentAudioIndex + 1);
//         await selectAudioHandler(currentAudioIndex + 1);
//         setUpdate(!update);
//       }
//     } catch (error) {}
//   };

//   const onVoteHandler = async (teamGainVoteId) => {
//     console.log(teamGainVoteId);
//     try {
//       const responseData = await api.user.voteForAudio({
//         teamId: loadedTeam.id,
//         audioIndex: currentAudioIndex,
//         teamGainVoteId: teamGainVoteId,
//       });
//       console.log(responseData);
//       if (responseData.status === 1) {
//         toast.success(responseData.message);
//         if (currentAudioIndex === loadedAudio.length - 1) {
//           history.push(
//             routes.TEAM_VERIFY_SUCCESS.replace(
//               '/:cid',
//               `/${loadedTeam.competitionId}`,
//             ),
//           );
//         }
//         setCurrentAudioIndex(currentAudioIndex + 1);
//         await selectAudioHandler(currentAudioIndex + 1);
//         setUpdate(!update);
//       } else {
//         toast.error(responseData.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="container" style={{ background: 'white' }}>
//       <Spin spinning={isLoading}>
//         {!isLoading && loadedTeam && (
//           <Row style={{ minHeight: '600px' }}>
//             <Col span={9}>
//               <List
//                 header={<h5>Danh sách audio</h5>}
//                 dataSource={loadedAudio}
//                 grid={{ column: 4, gutter: 24 }}
//                 renderItem={(item) => {
//                   return (
//                     <List.Item style={{ paddingBottom: '10px' }}>
//                       <Button
//                         key={item.index}
//                         onClick={() => {
//                           selectAudioHandler(item.index);
//                         }}
//                         style={{
//                           background: item.verified
//                             ? 'green'
//                             : 'rgb(214, 46, 82)',
//                           width: '80px',
//                           height: '30px',
//                         }}
//                       >{`Câu ${item.index + 1}`}</Button>
//                     </List.Item>
//                   );
//                 }}
//                 pagination={{ pageSize: 20 }}
//               />
//             </Col>
//             <Col span={15} style={{ paddingLeft: '2rem' }}>
//               {currentAudio && (
//                 <div className="container">
//                   <Row>
//                     <h4 style={{ textAlign: 'center', marginTop: '1rem' }}>
//                       Câu {currentAudioIndex + 1}
//                     </h4>
//                   </Row>
//                   <Row>
//                     <audio
//                       controls
//                       style={{ width: '100%', marginTop: '1rem' }}
//                       ref={audio}
//                     >
//                       <source
//                         src={`${PUBLIC_DOMAIN}/${currentAudio.audioLink}`}
//                       />
//                     </audio>
//                   </Row>

//                   <Row>
//                     <List
//                       itemLayout="horizontal"
//                       style={{ width: '100%', minHeight: '350px' }}
//                       dataSource={currentAudio.sentences}
//                       renderItem={(item) => {
//                         return (
//                           <List.Item>
//                             <Col span={22}>
//                               <List.Item.Meta
//                                 title={
//                                   <h6 style={{ color: 'blue' }}>
//                                     {item.teamName}
//                                   </h6>
//                                 }
//                               />
//                               {item.content}
//                             </Col>
//                             <Col span={2}>
//                               {item.teamId !== loadedTeam.id &&
//                                 !isNaN(currentAudioIndex) && (
//                                   <Badge
//                                     count={parseFloat(item.numberOfVotes)}
//                                     showZero
//                                     style={{
//                                       marginLeft: '10px',
//                                       marginTop: '7px',
//                                     }}
//                                   >
//                                     {!loadedAudio[currentAudioIndex]
//                                       .verified ? (
//                                       <LikeOutlined
//                                         className="send-outline"
//                                         style={{
//                                           textAlign: 'center',
//                                           fontSize: '30px',
//                                           paddingTop: '3px',
//                                         }}
//                                         onClick={() =>
//                                           onVoteHandler(item.teamId)
//                                         }
//                                       />
//                                     ) : (
//                                       <LikeOutlined
//                                         style={{
//                                           textAlign: 'center',
//                                           fontSize: '30px',
//                                           paddingTop: '3px',
//                                         }}
//                                       />
//                                     )}
//                                   </Badge>
//                                 )}
//                             </Col>
//                           </List.Item>
//                         );
//                       }}
//                       // pagination={{ pageSize: 4 }}
//                     />
//                   </Row>
//                   <Row style={{ marginTop: '1rem' }}>
//                     <Col span={22}>
//                       <Input.TextArea
//                         size="large"
//                         autoSize={{ minRows: 1, maxRows: 4 }}
//                         value={textContent}
//                         placeholder="Nhập nội dung audio"
//                         onChange={(event) => {
//                           setTextContent(event.target.value);
//                         }}
//                         disabled={
//                           currentAudioIndex &&
//                           loadedAudio[currentAudioIndex].verified
//                         }
//                       />
//                     </Col>
//                     <Col span={2}>
//                       {!isNaN(currentAudioIndex) &&
//                         !loadedAudio[currentAudioIndex].verified && (
//                           <SendOutlined
//                             className="send-outline"
//                             style={{
//                               marginLeft: '10px',
//                               marginTop: '5px',
//                               textAlign: 'center',
//                               fontSize: '30px',
//                             }}
//                             onClick={onSendTextContentHandler}
//                             // disabled={loadedAudio[currentAudioIndex].verified}
//                           />
//                         )}
//                       <br />
//                       <br />
//                     </Col>
//                   </Row>
//                 </div>
//               )}
//             </Col>
//           </Row>
//         )}
//       </Spin>
//     </div>
//   );
// };

// export default VerifyAudio;
