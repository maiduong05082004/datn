import { useState, useEffect } from 'react';
import { HeartOutlined } from '@ant-design/icons'; // Import icon trái tim

// Token của bạn
const YOUR_ACCESS_TOKEN = 'IGQWRQV215alBaRFdYam45VEtLbnlWOXRYaUdoTU5IaU1fbUl1OGdjNnBuRUNEbHp4X0xqcXZAjY3lqVUhBajZASaFFCZAWNJZA3J1QjBRTk9ZAMklsUjNpVTJiT3U4N2owd2stcE9JcFhMYU5Oa1IzVXljbXlmMnBMZAmMZD';

interface Post {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO';
  media_url: string;
  permalink: string;
}

interface Likes {
  [postId: string]: number;
}

const Instagram = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Likes>({});
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${YOUR_ACCESS_TOKEN}`);
      const data = await response.json();

      // Lấy ra 8 bài viết mới nhất
      const latestPosts = data.data.slice(0, 8);
      setPosts(latestPosts);

      // Lấy lượt thích cho từng bài viết
      const likePromises = latestPosts.map(async (post: Post) => {
        const likeResponse = await fetch(`https://graph.instagram.com/${post.id}?fields=like_count&access_token=${YOUR_ACCESS_TOKEN}`);
        const likeData = await likeResponse.json();
        return { [post.id]: likeData.like_count };
      });

      const likeResults = await Promise.all(likePromises);
      const likesObj = likeResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setLikes(likesObj);
    };

    fetchPosts();
  }, []);

  return (
    <section>
      <div className="pt-[40px]">
        <div className="px-[15px] pc:px-[48px]">
          <div className="mb-[20px] flex">
            <h3 className='text-[24px] font-[600] lg:text-[32px]'>BEESTYLE STYLING</h3>
            <h3 className='text-[24px] font-[600] lg:text-[32px]'> @BEEST_YLES</h3>
          </div>
          <div>
            <div className="grid grid-cols-3 grid-rows-2 lg:grid-cols-4 lg:gap-3">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="instagram-post relative"
                  onMouseEnter={() => setHoveredPostId(post.id)}
                  onMouseLeave={() => setHoveredPostId(null)}
                >
                  {post.media_type === 'VIDEO' ? (
                    <div>
                      <video controls className="w-full h-auto">
                        <source src={post.media_url} type="video/mp4" />
                      </video>
                    </div>
                  ) : (
                    <div className="pt-[100%] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${post.media_url})` }}></div>
                  )}

                  {/* Hiển thị thông tin khi hover vào ảnh */}
                  {hoveredPostId === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                      <div className="text-center px-[30pt]"> {/* Thêm padding trái phải */}
                        <p className="mb-2 text-ellipsis overflow-hidden line-clamp-4">{post.caption}</p> {/* Giới hạn 4 dòng */}
                        <p>
                          <HeartOutlined className="mr-1" /> {/* Icon trái tim */}
                          {likes[post.id] ? likes[post.id] : 'Loading...'}
                        </p>
                      </div>
                    </div>
                  )}

                  <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="absolute bottom-0 left-0 w-full text-center text-white bg-black bg-opacity-50 py-2">View on Instagram</a>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button className='text-white bg-black rounded-[5px] w-[228px] h-[32px] mt-[30px] mx-auto'>
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Instagram;
