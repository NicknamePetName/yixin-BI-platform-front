import { getChartByAiUsingPost } from '@/services/yixinbi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Select, Space, Spin, Upload } from 'antd';
import TextArea from "antd/es/input/TextArea";
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

/**
 * 添加图表页面
 * @constructor
 */

const { Option } = Select;
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.AiResponseVO>();
  const [submitting, setSubmitting] = useState(false);
  const [option, setOption] = useState<any>();

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) return;
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await getChartByAiUsingPost(params, {}, values.file.file.originFileObj);

      if (!res?.data) {
        message.success('分析失败');
      } else {
        message.success('分析成功');
        // const chartOption = JSON.parse(res.data.genChart ?? '');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Form name="addChart" onFinish={onFinish} initialValues={{}}>
        <Form.Item
          name="goal"
          label="分析目标"
          rules={[{ required: true, message: '请输入分析目标' }]}
        >
          <TextArea placeholder="请输入你的分析需求，比如：分析网站的用户增长情况" />
        </Form.Item>

        <Form.Item name="name" label="图表名称">
          <Input placeholder="请输图表名称" />
        </Form.Item>

        <Form.Item name="chartType" label="图表类型">
          <Select>
            <Option value="折线图">折线图</Option>
            <Option value="条形图">条形图</Option>
            <Option value="柱状图">柱状图</Option>
            <Option value="堆叠图">堆叠图</Option>
            <Option value="饼图">饼图</Option>
            <Option value="雷达图">雷达图</Option>
            <Option value="散点图">散点图</Option>
          </Select>
        </Form.Item>

        <Form.Item name="file" label="原始数据">
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
      <div>
        <Card title="分析结论：">
          {chart?.genResult ?? <div>请先在上面进行数据提交</div>}
          <Spin spinning={submitting}/>
        </Card>
      </div>
      <p> </p>
      <div>
        <Card title="可视化图表：">
          {
            option ? <ReactECharts option={option} /> : <div>请先在上面进行数据提交</div>
          }
          <Spin spinning={submitting}/>
        </Card>
      </div>
    </div>
  );
};
export default AddChart;
