import Joi from 'joi';

export const SignupSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Tên là bắt buộc',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Email không hợp lệ',
    'string.empty': 'Email là bắt buộc',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
    'string.empty': 'Mật khẩu là bắt buộc',
  }),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Mật khẩu xác nhận không khớp',
  }),
  date_of_birth: Joi.date().required().messages({
    'date.base': 'Ngày sinh không hợp lệ',
    'any.required': 'Ngày sinh là bắt buộc',
  }),
  sex: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': 'Giới tính không hợp lệ',
    'string.empty': 'Giới tính là bắt buộc',
  }),
});
