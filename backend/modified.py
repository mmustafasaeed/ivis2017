import csv
import json
import sys
import datetime
import time
# print sys.argv
# print len(sys.argv)
if (len(sys.argv) != 3):
    print 'use format: python modified.py <visualering_directory> <lopnr_new>'
    sys.exit(0)
resp = []
# resp = {'pnr': sys.argv[2]}
# person_file = csv.DictReader(open(sys.argv[1] + '/person.csv'))
# for row in person_file:
#     if row['lopnr_new'] == sys.argv[2]:
#         # print row
#         resp['person'] = row

# resp['biopsy'] = []
biopsy_file = csv.DictReader(open(sys.argv[1] +  '/biopsy.csv'))
for row in biopsy_file:
    if row['lopnr_new'] == sys.argv[2] and row['bioreferral_date']:
        resp.append({'type':'biopsy', 'date': row['bioreferral_date']})
        # print row
        # resp['biopsy'].append(row)

# resp['diagnoses'] =
biopsy_file = csv.DictReader(open(sys.argv[1] +  '/diagnoses.csv'))
for row in biopsy_file:
    if row['lopnr_new'] == sys.argv[2]:
        # print row
        # resp['diagnoses'].append(row)
        if row['surg_date']:
            resp.append({'type':'surgery', 'date': row['surg_date']})


# resp['psa'] = []
biopsy_file = csv.DictReader(open(sys.argv[1] +  '/psa.csv'))
for row in biopsy_file:
    if row['lopnr_new'] == sys.argv[2]:
        # print row
        if row['psadate']:
            val = {'type':'psa', 'date': row['psadate']}
            if row['psa_total']:
                val['psa_total'] = float(row['psa_total'])
            if row['psa_fot']:
                val['psa_fot'] = float(row['psa_fot'])

            resp.append(val)
        # print row
        # resp['psa'].append(row)

# import  pdb; pdb.set_trace()
pattern = '%d%b%Y'
resp.sort(key=lambda r: datetime.datetime.strptime(r['date'], pattern))
# sort here before dumping
_resp = []
for x in resp:
    # _resp.append(['date': int(time.mktime(time.strptime()))])
    _x = x
    _x['date'] = int(time.mktime(time.strptime(x['date'], pattern)))
    _resp.append(_x)
#int(time.mktime(time.strptime(date_time, pattern)))
resp = _resp
print 'output will be in %s.json' %(sys.argv[2])
with open(sys.argv[2] + '.json', 'w') as outfile:
    json.dump(resp, outfile)


