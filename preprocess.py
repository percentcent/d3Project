
from nltk.corpus import stopwords
stopWords = set(stopwords.words('english'))
print(stopWords)

count = 0
fo = open("/Users/peishanlee/Downloads/tweets_au_vic_full.txt","r")
fw = open('tweetProcessed_subset.txt', 'w')
for line in open('/Users/peishanlee/Downloads/tweets_au_vic_full.txt'):
	if(count > 200000):
		break
	count += 1
	line = fo.readline()
	elem = line.split('	')
	if (len(elem) < 6):
		continue
	tid = elem[0]
	time = elem[1]
	text = elem[2]
	hashtags = elem[3]
	keyword = elem[4]
	lat = elem[5]
	lon = elem[6]
	fw.write(elem[0]+"\t"+elem[1]+"\t"+elem[2]+"\t"+elem[3]+"\t"+elem[4]+"\t"+elem[5]+"\t"+elem[6]+"\n")

fo.close()
fw.close()

