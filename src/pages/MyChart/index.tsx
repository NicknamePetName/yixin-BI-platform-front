import { listMyChartByPageUsingPost } from '@/services/yixinbi/chartController';
import { useModel } from '@@/exports';
import { Avatar, Card, List, Result, message } from 'antd';
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
  const [expandedConclusions, setExpandedConclusions] = useState<{ [key: string]: boolean }>({});

  // 判断 ECharts option对象代码是否解析成功
  const isParseJSON = (item) => {
    try {
      JSON.parse(item.genChart);
      return true; // 解析成功
    } catch (e) {
      item.status = 'failed';
      return false; // 解析失败
    }
  };

  const loadData = async () => {
    setLoading(true);
    if (!Boolean(currentUser)) {
      return;
    }
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

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
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
            // 在切换页面时重置展开状态
            setExpandedConclusions({});
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
                <strong>分析目标:&nbsp;</strong>
                {item.goal}
              </p>
              <div style={{ marginBottom: 16 }} />
              <>
                {item.status === 'wait' && (
                  <>
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <Result
                      status="warning"
                      title="等待资源中"
                      subTitle={item.execMessage ?? '当前生成队列繁忙，请耐心等候'}
                      style={{ height: '402.468px' }}
                    />
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                      onClick={loadData}
                      style={{
                        float: 'right',
                        padding: '0 3px',
                        margin: '0',
                        backgroundImage:
                          'linear-gradient(to bottom left, #b3e5fc 0%, #90caf9 50%, #673ab7 100%)',
                        border: 'solid 1px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      刷新
                    </button>
                  </>
                )}
                {item.status === 'running' && (
                  <>
                    <Result
                      status="info"
                      title="内容生成中"
                      subTitle={item.execMessage}
                      style={{ height: '402.468px' }}
                    />
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                      onClick={loadData}
                      style={{
                        float: 'right',
                        padding: '0 3px',
                        margin: '0',
                        backgroundImage:
                          'linear-gradient(to bottom left, #b3e5fc 0%, #90caf9 50%, #673ab7 100%)',
                        border: 'solid 1px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      刷新
                    </button>
                  </>
                )}
                {item.status === 'succeed' && isParseJSON(item) && (
                  <>
                    <Card>
                      <ReactECharts option={JSON.parse(item.genChart)} />
                    </Card>
                    <p>
                      <br />
                      {/* Truncate to two lines initially */}
                      <span
                        style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxHeight: '2.4em',
                          lineHeight: '1.2em',
                        }}
                      >
                        <strong
                          onClick={() => {
                            setExpandedConclusions((prevState) => ({
                              ...prevState,
                              [item.id]: !prevState[item.id],
                            }));
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          分析结论:&nbsp;
                        </strong>
                        {item.genResult}
                      </span>
                      {/* Display full text if expanded */}
                      {expandedConclusions[item.id] ? item.genResult : null}
                    </p>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                      onClick={() => {
                        setExpandedConclusions((prevState) => ({
                          ...prevState,
                          [item.id]: !prevState[item.id],
                        }));
                      }}
                      style={{
                        padding: '0 3px',
                        margin: '0',
                        backgroundImage:
                          'linear-gradient(to bottom left, #b3e5fc 0%, #90caf9 50%, #673ab7 100%)',
                        border: 'solid 1px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      {expandedConclusions[item.id] ? '收起结论' : '展开结论'}
                    </button>
                  </>
                )}
                {item.status === 'failed' && (
                  <>
                    <Result
                      status="error"
                      title="生成失败"
                      subTitle={item.execMessage}
                      style={{ height: '402.468px' }}
                    />
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                      onClick={loadData}
                      style={{
                        float: 'right',
                        padding: '0 3px',
                        margin: '0',
                        backgroundImage:
                          'linear-gradient(to bottom left, #b3e5fc 0%, #90caf9 50%, #673ab7 100%)',
                        border: 'solid 1px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      重新生成
                    </button>
                  </>
                )}
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
