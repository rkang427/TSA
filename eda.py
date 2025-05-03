import numpy as np
import pandas as pd
from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis")

df = pd.read_csv("data/full_data.csv", encoding='ISO-8859-1')

df = df.T

sentiment = df.iloc[29:33]
sentiment.to_csv("data/sentiment_initial.csv")

def get_sentiment(text):
    if pd.isna(text) or not text:
        return None, None
    result = sentiment_analyzer(text)
    return result[0]['label'], result[0]['score']

sentiment_labels = []
sentiment_scores = []
response = []
for row in sentiment.itertuples(index=False):
    sentiment_label_temp = []
    sentiment_score_temp = []
    for cell in row:
        label, score = get_sentiment(str(cell))
        sentiment_label_temp.append(label)
        sentiment_score_temp.append(score)
    sentiment_labels.append(sentiment_label_temp)
    sentiment_scores.append(sentiment_score_temp)
tmp = sentiment.T.columns
sentiment_labels = sentiment_labels.T
sentiment_scores = sentiment_scores.T
sentiment_label_columns = [a + " Sentiment Label" for a in tmp]
sentiment_score_columns = [a + " Score Label" for a in tmp]
labels_df = pd.DataFrame(sentiment_labels, columns=sentiment_label_columns)
scores_df = pd.DataFrame(sentiment_scores, columns=sentiment_score_columns)
df = pd.concat([df, labels_df, scores_df], axis=1)
print(df.shape)
df.to_csv("data/sentiment_final.csv")



# # sentiment_labels = np.array(sentiment_labels).reshape(sentiment.shape)
# # sentiment_scores = np.array(sentiment_scores).reshape(sentiment.shape)
# #
# # df.iloc[29:34, df.columns.get_loc('sentiment_label')] = sentiment_labels
# # df.iloc[29:34, df.columns.get_loc('sentiment_score')] = sentiment_scores
# #
#
#
# #
# # def classify_sentiment(score):
# #     if score > 0.5:
# #         return 'Positive'
# #     elif score < 0.5:
# #         return 'Negative'
# #     else:
# #         return 'Neutral'
# #
# # sentiment_classifications = [[classify_sentiment(score) for score in row] for row in sentiment_scores]
# #
# # df.iloc[29:34, df.columns.get_loc('sentiment_classification')] = sentiment_classifications
# #
# # print(df.loc[29:34, ['sentiment_label', 'sentiment_score', 'sentiment_classification']])
