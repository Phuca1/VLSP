import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, DatePicker, Divider, Form, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import moment from 'moment';
import { RightOutlined } from '@ant-design/icons';
import apis from '../../../../../apis';
import { toast } from 'react-toastify';
import { PUBLIC_DOMAIN } from '../../../../../configs';

const dateFormat = 'YYYY/MM/DD';

const columns = [
  {
    title: 'Tên đội',
    dataIndex: 'name',
  },
  {
    title: 'Đội trưởng',
    dataIndex: 'realLeader',
    render: (leader) => {
      return leader.name;
    },
  },
  {
    title: 'Bản mô tả Api/Docker',
    dataIndex: 'resultSubmittedLink',
    render: (link) => {
      return (
        <Button href={`${PUBLIC_DOMAIN}/${link}`} target="blank">
          Download
        </Button>
      );
    },
  },
];

const TaskSubmissionDetail = (props) => {
  const { competition, reload, setReload } = props;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitDescription, setSubmitDescription] = useState(
    competition.taskSubmitResult.submitDescription,
  );
  const [teamSubmitted, setTeamSubmitted] = useState(null);

  useEffect(() => {
    const fetchTeamSubmitted = async () => {
      setIsLoading(true);
      try {
        const responseData = await apis.manager.getTeamsWhoSubmittedResult(
          competition.id,
        );
        if (responseData.status === 1) {
          setTeamSubmitted(responseData.teamSubmitted);
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    if (competition.taskSubmitResult.submitDescription) {
      fetchTeamSubmitted();
    }
  }, [competition]);

  const onUpdateDescriptionHandler = async (data) => {
    console.log(
      'start date: ',
      new Date(data.submitResultStartDate + 1000 * 60 * 60 * 24).toISOString(),
    );
    console.log(
      'end date: ',
      new Date(data.submitResultEndDate + 1000 * 60 * 60 * 24).toISOString(),
    );
    try {
      const responseData = await apis.manager.updateTaskSubmission({
        competitionId: competition.id,
        taskSubmissionInfo: {
          submitDescription: submitDescription,
          submitResultStartDate: new Date(
            data.submitResultStartDate + 1000 * 60 * 60 * 24,
          ).toISOString(),
          submitResultEndDate: new Date(
            data.submitResultEndDate + 1000 * 60 * 60 * 24,
          ).toISOString(),
        },
      });
      console.log(responseData);
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
  console.log('team submitted: ', teamSubmitted);

  return (
    <div className="container-fluid">
      <Spin spinning={isLoading}>
        {!isLoading && competition && (
          <div>
            <Form
              wrapperCol={{ span: 19 }}
              labelCol={{ span: 5 }}
              name="update-description"
              onFinish={onUpdateDescriptionHandler}
              form={form}
            >
              <Form.Item
                name="submitDescription"
                label="Hướng dẫn nộp kết quả"
                initialValue={submitDescription}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={submitDescription}
                  onReady={(editor) => {
                    console.log('CKeditor is ready to use!', editor);
                  }}
                  onChange={(event, editor) => {
                    setSubmitDescription(editor.getData());
                  }}
                />
              </Form.Item>
              <Form.Item
                name="submitResultStartDate"
                label="Ngày bắt đầu nộp kết quả"
                initialValue={moment(
                  competition.taskSubmitResult.submitResultStartDate.toString(),
                  dateFormat,
                )}
                rules={[
                  {
                    required: true,
                    message: 'Bạn cần nhập ngày vào',
                  },
                ]}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>

              <Form.Item
                name="submitResultEndDate"
                label="Ngày bắt đầu nộp kết quả"
                initialValue={moment(
                  competition.taskSubmitResult.submitResultEndDate.toString(),
                  dateFormat,
                )}
                rules={[
                  {
                    required: true,
                    message: 'Bạn cần nhập ngày vào',
                  },
                ]}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 5, offset: 8 }}>
                <Button
                  icon={<RightOutlined />}
                  type="default"
                  htmlType="submit"
                  block={true}
                  style={{ height: '45px' }}
                >
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
        <Divider />
        <h3>Các đội đã nộp kết quả: </h3>
        {teamSubmitted && (
          <Table
            dataSource={teamSubmitted}
            columns={columns}
            pagination={{ pageSize: 5 }}
            style={{ marginTop: '3rem' }}
          />
        )}
      </Spin>
    </div>
  );
};

export default TaskSubmissionDetail;
