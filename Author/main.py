from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List 
from tinydb import TinyDB, Query
import datetime

app = FastAPI()

db = TinyDB('db.json')
authors_table = db.table('authors')

class Author(BaseModel):
    id : int
    first_name : str
    last_name : str
    bio : str
    date_of_birth : datetime.date
    date_of_death : datetime.date
    nationality : str
    created_at : datetime.date
    updated_at : datetime.date
    average_rating : float
    book_count : int

