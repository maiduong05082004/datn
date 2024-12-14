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
            form.resetFields();
            navigate("/admin/dashboard");
        },
        onError: () => {
            toast.error("Bạn ko có quyền đăng nhập!!!");
        },
    });

    const onFinish = (values: FildType) => {
        mutate(values);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-[10px] shadow-lg w-[500px]">
                <h2 className="text-center text-[20px] font-bold text-gray-800 mb-8">
                    Đăng Nhập với quyền Admin
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
                            className="rounded-[5px] p-[10px]  border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
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
                            className="rounded-[5px] p-[10px] border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            htmlType="submit"
                            className="w-full text-white font-semibold p-[20px] rounded-m bg-black"
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Signin;
