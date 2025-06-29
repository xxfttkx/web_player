import React, { useState } from 'react';
import PlyrPlayer from './components/PlyrPlayer';
import './index.css'; // 确保你已经设置了 Tailwind 的 index.css
import UrlParse from './components/UrlParse';

function App() {
  const [videoSrc, setVideoSrc] = useState(
    'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4'
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoSrc(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-blue-600">🎥 Plyr 播放器 Demo</h2>
      <UrlParse setVideoSrc={setVideoSrc} />
      <div className="w-full max-w-xl space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            输入视频链接：
          </label>
          <input
            type="text"
            value={videoSrc}
            onChange={handleUrlChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            或选择本地文件：
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block"
          />
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <PlyrPlayer src={videoSrc} />
      </div>
    </div>
  );
}

export default App;
