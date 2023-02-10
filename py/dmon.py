import requests

res = requests.get(
    url='https://www.hermes.com/de/de/product/tasche-evelyne-iii-29-H056277CK37')
# res = requests.get(url='https://www.hermes.cn/cn/zh/product/pop-h%E8%80%B3%E7%8E%AF-H608001FO55/')

# https://www.hermes.cn/cn/zh/product/pop-h%E8%80%B3%E7%8E%AF-H608001FO55/
print(res.text)
