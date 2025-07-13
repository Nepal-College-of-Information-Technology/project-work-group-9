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
