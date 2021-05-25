import { Button, Input, Spin, Table, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apis from '../../../apis';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const UserManagement = (props) => {
  const [loadedUser, setLoadedUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSearchState] = useState({
    searchText: '',
    searchedColumn: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const res = await apis.user.getListUser();
      if (res.status !== 1) {
        toast.error(res.message);
      }
      console.log(res);
      setLoadedUser(res.users);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchState({
      searchText: '',
    });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Seach ${dataIndex}`}
          value={selectedKeys}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 200, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 80 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 80 }}
          >
            Reset
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
    render: (text) =>
      searchState.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: 'ffc069', padding: 0 }}
          searchWords={[searchState.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Username',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      // ...this.getColumnSearchProps('age'),
    },
    {
      title: 'Job',
      dataIndex: 'job',
      key: 'job',
      ...getColumnSearchProps('job'),
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <div
        style={{
          padding: '15px 30px 0 30px',
        }}
      >
        <Table
          columns={columns}
          dataSource={loadedUser}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </Spin>
  );
};

export default UserManagement;
