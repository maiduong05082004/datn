import React from 'react';

const ContactPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="text-center mb-12">
        
        <div className="relative w-full h-[300px] mb-12">
          <img
            src="https://bizweb.dktcdn.net/thumb/large/100/446/974/products/giay-mlb-chinh-hang-bigball-chunky-logo-ny-mau-kem-3ashbcv4n-50crs-2.jpg?v=1723951477623"
            alt="Banner"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-center">
            <h1 className="text-white text-3xl font-bold mb-4">Thông tin liên hệ</h1>
            <a href="/" className="text-white text-xl mb-0">
              Quay về
            </a>
          </div>
        </div>
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Thông Tin Liên Hệ</h1>
            <p className="text-lg text-gray-600 mt-4">
              Vui lòng tham khảo thông tin dưới đây để liên hệ với chúng tôi.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            {/* Địa chỉ */}
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt text-blue-600 text-2xl mr-4"></i>
              <p className="text-lg text-gray-800">
                Địa chỉ: Trụ sở chính Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
              </p>
            </div>

            {/* Số điện thoại */}
            <div className="flex items-center">
              <i className="fas fa-phone-alt text-blue-600 text-2xl mr-4"></i>
              <p className="text-lg text-gray-800">
                Điện thoại: <a href="tel:0947059709" className="text-blue-600">0846739434</a>
              </p>
            </div>

            {/* Zalo */}
            <div className="flex items-center">
              <i className="fas fa-comment-alt text-blue-600 text-2xl mr-4"></i>
              <p className="text-lg text-gray-800">
                Zalo: <a href="https://zalo.me/0947059709" className="text-blue-600">0846739434</a>
              </p>
            </div>

            {/* Giờ làm việc */}
            <div className="flex items-center">
              <i className="fas fa-clock text-blue-600 text-2xl mr-4"></i>
              <p className="text-lg text-gray-800">
                Giờ làm việc: Thứ 2 - Thứ 7, từ 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
