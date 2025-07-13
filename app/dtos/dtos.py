from pydantic import BaseModel
from typing import List, Optional

class BookDTO(BaseModel):
    id: int
    title: str
    author_id: int
    category_id: int

class BookDetailDTO(BaseModel):
    title: str
    author: str
    category: str

class BulkUploadBooks(BaseModel):
    books: List[BookDTO]