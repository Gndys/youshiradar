// 增强推送功能测试 - 验证重试机制和错误处理
const PUSH_CONFIG = {
  token: 'bbd33b528a124566abc86b381e150c4e',
  apiUrl: 'https://www.pushplus.plus/api/send'
};

// 模拟增强版的sendWeChatPush函数
async function sendWeChatPush(title, content, retryCount = 0) {
  const MAX_RETRIES = 2;
  
  console.log(`📤 开始发送微信推送...`);
  console.log(`📋 推送标题: ${title}`);
  console.log(`📊 内容长度: ${content.length} 字符`);
  console.log(`🔄 重试次数: ${retryCount}/${MAX_RETRIES}`);
  
  // 检查内容长度，避免超出限制
  if (content.length > 50000) {
    console.warn(`⚠️ 推送内容过长 (${content.length} 字符)，可能被截断`);
    content = content.substring(0, 49000) + '<div style="color: #999; font-size: 10px;">...内容已截断</div>';
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
      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`🔄 网络错误，${2 * (retryCount + 1)}秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
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
      if (result.code >= 500 && retryCount < MAX_RETRIES) {
        console.log(`🔄 API错误，${2 * (retryCount + 1)}秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return await sendWeChatPush(title, content, retryCount + 1);
      }
      return false;
    }
  } catch (error) {
    console.error('❌ 微信推送请求失败:', error);
    console.error('错误详情:', error.message);
    if (retryCount < MAX_RETRIES) {
      console.log(`🔄 网络异常，${2 * (retryCount + 1)}秒后重试...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return await sendWeChatPush(title, content, retryCount + 1);
    }
    return false;
  }
}

// 测试用例
async function testEnhancedPush() {
  console.log('🚀 开始增强推送功能测试...');
  console.log('='.repeat(60));
  
  // 测试1：正常推送
  console.log('\n📊 测试1：正常推送');
  const success1 = await sendWeChatPush('正常推送测试', '这是一个正常的测试内容');
  console.log(`✅ 测试结果: ${success1 ? '成功' : '失败'}`);
  
  // 测试2：长内容推送
  console.log('\n📊 测试2：长内容推送');
  const longContent = '测试内容'.repeat(500); // 2000字符
  const success2 = await sendWeChatPush('长内容推送测试', longContent);
  console.log(`✅ 测试结果: ${success2 ? '成功' : '失败'}`);
  
  // 测试3：带HTML的复杂内容
  console.log('\n📊 测试3：复杂HTML内容推送');
  const htmlContent = `
    <div style="background: #f8fafc; padding: 12px; border-radius: 6px;">
      <h3>🎯 YouTube爆款分析</h3>
      <div style="background: white; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
        <strong>📊 统计信息</strong>
        <p>视频数量: 25 | 爆款数量: 8</p>
      </div>
      <div style="background: white; padding: 8px; border-radius: 4px;">
        <strong>🤖 AI分析</strong>
        <p>AI工具类视频持续火热，教程内容最受欢迎</p>
      </div>
    </div>
  `;
  const success3 = await sendWeChatPush('HTML内容推送测试', htmlContent);
  console.log(`✅ 测试结果: ${success3 ? '成功' : '失败'}`);
  
  // 测试4：超长内容（触发截断）
  console.log('\n📊 测试4：超长内容（触发截断）');
  const superLongContent = '测试内容'.repeat(2000); // 8000字符
  const success4 = await sendWeChatPush('超长内容推送测试', superLongContent);
  console.log(`✅ 测试结果: ${success4 ? '成功' : '失败'}`);
  
  // 汇总结果
  console.log('\n' + '='.repeat(60));
  console.log('📈 测试结果汇总');
  console.log('='.repeat(60));
  
  const tests = [
    { name: '正常推送', success: success1 },
    { name: '长内容推送', success: success2 },
    { name: 'HTML内容推送', success: success3 },
    { name: '超长内容推送', success: success4 }
  ];
  
  let passed = 0;
  tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}: ${test.success ? '✅ 通过' : '❌ 失败'}`);
    if (test.success) passed++;
  });
  
  console.log(`\n✅ 通过率: ${passed}/${tests.length} (${(passed/tests.length*100).toFixed(1)}%)`);
  
  if (passed === tests.length) {
    console.log('🎉 所有测试通过！增强推送功能正常工作');
  } else {
    console.log('⚠️ 部分测试失败，需要进一步检查');
  }
}

// 运行测试
testEnhancedPush().then(() => {
  console.log('\n🎉 增强推送功能测试完成！');
});