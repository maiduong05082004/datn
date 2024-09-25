<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;


    const Role_Admin = 'admin';
    const Role_User = 'user';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',       // Tên đầu của người dùng (Ví dụ: John)
        'last_name',        // Họ của người dùng (Ví dụ: Doe)
        'date_of_birth',    // Ngày tháng năm sinh của người dùng
        'sex',              // Giới tính của người dùng (male, female, other)
        'email',            // Địa chỉ email của người dùng
        'password',         // Mật khẩu (sẽ được mã hóa khi lưu vào cơ sở dữ liệu)
        'provider_name',         // Mật khẩu (sẽ được mã hóa khi lưu vào cơ sở dữ liệu)
        'provider_id',         // Mật khẩu (sẽ được mã hóa khi lưu vào cơ sở dữ liệu)
        'role',             // Vai trò của người dùng (ví dụ: admin, user)
        'last_login_at',    // Thời gian người dùng đăng nhập lần cuối
        'is_active',        // Trạng thái kích hoạt tài khoản (true/false)
            
    ];
    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // ma hóa password vào cơ sở dữ liệu
        'is_active' => 'boolean',

    ];


    public function bill(){
        return $this->hasMany(Bill::class);
    }


    public function promotions()
    {
        return $this->belongsToMany(Promotion::class, 'user_promotions');
    }

    public function comments()
{
    return $this->hasMany(Comment::class);
}


   // Mối quan hệ với bảng ShippingAddress
   public function shippingAddresses()
   {
       return $this->hasMany(ShippingAddress::class);
   }


   public function defaultShippingAddress()
{
    return $this->hasOne(ShippingAddress::class)->where('is_default', true);
}

   
}
