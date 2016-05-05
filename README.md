# Data Science Spring 2016 Final Project
This is the base repository for our Data Science Final Project. The members of this team are Pratool Gadtaula, Zoher Ghadyali, and Anne Loverso and our project is to tell a data-driven story about Congress.

## Data
All the data we used for this project can be found in our GitHub repo. It is licensed free and open source under the GNU General Public License, and we encourage visitors to use the data as they see fit to continue the spirit of the project.

The data exists in comma-separated value (CSV) format. We have 226 CSV files, one for each branch of Congress for each of its 113 sessions. The 114th session of Congress was in term at the time of creation of this project, so we chose not to include it for incomplete data. The files are named [session][branch].csv where [session] is the session number, 1-113, and [branch] is the branch of Congress, either "house" or "senate". Additionally, we created a legislators.csv file which contains a row for each legislator and columns of information about them.

Within the CSV files, each row pertains to a vote taken during that session. These are reduced to votes we decided were important and relevant to this project: votes on bills, amendments, or passages. Other types of votes, such as nominations, were not included because we decided they were not relevant to our goals.

The columns in the CSV files are as follows:

Column | Contains 
--- | --- 
`Legislator IDs` | These cross-reference to the "vote_id" column of the legislators.csv, and is a unique ID identifying that legislator. The contents of this column are the legislator's vote: either "Yea", "Nay", "Not Voting", or NaN if no data exists.
`date` | The date of the vote
`isAmendment` | A boolean value indicating whether the vote is an amendment
`requires`	| The votes required to pass - most are simple majority, some are two-thirds
`result` | Text indicating whether the vote passed
`title` | Title of the bill in numerical format
`Subjects` | These columns are all subjects of bills present in that session, and the contents are boolean values indicating whether a bill pertained to a subject. This data only exists in the 93rd session and later.
`billTitle` | A short title, if it exists
`committee` | The bill's committe of origin, if applicable, else NaN
`officialTitle` | The official title of the bill
`sponsor` | The bill's sponsor, if known
