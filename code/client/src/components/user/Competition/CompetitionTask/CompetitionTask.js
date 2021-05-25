import { Card, Timeline, Row, Col, Button } from 'antd';
import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { PUBLIC_DOMAIN } from '../../../../configs';
import routes from '../../../../constants/routes';

const CompetitionTask = (props) => {
  const { competition, team, dataTraining } = props;
  console.log('hello', competition);
  return (
    <div>
      {competition && (
        <Card title={<h5>Các mốc của cuộc thi</h5>}>
          <Timeline>
            {competition.timeline.verifyData && (
              <Timeline.Item>
                {competition.taskVerifyData && (
                  <h6>
                    <Link
                      to={routes.START_VERIFY_AUDIO.replace(
                        '/:tid',
                        `/${team.id}`,
                      )}
                    >
                      Thẩm định dữ liệu
                    </Link>
                  </h6>
                )}
                {!competition.taskVerifyData && <h6>Thẩm định dữ liệu</h6>}
              </Timeline.Item>
            )}

            {competition.timeline.shareTrainingData && (
              <Timeline.Item>
                {competition.dataToShare.dataTrainingId && (
                  <h6>
                    <Link
                      to={routes.TEAM_REQUEST_DATA.replace(
                        '/:tid',
                        `/${team.id}`,
                      )}
                    >
                      Yêu cầu dữ liệu huấn luyện
                    </Link>
                  </h6>
                )}
                {!competition.dataToShare.dataTrainingId && (
                  <h6>Yêu cầu dữ liệu huấn luyện</h6>
                )}
              </Timeline.Item>
            )}

            {competition.timeline.submitResult && (
              <Timeline.Item>
                {competition.taskSubmitResult.submitDescription && (
                  <h6>
                    <Link
                      to={routes.TEAM_SUBMIT_RESULT.replace(
                        '/:tid',
                        `/${team.id}`,
                      )}
                    >
                      Nộp kết quả
                    </Link>
                  </h6>
                )}
                {!competition.taskSubmitResult.submitDescription && (
                  <h6>Nộp kết quả</h6>
                )}
              </Timeline.Item>
            )}

            {competition.timeline.submitReport && (
              <Timeline.Item>
                {competition.taskSubmitReport &&
                  competition.taskSubmitReport.submitReportStartDate && (
                    <h6>
                      <Link
                        to={routes.TEAM_SUBMIT_REPORT.replace(
                          '/:tid',
                          `/${team.id}`,
                        )}
                      >
                        Nộp báo cáo
                      </Link>
                    </h6>
                  )}
                {!competition.taskSubmitResult.submitDescription && (
                  <h6>Nộp báo cáo</h6>
                )}
              </Timeline.Item>
            )}
          </Timeline>
        </Card>
      )}
    </div>
  );
};

export default CompetitionTask;
