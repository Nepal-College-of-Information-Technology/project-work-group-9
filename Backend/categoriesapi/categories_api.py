from authorsapi.models import Categories, CategoryCreate
from fastapi import APIRouter, HTTPException
from db import categories_table
from db import books_table
import json
from tinydb import Query


router5 = APIRouter()
CategoryQuery=Query()
BookQuery=Query()


@router5.get('/categories')
def get_all_categories():
    categories = categories_table.all() 
    BookQuery = Query()
    categories_with_counts = []

    for category in categories:
        book_count = books_table.count(BookQuery.categoryId == category["id"])
        category_with_count = category.copy()
        category_with_count["bookCount"] = book_count
        categories_with_counts.append(category_with_count)

    return categories_with_counts


@router5.post('/categories', status_code=201)
def create_category(category: CategoryCreate):
    category_dict = category.model_dump()
    all_categories = categories_table.all()
    max_id = max([c.get("id", 0) for c in all_categories], default=0)
    category_dict["id"] = max_id + 1

    categories_table.insert(category_dict)
    return category_dict


@router5.get('/categories/{id}', response_model=Categories)
def get_category(id: int):
    category = categories_table.get(CategoryQuery.id == id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router5.put('/categories/{id}')
def update_category(id: int, category: Categories):
    updated = categories_table.update(category.model_dump(), Query().id == id)
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")
    return {**category.model_dump()}


@router5.delete('/categories/{id}')
def delete_category(id: int):
    deleted = categories_table.remove(CategoryQuery.id == id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}

@router5.get('/categories/{id}/books')
def get_books_under_category(id: int):
    return books_table.search(BookQuery.category_id==id)

    