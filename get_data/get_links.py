
from selenium import webdriver
from bs4 import BeautifulSoup

from urllib.parse import urlparse
from urllib.parse import urlparse
import time
import re
from constants import QUERRY

from handle_files.json_files import read_json, write_json

def get_page(url):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.headless = True
    driver = webdriver.Chrome(options=chrome_options)
    # driver = webdriver.Firefox()
    driver.get(url)
    driver.refresh()
    time.sleep(3)
    driver.refresh()
    time.sleep(5)
    htmlSource = driver.page_source
    page = re.sub('<!--*>','',htmlSource)
    soup = BeautifulSoup(page, 'html.parser')
    driver.close()
    return soup


def get_links(url , type = "presidential",home=True,date=None,querry=None):

    type = type.lower()
    links = []
    absolute_url = urlparse(url)
    base_url = f'{absolute_url.scheme}://{absolute_url.hostname}'

    if querry:
        soup = get_page(url)
        for link in soup.findAll('a'):
            if not link.get('href'):
                continue

            if querry in link['href']:
                tuple_data = (link.get_text(),f"{base_url}{link['href']}")
                links.append(tuple_data)
        return links
    if type in ['councillor','chairmanship']:
      querry = type
    elif home:
        querry = f'{type} election'.lower()
    else:
        querry = f'{type} election - {date} - {type}'.lower()
    print(querry)
    soup = get_page(url)
    for link in soup.findAll('a'):
        if link.get_text().lower() == querry:
            tuple_data = (link.get_text(),f"{base_url}{link['href']}")
            links.append(tuple_data)
    return links



def scrap_elections(url,type="Senatorial",get_lgs=True,get_wards=False):
    
    querry = f'type={QUERRY[type]}'
    file_base_name = f'{type.replace(" ","_")}.json'
    data = read_json(file_base_name)


    [url] = get_links(url,type)
    urls = get_links(url[1],type,False,querry=querry)
    data['elections'] = urls

    if not get_lgs:
        write_json(data,file_base_name)
        return urls

    if not data.get('constituencies'):
      data['constituencies'] = []
    for name,link in urls:
      *_,constituency = name.split('- ')
      if constituency not in data['constituencies']:
        data['constituencies'].append(constituency)
        write_json(data,file_base_name)

    if not data.get('seen'):
      data['seen'] = []

    count = 0
    for name,link in urls:
      *_,constituency = name.split('- ')

      count += 1
      end = ' '
      if count%20 == 0 :
        end = "\n"
      print(count, end=end)

      if constituency in data['seen'] and len(data[constituency]):
        continue

      path = urlparse(link)
      urls = get_links(link,type,False,querry=path.path)
      data[constituency] = urls
      data['seen'].append(constituency)
      write_json(data,file_base_name)

    if get_wards:
      if not data.get('wards'):
        data['wards'] = {}

      count = 0

      for constituency in data['constituencies']:

        count += 1
        end = ' '
        if count%20 == 0:
            end = "\n"
        print(count, end=end)

        if not data['wards'].get(constituency):
          data['wards'][constituency] = {}
        lgs = data[constituency]
        for lg_name, link in lgs:


          if data['wards'][constituency].get(lg_name):
            if len(data['wards'][constituency][lg_name]):
             continue

          path = urlparse(link)
          querry = '/'.join(path.path.split('/')[0:3])
          urls = get_links(link,type,False,querry=querry)
          data['wards'][constituency][lg_name] = urls
          write_json(data,file_base_name)
          
          
# def construct_links(election_type,year,)
