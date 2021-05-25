import React, { useState } from 'react';
import { Spin, Form, DatePicker, Input, Button } from 'antd';

import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import apis from '../../../../apis';
import { toast } from 'react-toastify';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 10,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 5,
      offset: 8,
    },
  },
};

const dateFormat = 'YYYY/MM/DD';

const CompetitionDetail = (props) => {
  const { competition, reload, setReload } = props;
  const [form] = Form.useForm();
  const [rules, setRules] = useState(competition.rules);
  const [isLoading, setIsLoading] = useState(false);

  const onUpdateHandler = async (form) => {
    console.log('form :', form);
    console.log('rules: ', rules);
    setIsLoading(true);
    try {
      const responseData = await apis.manager.updateCompetition({
        competitionId: competition.id,
        name: form.name,
        rules: rules,
        joinCompetitionStartDate: new Date(
          form.joinCompetitionStartDate + 1000 * 60 * 60 * 24,
        ).toISOString(),
        joinCompetitionEndDate: new Date(
          form.joinCompetitionEndDate + 1000 * 60 * 60 * 24,
        ).toISOString(),
      });
      if (responseData.status === 1) {
        setIsLoading(false);
        toast.success(responseData.message);
        setReload(!reload);
      } else {
        setIsLoading(false);
        toast.error(responseData.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-5">
      <Spin spinning={isLoading}>
        <Form
          {...formItemLayout}
          onFinish={onUpdateHandler}
          form={form}
          name="create-competition"
        >
          <Item
            name="name"
            label="Tên cuộc thi"
            initialValue={competition.name}
            rules={[
              {
                required: true,
                message: 'Hãy nhập tên cuộc thi',
              },
            ]}
          >
            <Input />
          </Item>

          <Item
            name="rules"
            label="Thể lệ cuộc thi"
            initialValue={competition.rules}
          >
            <CKEditor
              editor={ClassicEditor}
              data={rules}
              onReady={(editor) => {
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setRules(data);
              }}
            />
          </Item>

          <Item
            name="joinCompetitionStartDate"
            label="Ngày mở đăng kí"
            initialValue={moment(
              competition.joinCompetitionStartDate.toString(),
              dateFormat,
            )}
            rules={[
              {
                required: true,
                message: 'Hãy nhập ngày mở đăng kí',
              },
            ]}
          >
            <DatePicker format={dateFormat} />
          </Item>

          <Item
            name="joinCompetitionEndDate"
            label="Ngày kết thúc đăng kí"
            initialValue={moment(
              competition.joinCompetitionEndDate.toString(),
              dateFormat,
            )}
            rules={[
              {
                required: true,
                message: 'Hãy nhập ngày kết thúc đăng kí',
              },
            ]}
          >
            <DatePicker format={dateFormat} />
          </Item>
          <Item {...tailFormItemLayout}>
            <Button
              icon={<RightOutlined />}
              type="default"
              htmlType="submit"
              block={true}
              style={{ height: '45px' }}
            >
              Cập nhật
            </Button>
          </Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CompetitionDetail;
