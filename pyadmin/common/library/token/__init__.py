from abc import ABC, abstractmethod

class Driver(ABC):
    '''
    Token 基础类
    '''
    @abstractmethod
    def set(self, token:str, user_id:int, expire=0):
        '''
        储存Token
        :param token: Token
        :param user_id: 会员Id
        :param expire: 过期时长, 0 表示无限,单位秒
        '''
        pass

    @abstractmethod
    def get(self, token:str):
        '''
        获取Token内的消息
        :param token: Token
        '''
        pass
    
    @abstractmethod
    def check(self, token:str, user_id:int):
        '''
        判断Token是否可用
        :param token: Token
        :param user_id: 会员Id
        '''
        pass
    
    @abstractmethod
    def delete(self, token:str):
        '''
        删除Token
        :param token: Token
        '''
        pass 
    
    @abstractmethod
    def clear(self, user_id:int):
        '''
        删除指定用户的所有Token
        :param user_id: 会员Id
        '''
        pass