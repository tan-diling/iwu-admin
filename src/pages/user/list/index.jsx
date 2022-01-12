import { message, Avatar, Popconfirm, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { useRequest } from 'umi';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  QueryFilter,
  ProFormSelect,
} from '@ant-design/pro-form';
import UpdateModal from './components/UpdateModal';
import ViewModal from './components/ViewModal';
import { getUserList, requestUserLock, requestUserUnlock } from '@/services/user';
import { getSettings } from '@/services/common';
import styles from './index.less';

import iconFemale from '@/assets/user/icon-female.png';
import iconMale from '@/assets/user/icon-male.png';

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
  const [lockModalVisible, handleLockVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);

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

  const getValueEnum = (option) => {
    if (!settings || !settings.length) return {};
    const list = settings.find((item) => item.key === option)?.val || [];
    return list.reduce((res, cur) => {
      const { key, value } = cur;
      return { ...res, [key]: value };
    }, {});
  };

  const handleUnlock = async (record) => {
    try {
      const { id } = record;
      const success = await requestUserUnlock({ id, reason: '' });
      if (success && actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {}
  };

  const columns = [
    {
      title: '头像/等级/名称/ID/性别',
      dataIndex: 'name',
      render: (val, record) => {
        const { photo, name, id, vip, sex } = record;
        return (
          <div className={styles.nameWrapper}>
            <div className={styles.avatarWrapper}>
              <Avatar size={44} src={photo[0]} />
              {!!vip && (
                <div className={styles.vip}>
                  <div className={styles.vipText}>V{vip}</div>
                </div>
              )}
            </div>

            <div className={styles.nameRight}>
              <div className={styles.sexName}>
                <Avatar size={16} src={+sex === 1 ? iconMale : iconFemale} />
                <div className={styles.name}>{name}</div>
              </div>

              <div className={styles.userId}>{id}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '区域/手机号',
      dataIndex: 'region',
      render: (val, record) => {
        const {
          region,
          contact: { phone },
        } = record;
        return (
          <>
            <div>{getLabel('option.region', region)}</div>

            <div className={styles.text}>{phone}</div>
          </>
        );
      },
    },
    {
      title: '注册来源/注册时间',
      dataIndex: 'createSource',
      render: (val, record) => {
        const { createSource, createdAt } = record;
        return (
          <>
            <div>{getLabel('option.createSource', createSource)}</div>

            <div className={styles.text}>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</div>
          </>
        );
      },
    },
    {
      title: '审核状态/审核时间',
      dataIndex: 'status',
      render: (val, record) => {
        const { status, createdAt, updatedAt } = record;
        const statusItem = getStatusItem(status);
        // const time = moment(updatedAt).isAfter(moment(createdAt)) ? moment(updatedAt).format('YYYY-MM-DD HH:mm') : ;
        return status || status === 0 ? (
          <>
            <div className={styles.auditStatus} style={{ backgroundColor: statusItem.color }}>
              {statusItem.text}
            </div>
            <div className={styles.text}>{moment(updatedAt).format('YYYY-MM-DD HH:mm')}</div>
          </>
        ) : (
          '-'
        );
      },
    },
    {
      title: '用户状态',
      dataIndex: 'isPublished',
      render: (val) => {
        return val ? (
          <div className={styles.published}>已发布：可见</div>
        ) : (
          <div className={styles.notPublished}>已发布：不可见</div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const { locked } = record;
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
          ...[
            !!locked ? (
              <Popconfirm
                key="unlock"
                placement="top"
                title={`确定解封此用户？`}
                onConfirm={() => handleUnlock(record)}
              >
                <a>解封</a>
              </Popconfirm>
            ) : (
              <a
                key="lock"
                onClick={() => {
                  handleLockVisible(true);
                  setCurrentRow(record);
                }}
              >
                封禁
              </a>
            ),
          ],
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
            <ProFormSelect name="region" label="区域" valueEnum={getValueEnum('option.region')} />
            <ProFormSelect name="sex" label="性别" valueEnum={getValueEnum('option.sex')} />
            <ProFormSelect name="vip" label="等级" valueEnum={getValueEnum('option.vip')} />
            <ProFormSelect
              name="isPublished"
              label="用户状态"
              valueEnum={{ true: '已发布：可见', false: '已发布：不可见' }}
            />
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
          // rowSelection={{
          //   onChange: (_, selectedRows) => {
          //     setSelectedRows(selectedRows);
          //   },
          // }}
          rowSelection={false}
          rowClassName={(record) => (!!record.locked ? styles.beBlocked : null)}
        />
      </div>

      <ModalForm
        title="封禁原因"
        width="400px"
        visible={lockModalVisible}
        onVisibleChange={handleLockVisible}
        modalProps={{
          destroyOnClose: true,
          preserve: false,
        }}
        onFinish={async (value) => {
          const { id } = currentRow;
          try {
            const success = await requestUserLock({ id, ...value });
            if (success) {
              handleLockVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } catch (error) {
            message.error('封禁失败');
          }
        }}
      >
        <ProFormTextArea
          name="reason"
          placeholder="请输入封禁原因"
          rules={[
            {
              required: true,
              message: '封禁原因不能为空!',
            },
          ]}
        />
      </ModalForm>
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
