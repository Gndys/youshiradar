// 推送功能诊断工具
const PUSH_CONFIG = {
  token: 'bbd33b528a124566abc86b381e150c4e',
  apiUrl: 'https://www.pushplus.plus/api/send'
};

// 诊断推送功能
async function diagnosePushFunction() {
  console.log('🔍 开始诊断推送功能...');
  console.log('='.repeat(50));
  
  // 1. 检查网络连接
  console.log('1️⃣ 检查网络连接...');
  try {
    const connectivityTest = await fetch('https://www.pushplus.plus/api/send', {
      method: 'HEAD',
      timeout: 5000
    });
    console.log('✅ 网络连接正常');
  } catch (error) {
    console.error('❌ 网络连接失败:', error.message);
  }
  
  // 2. 检查Token有效性
  console.log('\n2️⃣ 检查Token有效性...');
  try {
    const tokenTest = await fetch(PUSH_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: PUSH_CONFIG.token,
        title: 'Token测试',
        content: '这是一个Token有效性测试',
        template: 'html'
      })
    });
    
    const result = await tokenTest.json();
    console.log('Token测试结果:', result);
    
    if (result.code === 200) {
      console.log('✅ Token有效');
    } else {
      console.log('⚠️ Token可能无效或有问题:', result.msg);
    }
  } catch (error) {
    console.error('❌ Token测试失败:', error.message);
  }
  
  // 3. 测试不同内容长度
  console.log('\n3️⃣ 测试不同内容长度...');
  const testCases = [
    { name: '超短内容', content: '测试' },
    { name: '短内容', content: '这是一个测试推送内容' },
    { name: '中等内容', content: '这是一个测试推送内容'.repeat(10) },
    { name: '长内容', content: '这是一个测试推送内容'.repeat(100) },
    { name: '超长内容', content: '这是一个测试推送内容'.repeat(500) }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 测试: ${testCase.name} (${testCase.content.length} 字符)`);
    try {
      const response = await fetch(PUSH_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: PUSH_CONFIG.token,
          title: `长度测试 - ${testCase.name}`,
          content: testCase.content,
          template: 'html'
        })
      });
      
      const result = await response.json();
      console.log(`结果: ${result.code === 200 ? '成功' : '失败'} - ${result.msg || result.message}`);
      
      if (result.code !== 200) {
        console.log('⚠️  可能的内容长度问题');
      }
    } catch (error) {
      console.error('错误:', error.message);
    }
    
    // 延迟1秒避免频率限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 4. 检查频率限制
  console.log('\n4️⃣ 检查频率限制...');
  console.log('连续发送3个测试推送，检查频率限制...');
  
  for (let i = 1; i <= 3; i++) {
    console.log(`发送第${i}个测试推送...`);
    try {
      const response = await fetch(PUSH_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: PUSH_CONFIG.token,
          title: `频率测试 ${i}`,
          content: `这是第${i}个频率测试推送`,
          template: 'html'
        })
      });
      
      const result = await response.json();
      console.log(`第${i}个: ${result.code === 200 ? '成功' : '失败'} - ${result.msg || result.message}`);
      
      if (result.code !== 200 && result.code === 999) {
        console.log('⚠️  触发频率限制，建议等待1-2分钟后重试');
        break;
      }
    } catch (error) {
      console.error(`第${i}个错误:`, error.message);
    }
    
    // 延迟2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🔍 诊断完成');
  
  // 提供建议
  console.log('\n💡 建议:');
  console.log('1. 如果Token测试失败，可能需要更换Token');
  console.log('2. 如果内容长度测试失败，建议减少推送内容');
  console.log('3. 如果频率测试失败，建议增加发送间隔（2-3分钟）');
  console.log('4. 检查网络连接是否稳定');
}

// 运行诊断
diagnosePushFunction().catch(console.error);