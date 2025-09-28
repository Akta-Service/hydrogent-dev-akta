import React, { useEffect, useState } from 'react';
import BlogCard from '~/components/ui/cards/BlogCard';
import { Blog } from '~/lib/types';

// Format published date safely
const formatDate = (publishedAt?: string | null): string => {
  if (!publishedAt) return 'N/A';
  try {
    const date = new Date(publishedAt);
    if (isNaN(date.getTime())) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return 'N/A';
  }
};

interface LatestNewsSectionProps {
  blogs: { node: Blog }[] | null | undefined;
}

const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ blogs }) => {
  const [processedBlogs, setProcessedBlogs] = useState<
    {
      id: string;
      image: string;
      title: string;
      date: string;
      time: string;
      link: string;
    }[]
  >([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && blogs?.length) {
      const processed = blogs.map(({ node }) => ({
        id: node.id,
        image: node.image?.url || '/placeholder.png',
        title: node.title,
        date: formatDate(node.publishedAt),
        time: node?.metafield?.value || '5 min',
        link: `/blogs/news/${node.handle || node.id}`,
      }));

      setProcessedBlogs(processed);
    }
  }, [blogs]);

  return (
    <div className="w-full bg-white lg:pt-[50px] lg:pb-[90px] md:pb-[45px] py-[45px] sm:py-auto">
      <div className="container max-w-[1440px] mx-auto px-[19px] md:px-[40px]">
        <h2 className="max-w-[516px] mx-auto text-center pb-[10px] custom-border-bottom border-b border-[2px] border-solid playfair text-primary text-[32px] md:text-[48px] lg:text-[64px] font-normal">
          Latest News
        </h2>
        <p className="text-center outfit md:font-light font-medium text-[16px] text-primary/80 mt-[23px]">
          Explore our iconic collections, where elegance meets excellence.
        </p>
        <div className="mt-[30px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {processedBlogs && processedBlogs.length > 0 ? (
            processedBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                image={blog.image}
                title={blog.title}
                date={blog.date}
                time={blog.time}
                to={blog.link}
              />
            ))
          ) : processedBlogs === undefined || processedBlogs.length === 0 ? (
            [...Array(4)].map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="animate-pulse blogCard bg-transparent w-[340px] sm:max-w-full mx-auto"
              >
                <div className="cardImg">
                  <div className="h-[200px] bg-gray-700 rounded w-full" />
                </div>
                <div className="cardInfo px-2 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-[12px] w-[50px] bg-gray-700 rounded"></div>
                    <span className="h-[4px] w-[4px] bg-[rgba(69,69,69,1)] rounded"></span>
                    <div className="h-[12px] w-[30px] bg-gray-700 rounded"></div>
                  </div>
                  <div className="mt-[10px] h-[20px] bg-gray-700 rounded w-[80%]" />
                  <div className="text-right mt-[10px]">
                    <div className="w-[101px] h-[26px] bg-gray-700 rounded ml-auto" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-primary">No posts available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestNewsSection;