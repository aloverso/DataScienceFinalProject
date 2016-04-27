import json
import pandas as pd

def create_table():
    """
    Creates a look up table to retrieve a Congress person's name given their
    state, district, and session of Congress.
    """
    table = {}
    with open('states_hash.json', 'r') as state_file:
        states_hash = json.load(state_file)
    congress = pd.read_csv('../legislators.csv', low_memory=False)
    sessions = []
    for session_name in congress:
        if 'c' in session_name and len(session_name) < 5:
            sessions.append(session_name)
    #states = congress['state'].unique()
    #districts = range(1,60)
    for session in range(len(sessions)):
        current = congress[(congress[sessions[session]]==1) &\
                  (congress['type']=='rep')]
        table[session] = {}
        for member in zip(current['first_name'],\
                          current['last_name'],\
                          current['state'],\
                          current['district'],\
                          current['vote_id']):
            #cong_name = sessions[session]
            name = member[0] + ' ' + member[1]
            state = states_hash[member[2]]
            dist = int(member[3])
            vote_id = member[4]
            if state in table[session]:
                if dist in table[session][state]:
                    table[session][state][dist].append([name, vote_id])
                else:
                    table[session][state][dist] = [[name, vote_id]]
            else:
                table[session][state] = {dist: [[name, vote_id]]}
    # in order to use JSON, the JSON must be constructed from a dictionary
    table = {"table": table}
    with open('reps-by-district.json', 'w') as f:
        json.dump(table, f, ensure_ascii=False)

if __name__ == "__main__":
    create_table()