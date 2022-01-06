import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormUploadButton,
  ProFormDatePicker,
  ProFormCascader,
} from '@ant-design/pro-form';
import addressData, { provinceData, cityData } from '@/utils/address';
import { getToken } from '@/utils/auth';
import { updateUser } from '@/services/user';

const { TabPane } = Tabs;

const UpdateModal = (props) => {
  const {
    values,
    values: { contact = {}, photo = [] },
  } = props;
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (photo.length)
      setFileList(photo.map((item) => ({ uid: item, name: item, status: 'done', url: item })));
  }, [photo]);

  const getValueEnum = (option) => {
    if (!props.settings || !props.settings.length) return {};
    const list = props.settings.find((item) => item.key === option)?.val || [];
    return list.reduce((res, cur) => {
      const { key, value } = cur;
      return { ...res, [key]: value };
    }, {});
  };

  const getInitialAddress = () => {
    if (!values.address) return [];
    const strArr = values.address.split(',');
    const provinceIndex = provinceData.map((item) => item.label).indexOf(strArr[0]);
    const provinceValue = provinceData[provinceIndex].value;
    const cityValue = cityData[provinceIndex].find((item) => item.label === strArr[1]).value;
    return [provinceValue, cityValue];
  };

  const getAddress = (addressVal = []) => {
    if (!addressVal.length) return '';
    const [provinceValue, cityValue] = addressVal;
    const provinceIndex = provinceData.map((item) => item.value).indexOf(provinceValue);
    const province = provinceData[provinceIndex].label;
    const city = cityData[provinceIndex].find((item) => item.value === cityValue).label;
    return [province, city].join(',');
  };

  const getHouseAndCar = () => {
    const { house, car } = values;
    const houseCarVal = [
      { house: 1, car: 1 },
      { house: 0, car: 1 },
      { house: 1, car: 0 },
      { house: 0, car: 0 },
    ];
    const index = houseCarVal.findIndex((item) => item.house === house && item.car === car);
    return `${index}`;
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
    const houseAndCar = {
      0: { house: 1, car: 1 },
      1: { house: 0, car: 1 },
      2: { house: 1, car: 0 },
      3: { house: 0, car: 0 },
    };
    const submitData = {
      ...values,
      ...value,
      address: getAddress(value.address),
      photo: photoList,
      ...(value['contact.phone']
        ? {
            contact: {
              phone: value['contact.phone'],
              weixin: value['contact.weixin'],
              douyin: value['contact.douyin'],
              weibo: value['contact.weibo'],
              qq: value['contact.qq'],
              xiaohongshu: value['contact.xiaohongshu'],
            },
          }
        : {}),
      'contact.phone': undefined,
      'contact.weixin': undefined,
      'contact.douyin': undefined,
      'contact.weibo': undefined,
      'contact.qq': undefined,
      'contact.xiaohongshu': undefined,
      sex: +value.sex,
      education: +value.education,
      maritalStatus: +value.maritalStatus,
      children: +value.children,
      ...houseAndCar[value.houseAndCar],
    };
    try {
      const res = await updateUser(submitData);
      if (res && res.code === 200) {
        message.success('编辑个人资料成功!');
        props.onVisibleChange(false);
        props.handleRefreshTable();
      }
    } catch (error) {
      message.error(`编辑个人资料失败! errorCode: ${error.errorCode}`);
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
      title="编辑个人资料"
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
      <Tabs tabPosition="left">
        <TabPane tab="基本信息" key="1">
          <Row gutter="24">
            <Col span={12}>
              <ProFormText name="name" label="名称" initialValue={values.name} {...defaultRules} />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="sex"
                label="性别"
                valueEnum={getValueEnum('option.sex')}
                initialValue={`${values.sex}`}
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
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
              <ProFormDigit
                name="height"
                label="身高（cm）"
                initialValue={values.height}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormDigit
                name="weight"
                label="体重（kg）"
                initialValue={values.weight}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="education"
                label="学历"
                valueEnum={getValueEnum('option.education')}
                initialValue={`${values.education}`}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="nation"
                label="民族"
                initialValue={values.nation}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="maritalStatus"
                label="婚姻状况"
                valueEnum={getValueEnum('option.maritalStatus')}
                initialValue={`${values.maritalStatus}`}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="children"
                label="有无子女"
                valueEnum={{ 0: '无', 1: '有' }}
                initialValue={`${values.children}`}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="blood"
                label="血型"
                valueEnum={getValueEnum('option.blood')}
                initialValue={`${values.blood}`}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="income"
                label="年入"
                valueEnum={getValueEnum('option.income-range')}
                initialValue={`${values.income}`}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="houseAndCar"
                label="房和车状况"
                valueEnum={{ 0: '有房有车', 1: '无房有车', 2: '有房无车', 3: '无房无车' }}
                initialValue={getHouseAndCar()}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="region"
                label="居住地"
                valueEnum={getValueEnum('option.region')}
                initialValue={`${values.region}`}
                {...defaultRules}
              />
            </Col>
            <Col span={12}>
              <ProFormCascader
                name="address"
                label="户口地"
                fieldProps={{ options: addressData }}
                // valueEnum={getValueEnum('option.income-range')}
                initialValue={getInitialAddress()}
                {...defaultRules}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="联系方式" key="2">
          <ProForm.Group>
            <Row gutter="24">
              <Col span={12}>
                <ProFormText
                  name="contact.phone"
                  label="手机号"
                  initialValue={contact.phone}
                  disabled
                  {...defaultRules}
                />
              </Col>
              <Col span={12}>
                <ProFormText name="contact.weixin" label="微信号" initialValue={contact.weixin} />
              </Col>
              <Col span={12}>
                <ProFormText name="contact.douyin" label="抖音号" initialValue={contact.douyin} />
              </Col>
              <Col span={12}>
                <ProFormText name="contact.weibo" label="微博号" initialValue={contact.weibo} />
              </Col>
              <Col span={12}>
                <ProFormText name="contact.qq" label="QQ号" initialValue={contact.qq} />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="contact.xiaohongshu"
                  label="小红书号"
                  initialValue={contact.xiaohongshu}
                />
              </Col>
            </Row>
          </ProForm.Group>
        </TabPane>
        <TabPane tab="内心告白" key="3">
          <ProFormTextArea
            name="intro"
            label="内心告白（10~100字内）"
            initialValue={values.intro}
            min={10}
            maxLength={100}
            rules={[
              {
                required: true,
                message: '请填写',
              },
              { max: 100, type: 'string', message: '请输入10~100字内' },
              { min: 10, type: 'string', message: '请输入10~100字内' },
            ]}
          />
        </TabPane>
        <TabPane tab="兴趣爱好" key="4">
          <ProFormTextArea
            name="interest"
            label="兴趣爱好（10~100字内）"
            initialValue={values.interest}
            rules={[
              {
                required: true,
                message: '请填写',
              },
              { max: 100, type: 'string', message: '请输入10~100字内' },
              { min: 10, type: 'string', message: '请输入10~100字内' },
            ]}
          />
        </TabPane>
        <TabPane tab="个人相册" key="5">
          <ProFormUploadButton
            name="photo"
            label="个人相册（第一张照片为头像）"
            max={9}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              headers: { Authorization: `Bearer ${getToken()}` },
            }}
            action="/api/image/upload"
            fileList={fileList}
            onChange={handleChangeFileList}
            rules={[
              {
                required: true,
                message: '请选择至少一张照片',
              },
            ]}
          />
        </TabPane>
      </Tabs>
    </ModalForm>
  );
};

export default UpdateModal;
