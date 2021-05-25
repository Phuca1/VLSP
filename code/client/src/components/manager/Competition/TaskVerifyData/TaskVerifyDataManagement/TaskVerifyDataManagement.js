import {
  Button,
  Card,
  Col,
  Input,
  Progress,
  Row,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../../../apis';
import routes from '../../../../../constants/routes';
import { isInteger } from '../../../../../utils/validateString';

const TaskVerifyDataManagement = (props) => {
  const { competition, reload, setReload } = props;
  const { taskVerifyData } = competition;
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTeam, setLoadedTeam] = useState();
  const [disabled, setdisabled] = useState(true);
  const [threshold, setThreshold] = useState();
  const history = useHistory();
  useEffect(() => {
    setIsLoading(true);
    const fetchTeams = async () => {
      const responseData = await apis.user.getListTeamInCompetition(
        competition.id,
      );
      console.log('team list:', responseData);
      if (responseData.status !== 1) {
        setIsLoading(false);
        toast.error(responseData.message);
      }
      const currentTeams = await Promise.all(
        responseData.teams.map(async (team) => {
          const leaderId = team.leader;
          const leader = await apis.user.getUserById(leaderId);
          if (leader.status !== 1) {
            setIsLoading(false);
            toast.error(leader.message);
          }
          const progress =
            team.audiosVerifiedId.length / team.numberOfAudiotoVerify;
          return {
            ...team,
            leader: leader.user,
            progress,
          };
        }),
      );
      console.log(currentTeams);
      setLoadedTeam(currentTeams);
    };
    fetchTeams();
    setIsLoading(false);
  }, [competition]);

  const columns = [
    {
      title: 'Tên đội',
      dataIndex: 'name',
    },
    {
      title: 'Số thành viên',
      dataIndex: 'member',
      render: (memberList) => {
        return memberList.length;
      },
    },
    {
      title: 'Đội trưởng',
      dataIndex: 'leader',
      render: (leader) => {
        return leader.name;
      },
    },
    {
      title: 'Ngày đăng kí',
      dataIndex: 'createdAt',
      render: (date) => {
        return <Moment format="DD/MM/YYYY">{date}</Moment>;
      },
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      render: (progress) => {
        return (
          <Progress percent={progress * 100} size="small" status="active" />
        );
      },
    },
    {
      title: 'Gửi E-mail',
      render: (_, record) => {
        if (record.progress * 100 < competition.taskVerifyData.threshold) {
          return (
            <Tooltip title="Gửi email nhắc nhở nhóm hoàn thành công việc đúng hạn">
              <Button onClick={() => onNotifyVerificationProgress(record.id)}>
                Nhắc nhở
              </Button>
            </Tooltip>
          );
        }
      },
    },
  ];

  const onSetThresholdHandler = (e) => {
    if (
      e.target.value &&
      parseFloat(e.target.value) !== taskVerifyData.threshold
    ) {
      setThreshold(e.target.value);
      setdisabled(false);
    } else {
      setdisabled(true);
    }
  };

  const onChangeThreshold = async () => {
    if (!isInteger(threshold)) {
      toast.error('Ngưỡng phải là số nguyên');
      return;
    }
    if (threshold < 0 || threshold > 100) {
      toast.error('Ngưỡng phải lớn hơn 0 và bé hơn 100');
      return;
    }
    try {
      const responseData = await apis.manager.updateThreshold({
        competitionId: competition.id,
        threshold: threshold,
      });
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setReload(!reload);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onNotifyVerificationProgress = async (teamId) => {
    try {
      const responseData = await apis.manager.notifyVerifyData({ teamId });
      if (responseData.status === 1) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onJumpToViewVerifyResult = async () => {
    history.push(
      routes.VIEW_VERIFICATION_RESULT.replace('/:cid', `/${competition.id}`),
    );
  };

  return (
    <div>
      {!isLoading && loadedTeam && (
        <Spin spinning={isLoading}>
          <Card title={<h4>Thông tin thẩm định dữ liệu</h4>}>
            <Row>
              <Col span={8}>
                <h6>Số audio mỗi đội phải thẩm định:</h6>
              </Col>
              <Col span={16}>
                <h6>{taskVerifyData.audiosPerTeamToVerify}</h6>
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem' }}>
              <Col span={8}>
                <h6>Số vote tối thiểu để chập nhận một audio:</h6>
              </Col>
              <Col span={16}>
                <h6>{taskVerifyData.minVotesToAcceptAudio}</h6>
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem' }}>
              <Col span={8}>
                <h6>Ngưỡng để đội vượt qua vòng thẩm định:</h6>
              </Col>
              <Col span={16}>
                <h6>{taskVerifyData.threshold}%</h6>
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem' }}>
              <Col span={8}>
                <h6>Ngày bắt đầu thẩm định:</h6>
              </Col>
              <Col span={16}>
                <h6>
                  <Moment format="YYYY/MM/DD">
                    {taskVerifyData.verifyDataStartDate}
                  </Moment>
                </h6>
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem' }}>
              <Col span={8}>
                <h6>Ngày kết thúc thẩm định:</h6>
              </Col>
              <Col span={16}>
                <h6>
                  <Moment format="YYYY/MM/DD">
                    {taskVerifyData.verifyDataEndDate}
                  </Moment>
                </h6>
              </Col>
            </Row>
          </Card>
          <Row style={{ marginTop: '2rem' }}>
            <Col span={10}>
              <h5>
                Bạn có thể thay đổi ngưỡng để đội vượt qua vòng thẩm định:{' '}
              </h5>
            </Col>
            <Col span={1}>
              <Input
                defaultValue={taskVerifyData.threshold}
                onChange={onSetThresholdHandler}
              />
            </Col>
            <Col span={2} offset={1}>
              <Button
                disabled={disabled}
                shape="round"
                type="primary"
                onClick={onChangeThreshold}
              >
                Cập nhật
              </Button>
            </Col>
          </Row>

          <Row style={{ marginTop: '1rem' }}>
            <Col span={6}>
              <h5>Xem kết quả thẩm định tại đây: </h5>
            </Col>
            <Col span={1}>
              <Button shape="round" onClick={onJumpToViewVerifyResult}>
                Xem
              </Button>
            </Col>
          </Row>

          <h3 style={{ marginTop: '2rem' }}>Tiến độ thẩm định của các đội</h3>
          <Table
            dataSource={loadedTeam}
            columns={columns}
            pagination={{ pageSize: 3 }}
            style={{ marginTop: '2rem' }}
          />
        </Spin>
      )}
    </div>
  );
};

export default TaskVerifyDataManagement;
