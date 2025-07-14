from fastapi import APIRouter, Query, HTTPException
from tinydb import where
from db import authors_table

router2 = APIRouter()

# Search authors by name
@router2.get("/authors/search/")
def search_authors(name: str = Query(..., min_length=1)):
    results = authors_table.search(
        (where('first_name').matches(f'(?i).*{name}.*')) | 
        (where('last_name').matches(f'(?i).*{name}.*'))
    )
    return results

# Get top authors by book count
@router2.get("/authors/top/")
def get_top_authors(limit: int = Query(5, gt=0)):
    authors = authors_table.all()
    authors_with_count = [a for a in authors if a.get("book_count") is not None]
    if not authors_with_count:
        raise HTTPException(status_code=404, detail="No authors with book counts found")
    authors_sorted = sorted(authors_with_count, key=lambda a: a["book_count"], reverse=True)
    return authors_sorted[:limit]
