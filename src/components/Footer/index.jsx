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
      copyright={`2022 个人所有 青云平台`}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/IvonSnow',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
