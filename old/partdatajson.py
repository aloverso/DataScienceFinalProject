import numpy as np
import pandas as pd

leg = pd.read_csv('legislators.csv')
part = pd.read_csv('party-partisanship.csv')

data = []
for col in part.columns:
    datap = {}
    datap["key"] = col
    datap["values"] = []
    for yr in range(113):
        datap["values"].append([yr+1,part[col].iloc[yr]])
    data.append(datap)
print data