import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

type FildType = {
    email?: string;
    password?: string;
};

const Signin = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const queryCient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (auth: FildType) => {
            try {
                const response = await axios.post(
                    `http://127.0.0.1:8000/api/admins/signin`,
                    auth
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: async (data) => {
            toast.success("Đăng Nhập Thành Công");
            localStorage.setItem("token_admin", data.token);
            
                const userResponse = await instance.get(
                    `http://127.0.0.1:8000/api/client/auth/profile`,
                );
                
                const userData = userResponse.data;
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("role", userData.role); 
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
        <>
            <ToastContainer />

            <div

                className="flex items-center justify-center min-h-screen"
                style={{
                    background: "linear-gradient(to right, #ff7e5f, #feb47b)",
                }}
            >
                <div className="bg-white p-10 rounded-2xl shadow-lg w-96">
                    <h2 className="text-center text-4xl font-bold text-gray-800 mb-8">
                        Đăng Nhập
                    </h2>
                    <Form
                        form={form}
                        name="signin"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Vui lòng nhập email hợp lệ!",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập email của bạn"
                                className="rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu!" },
                            ]}
                        >
                            <Input.Password
                                placeholder="Nhập mật khẩu"
                                className="rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full bg-orange-600 text-white font-semibold py-2 rounded-md hover:bg-orange-700"
                            >
                                Đăng Nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <Link
                            to="/admin/forgot-password"
                            className="text-orange-600 hover:text-orange-800"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signin;
