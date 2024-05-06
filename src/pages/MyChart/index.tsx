import { listMyChartByPageUsingPost } from '@/services/yixinbi/chartController';
import { useModel } from '@@/exports';
import { Avatar, Card, List, message } from 'antd';
import { createStyles } from 'antd-style';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

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
 * 我的图表页面
 * @constructor
 */

const MyChartPage: React.FC = () => {
  const { styles } = useStyles();
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        // if (res.data.records) {
        //   // @ts-ignore
        //   res.data.records.forEach((data) => {
        //     if (data.status === 'succeed') {
        //       const chartOption = JSON.parse(data.genChart ?? '{}');
        //       chartOption.title = undefined;
        //       data.genChart = JSON.stringify(chartOption);
        //     }
        //   });
        // }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败，' + e.message);
    }
    setLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  useEffect(() => {
    loadData();
  }, [searchParams.current, searchParams.pageSize]);

  return (
    <div className="my-chart-page">
      <div className={styles.container}></div>
      <div>
        <Search
          placeholder="请输入图表名称"
          enterButton
          loading={loading}
          onSearch={(value) => {
            // 设置搜索条件
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <div className="margin-16" />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              style={{
                width: '100%',
                backgroundImage:
                  'linear-gradient(to top right, #b3e5fc 0%, #90caf9 50%, #673ab7 100%)',
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <div style={{ marginBottom: 16 }} />
              <p>
                <strong>分析目标: </strong>
                {item.goal}
              </p>
              <div style={{ marginBottom: 16 }} />
              <Card>
                <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
              </Card>
              <p>
                <br />
                <strong>分析结论: </strong>
                {item.genResult}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
