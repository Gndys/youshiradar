// 修复后的推送服务 - 解决频率限制和内容优化问题

const PUSH_CONFIG = {
  token: 'bbd33b528a124566abc86b381e150c4e',
  apiUrl: 'https://www.pushplus.plus/api/send',
  maxContentLength: 40000, // 降低内容长度限制，避免被截断
  maxRetries: 2, // 减少重试次数
  baseDelay: 5000, // 增加基础延迟到5秒
  frequencyDelay: 15000 // 频率限制时延迟15秒
};

// 推送队列管理 - 避免频率冲突
class PushQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.lastPushTime = 0;
    this.minInterval = 60000; // 最小间隔1分钟
  }
  
  async add(pushData) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        data: pushData,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }
  
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      
      // 检查时间间隔
      const now = Date.now();
      const timeSinceLastPush = now - this.lastPushTime;
      
      if (timeSinceLastPush < this.minInterval) {
        const waitTime = this.minInterval - timeSinceLastPush;
        console.log(`⏰ 等待 ${waitTime}ms 避免频率限制...`);
        await this.sleep(waitTime);
      }
      
      try {
        const result = await this.sendPush(item.data);
        item.resolve(result);
        this.lastPushTime = Date.now();
      } catch (error) {
        item.reject(error);
      }
      
      // 处理完一个项目后等待一段时间
      if (this.queue.length > 0) {
        await this.sleep(2000); // 2秒间隔
      }
    }
    
    this.isProcessing = false;
  }
  
  async sendPush(pushData) {
    const { title, content, retryCount = 0 } = pushData;
    
    console.log(`📤 发送推送: ${title}`);
    console.log(`📊 内容长度: ${content.length} 字符`);
    
    // 内容长度检查和优化
    let optimizedContent = content;
    if (content.length > PUSH_CONFIG.maxContentLength) {
      console.warn(`⚠️ 内容过长 (${content.length} 字符)，进行优化...`);
      optimizedContent = this.optimizeContent(content);
    }
    
    // 频率控制
    if (retryCount > 0) {
      const delay = PUSH_CONFIG.baseDelay * retryCount + Math.random() * 3000;
      console.log(`⏰ 重试延迟: ${delay}ms`);
      await this.sleep(delay);
    }
    
    try {
      const response = await fetch(PUSH_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: PUSH_CONFIG.token,
          title: title,
          content: optimizedContent,
          template: 'html'
        })
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        console.log('✅ 推送成功');
        return { success: true, data: result };
      } else {
        console.error('❌ 推送失败:', result.msg || result.message);
        
        // 特殊处理频率限制
        if (result.code === 999 && result.data && result.data.includes('频率过快')) {
          console.warn('⚠️ 触发频率限制');
          if (retryCount < PUSH_CONFIG.maxRetries) {
            console.log(`🔄 频率限制，等待 ${PUSH_CONFIG.frequencyDelay}ms 后重试...`);
            await this.sleep(PUSH_CONFIG.frequencyDelay);
            return await this.sendPush({
              ...pushData,
              retryCount: retryCount + 1
            });
          }
        }
        
        return { success: false, error: result.msg || result.message };
      }
    } catch (error) {
      console.error('❌ 推送请求失败:', error);
      if (retryCount < PUSH_CONFIG.maxRetries) {
        console.log(`🔄 网络错误，准备重试...`);
        await this.sleep(PUSH_CONFIG.baseDelay);
        return await this.sendPush({
          ...pushData,
          retryCount: retryCount + 1
        });
      }
      throw error;
    }
  }
  
  // 内容优化 - 减少长度同时保持关键信息
  optimizeContent(content) {
    console.log('🔧 优化推送内容...');
    
    // 移除不必要的空白和换行
    let optimized = content
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    
    // 如果仍然过长，进行更激进的优化
    if (optimized.length > PUSH_CONFIG.maxContentLength) {
      console.log('🔧 进行激进优化...');
      
      // 保留关键部分：标题、统计、热门视频（减少数量）
      const titleMatch = optimized.match(/<h3[^>]*>.*?<\/h3>/);
      const statsMatch = optimized.match(/<div[^>]*class="[^"]*统计[^"]*"[^>]*>.*?<\/div>/);
      
      let newContent = '<div style="font-family: sans-serif; padding: 10px;">';
      
      if (titleMatch) {
        newContent += titleMatch[0];
      }
      
      if (statsMatch) {
        newContent += statsMatch[0];
      }
      
      // 只保留前3个热门视频
      const videoMatches = optimized.match(/<div[^>]*class="[^"]*热门视频[^"]*"[^"]*">.*?<\/div>/g);
      if (videoMatches && videoMatches.length > 0) {
        newContent += '<div style="margin: 10px 0;"><strong>🔥 热门视频（前3个）</strong></div>';
        newContent += videoMatches.slice(0, 3).join('');
      }
      
      newContent += '<div style="color: #666; font-size: 12px; margin-top: 10px;">内容已优化显示</div>';
      newContent += '</div>';
      
      optimized = newContent;
    }
    
    console.log(`✅ 内容优化完成: ${content.length} -> ${optimized.length} 字符`);
    return optimized;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 创建全局推送队列实例
const pushQueue = new PushQueue();

// 修复后的推送函数
async function sendWeChatPushFixed(title, content, useQueue = true) {
  console.log(`📤 修复版推送函数被调用`);
  console.log(`📋 标题: ${title}`);
  console.log(`📊 内容长度: ${content.length} 字符`);
  console.log(`🔄 使用队列: ${useQueue ? '是' : '否'}`);
  
  try {
    if (useQueue) {
      const result = await pushQueue.add({ title, content });
      return result.success;
    } else {
      // 直接发送（用于紧急情况）
      const result = await pushQueue.sendPush({ title, content });
      return result.success;
    }
  } catch (error) {
    console.error('❌ 推送失败:', error);
    return false;
  }
}

// 简化的推送内容生成 - 减少内容长度
function generatePushContentOptimized(searchTags, videoStats, topVideos, videoCount = 5, aiAnalysis = null) {
  const now = new Date().toLocaleString('zh-CN');
  
  // 简化版内容
  let content = `
    <div style="font-family: sans-serif; padding: 12px; background: #f5f5f5; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 12px;">
        <h3 style="margin: 0; color: #333; font-size: 16px;">🎯 YouTube爆款分析</h3>
        <p style="margin: 4px 0 0 0; color: #666; font-size: 12px;">${now}</p>
      </div>
  `;
  
  // 搜索标签 - 简化显示
  if (searchTags && searchTags.length > 0) {
    content += `
      <div style="background: white; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
        <div style="color: #1890ff; font-weight: bold; font-size: 12px; margin-bottom: 4px;">🔍 搜索标签</div>
        <div style="color: #333; font-size: 11px;">${searchTags.join(' • ')}</div>
      </div>
    `;
  }
  
  // 统计信息 - 紧凑显示
  if (videoStats) {
    content += `
      <div style="background: white; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
        <div style="color: #1890ff; font-weight: bold; font-size: 12px; margin-bottom: 4px;">📊 分析统计</div>
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span>视频: <strong>${videoStats.totalVideos}</strong></span>
          <span>频道: <strong>${videoStats.totalChannels}</strong></span>
          <span>均播: <strong>${videoStats.avgViews}</strong></span>
          <span>爆款: <strong style="color: #ff4d4f;">${videoStats.hotVideos}</strong></span>
        </div>
      </div>
    `;
  }
  
  // 热门视频 - 只显示关键信息
  if (topVideos && topVideos.length > 0) {
    content += `
      <div style="background: white; padding: 8px; border-radius: 4px;">
        <div style="color: #1890ff; font-weight: bold; font-size: 12px; margin-bottom: 6px;">🔥 热门视频</div>
    `;
    
    topVideos.slice(0, Math.min(3, videoCount)).forEach((video, index) => {
      const isHot = video.viewCount > video.subscriberCount * 2;
      
      content += `
        <div style="display: flex; align-items: center; padding: 4px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="background: ${index === 0 ? '#ffd93d' : '#e8e8e8'}; color: ${index === 0 ? '#333' : '#666'}; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; margin-right: 6px;">${index + 1}</span>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 11px; font-weight: 500; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${video.title}</div>
            <div style="font-size: 10px; color: #666;">
              <span>👁️ ${formatNumberSimple(video.viewCount)}</span>
              <span style="margin-left: 8px;">👍 ${formatNumberSimple(video.likeCount)}</span>
              ${isHot ? '<span style="margin-left: 8px; color: #ff4d4f;">🔥</span>' : ''}
            </div>
          </div>
        </div>
      `;
    });
    
    content += '</div>';
  }
  
  // AI分析 - 如果有且内容不过长
  if (aiAnalysis && content.length < 30000) {
    content += `
      <div style="background: white; padding: 8px; border-radius: 4px; margin-top: 8px;">
        <div style="color: #722ed1; font-weight: bold; font-size: 12px; margin-bottom: 4px;">🤖 AI洞察</div>
        <div style="color: #333; font-size: 11px; line-height: 1.4;">${aiAnalysis.substring(0, 500)}${aiAnalysis.length > 500 ? '...' : ''}</div>
      </div>
    `;
  }
  
  content += '</div>';
  return content;
}

// 简化的数字格式化
function formatNumberSimple(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 导出修复后的函数
window.PushService = {
  sendPush: sendWeChatPushFixed,
  generateContent: generatePushContentOptimized,
  queue: pushQueue
};

console.log('✅ 修复版推送服务已加载');
console.log('💡 使用方式: PushService.sendPush(title, content)');