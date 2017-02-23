import csv
import json
import sys

# print sys.argv
# print len(sys.argv)
if (len(sys.argv) != 3):
    print 'use format: python csvread.py <visualering_directory> <lopnr_new>'

resp = {'pnr': sys.argv[2]}
person_file = csv.DictReader(open(sys.argv[1] + '/person.csv'))
for row in person_file:
    if row['lopnr_new'] == sys.argv[2]:
        # print row
        resp['person'] = row

resp['biopsy'] = []
biopsy_file = csv.DictReader(open(sys.argv[1] +  '/biopsy.csv'))
for row in biopsy_file:
    if row['lopnr_new'] == sys.argv[2]:
        # print row
        resp['biopsy'].append(row)

resp['diagnoses'] = []
biopsy_file = csv.DictReader(open(sys.argv[1] +  '/diagnoses.csv'))
for row in biopsy_file:
    if row['lopnr_new'] == sys.argv[2]:
        # print row
        resp['diagnoses'].append(row)

resp['psa'] = []
biopsy_file = csv.DictReader(open(sys.argv[1] +  '/psa.csv'))
for row in biopsy_file:
    if row['lopnr_new'] == sys.argv[2]:
        # print row
        resp['psa'].append(row)

print 'output will be in %s.json' %(sys.argv[2])
with open(sys.argv[2] + '.json', 'w') as outfile:
    json.dump(resp, outfile)


