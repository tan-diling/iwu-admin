import { message, Avatar, Popconfirm, Card, Button } from 'antd';
import React, { useState, useRef } from 'react';
import { useRequest } from 'umi';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ProFormText, QueryFilter, ProFormSelect } from '@ant-design/pro-form';
import UpdateModal from './components/UpdateModal';
import ViewModal from './components/ViewModal';
import { getMatchmakerList, deleteMatchmaker } from '@/services/matchmaker';
import { getSettings } from '@/services/common';
import styles from './index.less';

const TableList = () => {
  const { data: settings = [] } = useRequest(getSettings);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();

  const getLabel = (option, key) => {
    if (!settings || !settings.length) return '-';
    const list = settings.find((item) => item.key === option)?.val || [];
    return (list.find((item) => item.key === key) || {}).value || '-';
  };

  const [filters, setFilters] = useState({});

  const getList = async (params, sort, filter) => {
    const { current, pageSize } = params;
    const { code, data } = await getMatchmakerList({ page: current, limit: pageSize, ...filters });
    if (code !== 200) return { success: false, data: [] };
    const { docs, page, limit, totalDocs } = data;
    return { data: docs, success: true, total: totalDocs };
  };

  const handleSearch = (values) => {
    setFilters({ ...values });
    actionRef.current.reload();
  };

  const handleReset = () => {
    if (!Object.keys(filters).length) return;

    setFilters({});
    actionRef.current.reload();
  };

  const getValueEnum = (option) => {
    if (!settings || !settings.length) return {};
    const list = settings.find((item) => item.key === option)?.val || [];
    return list.reduce((res, cur) => {
      const { key, value } = cur;
      return { ...res, [key]: value };
    }, {});
  };

  const handleDelete = async (record) => {
    try {
      const { id } = record;
      const success = await deleteMatchmaker({ id });
      if (success && actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {}
  };

  const columns = [
    {
      title: '头像',
      dataIndex: 'photo',
      render: (val) => <Avatar size={44} src={val} />,
      width: 70,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '地区',
      dataIndex: 'region',
      render: (val) => getLabel('option.region', val),
    },
    {
      title: '年龄',
      dataIndex: 'birthday',
      render: (val, record) => {
        const { birthday } = record;
        return birthday ? moment().diff(moment(birthday), 'years') : '-';
      },
    },
    {
      title: '个人经验',
      dataIndex: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '微信号',
      dataIndex: 'weixin',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (val, record) => {
        const { createdAt } = record;
        return createdAt ? moment(createdAt).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      render: (_, record) => {
        const { status } = record;
        return [
          <a
            key="view"
            onClick={() => {
              handleViewModalVisible(true);
              setCurrentRow(record);
            }}
          >
            查看
          </a>,
          <a
            key="edit"
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            编辑
          </a>,
          <Popconfirm
            key="delete"
            placement="top"
            title={'确定删除此红娘？'}
            onConfirm={() => handleDelete(record)}
          >
            <a>删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <QueryFilter onFinish={handleSearch} onReset={handleReset}>
            <ProFormText name="phone" label="手机号" />
          </QueryFilter>
        </Card>
        <ProTable
          headerTitle={
            <Button
              type="primary"
              onClick={() => {
                handleUpdateModalVisible(true);
                setCurrentRow(undefined);
              }}
            >
              新增
            </Button>
          }
          actionRef={actionRef}
          rowKey="id"
          search={false}
          request={getList}
          columns={columns}
          childrenColumnName={'--'}
          // rowSelection={{
          //   onChange: (_, selectedRows) => {
          //     setSelectedRows(selectedRows);
          //   },
          // }}
          rowSelection={false}
          rowClassName={(record) => (record.status === 4 ? styles.beBlocked : null)}
        />
      </div>

      <UpdateModal
        settings={settings}
        values={currentRow || {}}
        visible={updateModalVisible}
        onVisibleChange={(visible) => {
          handleUpdateModalVisible(visible);
          if (!visible) setCurrentRow(undefined);
        }}
        handleRefreshTable={() => {
          actionRef.current.reload();
        }}
      />

      <ViewModal
        settings={settings}
        values={currentRow || {}}
        visible={viewModalVisible}
        onCancel={() => {
          handleViewModalVisible(false);
          setCurrentRow(undefined);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
