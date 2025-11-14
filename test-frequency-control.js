// 测试频率控制机制
const PUSH_CONFIG = {
  token: 'bbd33b528a124566abc86b381e150c4e',
  apiUrl: 'https://www.pushplus.plus/api/send'
};

// 模拟增强版的sendWeChatPush函数
async function sendWeChatPush(title, content, retryCount = 0) {
  const MAX_RETRIES = 3; // 增加重试次数到3次
  const BASE_DELAY = 3000; // 基础延迟3秒，避免频率过快
  
  console.log(`📤 开始发送微信推送...`);
  console.log(`📋 推送标题: ${title}`);
  console.log(`📊 内容长度: ${content.length} 字符`);
  console.log(`🔄 重试次数: ${retryCount}/${MAX_RETRIES}`);
  
  // 检查内容长度，避免超出限制
  if (content.length > 50000) {
    console.warn(`⚠️ 推送内容过长 (${content.length} 字符)，可能被截断`);
    // 尝试截断内容
    content = content.substring(0, 49000) + '<div style="color: #999; font-size: 10px;">...内容已截断</div>';
  }
  
  // 频率控制 - 如果是重试，增加更长的延迟
  if (retryCount > 0) {
    const delay = BASE_DELAY * retryCount + Math.random() * 2000; // 随机延迟避免同时重试
    console.log(`⏰ 频率控制，等待 ${delay}ms 后重试...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  try {
    const requestBody = {
      token: PUSH_CONFIG.token,
      title: title,
      content: content,
      template: 'html'
    };
    
    console.log(`🚀 发送请求到: ${PUSH_CONFIG.apiUrl}`);
    
    const response = await fetch(PUSH_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`❌ HTTP 错误: ${response.status} ${response.statusText}`);
      // 如果是网络错误，尝试重试
      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`🔄 网络错误，准备重试...`);
        return await sendWeChatPush(title, content, retryCount + 1);
      }
      return false;
    }
    
    const result = await response.json();
    console.log(`📊 响应数据:`, result);
    
    if (result.code === 200) {
      console.log('✅ 微信推送发送成功');
      return true;
    } else {
      console.error('❌ 微信推送发送失败:', result.msg || result.message || '未知错误');
      
      // 特殊处理频率限制错误
      if (result.code === 999 && result.data && result.data.includes('频率过快')) {
        console.warn('⚠️ 触发频率限制，增加延迟后重试');
        if (retryCount < MAX_RETRIES) {
          const extraDelay = 10000 + Math.random() * 5000; // 10-15秒额外延迟
          console.log(`⏰ 频率限制，额外等待 ${extraDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, extraDelay));
          return await sendWeChatPush(title, content, retryCount + 1);
        }
      }
      
      // 其他临时错误，尝试重试
      if (result.code >= 500 && retryCount < MAX_RETRIES) {
        console.log(`🔄 API错误，准备重试...`);
        return await sendWeChatPush(title, content, retryCount + 1);
      }
      return false;
    }
  } catch (error) {
    console.error('❌ 微信推送请求失败:', error);
    console.error('错误详情:', error.message);
    // 网络错误，尝试重试
    if (retryCount < MAX_RETRIES) {
      console.log(`🔄 网络异常，准备重试...`);
      return await sendWeChatPush(title, content, retryCount + 1);
    }
    return false;
  }
}

// 测试频率控制
async function testFrequencyControl() {
  console.log('🚀 开始测试频率控制机制...');
  console.log('='.repeat(60));
  
  // 测试1：正常推送
  console.log('\n📊 测试1：正常推送');
  const success1 = await sendWeChatPush('频率控制测试1', '这是第一个测试推送');
  console.log(`✅ 测试结果: ${success1 ? '成功' : '失败'}`);
  
  // 等待一段时间
  console.log('\n⏰ 等待5秒，避免频率限制...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 测试2：快速连续推送（模拟频率限制）
  console.log('\n📊 测试2：连续推送（测试频率控制）');
  const success2 = await sendWeChatPush('频率控制测试2', '这是第二个测试推送');
  console.log(`✅ 测试结果: ${success2 ? '成功' : '失败'}`);
  
  // 测试3：长内容推送
  console.log('\n📊 测试3：长内容推送');
  const longContent = '测试内容'.repeat(100);
  const success3 = await sendWeChatPush('长内容频率测试', longContent);
  console.log(`✅ 测试结果: ${success3 ? '成功' : '失败'}`);
  
  // 测试4：模拟频率限制重试
  console.log('\n📊 测试4：模拟频率限制重试');
  console.log('🔄 故意快速发送多个请求来测试重试机制...');
  
  // 快速发送几个请求来触发频率限制
  const promises = [];
  for (let i = 0; i < 3; i++) {
    promises.push(sendWeChatPush(`频率测试${i+4}`, `这是第${i+4}个测试推送`));
  }
  
  const results = await Promise.allSettled(promises);
  const successCount = results.filter(r => r.value === true).length;
  console.log(`✅ 批量测试结果: ${successCount}/${results.length} 成功`);
  
  // 汇总结果
  console.log('\n' + '='.repeat(60));
  console.log('📈 频率控制测试汇总');
  console.log('='.repeat(60));
  
  const tests = [
    { name: '正常推送', success: success1 },
    { name: '连续推送', success: success2 },
    { name: '长内容推送', success: success3 }
  ];
  
  let passed = 0;
  tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}: ${test.success ? '✅ 通过' : '❌ 失败'}`);
    if (test.success) passed++;
  });
  
  console.log(`\n✅ 通过率: ${passed}/${tests.length} (${(passed/tests.length*100).toFixed(1)}%)`);
  console.log(`🎯 频率控制机制: ${successCount > 0 ? '✅ 正常工作' : '⚠️ 需要调优'}`);
  
  if (passed >= 2) {
    console.log('🎉 频率控制测试基本通过！');
  } else {
    console.log('⚠️ 需要进一步优化频率控制参数');
  }
}

// 运行测试
testFrequencyControl().then(() => {
  console.log('\n🎉 频率控制测试完成！');
});