from . import Driver
from redis import Redis, ConnectionPool

class RedisToken(Driver):
    '''
    Redis Token 操作类
    '''
    
    def __init__(self):
        '''
        构造函数
        '''
        pool = ConnectionPool(host='127.0.0.1', 
                           port=6375,
                           db=7,
                           health_check_interval=30, 
                           decode_responses=True
                           )
        self.r = Redis(connection_pool=pool)
        self.user_prefix = "up:"
        self.token_prefix = "tp:"
    
    def set(self, token:str, user_id:int):
        '''
        储存Token
        :param token: Token
        :param user_id: 会员Id
        '''
        key = self.token_prefix + token
        user_key = self.user_prefix + str(user_id)
        pipe = self.r.pipeline()
        
        pipe.set(key, user_id) 
        pipe.sadd(user_key, key)
        pipe.execute()
        return True

    def get(self, token:str):
        '''
        获取Token内的信息
        :param token: Token
        '''
        key = self.token_prefix + token
        value = self.r.get(key)
        
        return value
    
    def check(self, token:str, user_id:int):
        '''
        判断Token是否可用
        :param token: Token
        :param user_id: 会员Id
        '''
        data = self.get(token)
        return True if data and int(data) == user_id else False 
    
    def delete(self, token:str):
        '''
        删除Token
        :param token: Token
        '''
        data = self.get(token)
        if data:
            key = self.token_prefix + str(token)
            user_key = self.user_prefix + data
            
            pipe = self.r.pipeline()
            pipe.delete(key)
            pipe.srem(user_key, key)
            pipe.execute()
        return True
    
    def clear(self, user_id:int):
        '''
        删除指定用户的所有Token
        :param user_id: 会员Id
        '''
        user_key = self.user_prefix + str(user_id)
        keys = self.r.smembers(user_key)
        pipe = self.r.pipeline()
        pipe.delete(user_key)
        for k in keys:
            pipe.delete(k)
        pipe.execute()
        return True