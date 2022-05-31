import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Modal } from 'antd';
import ArticleList from './components/ArticleList';
import ArticleEdit from './components/ArticleEdit';
import styles from './index.less';
import classNames from 'classnames';
import axios from 'axios';

/*
 * 博客管理
 */
export default function BlogManage() {
  // 当前选中的文章行
  const [current, setCurrent] = useState(undefined);
  // 当前状态：list edit add
  const [mode, setMode] = useState('list');

  // 新建文章
  const toAdd = () => {
    setMode('add');
  };
  // 编辑文章
  const toEdit = (record) => {
    setCurrent(record);
    setMode('edit');
  };

  // 返回文章列表
  const backList = () => {
    setCurrent(undefined);
    setMode('list');
  };

  return (
    <PageContainer>
      <div className={classNames(styles.articleListWrap, { [styles.active]: mode === 'list' })}>
        {mode === 'list' && <ArticleList toEdit={toEdit} toAdd={toAdd} />}
      </div>
      <div className={classNames(styles.articleEditWrap, { [styles.active]: mode !== 'list' })}>
        {mode !== 'list' && <ArticleEdit mode={mode} backList={backList} data={current} />}
      </div>
    </PageContainer>
  );
}
