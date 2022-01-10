import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Tabs, Row, Col, message, Button, Card } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormUploadButton,
  ProFormDatePicker,
  ProFormCascader,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import Debounce from 'lodash.debounce';
import addressData, { provinceData, cityData } from '@/utils/address';
import { getToken } from '@/utils/auth';
import { addUser } from '@/services/user';
import { getSettings } from '@/services/common';
import request from '@/utils/request';

const UserDataEntry = () => {
  const { data: settings = [] } = useRequest(getSettings);
  const [fileList, setFileList] = useState([]);
  const [tabKey, setTabKey] = useState('entry');

  const getValueEnum = (option) => {
    if (!settings || !settings.length) return {};
    const list = settings.find((item) => item.key === option)?.val || [];
    return list.reduce((res, cur) => {
      const { key, value } = cur;
      return { ...res, [key]: value };
    }, {});
  };

  const defaultRules = {
    rules: [
      {
        required: true,
        message: '请填写',
      },
    ],
  };

  const handleTabChange = (key) => {
    setTabKey(key);
  };

  const handleReset = (e) => {
    setFileList([]);
  };

  const getAddress = (addressVal = []) => {
    if (!addressVal.length) return '';
    const [provinceValue, cityValue] = addressVal;
    const provinceIndex = provinceData.map((item) => item.value).indexOf(provinceValue);
    const province = provinceData[provinceIndex].label;
    const city = cityData[provinceIndex].find((item) => item.value === cityValue).label;
    return [province, city].join(',');
  };

  const showError = Debounce((file) => {
    if (file.status === 'error') {
      console.log('file', file);
      message.error(`上传失败，请稍后再试！error: ${file?.response?.message}`);
    }
  }, 300);

  const handleChangeFileList = ({ file, fileList: files }) => {
    showError(file);
    setFileList(files.filter((item) => item.status !== 'error'));
  };

  const handleSubmit = async (value) => {
    console.log('value', value);
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
      isPublished: true,
      createSource: 'input',
      ...houseAndCar[value.houseAndCar],
    };
    console.log('submitData', submitData);
    try {
      const res = await addUser(submitData);
      if (res && res.code === 200) {
        message.success('新增个人资料成功!');
      }
    } catch (error) {
      message.error(`新增个人资料失败! errorCode: ${error.errorCode}`);
    }
  };

  return (
    <PageContainer
      tabList={[
        {
          tab: '手动录入',
          key: 'entry',
        },
        {
          tab: '数据导入',
          key: 'import',
        },
      ]}
      onTabChange={handleTabChange}
    >
      {tabKey === 'entry' ? (
        <ProForm
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
          }}
          onFinish={handleSubmit}
          onReset={handleReset}
        >
          <Card title="基本信息">
            <Row gutter="24">
              <Col span={8}>
                <ProFormText name="name" label="名称" {...defaultRules} />
              </Col>
              <Col span={8}>
                <ProFormSelect
                  name="sex"
                  label="性别"
                  valueEnum={getValueEnum('option.sex')}
                  rules={[
                    {
                      required: true,
                      message: '请输入',
                    },
                  ]}
                  {...defaultRules}
                />
              </Col>
              <Col span={8}>
                <ProFormDatePicker
                  name="birthday"
                  label="出生年月"
                  {...defaultRules}
                  width={'lg'}
                />
              </Col>
              <Col span={8}>
                <ProFormDigit name="height" label="身高（cm）" {...defaultRules} />
              </Col>
              <Col span={8}>
                <ProFormDigit name="weight" label="体重（kg）" {...defaultRules} />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="education"
                  label="学历"
                  valueEnum={getValueEnum('option.education')}
                  {...defaultRules}
                />
              </Col>
              <Col span={8}>
                <ProFormText name="nation" label="民族" {...defaultRules} />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="maritalStatus"
                  label="婚姻状况"
                  valueEnum={getValueEnum('option.maritalStatus')}
                  {...defaultRules}
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="children"
                  label="有无子女"
                  valueEnum={{ 0: '无', 1: '有' }}
                  {...defaultRules}
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="blood"
                  label="血型"
                  valueEnum={getValueEnum('option.blood')}
                  {...defaultRules}
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="income"
                  label="年入"
                  valueEnum={getValueEnum('option.income-range')}
                  {...defaultRules}
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="houseAndCar"
                  label="房和车状况"
                  valueEnum={{ 0: '有房有车', 1: '无房有车', 2: '有房无车', 3: '无房无车' }}
                  {...defaultRules}
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="region"
                  label="居住地"
                  valueEnum={getValueEnum('option.region')}
                  {...defaultRules}
                />
              </Col>
              <Col span={8}>
                <ProFormCascader
                  name="address"
                  label="户口地"
                  fieldProps={{ options: addressData }}
                  {...defaultRules}
                />
              </Col>
            </Row>
          </Card>

          <Card title="联系方式" style={{ marginTop: '24px' }}>
            <Row gutter="24">
              <Col span={8}>
                <ProFormText name="contact.phone" label="手机号" {...defaultRules} />
              </Col>
              <Col span={8}>
                <ProFormText name="contact.weixin" label="微信号" />
              </Col>
              <Col span={8}>
                <ProFormText name="contact.douyin" label="抖音号" />
              </Col>
              <Col span={8}>
                <ProFormText name="contact.weibo" label="微博号" />
              </Col>
              <Col span={8}>
                <ProFormText name="contact.qq" label="QQ号" />
              </Col>
              <Col span={8}>
                <ProFormText name="contact.xiaohongshu" label="小红书号" />
              </Col>
            </Row>
          </Card>

          <Card title="内心告白" style={{ marginTop: '24px' }}>
            <ProFormTextArea
              name="intro"
              fieldProps={{
                showCount: {
                  formatter: ({ count }) => `${count}/100`,
                  min: 10,
                  maxLength: 100,
                },
              }}
              rules={[
                {
                  required: true,
                  message: '请填写',
                },
                { max: 100, type: 'string', message: '请输入10~100字内' },
                { min: 10, type: 'string', message: '请输入10~100字内' },
              ]}
            />
          </Card>

          <Card title="兴趣爱好" style={{ marginTop: '24px' }}>
            <ProFormTextArea
              name="interest"
              fieldProps={{
                showCount: {
                  formatter: ({ count }) => `${count}/100`,
                  maxLength: 100,
                },
              }}
              rules={[
                {
                  required: true,
                  message: '请填写',
                },
                { max: 100, type: 'string', message: '请输入100字内' },
              ]}
            />
          </Card>

          <Card title="个人相册" style={{ marginTop: '24px' }}>
            <ProFormUploadButton
              name="photo"
              max={9}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                headers: { Authorization: `Bearer ${getToken()}` },
                // customRequest: request,
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
          </Card>
        </ProForm>
      ) : (
        <Card>
          <ProFormUploadButton
            name="photo"
            max={9}
            title={'上传表格'}
            fieldProps={{
              name: 'file',
              type: 'primary',
              // listType: 'picture-card',
              headers: { Authorization: `Bearer ${getToken()}` },
              // customRequest: request,
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

          <div>
            导入的Execl表格请勿私自改动数据结构，请用官方标准模版填入数据进行导入。
            <Button type="link" icon={<DownloadOutlined />}>
              下载模板
            </Button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default UserDataEntry;
