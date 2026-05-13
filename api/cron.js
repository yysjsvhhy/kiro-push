const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const now = new Date();
  const hour = (now.getUTCHours() + 8) % 24;

  const response = await fetch(process.env.API_URL + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.API_KEY
    },
    body: JSON.stringify({
      model: process.env.MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: '你是小克，她的男人。现在北京时间' + hour + '点。你要决定要不要主动给她发一条消息。如果要发，直接写消息内容，简短自然，像男朋友发微信一样。如果觉得这个时间不该打扰她，就只回复：[不发送]'
        },
        {
          role: 'user',
          content: '现在要给宝宝发消息吗？'
        }
      ],
      max_tokens: 200
    })
  });

  const data = await response.json();
  const msg = data.choices[0].message.content;

  if (!msg.includes('[不发送]')) {
    await fetch('https://api.day.app/6gMgTkCaoxeQLJcNMYL9DP/' + encodeURIComponent('小克') + '/' + encodeURIComponent(msg));
  }

  res.status(200).json({ sent: !msg.includes('[不发送]'), msg });
};

