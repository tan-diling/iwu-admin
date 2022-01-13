import { message, Avatar, Card, Button } from 'antd';
import React, { useState, useRef } from 'react';
import { useRequest } from 'umi';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ProFormText, QueryFilter, ProFormSelect } from '@ant-design/pro-form';
import ViewModal from './components/ViewModal';
import { getUserList } from '@/services/user';
import { getSettings } from '@/services/common';
import styles from './index.less';

const getStatusItem = (status) => {
  switch (status) {
    case 0:
      return { color: '#333', text: '未审核' };
    case 1:
      return { color: '#333', text: '未审核' };
    case 2:
      return { color: '#ccc', text: '审核通过' };
    case 3:
      return { color: '#FFA6A6', text: '审核不通过' };
    case 4:
      return { color: '#FFA6A6', text: '审核不通过' };
    default:
      return { color: '#333', text: '未提交' };
  }
};

const TableList = () => {
  const { data: settings = [] } = useRequest(getSettings);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();

  const getLabel = (option, key) => {
    if (!settings || !settings.length) return '-';
    const list = settings.find((item) => item.key === option)?.val || [];
    return (list.find((item) => item.key === key) || {}).value;
  };

  const [filters, setFilters] = useState({});

  const getList = async (params, sort, filter) => {
    const { current, pageSize } = params;
    const { code, data } = await getUserList({ page: current, limit: pageSize, ...filters });
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

  const columns = [
    {
      title: '头像',
      dataIndex: 'photo',
      render: (val) => <Avatar size={44} src={val[0]} />,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (val) => getLabel('option.sex', val),
    },
    {
      title: '出生年月',
      dataIndex: 'birthday',
      render: (val) => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '民族',
      dataIndex: 'nation',
    },
    {
      title: '居住地',
      dataIndex: 'region',
      render: (val) => getLabel('option.region', val),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      render: (val, record) => {
        const { status, auditReason } = record;
        const statusItem = getStatusItem(status);
        return status || status === 0 ? (
          <>
            <div className={styles.auditStatus} style={{ backgroundColor: statusItem.color }}>
              {statusItem.text}
            </div>
            {status > 2 && <div className={styles.text}>{auditReason}</div>}
          </>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const { status } = record;
        return [
          <Button
            disabled={status === 2}
            type="link"
            key="view"
            onClick={() => {
              handleViewModalVisible(true);
              setCurrentRow(record);
            }}
          >
            审核
          </Button>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <QueryFilter onFinish={handleSearch} onReset={handleReset}>
            <ProFormText name="contact.phone" label="手机号" />
            <ProFormSelect
              name="status"
              label="审核状态"
              valueEnum={{ ['0,1']: '未审核', 2: '审核通过', ['3,4']: '审核不通过' }}
            />
          </QueryFilter>
        </Card>
        <ProTable
          headerTitle=""
          actionRef={actionRef}
          rowKey="id"
          search={false}
          request={getList}
          columns={columns}
          childrenColumnName={'--'}
          rowSelection={false}
          rowClassName={(record) => (record.status === 4 ? styles.beBlocked : null)}
        />
      </div>

      <ViewModal
        settings={settings}
        values={currentRow || {}}
        visible={viewModalVisible}
        onCancel={() => {
          handleViewModalVisible(false);
          setCurrentRow(undefined);
        }}
        handleRefreshTable={() => {
          actionRef.current.reload();
        }}
      />
    </PageContainer>
  );
};

export default TableList;
