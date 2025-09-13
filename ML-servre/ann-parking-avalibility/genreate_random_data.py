from datetime import datetime, timedelta
from random import choice, random
import pandas as pd

dataset = pd.read_csv('./data.csv')

weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

time_slots = []
start_time = datetime.strptime("00:00", "%H:%M")
end_time = datetime.strptime("23:30", "%H:%M")
interval = timedelta(minutes=30)

while start_time <= end_time:
    next_time = start_time + interval
    time_slots.append(f"{start_time.strftime('%H:%M')}-{next_time.strftime('%H:%M')}")
    start_time = next_time


binary = ['Yes', 'No']

locations = ['Market', 'Residential', 'Office Area', 'Commercial']

citys = ['Tier I', 'Tier II', 'Tier III']

nearby_transports = ['None', 'Bus Stand', 'Railway Station', 'Airport']



for i in range(10000):
    day = choice(weekdays)
    time_slot = choice(time_slots)
    is_festival = choice(binary)
    is_holiday = choice(binary)
    location_type = choice(locations)
    city_type = choice(citys)
    nearby_transport = choice(nearby_transports)
    upcoming_festival = choice(binary)
    crowd_percentage = random()

    data = [day, time_slot, is_festival, is_holiday, location_type, city_type, nearby_transport, upcoming_festival, crowd_percentage]

    dataset.loc[len(dataset)] = data

    print(i)

dataset.to_csv('./dataset.csv', index=False)