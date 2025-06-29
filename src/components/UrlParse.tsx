import React, { useState } from 'react';

const UrlParse: React.FC<{ setVideoSrc: (src: string) => void }> = ({
  setVideoSrc,
}) => {
  const [urlToParse, setUrlToParse] = useState('');
  const [parsedLinks, setParsedLinks] = useState<string[]>([]);

  const handleParseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlToParse(e.target.value);
  };

  //   function toProxyUrl(originalUrl: string): string {
  //     const url = new URL(originalUrl);
  //     return '/api/jable' + url.pathname + url.search;
  //   }

  const handleParse = async () => {
    try {
      const response = await fetch(urlToParse);
      const html = await response.text();
      console.log(html);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const iframes = Array.from(doc.querySelectorAll('iframe'));
      const links = iframes.map(iframe => iframe.src).filter(src => src);

      // 提取 <script> 标签中的内容
      const scripts = Array.from(doc.querySelectorAll('script'));
      let hlsUrl = '';

      for (const script of scripts) {
        if (script.textContent && script.textContent.includes('var hlsUrl')) {
          const match = script.textContent.match(
            /var hlsUrl\s*=\s*['"]([^'"]+)['"]/
          );
          if (match) {
            hlsUrl = match[1]; // 提取到的 hlsUrl
            break;
          }
        }
      }

      if (hlsUrl) {
        links.push(hlsUrl); // 将 hlsUrl 添加到链接列表中
      }

      if (links.length > 0) {
        setParsedLinks(links); // 设置解析到的链接列表
      } else {
        alert('未找到 iframe 或视频链接');
      }
    } catch (error) {
      console.error('解析失败:', error);
      alert('解析失败，请检查输入的 URL');
    }
  };

  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">输入网址：</label>
      <div className="flex space-x-2">
        <input
          type="text"
          value={urlToParse}
          onChange={handleParseUrlChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleParse}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          解析
        </button>
      </div>

      {/* 显示解析结果 */}
      {parsedLinks.length > 0 && (
        <div className="mt-4">
          <label className="block mb-1 font-medium text-gray-700">
            解析结果：
          </label>
          <ul className="space-y-2">
            {parsedLinks.map((link, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span
                  className="text-blue-500 underline cursor-pointer"
                  onClick={() => setVideoSrc(link)}
                >
                  {link}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UrlParse;
