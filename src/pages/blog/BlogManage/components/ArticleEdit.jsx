import React, { useState } from 'react';
import {
  Card,
  Tooltip,
  Button,
  Descriptions,
  Input,
  Select,
  Tag,
  Upload,
  Modal,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  UploadOutlined,
  PlusCircleOutlined,
  FormOutlined,
  AlignLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styles from '../index.less';
import { isArray } from 'lodash';
import { useMount, useRequest } from 'ahooks';
import axios from 'axios';
// markdow编辑展示相关
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import FormItem from 'antd/lib/form/FormItem';

// markdow语法解析器
const mdParser = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && window.hljs.getLanguage(lang)) {
      try {
        return window.hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  },
});
const DescriptionItem = Descriptions.Item;
const SelectOption = Select.Option;
const { TextArea } = Input;

// 请求所有可选的文章标签
const queryAllLabels = async () => {
  const { data: res } = await axios.get('/api/blog/articleLabels/all');

  return res.data.map((item) => ({
    label: item.name,
    value: item.name,
  }));
};

/*
 * 文章编辑
 */
export default function ArticleEdit({ mode, data, backList }) {
  // 标题
  const [title, setTitle] = useState('');
  // 摘要
  const [abstract, setAbstract] = useState('');
  // 标签
  // 所有可选的标签
  const { data: labelOptions = [] } = useRequest(queryAllLabels);
  const [labels, setLabels] = useState([]);
  const [isLabelAdd, setLabelsAdd] = useState(false); // 是否新增标签
  const [isCustomize, setCustomize] = useState(false); // 是否自定义标签
  const [newLabel, setNewLabel] = useState(''); // 新标签值
  // 封面
  const [cover, setCover] = useState('');
  const [imgeTemp, setImgTemp] = useState('');
  const [urlModalVisible, setUrlModal] = useState(false);
  const [mask, setMask] = useState(false);
  // 文章内容md
  const [mdContent, setMdContent] = useState('');
  // 文章内容 html
  const [htmlContent, setHtmlContent] = useState('');

  useMount(() => {
    if (mode === 'edit') {
      setTitle(data.title);
      setAbstract(data.abstract);
      setLabels(data.labels ? data.labels.split(',') : []);
      setCover(data.cover_url);
      setMdContent(data.content_md);
      setHtmlContent(data.content_html);
    }
  });

  //md编辑时响应函数
  const handleEditorChange = ({ html, text }) => {
    console.log('handleEditorChange', html, text);
    setMdContent(text);
    setHtmlContent(html);
  };

  // 提交文章
  const handlePostArticle = () => {
    if (title && abstract && labels && cover && mdContent && htmlContent) {
      Modal.confirm({
        title: '确定保存当前文章?',
        icon: null,
        onOk() {
          let labelsStr = labels.join(',');
          if (mode === 'edit') {
            let body = {
              id: data.article_id,
              title,
              abstract,
              labelsStr,
              cover,
              mdContent,
              htmlContent,
            };
            axios
              .post('/api/blog/articles/update', body, {
                headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': window.localStorage.getItem('x-csrf-token'),
                },
              })
              .then((res) => {
                if (res.data.success) {
                  message.success('更新成功');
                  backList();
                } else {
                  message.error(res.data.message);
                }
              });
          } else {
            let body = { title, abstract, labelsStr, cover, mdContent, htmlContent };
            axios
              .post('/api/blog/articles/add', body, {
                headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': window.localStorage.getItem('x-csrf-token'),
                },
              })
              .then((res) => {
                if (res.data.success) {
                  message.success('创建成功');
                  backList();
                } else {
                  message.error(res.data.message);
                }
              });
          }
        },
        onCancel() {},
      });
    } else {
      message.warn('请确认文章每项信息都已经填写!');
    }
  };

  const beforeUploadMd = (file, fileList) => {
    console.log(file);
    console.log(fileList);

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setMdContent(reader.result);
    };
    reader.onerror = () => {
      message.error('上传失败');
    };
  };

  // 删除已选的标签
  const removeLabel = (label) => {
    let newLabels = labels.filter((item) => item !== label);

    setLabels(newLabels);
  };

  return (
    <Card
      className={styles.EditWrap}
      title={`${mode === 'edit' ? '编辑' : '创建'}文章`}
      extra={[
        <Tooltip key="back" title="返回文章列表">
          <Button type="primary" icon={<ArrowLeftOutlined />} onClick={backList} />
        </Tooltip>,
      ]}
    >
      <Descriptions column={1}>
        <DescriptionItem label={'标题'}>
          <Input
            placeholder="输入你的文章标题"
            style={{ width: '60%' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DescriptionItem>
        <DescriptionItem label={'摘要'} style={{ paddingBottom: 0 }}>
          <TextArea
            placeholder="输入摘要"
            rows={4}
            showCount
            maxLength={200}
            style={{ width: '60%' }}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        </DescriptionItem>
        <DescriptionItem label={'标签'}>
          {isArray(labels) &&
            labels.length > 0 &&
            labels.map((item) => (
              <Tag
                className={styles.featureTag}
                key={item}
                closable
                onClose={() => removeLabel(item)}
              >
                {item}
              </Tag>
            ))}
          {!isLabelAdd && (
            <PlusCircleOutlined
              onClick={() => {
                setLabelsAdd(true);
              }}
            />
          )}
          {isLabelAdd && (
            <>
              {isCustomize ? (
                <>
                  <Input
                    style={{ width: 100 }}
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                  />
                  <Tooltip title="取消自定义">
                    <AlignLeftOutlined
                      style={{ marin: '0 10px', color: '#777' }}
                      onClick={() => {
                        setCustomize(false);
                        setNewLabel('');
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Select
                    showSearch
                    style={{ width: 100 }}
                    options={labelOptions.filter((item) => !labels.includes(item.value))}
                    onSelect={(val) => setNewLabel(val)}
                  />
                  <Tooltip title="自定义">
                    <FormOutlined
                      style={{ marin: '0 10px', color: '#777' }}
                      onClick={() => {
                        setCustomize(true);
                        setNewLabel('');
                      }}
                    />
                  </Tooltip>
                </>
              )}

              <CheckCircleOutlined
                className={styles.manulIcon}
                style={{
                  margin: '0 6px 0 16px',
                }}
                onClick={() => {
                  if (newLabel) {
                    setLabels([...labels, newLabel]);
                    setNewLabel('');
                  }
                  setLabelsAdd(false);
                }}
              />
              <CloseCircleOutlined
                className={styles.manulIcon}
                onClick={() => {
                  setLabelsAdd(false);
                  setNewLabel('');
                }}
              />
            </>
          )}
        </DescriptionItem>
        <DescriptionItem label={'封面'}>
          {/* <Upload
            name="cover"
            listType="picture-card"
            className="cover-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            // beforeUpload={beforeUpload}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {cover ? <img src={cover} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload> */}

          {cover ? (
            <div
              className={styles.coverWrap}
              onMouseEnter={() => setMask(true)}
              onMouseLeave={() => setMask(false)}
            >
              <img className={styles.coverImg} src={cover} alt="avatar" style={{ width: '100%' }} />
              {mask && (
                <div className={styles.mask}>
                  <DeleteOutlined className={styles.delete} onClick={() => setCover('')} />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.uploadCover} onClick={() => setUrlModal(true)}>
              <PlusOutlined />
            </div>
          )}
          {/* 输入封面图片url的对话框 */}
          <Modal
            title={'封面图片url'}
            width={600}
            visible={urlModalVisible}
            bodyStyle={{ padding: 10 }}
            footer={[
              <Button
                key={'ok'}
                type={'primary'}
                onClick={() => {
                  setCover(imgeTemp);
                  setImgTemp('');
                  setUrlModal(false);
                }}
              >
                {'确定'}
              </Button>,
            ]}
            onCancel={() => setUrlModal(false)}
          >
            <Input
              value={imgeTemp}
              onChange={(e) => setImgTemp(e.target.value)}
              placeholder="输入封面的url地址"
            />
          </Modal>
        </DescriptionItem>
        <DescriptionItem label={'文本内容'}>
          <Upload beforeUpload={beforeUploadMd} maxCount={1} accept={'.md'} showUploadList={false}>
            <Tooltip key="uploadMd" title="上传md文件">
              <Button type="primary" icon={<UploadOutlined />} style={{ marginRight: 12 }}>
                {'本地上传'}
              </Button>
            </Tooltip>
          </Upload>
        </DescriptionItem>
      </Descriptions>
      <div>
        <MdEditor
          style={{ height: 600 }}
          value={mdContent}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
        />
      </div>
      <Button type={'primary'} size="large" style={{ marginTop: 20 }} onClick={handlePostArticle}>
        提交
      </Button>
    </Card>
  );
}
