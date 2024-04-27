import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '亦忻';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '亦忻智能 BI 平台',
          title: '亦忻智能 BI 平台',
          href: '项目地址',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/NicknamePetName',
          blankTarget: true,
        },
        {
          key: '亦忻智能 BI 平台',
          title: '亦忻智能 BI 平台',
          href: '项目地址',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
