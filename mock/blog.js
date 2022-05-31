const queryArticlesList = (req, res) => {
  res = [
    {
      title: '测试',
      status: 1,
      feature: ['react', 'js'],
      likeCount: 10,
      commentCount: 100,
      readCount: 300,
    },
  ];

  return res;
};

export default {
  'GET /blog/api/list': [
    {
      title: '测试',
      abstract: '客户vv规定了来u法国特欧服判处爸爸频道',
      status: 1,
      topFlag: 1,
      feature: ['react', 'js'],
      likeCount: 10,
      commentCount: 100,
      readCount: 300,
      createTime: '2022-05-02',
    },
    {
      title: '测试2',
      abstract: '风里来雨里去safe却无法萨嘎萨嘎大发噶阿三的马拉松',
      status: 0,
      topFlag: 0,
      feature: ['blog'],
      likeCount: 13,
      commentCount: 200,
      readCount: 301,
      createTime: '2022-05-01',
    },
  ],

  'GET /blog/api/feature/list': ['react', 'vue', 'es6', 'js', 'css'],
};
