// 推送错误调试脚本
const PUSH_CONFIG = {
  token: 'bbd33b528a124566abc86b381e150c4e',
  apiUrl: 'https://www.pushplus.plus/api/send'
};

// 模拟实际推送内容
const testContent = `
  <div style="background: #f8fafc; padding: 12px; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="text-align: center; margin-bottom: 12px;">
      <h3 style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600;">🎯 YouTube爆款分析</h3>
      <p style="color: #64748b; margin: 4px 0 0 0; font-size: 11px;">2025/11/13 23:46:32</p>
    </div>
    <div style="background: white; padding: 8px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
      <div style="color: #3b82f6; font-size: 12px; font-weight: 600; margin-bottom: 4px;">🔍 搜索标签</div>
      <div style="color: #475569; font-size: 11px; line-height: 1.4;">AI • ChatGPT • 人工智能</div>
    </div>
    <div style="background: white; padding: 8px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
      <div style="color: #3b82f6; font-size: 12px; font-weight: 600; margin-bottom: 6px;">📊 分析统计</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
        <div style="color: #475569;">视频: <strong style="color: #1e293b;">25</strong></div>
        <div style="color: #475569;">频道: <strong style="color: #1e293b;">18</strong></div>
        <div style="color: #475569;">均播: <strong style="color: #1e293b;">128K</strong></div>
        <div style="color: #475569;">爆款: <strong style="color: #ef4444;">8</strong></div>
      </div>
    </div>
    <div style="background: white; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
      <div style="color: #3b82f6; font-size: 12px; font-weight: 600; margin-bottom: 6px;">🔥 热门视频</div>
      <div style="display: flex; align-items: flex-start; padding: 6px 0; border-bottom: 1px solid #f1f5f9; ">
        <div style="background: #fbbf24; color: white; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; margin-right: 8px; flex-shrink: 0;">1</div>
        <a href="https://www.youtube.com/watch?v=test123" target="_blank" style="text-decoration: none; margin-right: 8px; flex-shrink: 0;">
          <img src="https://i.ytimg.com/vi/test123/mqdefault.jpg" alt="AI革命：ChatGPT如何改变我们的工作方式" style="width: 60px; height: 34px; object-fit: cover; border-radius: 4px; border: 1px solid #e2e8f0; display: block;">
        </a>
        <div style="flex: 1; min-width: 0;">
          <a href="https://www.youtube.com/watch?v=test123" target="_blank" style="text-decoration: none; color: inherit;">
            <div style="color: #1e293b; font-size: 11px; font-weight: 500; margin-bottom: 2px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; cursor: pointer;">AI革命：ChatGPT如何改变我们的工作方式</div>
          </a>
          <div style="color: #64748b; font-size: 10px; margin-bottom: 2px;">TechVision</div>
          <div style="color: #64748b; font-size: 10px; display: flex; flex-wrap: wrap; gap: 8px;">
            <span>👁️ 2.5M</span>
            <span>👍 45K</span>
            <span>💬 3.2K</span>
            <span style="color: #ef4444; font-weight: 500;">🔥</span>
          </div>
        </div>
      </div>
    </div>
    <div style="background: white; padding: 12px; border-radius: 4px; margin-top: 8px; border: 1px solid #e2e8f0;">
      <div style="color: #8b5cf6; font-size: 12px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center;">
        <span style="margin-right: 6px;">🤖</span>
        AI洞察分析
      </div>
      <div style="color: #475569; font-size: 11px; line-height: 1.5; white-space: pre-line;">1️⃣ **内容趋势**：AI应用实操与技能教学需求激增，工具使用指南和职场影响分析最受欢迎。

2️⃣ **成功要素**：
- 实操演示
- 技能提升
- 职场应用

3️⃣ **创作建议**：
- 制作「AI工具+具体行业」实战案例系列（如AI+设计/编程）
- 开发「从零掌握ChatGPT提示词工程」系统课程

4️⃣ **机会洞察**：AI在中小企业数字化转型中的落地应用指南</div>
    </div>
  </div>
`;

// 检查内容长度
console.log('📊 内容长度分析：');
console.log('- 总字符数：', testContent.length);
console.log('- 是否超过限制（50000）：', testContent.length > 50000 ? '是' : '否');
console.log('- 内容预览（前200字符）：', testContent.substring(0, 200));

// 测试不同长度的内容
async function testContentLength() {
  const testCases = [
    { name: '短内容', content: '测试内容' },
    { name: '中等内容', content: '测试内容'.repeat(100) },
    { name: '长内容（实际）', content: testContent },
    { name: '超长内容', content: '测试内容'.repeat(2000) }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 测试: ${testCase.name}`);
    console.log(`📊 长度: ${testCase.content.length} 字符`);
    
    try {
      const response = await fetch(PUSH_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: PUSH_CONFIG.token,
          title: `测试推送 - ${testCase.name}`,
          content: testCase.content,
          template: 'html'
        })
      });
      
      const result = await response.json();
      console.log(`✅ 结果: ${result.code === 200 ? '成功' : '失败'} - ${result.msg}`);
      
    } catch (error) {
      console.error(`❌ 错误:`, error.message);
    }
  }
}

// 检查HTML内容是否有问题
function validateHTMLContent(content) {
  console.log('\n🔍 HTML内容验证：');
  
  // 检查特殊字符
  const specialChars = /[<>\"'&]/g;
  const matches = content.match(specialChars);
  if (matches) {
    console.log('⚠️  发现特殊字符:', matches);
  } else {
    console.log('✅ 无特殊字符问题');
  }
  
  // 检查HTML结构
  const divCount = (content.match(/<div/g) || []).length;
  const closeDivCount = (content.match(/<\/div>/g) || []).length;
  console.log(`📊 div标签: ${divCount} 开始, ${closeDivCount} 结束`);
  
  if (divCount !== closeDivCount) {
    console.log('⚠️  div标签不匹配');
  } else {
    console.log('✅ HTML结构完整');
  }
  
  // 检查样式属性
  const styleCount = (content.match(/style=/g) || []).length;
  console.log(`📊 样式属性数量: ${styleCount}`);
  
  return true;
}

// 运行调试
console.log('🔍 开始推送错误调试...');
console.log('='.repeat(50));

validateHTMLContent(testContent);
testContentLength().then(() => {
  console.log('\n' + '='.repeat(50));
  console.log('🔍 调试完成');
});