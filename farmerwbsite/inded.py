from GoogleNews import GoogleNews
import pandas as pd
import csv

gNews = GoogleNews(period='1d')
gNews.search("fertilizer in India")
result = gNews.result()

news_data = []
for res in result:
    news_data.append({
        "Title": res["title"],
        "Details": res["link"]
        
    })

with open("data.csv", "a", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["Title", "Details"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    for row in news_data:
        writer.writerow(row)