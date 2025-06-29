import React, { useEffect, useRef } from 'react';
import type { MediaType } from 'plyr';
import Plyr, { type APITypes, type PlyrInstance } from 'plyr-react';
import 'plyr-react/plyr.css';
import Hls from 'hls.js';

type PlyrPlayerProps = {
  src: string;
};

const PlyrPlayer: React.FC<PlyrPlayerProps> = ({ src }) => {
  const plyrRef = useRef<APITypes>(null);
  const isHls = src.endsWith('.m3u8');
  const hlsRef = useRef<Hls | null>(null); // 缓存 hls 实例以清理
  useEffect(() => {
    hlsRef.current?.destroy();
    if (!isHls || !plyrRef.current) return;
    if (Hls.isSupported()) {
      const loadVideo = async () => {
        const video = document.getElementById('plyr') as HTMLVideoElement;
        var hls = new Hls();
        hlsRef.current = hls;
        // https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8
        // https://akuma-trstin.mushroomtrack.com/hls/egL_sLaoeRDlChrE98hjSw/1751186009/51000/51410/51410.m3u8
        const proxiedSrc = src.replace(
          'https://akuma-trstin.mushroomtrack.com/hls',
          '/proxy/hls'
        );
        hls.loadSource(proxiedSrc);
        console.log(`HLS source loaded: ${video}`);
        hls.attachMedia(video);
        // @ts-ignore
        plyrRef.current!.plyr.media = video;

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          (plyrRef.current!.plyr as PlyrInstance).play();
        });
      };
      loadVideo();
    }
  }, [src, isHls]);

  const controls = [
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'fullscreen',
  ];

  const source = isHls
    ? { type: 'video' as MediaType, sources: [] } // 交给 hls.js 加载
    : {
        type: 'video' as MediaType,
        title: 'MP4 视频',
        sources: [
          {
            src,
            type: 'video/mp4',
          },
        ],
      };

  return (
    <Plyr ref={plyrRef} id="plyr" source={source} options={{ controls }} />
  );
};

export default PlyrPlayer;
