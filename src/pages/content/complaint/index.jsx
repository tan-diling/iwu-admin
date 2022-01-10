import { message, Avatar, Card, Button } from 'antd';
import React, { useState, useRef } from 'react';
import { useRequest } from 'umi';
import { ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea, QueryFilter, ProFormSelect } from '@ant-design/pro-form';
import { getComplaintList, complaintFeedback } from '@/services/content/complaint';
import { getSettings } from '@/services/common';
import styles from './index.less';

import iconFemale from '@/assets/user/icon-female.png';
import iconMale from '@/assets/user/icon-male.png';

const TableList = () => {
  const { data: settings = [] } = useRequest(getSettings);
  const [feedbackModalVisible, handleFeedbackVisible] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();

  const [filters, setFilters] = useState({});

  const getList = async (params, sort, filter) => {
    const { current, pageSize } = params;
    console.log('params', params);
    const { code, data } = await getComplaintList({ page: current, limit: pageSize, ...filters });
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
      title: '举报人：头像/等级/昵称/ID/性别',
      dataIndex: 'informer_profile',
      render: (val) => {
        const { photo, name, id, vip, sex } = val;
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
      title: '',
      dataIndex: 'id',
      align: 'center',
      render: () => {
        return <ArrowRightOutlined style={{ fontSize: '24px' }} />;
      },
    },
    {
      title: '被举报人：头像/等级/昵称/ID/性别',
      dataIndex: 'source_profile',
      render: (val) => {
        const { photo, name, id, vip, sex } = val;
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
      title: '举报内容',
      dataIndex: 'cause',
    },
    {
      title: '举报时间',
      dataIndex: 'createdAt',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const { status } = record;
        return [
          <Button
            disabled={status === 1}
            type="link"
            key="view"
            onClick={() => {
              handleFeedbackVisible(true);
              setCurrentRow(record);
            }}
          >
            {status === 0 ? '处理' : '已处理'}
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
            <ProFormSelect
              name="status"
              label="审核状态"
              valueEnum={{ 0: '未处理', 1: '已处理' }}
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

      <ModalForm
        title="举报处理"
        width="400px"
        visible={feedbackModalVisible}
        onVisibleChange={handleFeedbackVisible}
        onFinish={async (value) => {
          const { id } = currentRow;
          try {
            const success = await complaintFeedback({ id, status: 1, ...value });
            if (success) {
              handleFeedbackVisible(false);
              message.success('举报反馈成功');
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } catch (error) {
            message.error('举报反馈失败');
          }
        }}
      >
        <ProFormTextArea
          name="feedback"
          modalProps={{
            destroyOnClose: true,
            preserve: false,
          }}
          placeholder="请输入举报反馈"
          // initialValue={'您反馈的情况我们已经知晓，谢谢您的反馈！'}
          rules={[
            {
              required: true,
              message: '举报反馈不能为空!',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
