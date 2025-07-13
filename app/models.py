import datetime
from pydantic import BaseModel
from typing import List, Optional

class Book(BaseModel):
    title: str
    rating: Optional[float] = None

class Author(BaseModel):
    author_id: int
    first_name: str
    last_name: str
    bio: str
    date_of_birth: datetime.date
    date_of_death: datetime.date
    nationality: str
    created_at: datetime.date
    updated_at: datetime.date
    average_rating: float
    book_count: int
    books: List[Book]

    class Config:
        json_encoders = {
            datetime.date: lambda v: v.isoformat()
        }

class Categories(BaseModel):
    id: int
    name: str    
