import instance from "@/configs/axios";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type FildType = {
    email?: string;
    password?: string;
};

const Signin = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (auth: FildType) => {
            try {
                const response = await instance.post(
                    `http://localhost:8000/api/admins/signin`,
                    auth
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: (data) => {
            toast.success("Đăng Nhập Thành Công");
            localStorage.setItem("user", data.token);
            form.resetFields();
            navigate("/admin/dashboard");
        },
        onError: () => {
            toast.error("Đăng Nhập Thất Bại!");
        },
    });

    const onFinish = (values: FildType) => {
        mutate(values);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-blue-800 to-indigo-900">
            <div className="bg-white p-8 rounded-xl shadow-xl w-96">
                <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Đăng Nhập</h2>
                <Form form={form} name="signin" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
                    >
                        <Input
                            placeholder="Nhập email của bạn"
                            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu"
                            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <Link to="/admin/forgot-password" className="text-blue-600 hover:text-blue-800">
                        Quên mật khẩu?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signin;
