import numpy as np
import pandas as pd
from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis")

df = pd.read_csv("data/semantics.csv", encoding='ISO-8859-1')

df_sem = df.copy()
def get_sentiment(text):
    if pd.isna(text) or not text:
        return 'Unknown','Unknown'
    result = sentiment_analyzer(text)
    return classify_sentiment(result[0]['score']), result[0]['score']
def classify_sentiment(score):
    if score > 0.5:
        return 'Positive'
    elif score < 0.5:
        return 'Negative'
    else:
        return 'Neutral'
df_sem = df_sem.fillna('Unknown')
df_sem_score = df_sem.copy()
for a in df_sem.columns[1:]:
    for b in df_sem.index:
        print(df_sem[a])
        df_sem[a][b] = get_sentiment(df_sem[a][b])[0]
        df_sem_score[a][b] = get_sentiment(df_sem[a][b])[1]
df_sem_score.to_csv('data/sem_sentiment.csv')
df_sem.to_csv('data/sem_sentiment_score.csv')