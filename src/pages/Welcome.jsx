import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome = () => {
  const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <Alert
          message={'为个人网站提供统一的管理，格局一下子就大了'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>博客中心</Typography.Text>
        <ul>
          <li>博客管理: 博客增删编辑</li>
          <li>博客标签：博客标签的增删编辑</li>
          <li>博客类目：待实现</li>
        </ul>
        {/* <CodePreview>yarn add @ant-design/pro-layout</CodePreview> */}
      </Card>
    </PageContainer>
  );
};

export default Welcome;
