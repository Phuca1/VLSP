import { Button, Input, Row, Slider, Space, Table, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import Plot from 'react-plotly.js';
import * as anova from '../../../../utils/anova';

import { SearchOutlined, SoundOutlined } from '@ant-design/icons';
import { PUBLIC_DOMAIN } from '../../../../configs';
import apis from '../../../../apis';
import { toast } from 'react-toastify';

const TestAssessment = (props) => {
  const { allAudios, test } = props;
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();
  const [searchRange, setSearchRange] = useState();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [audioLink, setAudioLink] = useState();

  const audio = useRef();

  // useEffect(() => {
  //   if (audio.current) {
  //     audio.current.pause();
  //     audio.current.load();
  //   }
  // }, [audioLink]);

  const listVoice = test.voices;
  let meanList = [];
  let deviationList = [];
  let listAudiosPoint = [];

  let listAudioExpand = [];

  // tính mean và standard deviation của từng giọng
  for (const val of listVoice) {
    // console.log(val);
    const audios = allAudios.filter(
      (audio) => audio.averagePoint && audio.voice === val,
    );

    listAudiosPoint.push(audios.map((audio) => audio.averagePoint));

    const mean =
      audios.reduce((acc, curAudio) => {
        return acc + curAudio.averagePoint;
      }, 0) / audios.length;
    meanList.push(mean);
  }
  console.log(meanList);

  for (const i in listVoice) {
    const audios = allAudios.filter(
      (audio) => audio.averagePoint && audio.voice === listVoice[i],
    );
    if (audios.length === 0) {
      deviationList.push(0);
    } else {
      const standardError =
        audios.reduce((acc, curAudio) => {
          return acc + Math.pow(meanList[i] - curAudio.averagePoint, 2);
        }, 0) / Math.pow(audios.length, 2);
      deviationList.push(Math.pow(standardError, 0.5));
    }
  }

  console.log('table anova : ', anova.table(listAudiosPoint));

  for (const audio of allAudios) {
    if (!audio.averagePoint) {
      listAudioExpand.push(audio);
    } else {
      const audiosDetail = audio.users.map((urs) => {
        return {
          ...audio,
          userId: urs.userId,
          point: urs.point,
          textFileName: audio.name.split('-')[0],
        };
      });
      listAudioExpand = listAudioExpand.concat(audiosDetail);
    }
  }

  const getColumnSearchProps = (dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : '',
      // render: (text) =>
      //   searchedColumn === dataIndex ? (
      //     <Highlighter
      //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ''}
      //     />
      //   ) : (
      //     text
      //   ),
    };
  };

  const getColumnSearchByRangeProps = (dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Slider
            range
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e ? [e] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
            max={5}
            min={1}
            step={0.1}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearchByRange(selectedKeys, confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleResetRange(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchRange(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (range, record) =>
        record[dataIndex]
          ? record[dataIndex] >= range[0] && record[dataIndex] <= range[1]
          : null,
      render: (text) => text,
    };
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleSearchByRange = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchRange(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleResetRange = (clearFilters) => {
    clearFilters();
    setSearchRange(null);
  };

  const clearAllHandler = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const changeTableHandler = (pagination, filters, sorter) => {
    console.log('Pagination', pagination);
    console.log('Filters', filters);
    console.log('Sorter', sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const onSendResultHandler = async () => {
    try {
      const responseData = await apis.manager.sendResultToTeams({
        testId: test.id,
      });
      if (responseData.status === 1) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container" style={{ background: 'white' }}>
      <Row style={{ marginTop: '1rem' }}>
        <h2>Bảng thống kê kết quả chung của bài thí nghiệm</h2>
      </Row>
      <Row style={{ width: '100%', minHeight: '500px' }}>
        <Plot
          data={[
            {
              showlegend: true,
              type: 'bar',
              name: 'Điểm',
              x: listVoice,
              y: meanList,
              error_y: {
                type: 'data',
                array: deviationList,
                visible: true,
              },
              width: listVoice.map((_) => 0.5),
            },
          ]}
          layout={{
            width: 1000,
            height: 600,
            title: 'Kì vọng và phương sai của các giọng',
            autosize: true,
            titlefont: { size: 30 },
          }}
        />
      </Row>

      <Row>
        <h3>Bảng Two-Factor ANOVA</h3>
      </Row>

      <Row style={{ marginTop: '2rem' }}>
        <h3>Danh sách audio</h3>
      </Row>

      <audio autoPlay ref={audio}>
        <source src={`${PUBLIC_DOMAIN}/${audioLink}`} />
      </audio>

      <Button onClick={clearAllHandler}>Làm mới</Button>

      <Row style={{ width: '100%', minHeight: '700px' }}>
        <Table
          style={{ width: '100%', marginTop: '1rem' }}
          dataSource={listAudioExpand}
          onChange={changeTableHandler}
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
              title: 'Audio',
              dataIndex: 'name',
              render: (text, record) => {
                return <Tooltip title={record.sentence}>{text}</Tooltip>;
              },
            },
            {
              title: 'Giọng',
              dataIndex: 'voice',
              key: 'voice',
              sortDirections: ['descend', 'ascend'],
              sorter: (a, b) => {
                return a.voice.localeCompare(b.voice);
              },
              sortOrder: sortedInfo.columnKey === 'voice' && sortedInfo.order,
              ...getColumnSearchProps('voice'),
              filteredValue: filteredInfo.voice || null,
            },
            {
              title: 'Câu',
              dataIndex: 'textFileName',
              key: 'textFileName',
              ...getColumnSearchProps('textFileName'),
              filteredValue: filteredInfo.textFileName || null,
            },
            {
              title: 'Điểm',
              dataIndex: 'point',
              key: 'point',
              sorter: (a, b) => {
                if (!a.point) return 1;
                if (!b.point) return -1;
                return a.point - b.point;
              },
              sortDirections: ['descend', 'ascend'],
              sortOrder: sortedInfo.columnKey === 'point' && sortedInfo.order,
              ...getColumnSearchByRangeProps('point'),
              filteredValue: filteredInfo.point || null,
            },
            {
              title: 'id người đánh giá',
              dataIndex: 'userId',
              ...getColumnSearchProps('userId'),
              filteredValue: filteredInfo.userId || null,
            },
          ]}
          pagination={{ pageSize: 10 }}
        />
      </Row>
      <Row justify="center">
        <Button
          type="primary"
          shape="round"
          style={{ width: '300px', height: '45px' }}
          onClick={onSendResultHandler}
        >
          Gửi kết quả
        </Button>
      </Row>
      <Row justify="center" style={{ margin: '2rem 0 2rem 0' }}>
        <h6>
          Lưu ý, kết quả của bài test này sẽ chỉ được gửi cho những đội đã đăng
          kí cuộc thi
        </h6>
      </Row>
    </div>
  );
};

export default TestAssessment;
