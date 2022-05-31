import React, { useState, useRef } from 'react';
import {
  Button,
  message,
  Drawer,
  Badge,
  Table,
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Modal,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRequest } from 'ahooks';
import styles from '../index.less';
import { isArray } from 'lodash';
import moment from 'moment';

const DescriptionItem = Descriptions.Item;

// 获取文章列表数据
const queryArticlesList = async () => {
  const { data: res } = await axios.get('/api/blog/articles/list');
  return res;
};

/*
 * 文章列表
 */
export default function ArticleList({ toEdit, toAdd }) {
  const { data, run: updateArticlesList, error, loading } = useRequest(queryArticlesList);
  const [detailVisible, setDetailVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);

  const toDetail = (record) => {
    setDetailVisible(true);
    setCurrent(record);
  };

  // 删除文章
  const toDelete = (record) => {
    Modal.confirm({
      title: '确认删除该文章?',
      onOk: () => {
        console.log(record);
        axios
          .delete(`/api/blog/articles/delete?id=${record.article_id}`, {
            headers: {
              'x-csrf-token': window.localStorage.getItem('x-csrf-token'),
            },
          })
          .finally(() => {
            updateArticlesList();
          });
      },
      onCancel: () => {},
    });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 400,
      align: 'center',
      render: (dom, record) => {
        return <a onClick={() => toDetail(record)}>{dom}</a>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (_, record) => {
        return record.status == '1' ? (
          <Badge color="#52c41a" text={<span style={{ color: '#52c41a' }}>{'发布'}</span>} />
        ) : (
          <Badge color="#bfbfbf" text={<span style={{ color: '#bfbfbf' }}>{'本地'}</span>} />
        );
      },
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      align: 'center',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      align: 'center',
    },
    {
      title: '浏览量',
      dataIndex: 'read_count',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val, _) => {
        return moment(val).format('YYYY-MM-DD');
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                toEdit(record);
              }}
            >
              {'编辑'}
            </a>
            &nbsp;&nbsp;
            <a onClick={() => toDelete(record)}>{'删除'}</a>
          </>
        );
      },
    },
  ];

  const getDetailContent = () => {
    return (
      <Descriptions column={2} className={styles.detailContent}>
        <DescriptionItem span={2}>
          <h2 className={styles.detailTitle}>{current.title}</h2>
        </DescriptionItem>
        <DescriptionItem label={'状态'}>
          {current.status == '1' ? (
            <Badge color="#52c41a" text={<span style={{ color: '#52c41a' }}>{'发布'}</span>} />
          ) : (
            <Badge color="#bfbfbf" text={<span style={{ color: '#bfbfbf' }}>{'本地'}</span>} />
          )}
        </DescriptionItem>
        <DescriptionItem label={'置顶'}>
          {current.topFlag ? (
            <Badge color="#fa541c" text={<span style={{ color: '#fa541c' }}>{'是'}</span>} />
          ) : (
            <Badge color="#bfbfbf" text={<span style={{ color: '#bfbfbf' }}>{'否'}</span>} />
          )}
        </DescriptionItem>
        <DescriptionItem label={'推荐数'}>{current.like_count}</DescriptionItem>
        <DescriptionItem label={'评论数'}>{current.comment_count}</DescriptionItem>
        <DescriptionItem label={'浏览量'}>{current.read_count}</DescriptionItem>
        <DescriptionItem label={'创建时间'}>{current.created_at}</DescriptionItem>
        <DescriptionItem span={2}>
          <img className={styles.detailImg} alt={current.title} src={current.cover_url} />
        </DescriptionItem>
        <DescriptionItem label={'标签'} span={2} className={styles.detailAbstract}>
          {isArray(current.feature) &&
            current.feature.map((item) => (
              <Tag className={styles.featureTag} key={item}>
                {item}
              </Tag>
            ))}
        </DescriptionItem>
        <DescriptionItem label={'摘要'} span={2} className={styles.detailAbstract}>
          {current.abstract}
        </DescriptionItem>
      </Descriptions>
    );
  };

  return (
    <>
      <Card
        title={'文章列表'}
        extra={[
          <Button key={'add'} type={'primary'} onClick={toAdd}>
            {'新建文章'}
          </Button>,
        ]}
      >
        <Table dataSource={data} columns={columns} />
      </Card>

      {/* 侧边抽屉详情 */}
      <Drawer
        width={500}
        visible={detailVisible}
        onClose={() => {
          setCurrent(undefined);
          setDetailVisible(false);
        }}
        closable={false}
      >
        {current && getDetailContent()}
      </Drawer>
    </>
  );
}
