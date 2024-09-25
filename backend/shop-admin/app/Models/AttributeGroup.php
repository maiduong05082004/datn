<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeGroup extends Model
{
    use HasFactory;

    protected $table = 'attribute_groups';

    protected $fillable = [
        'group_id',
        'attribute_id',
        'created_at',
        'updated_at'
    ];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }
}
