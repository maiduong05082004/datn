import { useEffect } from "react";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  // Load dau trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-gray-50">

      <div className="relative w-full h-[300px]">
        <img
          src="https://bizweb.dktcdn.net/thumb/large/100/446/974/products/giay-mlb-chinh-hang-bigball-chunky-logo-ny-mau-kem-3ashbcv4n-50crs-2.jpg?v=1723951477623"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-center">
          <h1 className="text-white text-3xl font-bold mb-4">Chính sách bảo mật</h1>

          <Link to={`/`} className="text-white text-xl mb-0">
            Quay về
          </Link>
        </div>
      </div>

      {/* Content Section */}

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Cám ơn quý khách đã quan tâm và truy cập vào website</h2>

          <p className="text-lg text-gray-600 mb-4">
            Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của Quý khách.
          </p>

          <p className="text-lg text-gray-600 mb-4">
            Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của Quý khách.
          </p>

          <p className="text-lg text-gray-600 mb-4">
            Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung của Chính sách bảo mật.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">1. Thu thập thông tin cá nhân</h2>
          <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
            <li className="mb-4">Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này liên quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm một số thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi tiết tài khoản ngân hàng.</li>
            <li className="mb-4">Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử lý đơn đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu thông qua website và theo yêu cầu của bạn.</li>
            <li className="mb-4">Hơn nữa, chúng tôi sẽ sử dụng các thông tin đó để quản lý tài khoản của bạn; xác minh và thực hiện giao dịch trực tuyến, nhận diện khách vào web, nghiên cứu nhân khẩu học, gửi thông tin bao gồm thông tin sản phẩm và dịch vụ. Nếu quý khách không muốn nhận bất cứ thông tin tiếp thị của chúng tôi thì có thể từ chối bất cứ lúc nào.</li>
            <li className="mb-4">Chúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ giao hàng cho bạn (ví dụ cho bên chuyển phát nhanh hoặc nhà cung cấp).</li>
            <li className="mb-4">Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì lí do bảo mật nên chúng tôi không công khai trực tiếp được. Tuy nhiên, quý khách có thể tiếp cận thông tin bằng cách đăng nhập tài khoản trên web.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">2. Bảo mật</h2>
          <ul className="list-disc pl-6 text-lg text-gray-600">
            <li className="mb-4">Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc mất mát hoặc tiêu hủy hoặc thiệt hại cho thông tin của bạn.</li>
            <li className="mb-4">Chúng tôi khuyên quý khách không nên đưa thông tin chi tiết về việc thanh toán với bất kỳ ai bằng e-mail, chúng tôi không chịu trách nhiệm về những mất mát quý khách có thể gánh chịu trong việc trao đổi thông tin của quý khách qua internet hoặc email.</li>
            <li className="mb-4">Quý khách tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống website.</li>
            <li className="mb-4">Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">3. Quyền lợi khách hàng</h2>

          <ul className="list-disc pl-6 text-lg text-gray-600">
            <li>Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong dữ liệu của bạn mà không mất phí. Bất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
