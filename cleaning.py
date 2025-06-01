import pandas as pd
import numpy as np
import openpyxl
import matplotlib.pyplot as plt
import scipy.stats as stats
import seaborn as sns
import ast
import redivis
import re
# df = pd.read_csv('data/full_data.csv', encoding='latin1')
# df_types = pd.read_csv('data/total_value_types.csv')
# def list_vals(x):
#
#     if isinstance(x.values[1], str):
#         return x.values[1].replace("{","").replace("}","").replace("'", "").split(",")
#     else:
#         return x.values[1]
# def remove_whitespace(x):
#     return [a.strip() for a in x]
#
# col_1 = list(set(remove_whitespace(list_vals(df_types.iloc[0]))))
# col_2 = list(set(remove_whitespace(list_vals(df_types.iloc[1]))))
# col_3 = list(set(remove_whitespace(list_vals(df_types.iloc[2]))))
# #submission_date = list(set(remove_whitespace(list_vals(df_types.iloc[3]))))
# grade_level = list(set(remove_whitespace(list_vals(df_types.iloc[4]))))
# col_6 = {
#     'College Sophomore': 'College Sophomore',
#     'College Junior': 'College Junior',
#     'College Senior': 'College Senior',
#     'High School Sophomore': 10,
#     'High School Junior': 11,
#     'High School Senior': 12,
#     '7th': 7,
#     '8th': 8,
#     '9th': 9,
#     '10th': 10,
#     '11th': 11,
#     '12th': 12,
#     'pre-hs': 'Pre-High School'
# }
# gender = list(set(remove_whitespace(list_vals(df_types.iloc[5]))))
# col_5 = {"Female", "Male", "Non-binary"}
# #normalized_gender = [a if a in accepted_genders else 'Unknown' for a in gender]
# ethnicity = list(set(remove_whitespace(list_vals(df_types.iloc[6]))))
# col_8 = {
#     'BLACK': 'Black',
#     'nan': 'Unknown',
#     'Pacific Islander':'Pacific Islander',
#     'Not Specified':'Unknown',
#     'Asian':'Asian',
#     'LATINO':'Hispanic',
#     'Hispanic':'Hispanic',
#     'Native American':'Native American',
#     'ASIAN':'Asian',
#     'Multi-Racial':'Multi-Racial',
#     'MULTI RACIAL':'Multi-Racial',
#     'White':'White',
#     'WHITE':'White'
# }
# county = list(set(remove_whitespace(list_vals(df_types.iloc[7]))))
#
# def clean_counties(county_list):
#     replacements = {
#         'united states of america': 'Unknown',
#         'Idk':'Unknown',
#         'usa': 'Unknown',
#         'u.s.a.': 'Unknown',
#         'u.s.': 'Unknown',
#         'united sates': 'Unknown',
#         'united state': 'Unknown',
#         'united stars': 'Unknown',
#         'united stayed': 'Unknown',
#         'ameroca': 'Unknown',
#         'unite state': 'Unknown',
#         'north america': 'Unknown',
#         'pre-hs': 'Unknown',
#         'america': 'Unknown',
#         'atlanta': 'Unknown',
#         'atl': 'Unknown',
#         'dekalb': 'DeKalb',
#         'fulton county': 'Fulton',
#         'clayton county': 'Clayton',
#         'gwinnett': 'Gwinnett',
#         'bibb': 'Bibb',
#         'morrow': 'Morrow',
#         'chatham county': 'Chatham',
#         'fayette county': 'Fayette',
#         'henry county': 'Henry',
#         'douglas county': 'Douglas',
#         'cobb county': 'Cobb',
#         'columbus': 'Columbus',
#         'lowndes': 'Lowndes',
#         'hall county': 'Hall',
#         'paulding county': 'Paulding',
#         'richmond hill': 'Richmond Hill',
#         'rockdale': 'Rockdale',
#         'stone mountain': 'Stone Mountain',
#         'henry': 'Henry',
#         'lithonia': 'Unknown',
#         'fulton': 'Fulton',
#         'decatur': 'Decatur',
#         'georgia': 'Unknown',
#         'GA - Georgia':'Unknown',
#         'United Stares':'Unknown',
#         'untied states of america':'Unknown',
#         'DeKalb county':'DeKalb',
#         'GA':'Unknown',
#         'US':'Unknown',
#         'Chatham (GA)':'Chatham',
#         'Ga':'Unknown',
#         'Vietnam':'Unknown',
#         'Clayton Countu':'Clayton',
#         'Usa':'Unknown', 'El Salvador':'Unknown',
#         'Dekalv':'DeKalb',
#         '707 Madison Ln SE Smyrna Georgia':'Cobb',
#         'United  states':'Unknown',
#         'Lithonia ga':'Lithonia',
#         'south fulton':'South Fulton',
#         '3': 'Unknown', 'U.S.': 'Unknown', 'Ha': 'Unknown', 'atlanta public schools': 'Unknown',
#         'united states of ameroca': 'Unknown',
#         'united states': 'Unknown', 'united states of unknown': 'Unknown',
#         'unknown': 'Unknown', 'united': 'Unknown', 'the united states of america': 'Unknown',
#         'aps': 'Unknown', 'Peachtree corners': 'Gwinnett', 'us': 'Unknown', 'g': 'Unknown',
#         'the united states': 'Unknown', 'N/a':'Unknown', 'dekalb county':'DeKalb', 'Fulton school':'Fulton', 'florida':'Unknown',
#         'United State': 'Unknown', 'United States of America': 'Unknown', 'brazil': 'Unknown', 'venezuela': 'Unknown', 'mexico': 'Unknown',
#         'jamaica': 'Unknown', 'ga': 'Unknown', 'california': 'Unknown', 'china': 'Unknown', 'vietnam': 'Unknown',
#         'japan': 'Unknown', 'africa': 'Unknown', 'caribbean': 'Unknown', 'canada': 'Unknown', 'england': 'Unknown',
#         'france': 'Unknown', 'germany': 'Unknown', 'united kingdom': 'Unknown', 'spain': 'Unknown', 'italy': 'Unknown',
#         'portugal': 'Unknown', 'bahamas': 'Unknown', 'el salvador': 'Unknown', 'nicaragua': 'Unknown',
#         'cuba': 'Unknown', 'Chatam County':'Chatam', 'Macon County':'Macon', 'Henry County':'Henry', 'Hall County':'Hall',
#         'colombia': 'Unknown', 'paraguay': 'Unknown', 'peru': 'Unknown', 'dominican republic': 'Unknown',
#         'united stated': 'Unknown', 'united stated of america': 'Unknown', 'tijuana': 'Unknown',
#         'palm beach': 'Unknown',
#         'florida/ga': 'Unknown', 'pike county': 'Pike', 'pike': 'Pike', 'nan': 'Unknown', 'idk': 'Unknown',
#         'n/a': 'Unknown', 'ok': 'Unknown', 'yes': 'Unknown', 'house': 'Unknown', 'dealbreaker': 'Unknown',
#         '4': 'Unknown',
#         '5': 'Unknown', '11828': 'Suffolk', 'gwinett': 'Gwinnett', 'gwinnet': 'Gwinnett', 'gwinnettt': 'Gwinnett',
#         'Unite State': 'Unknown', 'BIBB':'Bibb', 'lee':'Lee',
#         'thimas': 'Thimas', 'Clayton county': 'Clayton', 'conley': 'Conley', 'Newton': 'Newton', 'cameroon': 'Cameron',
#         'Henry county': 'Henry', 'Palm beach': 'Palm Beach', 'Untied states': 'Unknown', 'clayton': 'Clayton',
#         'College park': 'Fulton',
#         'united state of america': 'Unknown', 'The Bahamas': 'Unknown', 'Riverdale GA': 'Clayton', 'geogria': 'Unknown',
#         'Atlanta public schools': 'Unknown',
#         'United states': 'Unknown',
#         'United Stars': 'Unknown',
#         'USA': 'Unknown',
#         'The United States of America': 'Unknown',
#         'Untied States Of America': 'Unknown',
#         'United States Of Ameroca': 'Unknown',
#         'U.S.A': 'Unknown',
#         'United State Of America': 'Unknown',
#         'United States Of America': 'Unknown',
#         'North America': 'Unknown',
#         'The United States': 'Unknown',
#         'North america': 'Unknown',
#         'United states of america': 'Unknown',
#         'United state': 'Unknown',
#         'America': 'Unknown',
#         'United states of America': 'Unknown',
#         'United States': 'Unknown',
#         'Mexico': 'Unknown',
#         'Brazil': 'Unknown',
#         'Venezuela': 'Unknown',
#         'Jamaica': 'Unknown',
#         'Cuba': 'Unknown',
#         'Georgia': 'Unknown',
#         'Florida/Georgia': 'Unknown',
#         'House': 'Unknown',
#         'A': 'Unknown',
#         'BEXAR': 'Unknown',
#         'G': 'Unknown',
#         'Dealbreaker': 'Unknown',
#         'Yes': 'Unknown',
#         'I’m not sure': 'Unknown',
#         'Pine Beach': 'Unknown',
#         'Cameroon': 'Unknown',
#         'United stated': 'Unknown',
#         'United’s states': 'Unknown',
#         'United sates': 'Unknown',
#         'riverdale': 'Clayton',
#         'Fulton county': 'Fulton',
#         'South fulton': 'Fulton',
#         'American': 'Unknown',
#         'College Park': 'Fulton',
#         'Fulton School': 'Fulton',
#         'Macon': 'Unknown',
#         'Decatur': 'Unknown',
#         'Peachtree Corners': 'Unknown',
#         'ATL': 'DeKalb',
#         'Aps':'Clayton',
#         'Duluth GA':'Duluth', 'Norcross ga':'Gwinnett', 'Atlanta':'Unknown',
#         'United States of america':'Unknown','California':'Unknown', 'DEKALB':'Dekalb',
#         'SouthFulton':'Fulton', 'Fulton County':'Fulton', 'Gwinnett County':'Gwinnett', 'Gwinnett':'Gwinnett',
#         'Clayton County':'Clayton', 'newton':'Newton','Chatham county':'Chatham', 'Untied States of America':'Unknown',
#         'Atl':'DeKalb', 'Atlanta ga':'Unknown', 'Atlanta Georgia':'Unknown', 'cherokee':'Cherokee', 'Marietta city':'Cobb',
#         'Forest park':'Clayton','Union city':'Fulton', 'Marietta':'Cobb', 'Guatemala':'Unknown',
#         'Atlanta GA':'Unknown', 'United State of America':'Unknown', 'AMERICA':'Unknown', 'U.A.S':'Dekalb','jonesboro':'Clayton',
#         'Cherokee county':'Cherokee','GEORGIA':'Unknown', 'Dékalb County':'DeKalb','Dekalb County':'DeKalb','Dekalb county':'DeKalb',
#         'Forsytj':'Forsyth', 'Dad':'Unknown', 'U.S':'Unknown', 'United Sates':'Unknown','Dekalb c':'DeKalb', 'Us':'Unknown',
#         "Dekalb": "DeKalb", "Dakalb": "DeKalb", "Deakalb": "DeKalb", 'Nun':'Unknown',
#         "Gwinnet": "Gwinnett", "Gwinett": "Gwinnett", "Gwienntt": "Gwinnett",
#         "Futon": "Fulton", "Clayton Country": "Clayton", "Coob": "Cobb",
#         "Thimas": "Thomas", "Bullocj": "Bulloch", "Dectur": "Decatur", "Chatam": "Chatham"
#
#     }
#
#     cleaned_list = []
#     for county in county_list:
#         county_clean = replacements.get(county, county)
#         cleaned_list.append(county_clean)
#
#
#     replacements = {
#     'Ringgold': 'Catoosa',
#     'Colombia': 'Columbia',
#     'Ccps': 'Clayton',
#     'Dad': 'Unknown',
#     'United States': 'Unknown',
#     'GEORGIA': 'Unknown',
#     'U.S.A': 'Unknown',
#     'United States Of America': 'Unknown',
#     'U.s': 'Unknown',
#     'U.A.S': 'Unknown',
#     'Palm Beach': 'Palm Beach',
#     'Futon County': 'Fulton',
#     'Futon': 'Fulton',
#     'Gwittenet': 'Gwinnett',
#     'Peach County': 'Peach',
#     'Lowndes': 'Lowndes',
#     'Coweta': 'Coweta',
#     'Thimas': 'Thomas',
#     'SE atlanta': 'Unknown',
#     'Gwinnett County': 'Gwinnett',
#     'BEXAR': 'Bexar',
#     'Houston': 'Houston',
#     'Muscogee County': 'Muscogee',
#     'Dougherty': 'Dougherty',
#     'Dekalb Country': 'DeKalb',
#     'Dekalb c': 'DeKalb',
#     'Fulton clCounty': 'Fulton',
#     'Marietta City': 'Marietta',
#     'Forest park': 'Clayton',
#     'Clayton country': 'Clayton',
#     'Peach': 'Peach',
#     'Cobb county': 'Cobb',
#     'Macon': 'Bibb',
#     'Bibb': 'Bibb',
#     'Clayton. County': 'Clayton',
#     'Canton': 'Cherokee',
#     'Dekalb': 'DeKalb',
#     'Dekalb County': 'DeKalb',
#     'Fulton county': 'Fulton',
#     'Gwinnet': 'Gwinnett',
#     'Gwinnett county': 'Gwinnett',
#     'Futun County': 'Fulton',
#     'Douglas County': 'Douglas',
#     'Richond Hill': 'Richmond Hill',
#     'Chatham County': 'Chatham',
#     'SouthFulton': 'South Fulton',
#         'U.S.A.': 'Unknown',
#         'Untied state': 'Unknown',
#         'United stayed': 'Unknown',
#         'United States of America': 'Unknown',
#         'United States of america': 'Unknown',
#         'Untied States of America': 'Unknown',
#         '9 Somerset Hill': 'Unknown',
#         'Geogria': 'Unknown',
#         'Catoosa': 'Catoosa',
#         'Cobb': 'Cobb',
#         'DeKalb': 'DeKalb'
# }
#     cleaned_list2 = []
#     for county in cleaned_list:
#         county_clean = replacements.get(county, county)
#         cleaned_list2.append(county_clean)
#
#     return cleaned_list2
#
# def clean_cities(s):
#     s = s.strip().lower()  # Remove leading/trailing spaces and convert to lowercase
#
#     # Handle specific city name corrections
#     if 'atalanta' in s or 'atlanta georgia' in s or 'atlant' == s or 'atl' == s:
#         return 'Atlanta'
#     if 'merietta' in s or 'marietta' in s or '3640 glen mora dr' in s:
#         return 'Marietta'
#     if 'union city' in s:
#         return 'Union City'
#     if 'fairburn' in s and 'ga' in s:
#         return 'Fairburn'
#     if 'forrest' in s:
#         return 'Forest Park'
#     if 'jonesboro' in s:
#         return 'Jonesboro'
#     if 'dekalb' in s or 'dectur' in s or 'deactur' in s:
#         return 'DeKalb'
#     if 'stone mountain' in s or 'stone m' in s:
#         return 'Stone Mountain'
#     if 'fayetteville' in s:
#         return 'Fayetteville'
#     if 'peachtree corners' in s:
#         return 'Peachtree Corners'
#     if 'canton' in s:
#         return 'Canton'
#     if 'statesboro' in s:
#         return 'Statesboro'
#     if 'lithonia' in s or 'lithona' in s or 'lithoina' in s:
#         return 'Lithonia'
#     if 'kennesaw' in s:
#         return 'Kennesaw'
#     if 'mabelton' in s:
#         return 'Mableton'
#     if 'gwinnett' in s:
#         return 'Gwinnett'
#     if 'red' in s:
#         return 'Redwood City'
#     if 'dunwoody' in s:
#         return 'Dunwoody'
#     if 'pooler' in s:
#         return 'Pooler'
#     if 'savannah' in s or 'nassau new providence' in s:
#         return s.title()
#     if 'union' in s or 'unión' in s:
#         return 'Union City'
#     if s in ['colney', 'idk', 'sw','.','whoisdisren5@gmail.com','na', 'ga', 'georgia', '30331', 'n', '------', 'unknown', 'red', 'castle hills', 'statam']:
#         return 'Unknown'
#     if s == '30297':
#         return 'St Marys'
#     if 'decatur' in s:
#         return 'Decatur'
#     if 'warner' in s:
#         return 'Warner Robins'
#     if 'conley' in s or 'conyers' in s:
#         return 'Conley'
#     if 'ellenwoox' in s or 'ellendwood' in s or 'ellenwod' in s or 'elllenwood' in s or 'ellen' in s:
#         return 'Ellenwood'
#     if 'mcdonough' in s:
#         return 'McDonough'
#     if 'marrrietta' in s:
#         return 'Marietta'
#     if 'marrietta' in s:
#         return 'Marietta'
#     if 'statesbore' in s:
#         return 'Statesboro'
#     if 'fayettville' in s:
#         return 'Fayetteville'
#     if 'gainsville' in s:
#         return 'Gainesville'
#     if 'lithionia' in s:
#         return 'Lithonia'
#     if 'dauglasville' in s:
#         return 'Douglasville'
#     if 'dekatur' in s or 'decauter' in s:
#         return 'Decatur'
#     if 'fayettteville' in s:
#         return 'Fayetteville'
#     if 'marrrietta' in s:
#         return 'Marietta'
#     if 'convington' in s:
#         return 'Covington'
#     if 'bruncwick' in s:
#         return 'Brunswick'
#     if 'atlants' in s:
#         return 'Atlanta'
#     if 'peachtree' in s:
#         return 'Peachtree Corners'
#     if 'statesbore' in s:
#         return 'Statesboro'
#     if 'stone crest' in s or 'stonecrest' in s:
#         return 'Stonecrest'
#     if 'stonemountain' in s:
#         return 'Stone Mountain'
#     if 'mableton' in s:
#         return 'Mableton'
#     if 'scottdale' in s:
#         return 'Scottsdale'
#     if 'mariettta' in s:
#         return 'Marietta'
#     if 'peachtree cornners' in s:
#         return 'Peachtree Corners'
#     if 'conley' in s:
#         return 'Conley'
#     if 'decatue' in s:
#         return 'Decatur'
#     if 'lithia springs' in s:
#         return 'Lithia Springs'
#     if 'dunwoody' in s:
#         return 'Dunwoody'
#     if 'hampstead' in s:
#         return 'Hampton'
#     if 'kenessaw' in s:
#         return 'Kennesaw'
#     if 'atlanta' in s:
#         return 'Atlanta'
#     if 'boca raton' in s:
#         return 'Boca Raton'
#     if 'mcdonough' in s:
#         return 'McDonough'
#     if 'norcross' in s or 'norcorss' in s:
#         return 'Norcross'
#     if 'canton' in s:
#         return 'Canton'
#     if 'conyers' in s:
#         return 'Conyers'
#     if 'richmond hill' in s:
#         return 'Richmond Hill'
#     if 'powder springs' in s:
#         return 'Powder Springs'
#     if 'atlanta' in s:
#         return 'Atlanta'
#     if 'college' in s:
#         return 'College Park'
#     if 'mable' in s:
#         return 'Mableton'
#     if 'savannah' in s:
#         return 'Savannah'
#     if s in ['brunswick', 'chattahoochee hills', 'macon', 'albany']:
#         return s.title()
#
#     # Handle exceptions for proper case formatting
#     exceptions = ["of", "and", "in", "the", "a", "an", "for", "to", "on"]
#     words = s.split()
#     proper_case_words = [word.capitalize() if word.lower() not in exceptions else word.lower() for word in words]
#     return " ".join(proper_case_words)
#
# def clean_school_names(school_names):
#     cleaned_names = []
#
#     # Process each school name in the input list
#     for name in school_names:
#
#         if (name is np.nan or name == '' or 'n/a' in name.lower()
#                 or 'B.E.S.T' in name or 'bolly' in name or 'thibodeaux' in name
#                 or 'daitorian' in name or 'ia school' in name or '300092' in name
#                 or '202401842' in name):
#             name = 'Unknown'
#         else:
#             name = name.lower()
#             name = name.replace("hs", "high school")
#             name = name.replace("hogh", "high")
#             name = name.replace("hool", "school")
#             name = name.replace("schiol", "school")
#             name = name.replace("hight", "high")
#             name = name.replace("gind", "school")
#             name = name.replace("academy", "school")
#             name = name.replace("tech", "technical")
#             name = name.replace("highigh", "high")
#             name = name.replace("scschool", "school")
#             name = name.replace("scholl", "school")
#             name = name.replace("schoolcschool", "school")
#
#             name = name.replace("atlanta", "atlanta technical")
#             name = name.replace("langston hughes highigh", "langston hughes high school")
#             name = name.replace("coretta scott king ywla", "coretta scott king young women's leadership academy")
#             name = name.replace("lownde high cchoolcchool", "Lownde High School")
#             name = name.replace("miller grove", "miller grove high school")
#             if 'atlanta technical' in name:
#                 name = 'atlanta technical school'
#             if 'south gwinett' in name:
#                 name = 'south gwinett high school'
#             if 'king' in name:
#                 name = 'martin luther king jr high school'
#             if 'martin' in name or 'matrin' in name or 'mlk' in name or 'ml' in name\
#                     or 'martain' in name or 'marten' in name:
#                 name = 'martin luther king jr high school'
#             if 'maynard' in name:
#                 name = 'maynard holbrook jackson high school'
#             if 'morrow' in name:
#                 name = 'morrow high school'
#             if 'cedar' in name:
#                 name = 'cedar grove high school'
#             if 'bannker' in name:
#                 name = 'banneker high school'
#             if 'fredrick' in name:
#                 name = 'frederick douglass school'
#             if 'coulmbia' in name or 'columbi' in name:
#                 name = 'columbia high school'
#             if 'creek' in name:
#                 name = 'creekside high school'
#             if 'school' not in name:
#                 name = name.strip() + " school"
#             if 'cedar' in name.lower():
#                 name = 'Cedar Grove High School'
#
#             elif 'therrel' in name.lower():
#                 name = 'DM Therrell High School'
#
#             elif 'mays' in name.lower():
#                 name = 'Benjamin E. Mays High School'
#
#             elif 'marrietta' in name.lower():
#                 name = 'Marietta High School'
#             elif 'ksu' in name.lower() or 'kennesaw' in name.lower():
#                 name = 'Kennesaw State University School'
#             elif 'maynard' in name.lower() or 'holbrook' in name.lower():
#                 name = 'Maynard Holbrook Jackson High School'
#
#             elif 'langston hughes' in name.lower():
#                 name = 'Langston Hughes High School'
#
#             elif 'columbia' in name.lower():
#                 name = 'Columbus High School'
#             elif 'best school' in name.lower():
#                 name = 'Best Academy'
#             elif 'milk' in name.lower():
#                 name = 'Milton High School'
#             corrections = {
#                 'south gwinett': 'south gwinnett high school',
#                 'miller grove high school high acholl': 'miller grove high school',
#                 'koa edwrads school': 'koa edwards school',
#                 'basis shavano school': 'basis shavano',
#                 'marietta high schoolchoop': 'marietta high school',
#                 'mundy\x92s mills school': 'mundy\'s mills school',
#                 'de\x92monta tukes school': 'de\'monta tukes school',
#                 'miller grove high school high scho': 'miller grove high school',
#                 'cedar grove ugh school': 'cedar grove high school',
#                 'miller grove high schoolr high school': 'miller grove high school',
#                 'miller grove high school high schools': 'miller grove high school',
#                 'creekside high-school': 'creekside high school',
#                 'mundys mill high school': 'mundy\'s mill high school',
#                 'coretta scott kind ywla school': 'coretta scott king ywla school',
#                 'maynard holbrook jackson holbrook high school': 'maynard jackson high school',
#                 'mceachern school': 'mcEachern school',
#                 'the best academt school': 'the best academy school',
#                 'maynard jackson holbrook high school': 'maynard jackson high school'
#             }
#
#             for key, value in corrections.items():
#                 if key.lower() in name.lower():
#                     name = value
#
#         name = name.title().strip()
#         name = name.replace(".", "")
#         name = name.replace('\x92', "'")
#         if 'mcdonough' in name.lower():
#             name = 'McDonough High School'
#         if 'therrell' in name.lower():
#             name = 'DM Therrell High School'
#         if 'mill' in name.lower():
#             name = 'Mundy Mill High School'
#         if 'norcross' in name.lower():
#             name = 'Norcross High School'
#         elif 'jonesboro' in name.lower() and 'school' in name.lower():
#             name = 'Jonesboro High School'
#         elif 'galloway' in name.lower() and 'schooly' in name.lower():
#             name = 'The Galloway School'
#         elif 'mhigh' in name.lower():
#             name = 'MHigh School'
#         elif 'cedar' in name.lower() and 'grove' in name.lower():
#             name = 'Cedar Grove High School'
#         elif 'norcor' in name.lower():
#             name = 'Norcross High School'
#         elif 'stockbridge' in name.lower() and 'school' in name.lower() and 'advanced' in name.lower():
#             name = 'Stockbridge High School'
#         elif 'booker t was' in name.lower():
#             name = 'Booker T Washington School'
#         elif 'mount zuon' in name.lower():
#             name = 'Mount Zion School'
#         elif 'shigh' in name.lower():
#             name = 'Shiloh High School'
#         elif 'dm therrell' in name.lower():
#             name = 'D.M. Therrell High School'
#         elif 'st john\'s' in name.lower():
#             name = 'St. John\'s College School'
#         elif 'mid town' in name.lower():
#             name = 'Midtown High School'
#         elif 'mount' in name.lower() and 'zion' in name.lower() and 'school' in name.lower():
#             name = 'Mount Zion School'
#         if 'norcross' in name.lower():
#             name = 'Norcross High School'
#         elif 'jonesboro' in name.lower() and 'school' in name.lower():
#             name = 'Jonesboro High School'
#         elif 'galloway' in name.lower() and 'schooly' in name.lower():
#             name = 'The Galloway School'
#         elif 'mhigh' in name.lower():
#             name = 'MHigh School'
#         elif 'cedar' in name.lower() and 'grove' in name.lower():
#             name = 'Cedar Grove High School'
#         elif 'norcor' in name.lower():
#             name = 'Norcross High School'
#         elif 'stockbridge' in name.lower() and 'school' in name.lower() and 'advanced' in name.lower():
#             name = 'Stockbridge High School'
#         elif 'booker t was' in name.lower():
#             name = 'Booker T Washington School'
#         elif 'mount zuon' in name.lower():
#             name = 'Mount Zion School'
#         elif 'shigh' in name.lower():
#             name = 'Shiloh High School'
#         elif 'dm therrell' in name.lower():
#             name = 'D.M. Therrell High School'
#         elif 'st john\'s' in name.lower():
#             name = 'St. John\'s College School'
#         elif 'mid town' in name.lower():
#             name = 'Midtown High School'
#         elif 'mount' in name.lower() and 'zion' in name.lower() and 'school' in name.lower():
#             name = 'Mount Zion School'
#         elif 'atl technicalnical' in name.lower():
#             name = 'Atlanta Technical School'
#         elif 'northclayton' in name.lower():
#             name = 'North Clayton High School'
#         elif 'langston huges' in name.lower():
#             name = 'Langston Hughes High School'
#         elif 'lakeside high' in name.lower():
#             name = 'Lakeside High School'
#         elif 'booker t washington school' in name.lower():
#             name = 'Booker T Washington High School'
#         elif 'morrow high school' in name.lower():
#             name = 'Morrow High School'
#         elif 'gordon state' in name.lower():
#             name = 'Gordon State College'
#         elif 'lovett' in name.lower():
#             name = 'Lovett School'
#         elif 'jasper county' in name.lower():
#             name = 'Jasper County High School'
#         elif 'union grove' in name.lower() and 'high' in name.lower():
#             name = 'Union Grove High School'
#         elif 'mceachern' in name.lower():
#             name = 'McEachern High School'
#         elif 'miler grove' in name.lower():
#             name = 'Miller Grove High School'
#         elif 'cmecachern' in name.lower():
#             name = 'McEachern High School'
#         elif 'langston hughes' in name.lower():
#             name = 'Langston Hughes High School'
#         elif 'springdale' in name.lower():
#             name = 'Springdale High School'
#         cleaned_names.append(name)
#     replacements = {
#         'Lsa School': 'LSA School',
#         'Nahigh School': 'N/A High School',
#         'Culmiba High School': 'Columbia High School',
#         'Jeremiah Brown School': 'Jeremiah Brown School',
#         'Riverdale High-School': 'Riverdale High School',
#         'Riverdale High Schoolchiol': 'Riverdale High School',
#         'Banneker School': 'Banneker High School',
#         'Banneker High Schools': 'Banneker High School',
#         'Gsu School': 'GSU School',
#         'Georgia Institute Of Technicalnology School': 'Georgia Institute of Technology School',
#         'Mt Zion High Schools': 'Mount Zion High School',
#         'Albany Technicalnical College School': 'Albany Technical College School',
#         'Riverale High School': 'Riverdale High School',
#         'Ce Da R Grove High School': 'Cedars Grove High School',
#         'Jean Ribault High School': 'Jean Ribault High School',
#         'Q P School': 'Q.P. School',
#         'South Gwinnett School': 'South Gwinnett High School',
#         'Tri-Cities High School': 'Tri-Cities High School',
#         'MHigh School': 'M High School',
#         'Columbus Technicalnical College School': 'Columbus Technical College School',
#         'Basis Shavano': 'Unknown',
#         '30288 School': 'Unknown',
#         'Global Impact School': 'Global Impact Learning School',
#         'Jaylen Thibodeaux/Jt Or Jay School': 'Jaylen Thibodeaux School',
#         'Gwinnett Technicalnical College School': 'Gwinnett Technical College School',
#         'Peach County High School': 'Peach County High School'
#     }
#     your_set = cleaned_names
#     cleaned_set = [replacements.get(item, item) for item in your_set]
#     schools = [school.replace("High Schooo", "High School").replace("Lakside", "Lakeside") for
#                school in cleaned_set]
#
#     schools = [school.replace("Centeral", "Central")
#                .replace("Colombia", "Columbus")
#                .replace("Mt Zion", "Mount Zion")
#                .replace("M High", "Marietta High") for school in schools]
#
#     schools = [school.replace(" School", "").replace(" High School", "") for school in schools]
#     schools = [school.replace(" ", "Unknown") for school in schools]
#     schools = [school.replace("Schnoo", "School")
#                .replace("DM There'Ll High", "D.M. Therrell High")
#                .replace("De'Monta Tukes", "DeMontay Tukes") for school in schools]
#
#     invalid_entries = ['Idk', 'Bolly Njie','Unknown', 'Graduated', 'N/A', 'Q.P.', 'Homeschool', 'DeMontay Tukes']
#     schools = ['Unknown' if school in invalid_entries else school for school in schools]
#
#     schools = [school.replace(" School", "").replace(" High", "").replace(" High-School", "") for school in schools]
#
#     schools = [school.replace("Valdosts State University", "Valdosta State University")
#                .replace("Georgia Piedmont Technicalnical College", "Georgia Piedmont Technical College")
#                .replace("Albany Staye University", "Albany State University")
#                .replace("Miller Grove", "Miller Grove High School")
#                .replace("Forsyth Central-School", "Forsyth Central High School")
#                .replace("The Best Academy", "Best Academy")
#                .replace("Peach County", "Pike County") for school in schools]
#     schools = [school.replace("Sothern New Hampshire University", "Southern New Hampshire University")
#                .replace("Georgia Technical", "Georgia Tech")
#                .replace("Culinary Insitute Of America", "Culinary Institute of America")
#                .replace("The University Of West Georgia", "University Of West Georgia")  # Remove duplicate
#                .replace("The Galloway", "Galloway School") for school in schools]
#
#
#     return schools
# #----
#
#
#
#
#
#
# #counties
# df = df.T
# #submission id
# col_1_clean = df.iloc[0]
# #exit ticket id
# col_2_clean = df.iloc[1]
# #exit name
# col_3_clean = df.iloc[2]
# #submission date
# col_4_clean = pd.to_datetime(df.iloc[3])
# #col 5 is empty (user id)
# col_5_clean =  df.iloc[4]
# col_6_clean = [col_6.get(val, val) for val in df.iloc[5]]
#
# #gender
# col_7_clean = ['Unknown' if a is np.nan else a for a in df.iloc[6]]
# #ethnicity
# col_8_clean = [col_8.get(a, a) for a in df.iloc[7]]
# #counties
# col_9 = clean_counties(df.iloc[8])
# col_9_clean = ['Unknown' if a is np.nan else a for a in col_9]
# #cities
# col_10 = ['Unknown' if a is np.nan else a for a in df.iloc[9]]
# col_10_clean = [clean_cities(a) for a in col_10]
# #states
# col_11_clean = ['Unknown' if a is np.nan else a for a in df.iloc[10]]
# #zip code
# col_12_clean = df.iloc[11]
# #school
# col_13_clean = clean_school_names(df.iloc[12])
# #df.iloc[13:34] = df.iloc[13:34].applymap(lambda x: 'Unknown' if pd.isna(x) else x)
#
# cleaned_data = {
#     'col_1': col_1_clean,
#     'col_2': col_2_clean,
#     'col_3': col_3_clean,
#     'col_4': col_4_clean,
#     'col_5': col_5_clean,
#     'col_6': col_6_clean,
#     'col_7': col_7_clean,
#     'col_8': col_8_clean,
#     'col_9': col_9_clean,
#     'col_10': col_10_clean,
#     'col_11': col_11_clean,
#     'col_12': col_12_clean,
#     'col_13': col_13_clean
# }
#
# df_cleaned = pd.DataFrame(cleaned_data)
# print(df_cleaned.shape)
# tmp = df.iloc[13:35].T
# print(tmp.shape)
# df_cleaned_final = pd.concat([df_cleaned, tmp], axis=1)
# df_cleaned_final.columns =  df.T.columns
#
# df_cleaned_final.to_csv('cleaned_data.csv')
georgia_counties = {
    'Appling', 'Atkinson', 'Bacon', 'Baker', 'Baldwin', 'Banks', 'Barrow', 'Bartow', 'Ben Hill', 'Berrien',
    'Bibb', 'Bleckley', 'Brantley', 'Brooks', 'Bryan', 'Bulloch', 'Burke', 'Butts', 'Calhoun', 'Camden',
    'Candler', 'Carroll', 'Catoosa', 'Charlton', 'Chatham', 'Chattahoochee', 'Chattooga', 'Cherokee', 'Clarke',
    'Clay', 'Clayton', 'Clinch', 'Cobb', 'Coffee', 'Colquitt', 'Columbia', 'Cook', 'Coweta', 'Crawford',
    'Crisp', 'Dade', 'Dawson', 'Decatur', 'DeKalb', 'Dodge', 'Dooly', 'Dougherty', 'Douglas', 'Early',
    'Echols', 'Effingham', 'Elbert', 'Emanuel', 'Evans', 'Fannin', 'Fayette', 'Floyd', 'Forsyth', 'Franklin',
    'Fulton', 'Gilmer', 'Glascock', 'Glynn', 'Gordon', 'Grady', 'Greene', 'Gwinnett', 'Habersham', 'Hall',
    'Hancock', 'Haralson', 'Harris', 'Hart', 'Heard', 'Henry', 'Houston', 'Irwin', 'Jackson', 'Jasper',
    'Jeff Davis', 'Jefferson', 'Jenkins', 'Johnson', 'Jones', 'Lamar', 'Lanier', 'Laurens', 'Lee', 'Liberty',
    'Lincoln', 'Long', 'Lowndes', 'Lumpkin', 'McDuffie', 'McIntosh', 'Macon', 'Madison', 'Marion', 'Meriwether',
    'Miller', 'Mitchell', 'Monroe', 'Montgomery', 'Morgan', 'Murray', 'Muscogee', 'Newton', 'Oconee', 'Oglethorpe',
    'Paulding', 'Peach', 'Pickens', 'Pierce', 'Pike', 'Polk', 'Pulaski', 'Putnam', 'Quitman', 'Rabun',
    'Randolph', 'Richmond', 'Rockdale', 'Schley', 'Screven', 'Seminole', 'Spalding', 'Stephens', 'Stewart',
    'Sumter',
    'Talbot', 'Taliaferro', 'Tattnall', 'Taylor', 'Telfair', 'Terrell', 'Thomas', 'Tift', 'Toombs', 'Towns',
    'Treutlen', 'Troup', 'Turner', 'Twiggs', 'Union', 'Upson', 'Walker', 'Walton', 'Ware', 'Warren',
    'Washington', 'Wayne', 'Webster', 'Wheeler', 'White', 'Whitfield', 'Wilcox', 'Wilkes', 'Wilkinson', 'Worth'
}


def is_valid_zip(zip_code):
    if zip_code is np.nan:
        return False
    zip_pattern = re.compile(r"^\d{5}(-\d{4})?$")
    return bool(zip_pattern.match(zip_code))

# def normalize_location(loc):
#     loc = loc.strip().lower()
#     loc = re.sub(r'[^a-z\s]', '', loc)
#     if 'dekalb' in loc:
#         return 'DeKalb'
#     elif 'fulton' in loc:
#         return 'Fulton'
#     elif 'cobb' in loc:
#         return 'Cobb'
#     elif 'gwinnett' in loc or 'gwittenet' in loc:
#         return 'Gwinnett'
#     elif 'clayton' in loc:
#         return 'Clayton'
#     elif 'henry' in loc:
#         return 'Henry'
#     elif 'chatham' in loc:
#         return 'Chatham'
#     elif 'douglas' in loc:
#         return 'Douglas'
#     elif 'paulding' in loc:
#         return 'Paulding'
#     elif 'forsyth' in loc:
#         return 'Forsyth'
#     elif 'fayette' in loc:
#         return 'Fayette'
#     elif 'hall' in loc:
#         return 'Hall'
#     elif 'rockdale' in loc:
#         return 'Rockdale'
#     elif 'bulloch' in loc:
#         return 'Bulloch'
#     elif 'peach' in loc:
#         return 'Peach'
#     elif 'lowndes' in loc:
#         return 'Lowndes'
#     elif 'houston' in loc:
#         return 'Houston'
#     elif 'coweta' in loc:
#         return 'Coweta'
#     elif 'newton' in loc:
#         return 'Newton'
#     elif 'clarke' in loc:
#         return 'Clarke'
#     elif 'carroll' in loc:
#         return 'Carroll'
#     elif 'muscogee' in loc:
#         return 'Muscogee'
#     elif 'richmond' in loc:
#         return 'Richmond'
#     elif 'columbia' in loc:
#         return 'Columbia'
#     else:
#         for county in georgia_counties:
#             if county.lower() in loc:
#                 return county
#         return 'Unknown'

# zipcodes =[7107, 11550, 20014, 20034, 20035, 20088, 20236, 30000, 30002, 30004, 30005, 30008, 30009, 30011, 30012, 30013, 30014, 30016, 30017, 30019, 30021, 30022, 30024, 30027, 30030, 30031, 30032, 30033, 30034, 30035, 30036, 30037, 30038, 30039, 30040, 30041, 30043, 30044, 30045, 30046, 30047, 30052, 30053, 30058, 30060, 30062, 30063, 30064, 30066, 30067, 30068, 30071, 30075, 30076, 30078, 30079, 30080, 30081, 30082, 30083, 30084, 30087, 30088, 30092, 30093, 30094, 30096, 30097, 30101, 30102, 30106, 30114, 30115, 30118, 30122, 30123, 30126, 30127, 30132, 30134, 30135, 30138, 30141, 30144, 30152, 30154, 30168, 30180, 30189, 30204, 30212, 30213, 30214, 30215, 30228, 30236, 30238, 30239, 30247, 30248, 30249, 30252, 30253, 30256, 30260, 30263, 30265, 30268, 30269, 30272, 30273, 30274, 30281, 30283, 30288, 30290, 30291, 30294, 30295, 30296, 30297, 30299, 30303, 30305, 30306, 30307, 30310, 30311, 30312, 30313, 30314, 30315, 30316, 30317, 30318, 30319, 30321, 30324, 30325, 30327, 30328, 30329, 30331, 30333, 30337, 30338, 30339, 30340, 30341, 30344, 30345, 30347, 30348, 30349, 30350, 30354, 30360, 30363, 30368, 30372, 30375, 30391, 30392, 30394, 30396, 30398, 30429, 30458, 30501, 30518, 30519, 30548, 30600, 30609, 30653, 30656, 30690, 30724, 30736, 30926, 30964, 30987, 31030, 31063, 31069, 31088, 31204, 31210, 31250, 31313, 31322, 31324, 31401, 31405, 31408, 31415, 31419, 31601, 31698, 31705, 31721, 31763, 31792, 31903, 31907, 32208, 32218, 32658, 32907, 33428, 36606, 39349, 39835, 40087, 40349, 60060, 78213, 30032, 30038, 30038, 30068, 30034, 30058, 30032, 30067, 30092, 30349, 30236, 30260, 30331]

if __name__ == "__main__":
    # user = redivis.user("stanfordphs")
    # dataset = user.dataset("us_zip_codes_to_longitude_and_latitude:d5sz:v1_1")
    # table = dataset.table("us_zip_codes_to_longitude_and_latitude:j864")
    #
    # df = table.to_pandas_dataframe()
    # df = df[df['Zip'].isin(zipcodes)]
    # df.to_csv('data/georgia_longitude_and_latitude.csv')
    # print(df.head())
    df = pd.read_csv('data/semantics.csv')

    print(df.head())