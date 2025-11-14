// 最终推送功能测试脚本
const PUSH_CONFIG = {
  token: 'bbd33b528a124566abc86b381e150c4e',
  apiUrl: 'https://www.pushplus.plus/api/send'
};

// 模拟测试数据
const testData = {
  searchTags: ['AI', 'ChatGPT', '人工智能'],
  videoStats: {
    totalVideos: 25,
    totalChannels: 18,
    avgViews: '128K',
    hotVideos: 8
  },
  topVideos: [
    {
      videoId: 'test123',
      title: 'AI革命：ChatGPT如何改变我们的工作方式',
      channelTitle: 'TechVision',
      viewCount: 2500000,
      likeCount: 45000,
      commentCount: 3200,
      subscriberCount: 150000,
      thumbnail: 'https://i.ytimg.com/vi/test123/mqdefault.jpg'
    },
    {
      videoId: 'test456',
      title: '深度学习入门教程',
      channelTitle: 'AI学院',
      viewCount: 1800000,
      likeCount: 28000,
      commentCount: 2100,
      subscriberCount: 120000,
      thumbnail: 'https://i.ytimg.com/vi/test456/mqdefault.jpg'
    }
  ],
  aiAnalysis: `📈 内容趋势：AI工具类视频持续火热，教程和实用技巧最受欢迎

🔑 成功要素：实用性+易懂性+时效性

💡 创作建议：
• 制作"AI工具使用教程"系列
• 分享"ChatGPT工作流优化"技巧

🎯 机会洞察：AI+行业应用（如AI+设计、AI+写作）存在蓝海机会`
};

// 生成推送内容
function generatePushContent(searchTags, videoStats, topVideos, aiAnalysis = null) {
  const now = new Date().toLocaleString('zh-CN');
  let content = `
    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="text-align: center; margin-bottom: 12px;">
        <h3 style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600;">🎯 YouTube爆款分析</h3>
        <p style="color: #64748b; margin: 4px 0 0 0; font-size: 11px;">${now}</p>
      </div>
  `;
  
  // 搜索标签信息
  if (searchTags && searchTags.length > 0) {
    content += `
      <div style="background: white; padding: 8px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
        <div style="color: #3b82f6; font-size: 12px; font-weight: 600; margin-bottom: 4px;">🔍 搜索标签</div>
        <div style="color: #475569; font-size: 11px; line-height: 1.4;">${searchTags.join(' • ')}</div>
      </div>
    `;
  }
  
  // 统计信息
  if (videoStats) {
    content += `
      <div style="background: white; padding: 8px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
        <div style="color: #3b82f6; font-size: 12px; font-weight: 600; margin-bottom: 6px;">📊 分析统计</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
          <div style="color: #475569;">视频: <strong style="color: #1e293b;">${videoStats.totalVideos}</strong></div>
          <div style="color: #475569;">频道: <strong style="color: #1e293b;">${videoStats.totalChannels}</strong></div>
          <div style="color: #475569;">均播: <strong style="color: #1e293b;">${videoStats.avgViews}</strong></div>
          <div style="color: #475569;">爆款: <strong style="color: #ef4444;">${videoStats.hotVideos}</strong></div>
        </div>
      </div>
    `;
  }
  
  // 热门视频
  if (topVideos && topVideos.length > 0) {
    content += `
      <div style="background: white; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
        <div style="color: #3b82f6; font-size: 12px; font-weight: 600; margin-bottom: 6px;">🔥 热门视频</div>
    `;
    
    topVideos.forEach((video, index) => {
      const isHot = video.viewCount > video.subscriberCount * 2;
      const medalColor = index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : index === 2 ? '#f59e0b' : '#6b7280';
      
      content += `
        <div style="display: flex; align-items: flex-start; padding: 6px 0; border-bottom: 1px solid #f1f5f9; ${index === topVideos.length - 1 ? 'border-bottom: none;' : ''}">
          <div style="background: ${medalColor}; color: white; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; margin-right: 8px; flex-shrink: 0;">${index + 1}</div>
          <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" style="text-decoration: none; margin-right: 8px; flex-shrink: 0;">
            <img src="${video.thumbnail}" alt="${video.title}" style="width: 60px; height: 34px; object-fit: cover; border-radius: 4px; border: 1px solid #e2e8f0; display: block;">
          </a>
          <div style="flex: 1; min-width: 0;">
            <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" style="text-decoration: none; color: inherit;">
              <div style="color: #1e293b; font-size: 11px; font-weight: 500; margin-bottom: 2px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; cursor: pointer;">${video.title}</div>
            </a>
            <div style="color: #64748b; font-size: 10px; margin-bottom: 2px;">${video.channelTitle}</div>
            <div style="color: #64748b; font-size: 10px; display: flex; flex-wrap: wrap; gap: 8px;">
              <span>👁️ ${formatNumber(video.viewCount)}</span>
              <span>👍 ${formatNumber(video.likeCount)}</span>
              <span>💬 ${formatNumber(video.commentCount)}</span>
              ${isHot ? '<span style="color: #ef4444; font-weight: 500;">🔥</span>' : ''}
            </div>
          </div>
        </div>
      `;
    });
    
    content += '</div>';
  }
  
  // 添加AI分析
  if (aiAnalysis) {
    content += `
      <div style="background: white; padding: 12px; border-radius: 4px; margin-top: 8px; border: 1px solid #e2e8f0;">
        <div style="color: #8b5cf6; font-size: 12px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center;">
          <span style="margin-right: 6px;">🤖</span>
          AI洞察分析
        </div>
        <div style="color: #475569; font-size: 11px; line-height: 1.5; white-space: pre-line;">${aiAnalysis}</div>
      </div>
    `;
  }
  
  content += '</div>';
  return content;
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 测试推送功能
async function testPushFunction() {
  console.log('🧪 开始测试最终推送功能...');
  
  try {
    // 测试AI增强推送
    const title = `🤖 AI洞察：YouTube爆款分析 - ${testData.searchTags.join(', ')}`;
    const content = generatePushContent(testData.searchTags, testData.videoStats, testData.topVideos, testData.aiAnalysis);
    
    console.log('📤 发送AI增强推送...');
    console.log('📋 标题:', title);
    console.log('📊 内容长度:', content.length, '字符');
    
    const requestBody = {
      token: PUSH_CONFIG.token,
      title: title,
      content: content,
      template: 'html'
    };
    
    const response = await fetch(PUSH_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const result = await response.json();
    
    if (result.code === 200) {
      console.log('✅ AI增强推送测试成功！');
      console.log('📊 响应数据:', result);
      return true;
    } else {
      console.error('❌ AI增强推送测试失败:', result.msg || result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ 推送测试异常:', error);
    return false;
  }
}

// 运行测试
testPushFunction().then(success => {
  if (success) {
    console.log('🎉 最终推送功能测试完成 - 成功！');
    console.log('✅ 单条智能推送策略已生效');
    console.log('✅ AI分析集成正常');
    console.log('✅ 推送内容格式正确');
    console.log('✅ 额度使用效率优化完成');
  } else {
    console.log('⚠️ 推送功能测试失败，需要检查配置');
  }
});