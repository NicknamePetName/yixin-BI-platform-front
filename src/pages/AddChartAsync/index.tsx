import {getChartByAiAsyncUsingPost, getChartByAiUsingPost} from '@/services/yixinbi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Space, Upload } from 'antd';
import { createStyles } from 'antd-style';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import {useForm} from "antd/es/form/Form";

const useStyles = createStyles(() => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      marginLeft: '-300px',
      width: '100%',
      height: '100vh',
      overflow: 'auto',
      marginTop: '-33px',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

/**
 * 添加图表页面
 * @constructor
 */

const { Option } = Select;
const AddChartAsync: React.FC = () => {
  const [form, setForm] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const { styles } = useStyles();

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) return;
    setSubmitting(true);

    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await getChartByAiAsyncUsingPost(params, {}, values.file.file.originFileObj);

      if (!res?.data) {
        message.success('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <div className={styles.container}></div>
      <Form form={form} name="addChart" onFinish={onFinish} initialValues={{}}>
        <Form.Item
          name="goal"
          label="分析目标"
          rules={[{ required: true, message: '请输入分析目标' }]}
        >
          <TextArea placeholder="请输入你的分析需求，比如：分析网站的用户增长情况" />
        </Form.Item>

        <Form.Item name="name" label="图表名称" rules={[{ required: true, message: '请输入图表' }]}>
          <Input placeholder="请输图表名称" />
        </Form.Item>

        <Form.Item name="chartType" label="图表类型" style={{ marginLeft: '10px' }}>
          <Select placeholder="请选择图表类型">
            <Option value="折线图">折线图</Option>
            <Option value="条形图">条形图</Option>
            <Option value="柱状图">柱状图</Option>
            <Option value="堆叠图">堆叠图</Option>
            <Option value="饼图">饼图</Option>
            <Option value="雷达图">雷达图</Option>
            <Option value="散点图">散点图</Option>
          </Select>
        </Form.Item>

        <Form.Item name="file" label="原始数据" rules={[{ required: true, message: '请上传CSV文件' }]}>
          <Upload name="file" maxCount={1}>
            <Button icon={<UploadOutlined />}>上传CSV文件</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
              提交
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
export default AddChartAsync;
