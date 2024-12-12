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
    <section>
      <div className="pt-[40px]">
        <div className="px-[15px] pc:px-[48px]">
          <div className="mb-[20px] flex">
            <h3 className='text-[24px] font-[600] lg:text-[32px]'>BEESTYLE STYLING</h3>
            <h3 className='text-[24px] font-[600] lg:text-[32px]'> @BEEST_YLES</h3>
          </div>
          <div className="">
            <div className="elfsight-app-02ba200d-1830-4567-8bc3-c4f5cf889a32" data-elfsight-app-lazy></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Instagram;
