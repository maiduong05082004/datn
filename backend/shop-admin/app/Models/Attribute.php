<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attribute extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'attribute_type'];

    public function values()
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id');
    }

   
    public function attributeGroups()
    {
        return $this->hasMany(AttributeGroup::class, 'attribute_id');
    }
    
    public function attributeValues()
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id');
    }
   
}
