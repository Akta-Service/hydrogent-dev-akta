import React from 'react';
import RingVisualizer from '~/components/product/RingBuilder';
import SliderGallery from '../slider/SliderGallery';

interface PreviewTabsProps {
  previewActiveTab: 'preview' | 'video' | 'images';
  setPreviewActiveTab: (tab: 'preview' | 'video' | 'images') => void;
  ringVisualizerForSku: any[];
  hasCSVMedia: boolean;
  videosForSku: any[];
  imagesForSku: any[];
  fallbackImages: any[];
}

const tabs = [
  { id: 'images', label: 'Images' },
  { id: 'video', label: 'Video' },
  { id: 'preview', label: 'Preview' },
];

const PreviewTabs: React.FC<PreviewTabsProps> = ({
  previewActiveTab,
  setPreviewActiveTab,
  ringVisualizerForSku,
  hasCSVMedia,
  videosForSku,
  imagesForSku,
  fallbackImages,
}) => {
  // Filter tabs to hide video tab if no video URL is present and preview tab if no preview URL is present
  const filteredTabs = tabs?.filter(tab => 
    (tab.id !== 'video' || (tab.id === 'video' && videosForSku[0]?.url)) &&
    (tab.id !== 'preview' || (tab.id === 'preview' && ringVisualizerForSku[0]?.url))
  );

  return (
    <div className="md:w-1/2">
      <div className="flex h-[48px] rounded-[8px] mb-4 overflow-hidden p-1">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPreviewActiveTab(tab.id as 'preview' | 'video' | 'images')}
            className={`flex-1 rounded-[7px] h-[40px] text-[16px] outfit font-light transition-colors duration-200  ${
              previewActiveTab === tab.id
                ? 'bg-black text-white shadow-[0px_0px_8px_0px_#ffffff66]'
                : 'bg-transparent text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {previewActiveTab === 'preview' && (
          <div className=''>
            <RingVisualizer
              csvMedia={null}
              fallbackRingImageUrl={
                ringVisualizerForSku[0]?.url ||
                'https://cdn.shopify.com/s/files/1/0937/6904/0186/files/BR0001-P-7x7mm-W-C.png?v=1750329442'
              }
              itemHeight={550}
              hasCSVMedia={false}
            />
          </div>
        )}

        {previewActiveTab === 'video' && (
          <div className="flex justify-center">
            <div className="w-full aspect-video flex items-center justify-center text-primary">
              <video
                src={
                  videosForSku[0]?.url ||
                  'https://cdn.shopify.com/videos/c/o/v/d1dfefb16419452297b70381ad90fecc.mp4'
                }
                className="w-full h-[526px] object-cover rounded-lg border cursor-pointer hover:border-white transition-all"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        )}

        {previewActiveTab === 'images' && (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 flex justify-center items-center">
              <SliderGallery
                images={imagesForSku.length > 0 ? imagesForSku : fallbackImages}
                videos={[]}
                hasCSVMedia={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewTabs;