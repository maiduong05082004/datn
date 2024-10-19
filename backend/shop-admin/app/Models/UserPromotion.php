<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPromotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'promotion_id'
    ];

    // Quan hệ với User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ với Promotion
    public function promotion()
    {
        return $this->belongsTo(Promotion::class);
    }
}
