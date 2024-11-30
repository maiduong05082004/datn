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
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            {contextHolder}
            <div className="w-full max-w-md p-8 bg-gray-100 rounded-xl shadow-lg">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">Đăng Nhập</h2>
                <p className="text-center text-gray-600 mb-4">Vui lòng đăng nhập để tiếp tục</p>
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ email: "", password: "" }}
                >
                    {/* Email Input */}

                    <Form.Item<FildType>
                        label={<span className="font-semibold text-gray-800">Email</span>}
                        name="email"
                        rules={[{ required: true, message: "Bạn chưa nhập email" }]}
                    >
                        <Input
                            placeholder="Nhập email của bạn"
                            className="w-full h-12 px-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </Form.Item>

                    {/* Password Input */}

                    <Form.Item<FildType>
                        label={<span className="font-semibold text-gray-800">Mật khẩu</span>}
                        name="password"
                        rules={[{ required: true, message: "Bạn chưa nhập mật khẩu" }]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu"
                            className="w-full h-12 px-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </Form.Item>

                    {/* Custom Remember Me and Forgot Password */}

                    <div className="flex items-center justify-between mb-4">
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            className="mb-0"
                        >
                            <div className="flex items-center">
                                <label className="relative flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-6 h-6 bg-white border border-gray-300 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:after:content-['✓'] peer-checked:after:text-white peer-checked:after:absolute peer-checked:after:top-[2px] peer-checked:after:left-[5px] peer-checked:after:text-sm flex items-center justify-center transition-none"></div>
                                    <span className="ml-2 text-gray-700">Remember password</span>
                                </label>
                            </div>
                        </Form.Item>
                        <Link to="/forgot-password" className="text-gray-900 font-medium">Quên mật khẩu?</Link>
                    </div>

                    {/* Submit Button */}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="w-full h-12 font-semibold text-white bg-black rounded-lg"
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>

                    {/* Link to Signup */}

                    <div className="text-center">
                        <span className="text-gray-700">
                            Bạn chưa có tài khoản?{" "}
                            <Link to="/signup" className="text-gray-950 font-medium">Đăng ký ngay!</Link>
                        </span>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Signin;
