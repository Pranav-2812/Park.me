from joblib import load
import pandas as pd
import numpy as np
loaded_ct = load('column_transformer.joblib')

input_data = [['Tuesday', '21:30-22:00', 'No', 'No', 'Commercial', 'Tier I', 'Airport', 'No']]
# input_data = pd.DataFrame(input_data)
# input_data = input_data.reshape(-1, 1)
input_data = loaded_ct.transform(input_data)

print(input_data)