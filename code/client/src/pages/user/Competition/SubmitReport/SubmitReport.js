import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Spin, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import routes from '../../../../constants/routes';

const dummyReq = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const SubmitReport = ({ history }) => {
  const { tid: teamId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState();
  const [competition, setCompetition] = useState();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const responseData1 = await apis.user.getTeamById(teamId);
        if (responseData1.status === 1) {
          setTeam(responseData1.team);
        } else {
          toast.error(responseData1.message);
          return;
        }
        const responseData2 = await apis.user.getCompetitionById({
          competitionId: responseData1.team.competitionId,
        });
        if (responseData2.status === 1) {
          setCompetition(responseData2.competition);
        } else {
          toast.error(responseData2.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompetition();
  }, []);

  const onFileChange = (event) => {
    console.log(event);
    setFile(event);
  };

  const onSubmitResult = async () => {
    if (!file) {
      toast.error('Hãy upload 1 file lên');
      return;
    }
    if (file.fileList.length !== 1) {
      toast.error('Hãy upload 1 file duy nhất');
      return;
    }
    if (!['pdf', 'doc', 'docx'].includes(file.fileList[0].name.split('.')[1])) {
      toast.error('Chỉ upload file pdf hoặc file doc/docx');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('competitionId', competition.id);
    formData.append('teamId', team.id);
    formData.append('file', file.fileList[0].originFileObj);
    try {
      const responseData = await apis.user.submitReport(formData);
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        history.push(
          routes.COMPETITION_USER.replace('/:cid', `/${competition.id}`),
        );
      } else {
        toast.error(responseData.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ background: 'white' }}>
      <Spin spinning={isLoading}>
        {competition && team && (
          <Card title={<h3>Nộp bản báo cáo</h3>}>
            <Row style={{ marginTop: '2rem' }}>
              <Col span={4}>
                <h6 style={{ float: 'right' }}>Upload file mô tả</h6>
              </Col>
              <Col span={1} />
              <Col span={19}>
                <Upload
                  name="file"
                  customRequest={dummyReq}
                  onChange={onFileChange}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Col>
            </Row>
            <Row style={{ marginTop: '2rem' }} justify="center">
              <h6>
                Chú ý: chỉ upload 1 file duy nhất, là file word hoặc file pdf
              </h6>
            </Row>
            <Row style={{ marginTop: '2rem' }}>
              <Col offset={9}>
                <Button
                  style={{ width: '300px', height: '45px' }}
                  type="primary"
                  shape="round"
                  onClick={onSubmitResult}
                >
                  Nộp báo cáo
                </Button>
              </Col>
            </Row>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default SubmitReport;
