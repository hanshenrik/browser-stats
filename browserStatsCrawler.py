"""
crawls w3schools.com's browser statistics tables and saves the result in a JSON file.
by Hans Henrik Grønsleth 2015-02-25.
license? do whatever you want..
"""

from urllib.request import urlopen
from bs4 import BeautifulSoup
from collections import OrderedDict
import json

# fetch the page
response = urlopen('http://www.w3schools.com/browsers/browsers_stats.asp')
html = response.read()

# use BeautifulSoup to make it easier to access HTML elements
soup = BeautifulSoup(html)

# create an ordered dictionary to store data in
stats = OrderedDict()

tables = soup.find_all('table')
for table in tables:
  ths = table.find_all('th')
  ths = [th.text.strip() for th in ths]
  year = ths[0] # year is stated in the first column
  stats[year] = OrderedDict()
  
  trs = table.find_all('tr')
  for tr in trs:
    tds = tr.find_all('td')
    for i in range(0, len(tds)):
      td = tds[i].text.strip()
      if i == 0: # months are stated in the first column
        month = td
        stats[year][month] = OrderedDict()
      else: # this is a value
        td = td.replace(' %', '') # remove all but the decimal value
        stats[year][month][ths[i]] = td

# dump to a json file
out_file = open("browserStats.json", "w")
json.dump(stats, out_file, indent = 2)
out_file.close()
