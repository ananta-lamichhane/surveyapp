import pandas as pd
def transform_jester_matrix():
    df = pd.read_csv('/home/ananta/Documents/surveyapp/survey/backend/data/datasets/jester/ratings.csv', sep=",", dtype="str")
    df = df[::1:]

    cols = ['userId', 'itemId', 'rating']
    df2 = pd.DataFrame(columns=cols)
  
    for i, vals in df.iterrows():
        print(i)
        if(i == 100):
            break
        for j,v in enumerate(vals):
            print(f"{i},{j},{v}")
            df2=df2.append({'userId': i, 'itemId':j, 'rating':v}, ignore_index=True)
    print(df2.head(10))


transform_jester_matrix()