import instance from "@/configs/axios";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, FormProps, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

type FildType = {
    email?: string;
    password?: string;
    confirmPassword?: string;
};

const Signin = () => {
    const [form] = Form.useForm();
    const [messageAPI, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (auth: FildType) => {
            try {
                const response = await instance.post(`http://localhost:8000/api/admins/signin`, auth);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: (data) => {
            messageAPI.success("Đăng nhập thành công!");
            localStorage.setItem("user", JSON.stringify(data));
            form.resetFields();
            navigate("/admin/dashboard");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
            messageAPI.error(errorMessage);
        }
    });

    const onFinish: FormProps<FildType>['onFinish'] = (values) => {
        mutate(values);
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/183983/Originals/cac-mau-background-4k-cuc-sac-net-2.png" }}
        >
            {contextHolder}
            <div className="w-full max-w-5xl p-12 space-y-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">Đăng Nhập</h2>
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ email: "", password: "" }}
                >
                    <Form.Item<FildType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Bạn chưa nhập email" }]}
                    >
                        <Input className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </Form.Item>
                    <Form.Item<FildType>
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Bạn chưa nhập mật khẩu" }]}
                    >
                        <Input.Password className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block className="w-full h-10 font-semibold bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500">
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                    <div className="text-center">
                        <Link to="/signup" className="text-green-600 hover:underline">Chưa có tài khoản? Đăng ký ngay!</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Signin;
