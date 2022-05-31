import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { Button, message, Table, Modal, Form, Card, Input } from 'antd';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 13,
  },
};

export default function BlogFeature() {
  const { data, run: updateLabelsList, error, loading } = useRequest(queryLabelsList);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);
  const [labelForm] = Form.useForm();

  const labelListColumns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: 400,
      align: 'center',
    },
    {
      title: '中文名',
      dataIndex: 'cn_name',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: '总文章数',
      dataIndex: 'article_count',
      align: 'center',
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

  useEffect(() => {
    if (addModalVisible && current) {
      // 编辑时，给表单赋初值
      labelForm.setFieldsValue(current);
    }
  }, [current, addModalVisible, labelForm]);

  // 新增标签
  const toAdd = () => {
    labelForm.resetFields();
    setAddModalVisible(true);
  };

  const handleAdd = () => {
    labelForm.validateFields().then((values) => {
      axios
        .post('/api/blog/articleLabels/add', values, {
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': window.localStorage.getItem('x-csrf-token'),
          },
        })
        .then((res) => {
          if (res.data.success) {
            message.success('新增成功');
            updateLabelsList();
            setAddModalVisible(false);
          } else {
            message.error(res.data.message);
          }
        });
    });
  };

  const cancelAdd = () => {
    setAddModalVisible(false);
    setCurrent(undefined);
  };

  // 删除标签
  const toDelete = (record) => {
    Modal.confirm({
      title: '确认删除该标签?',
      onOk: () => {
        axios
          .delete(`/api/blog/articleLabels/delete?id=${record.id}`, {
            headers: {
              'x-csrf-token': window.localStorage.getItem('x-csrf-token'),
            },
          })
          .then((res) => {
            if (res.data.success) {
              message.success(res.data.message);
              updateLabelsList();
            } else {
              message.error(res.data.message);
            }
          });
      },
      onCancel: () => {},
    });
  };

  // 编辑标签
  const toEdit = (record) => {
    setAddModalVisible(true);
    setCurrent(record);
  };

  const handleEdit = () => {
    labelForm.validateFields().then((values) => {
      const body = {
        id: current.id,
        ...values,
      };
      axios
        .post('/api/blog/articleLabels/update', body, {
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': window.localStorage.getItem('x-csrf-token'),
          },
        })
        .then((res) => {
          if (res.data.success) {
            message.success('更新成功');
            updateLabelsList();
            setAddModalVisible(false);
          } else {
            message.error(res.data.message);
          }
        });
    });
  };

  const getGabelModalContent = () => {
    return (
      <Form form={labelForm}>
        <Form.Item
          label={'标签名'}
          name={'name'}
          rules={[{ required: true, message: '标签名必填' }]}
          {...formItemLayout}
        >
          <Input placeholder="请输入标签名" />
        </Form.Item>

        <Form.Item label={'中文别名'} name={'cn_name'} {...formItemLayout}>
          <Input />
        </Form.Item>

        <Form.Item label={'描述'} name={'description'} {...formItemLayout}>
          <Input />
        </Form.Item>
      </Form>
    );
  };

  return (
    <>
      <Card
        title={'标签列表'}
        extra={[
          <Button key={'add'} type={'primary'} onClick={toAdd}>
            {'新增标签'}
          </Button>,
        ]}
      >
        <Table dataSource={data} columns={labelListColumns} />
      </Card>

      <Modal
        title={`${current ? '编辑' : '新增'}标签`}
        visible={addModalVisible}
        destroyOnClose={true}
        onCancel={cancelAdd}
        footer={[
          <Button key="cancel" onClick={cancelAdd}>
            {'取消'}
          </Button>,
          <Button key="ok" type={'primary'} onClick={current ? handleEdit : handleAdd}>
            {current ? '保存' : '新增'}
          </Button>,
        ]}
      >
        {getGabelModalContent()}
      </Modal>
    </>
  );
}

// 获取文章列表数据
const queryLabelsList = async () => {
  const { data: res } = await axios.get('/api/blog/articleLabels/list');
  return res.data;
};
