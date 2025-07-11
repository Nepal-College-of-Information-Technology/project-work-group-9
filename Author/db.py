from tinydb import TinyDB, Query

db = TinyDB('db.json')
authors_table = db.table('authors')