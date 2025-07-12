from fastapi import APIRouter, Query
from tinydb import where
from db import authors_table

router = APIRouter()

# Search authors by name
@router.get("/authors/search/")
def search_authors(name: str = Query(..., min_length=1)):
    results = authors_table.search(
        (where('first_name').matches(f'(?i).*{name}.*')) | 
        (where('last_name').matches(f'(?i).*{name}.*'))
    )
    return results


