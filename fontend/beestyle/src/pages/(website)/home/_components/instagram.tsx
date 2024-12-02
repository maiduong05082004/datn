import { useEffect } from 'react';

const Instagram = () => {
  useEffect(() => {
    // Tạo và thêm script của Elfsight vào trang
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Dọn dẹp khi component bị gỡ bỏ
    };
  }, []);

  return (
    <div>
      {/* Mã nhúng widget Instagram Feed từ Elfsight */}
      <div className="elfsight-app-02ba200d-1830-4567-8bc3-c4f5cf889a32" data-elfsight-app-lazy></div>
    </div>
  );
};

export default Instagram;
