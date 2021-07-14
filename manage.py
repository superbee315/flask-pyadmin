'''
Created on 2021年5月5日

@author: 40215
'''
from pyadmin.app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(port=8888)
