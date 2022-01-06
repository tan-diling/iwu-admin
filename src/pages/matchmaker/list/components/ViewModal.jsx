import React from 'react';
import { Image, Modal, Descriptions, Button } from 'antd';
import moment from 'moment';

const ViewModal = (props) => {
  const { values } = props;

  const getLabel = (option, value) => {
    if (!props.settings || !props.settings.length) return '';
    const list = props.settings.find((item) => item.key === option)?.val || [];
    return list.find((item) => item.key === value)?.value;
  };

  return (
    <Modal
      title="查看红娘资料"
      width={800}
      destroyOnClose
      preserve={false}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={
        <Button type="primary" onClick={props.onCancel}>
          确定
        </Button>
      }
    >
      <Descriptions>
        <Descriptions.Item label="名称">{values.name}</Descriptions.Item>
        <Descriptions.Item label="地区">
          {getLabel('option.region', values.region)}
        </Descriptions.Item>
        <Descriptions.Item label="出生年月">
          {moment(values.birthday).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="手机号">{values.phone}</Descriptions.Item>
        <Descriptions.Item label="微信号" span={2}>
          {values.weixin || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="个人经验" span={3}>
          {values.description || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="头像" span={3}>
          <Image width={120} src={values.photo} />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewModal;
