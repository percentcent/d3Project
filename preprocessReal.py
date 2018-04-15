elemid = {
	'Price_k': "Price",
	'bedroom':"Bedroom",
	'bathroom': "Bathroom",
	'parking': "Parking",
	'age_md': "Median age",
	'income_md': "Median income",
	'local_Per': "Local(%)",
	'English_Per': "English speaking(%)",
	'rent_md':"Median rent",
	'sch_rank':"Secondary school",
	'to_station':"Walking to station",
	'Time_train':"train time to CBD",
	'Total_time':"Total time to CBD",
	'supermarket':"Supermarket",
	'hospital':"Hospital",
	'shopping_center':"Shopping center",
	'clinic':"Clinic",
	'Land_size':"Land Size"}

index = {}
maxDict = {}
minDict = {}

def num(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

count  = 0
for line in open('melbourne_vis.csv','r',encoding="utf-8"):
	elem = line.split(',')
	if count == 0:
		for i in range(len(elem)):
			item = elem[i]
			if(item in elemid):
				index[item] = i
				maxDict[item] = 0
				minDict[item] = 1000000
				count = 1
	else:
		for key in index:
			value = index[key]
			temp = num(elem[value])
			if temp > maxDict[key]:
				maxDict[key] = temp
			if temp > 0 and temp < minDict[key]:
				minDict[key] = temp

for key in minDict:
	minV = minDict[key]
	print(key,minV)

for key in maxDict:
	minV = maxDict[key]
	print(key,minV)