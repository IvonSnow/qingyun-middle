import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`青云平台 Created by xueyunfeng`}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/IvonSnow',
          blankTarget: true,
        },
        {
          key: 'right',
          title: '苏ICP备2022024806号-1',
          href: 'https://beian.miit.gov.cn',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
