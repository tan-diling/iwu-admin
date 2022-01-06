import React from 'react';
import { Tabs, Image, Row, Col, Modal, Descriptions, Button } from 'antd';
import moment from 'moment';
import styles from '../index.less';

const { TabPane } = Tabs;

const ViewModal = (props) => {
  const { values } = props;

  const getLabel = (option, value) => {
    if (!props.settings || !props.settings.length) return '';
    const list = props.settings.find((item) => item.key === option)?.val || [];
    return list.find((item) => item.key === value)?.value;
  };

  return (
    <Modal
      title="查看个人资料"
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
      <Tabs tabPosition="left">
        <TabPane tab="基本信息" key="1">
          <Descriptions>
            <Descriptions.Item label="名称">{values.name}</Descriptions.Item>
            <Descriptions.Item label="性别">{getLabel('option.sex', values.sex)}</Descriptions.Item>
            <Descriptions.Item label="出生年月">
              {moment(values.birthday).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="身高（cm）">{values.height}</Descriptions.Item>
            <Descriptions.Item label="体重（kg）">{values.weight}</Descriptions.Item>

            <Descriptions.Item label="学历">
              {getLabel('option.education', values.education)}
            </Descriptions.Item>
            <Descriptions.Item label="民族">{values.nation}</Descriptions.Item>
            <Descriptions.Item label="婚姻状况">
              {getLabel('option.maritalStatus', values.maritalStatus)}
            </Descriptions.Item>

            <Descriptions.Item label="有无子女">
              {+values.children === 1 ? '有' : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="血型">
              {getLabel('option.blood', values.blood)}
            </Descriptions.Item>
            <Descriptions.Item label="年入">
              {getLabel('option.income-range', values.income)}
            </Descriptions.Item>
            <Descriptions.Item label="房和车状况">{`${values.house ? '有' : '无'}房${
              values.car ? '有' : '无'
            }车`}</Descriptions.Item>

            <Descriptions.Item label="居住地">
              {getLabel('option.region', values.region)}
            </Descriptions.Item>
            <Descriptions.Item label="户口地">
              {values.address?.split(',').join('')}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="联系方式" key="2">
          <Descriptions>
            <Descriptions.Item label="手机号">{values.contact?.phone}</Descriptions.Item>
            <Descriptions.Item label="微信号">{values.contact?.weixin || '-'}</Descriptions.Item>
            <Descriptions.Item label="抖音号">{values.contact?.douyin || '-'}</Descriptions.Item>
            <Descriptions.Item label="微博号">{values.contact?.weibo || '-'}</Descriptions.Item>
            <Descriptions.Item label="QQ号">{values.contact?.qq || '-'}</Descriptions.Item>
            <Descriptions.Item label="小红书号">
              {values.contact?.xiaohongshu || '-'}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="内心告白" key="3">
          <Descriptions>
            <Descriptions.Item label="内心告白">{values.intro}</Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="兴趣爱好" key="4">
          <Descriptions>
            <Descriptions.Item label="兴趣爱好">{values.interest}</Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="个人相册" key="5">
          <Row style={{ marginTop: '-10px' }}>
            {values.photo?.map((item) => (
              <Col span={8} key={item}>
                <div className={styles.imgWrapper}>
                  <Image width={180} src={item} />
                </div>
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ViewModal;
