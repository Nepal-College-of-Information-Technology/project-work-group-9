from typing import List, Optional
from pydantic import BaseModel, Field, computed_field
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from datetime import date



class Book(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    author_id: int = Field(..., gt=0)
    category_id: int = Field(..., gt=0)
    isbn: Optional[str] = Field(default=None, min_length=10, max_length=13)
    price: float = Field(..., gt=0) 
    publication_date: date
    description: Optional[str] = None
    pages: int = Field(..., gt=0)
    available_copies: int = Field(default=1, ge=0)
 

class Author(BaseModel):
    author_id: int
    first_name: str
    last_name: str
    bio: str
    date_of_birth: date
    date_of_death: Optional[date] = None  # maybe allow None if unknown
    nationality: str
    created_at: date
    updated_at: date
    average_rating: float
    book_count: int
    books: List[Book]


    @computed_field
    def name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    class Config:
        json_encoders = {
            date: lambda v: v.isoformat()
        }



class Categories(BaseModel):
    id: int
    name: str

class CategoryCreate(BaseModel):
    name: str    

class BookCreate(BaseModel):
    title: str
    description: str
    author_id: int
    category_id: int
    publication_date: date
    price: float


class AuthorCreateInput(BaseModel):
    name: str
    bio: Optional[str] = None
