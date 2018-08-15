
count = 0
fw = open('/Users/peishanlee/Downloads/tweet_GreatMelbourne.txt', 'w')

maxlon = 144.0
for line in open("/Users/peishanlee/Downloads/tweets_au_vic_full.txt","r"):
	elem = line.split('	')
	if (len(elem) < 6):
		continue
	tid = elem[0]
	time = elem[1]
	text = elem[2]
	#hashtags = elem[3]
	#keyword = elem[4]
	lat = elem[5]
	lon = elem[6]
	if(count >0):
		try:
			latNum = float(lat)
			lonNum = float(lon)
			if lonNum > maxlon:
				maxlon = lonNum
			if latNum > -38.10 and latNum < -37.50 and lonNum > 144.70 and lonNum < 145.45:
				fw.write(elem[0]+"\t"+elem[1]+"\t"+elem[2]+"\t"+elem[5]+"\t"+elem[6]+"\n")
		except ValueError:
			print("error")
	count += 1

fw.close()
print(maxlon)
