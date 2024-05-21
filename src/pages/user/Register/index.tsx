import { Footer } from '@/components';
import {userLoginUsingPost, userRegisterUsingPost} from '@/services/yixinbi/userController';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, Link, history } from '@umijs/max';
import { Tabs, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});



const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { styles } = useStyles();
  const [formKey, setFormKey] = useState(0); // 状态用于强制重新渲染表单组件
  
  // 表单提交
  const handleSubmit = async (values: API.UserRegisterRequest) => {

    const {userPassword, checkPassword} = values;
    if (userPassword !== checkPassword) {
      message.error("两次输入的密码不一致");
      return;
    }

    try {
      // 注册
      const res = await userRegisterUsingPost(values);
      if (res.data) {
        message.success('注册成功！');
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/user/login');
        return;
      } else {
        setFormKey(prevKey => prevKey + 1);
        message.error('注册失败:' + res.message);
      }
    } catch (error: any) {
      setFormKey(prevKey => prevKey + 1);
      console.log(error);
      message.error('注册失败，请重试！');
    }
  };
  // const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
        </title>
      </Helmet>

      <div
        style={{
          marginTop: '90px',
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/register.svg" />}
          title="欢迎注册 亦忻 智能 BI 平台"
          subTitle={
            <a href="https://github.com/NicknamePetName" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color:'#1677ff'}}>亦忻智能 BI 平台是自动生成可视化图表及分析结论，实现数据分析的降本增效的智能数据分析平台</a>
          }
          initialValues={{
            autoLogin: true,
          }}
          key={formKey}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '40px',
              padding: '1px 10px',
              margin: '0',
              fontSize: '15px',
              backgroundImage:
                'linear-gradient(to top right, #b3e5fc 0%, #90caf9 50%, #673ab7 100%)',
              border: 'solid 1px #1677ff',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            <Link to="/user/login">登录</Link>
          </div>
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码注册',
              },
              {
                key: 'mobile',
                label: '手机号注册',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入用户名: '}
                rules={[
                  {
                    required: true,
                    message: '用户名不能为空！',
                  },
                  {
                    min: 4,
                    type: 'string',
                    message: '长度不能小于 4',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码: '}
                rules={[
                  {
                    required: true,
                    message: '密码不能为空！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '长度不能小于 8',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请再次输入密码: '}
                rules={[
                  {
                    required: true,
                    message: '密码不能为空！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '长度不能小于 8',
                  },
                ]}
              />
            </>
          )}

          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="mobile"
                placeholder={'请输入手机号！'}
                rules={[
                  {
                    required: true,
                    message: '手机号不能为空！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '不合法的手机号！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码: '}
                rules={[
                  {
                    required: true,
                    message: '密码不能为空！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '长度不能小于 8',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码！'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'秒后重新获取'}`;
                  }
                  return '获取验证码';
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '验证码不能为空！',
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  // const result = await getFakeCaptcha({
                  //   phone,
                  // });
                  // if (!result) {
                  //   return;
                  // }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
