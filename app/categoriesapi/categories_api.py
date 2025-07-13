from models import Categories
from fastapi import APIRouter, HTTPException
from db import categories_table
import json
from tinydb import Query


router5 = APIRouter()


@router5.get('/categories')
def get_all_categories():
    categories = categories_table.all()
    return categories, 200


@router5.post('/categories', status_code=201)
def create_category(category: Categories):
    existing = categories_table.get(Query().id == category.id)
    if existing:
        raise HTTPException(status_code=400, detail="Category ID already exists")
    categories_dict=json.loads(category.model_dump_json())
    categories_id=categories_table.insert(categories_dict)
    return {**categories_dict}