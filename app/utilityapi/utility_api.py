from models import Categories
from fastapi import APIRouter, HTTPException
from db import categories_table
from db import books_table
from db import authors_table
from dtos.dtos import BookDetailDTO,BookDTO,BulkUploadBooks
import json
from tinydb import Query


router7 = APIRouter()
CategoryQuery=Query()
BookQuery=Query()


@router7.get("/utility/books/details", response_model=list[BookDetailDTO])
def get_book_details():
    details = []
    for book in books_table:
        author = next((a for a in authors_table if a["author_id"] == book["author_id"]), {})
        category = next((c for c in categories_table if c["id"] == book["category_id"]), {})
        details.append({
            "title": book["title"],
            "author": author.get("first_name", "Unknown"),
            "category": category.get("name", "Unknown")
        })
    return details

