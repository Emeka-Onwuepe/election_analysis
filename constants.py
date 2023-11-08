IREV_URL= 'https://inecelectionresults.ng/elections/types'
WARD_BASE_URL = 'https://inecelectionresults.ng/elections'


STATES = [
    'ABIA','ADAMAWA','AKWA IBOM','ANAMBRA',
    'BAUCHI','BAYELSA','BENUE','BORNO',
     'CROSS RIVER','DELTA','EBONYI','EDO',
     'EKITI','ENUGU','FCT','GOMBE','IMO',
    'JIGAWA','KADUNA','KANO','KATSINA',
     'KEBBI','KOGI','KWARA','LAGOS',
    'NASARAWA','NIGER','OGUN','ONDO',
     'OSUN', 'OYO','PLATEAU','RIVERS',
     'SOKOTO','TARABA','YOBE','ZAMFARA'
]

# 640
PIXES = 256
IMG_SIZE = (PIXES, PIXES)

QUERRY = {"Senatorial":'sen',
          "House of Representatives":'reps',
          "House of Assemby":'assembly',
          "Chairmanship":'chairman',
          "Councillor":'councillor',
          "Presidential":'pres',
          "Governorship":'gov'
          }