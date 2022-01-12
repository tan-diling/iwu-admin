import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import { getToken } from '@/utils/auth';
import { updateMatchmaker, addMatchmaker } from '@/services/matchmaker';

const UpdateModal = (props) => {
  const {
    values,
    values: { photo = '' },
  } = props;
  const [fileList, setFileList] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState([]);

  useEffect(() => {
    setFileList(photo ? [{ uid: photo, name: photo, status: 'done', url: photo }] : []);
    setDefaultFileList(photo.map((item) => ({ uid: item, name: item, status: 'done', url: item })));
  }, [photo]);

  const getValueEnum = (option) => {
    if (!props.settings || !props.settings.length) return {};
    const list = props.settings.find((item) => item.key === option)?.val || [];
    return list.reduce((res, cur) => {
      const { key, value } = cur;
      return { ...res, [key]: value };
    }, {});
  };

  const handleChangeFileList = ({ file, fileList: files }) => {
    setFileList(files);
  };

  const handleSubmit = async (value) => {
    const photoList = fileList
      .filter((item) => item.status === 'done')
      .map((item) => {
        if (item.response) {
          return item.response?.data?.url;
        }
        return item.url;
      });
    const submitData = {
      ...values,
      ...value,
      label: '金牌媒人',
      photo: photoList.join(''),
    };
    try {
      const submitFunc = values.id ? updateMatchmaker : addMatchmaker;
      const res = await submitFunc(submitData);
      if (res && res.code === 200) {
        message.success(`${values.id ? '编辑' : '新增'}红娘资料成功!`);
        props.onVisibleChange(false);
        props.handleRefreshTable();
      }
    } catch (error) {
      message.error(`${values.id ? '编辑' : '新增'}红娘资料失败! errorCode: ${error.errorCode}`);
    }
  };

  const defaultRules = {
    rules: [
      {
        required: true,
        message: '请填写',
      },
    ],
  };

  return (
    <ModalForm
      title={`${values.id ? '编辑' : '新增'}红娘`}
      width={800}
      modalProps={{
        destroyOnClose: true,
        preserve: false,
      }}
      visible={props.visible}
      onVisibleChange={props.onVisibleChange}
      // initialValues={values}
      onFinish={handleSubmit}
    >
      <Row gutter="24">
        <Col span={24}>
          <ProFormUploadButton
            name="photo"
            label="头像"
            max={1}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              headers: { Authorization: `Bearer ${getToken()}` },
            }}
            action="/api/image/upload"
            fileList={fileList}
            initialValue={defaultFileList}
            onChange={handleChangeFileList}
            rules={[
              {
                required: true,
                message: '请选择至少一张照片',
              },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormText name="name" label="名称" initialValue={values.name} {...defaultRules} />
        </Col>
        <Col span={12}>
          <ProFormText
            name="region"
            label="地区"
            valueEnum={getValueEnum('option.region')}
            initialValue={values.region}
            {...defaultRules}
          />
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            name="birthday"
            label="出生年月"
            initialValue={values.birthday}
            width={'lg'}
            {...defaultRules}
          />
        </Col>
        <Col span={12}>
          <ProFormText name="phone" label="手机号" initialValue={values.phone} {...defaultRules} />
        </Col>
        <Col span={12}>
          <ProFormText name="weixin" label="微信号" initialValue={values.weixin} />
        </Col>

        <Col span={24}>
          <ProFormTextArea
            name="description"
            label="个人经验（100字内）"
            initialValue={values.description}
            rules={[
              {
                required: true,
                message: '请填写',
              },
              { max: 100, type: 'string', message: '请输入100字内' },
            ]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default UpdateModal;
