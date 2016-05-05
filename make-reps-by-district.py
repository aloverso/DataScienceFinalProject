import json
import pandas as pd

def create_table():
    """
    Creates a look up table to retrieve a Congress person's name, vote id,
    and length of time in office given their state, district, and session
    of Congress.
    """

    table = {}
    with open('states_hash.json', 'r') as state_file:
        states_hash = json.load(state_file)
    congress = pd.read_csv('./data/legislators.csv', low_memory=False)
    sessions = []
    for session_name in congress:
        if 'c' in session_name and len(session_name) < 5:
            sessions.append(session_name)
    for session in range(len(sessions)):
        current = congress[(congress[sessions[session]]==1) &\
                  (congress['type']=='rep')]
        table[session] = {}
        for member in zip(current['first_name'],\
                          current['last_name'],\
                          current['state'],\
                          current['district'],\
                          current['vote_id']):
            name = member[0] + ' ' + member[1]
            state = states_hash[member[2]]
            dist = int(member[3])
            vote_id = member[4]

            person = congress[(congress['vote_id'] == vote_id)]
            incumbency_len = 0
            for i in range(session,0,-1):
                if int(person[sessions[i]]) == 1:
                    incumbency_len += 2
                else:
                    break

            if state in table[session]:
                if dist in table[session][state]:
                    table[session][state][dist].append(\
                            [name, vote_id, incumbency_len])
                else:
                    table[session][state][dist] =\
                            [[name, vote_id, incumbency_len]]
            else:
                table[session][state] = {dist: [[name, vote_id, incumbency_len]]}

    # in order to use JSON, the JSON must be constructed from a dictionary base
    table = {"table": table}
    with open('reps-by-district.json', 'w') as f:
        json.dump(table, f, ensure_ascii=False)

if __name__ == "__main__":
    create_table()
