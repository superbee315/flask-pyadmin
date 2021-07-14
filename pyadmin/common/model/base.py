import time
from pyadmin.extensions import db

class CRUDMixin():
    """ Mixin that adds convenience methods for CRUD (create, read, update, delete) operations. """
    
    @classmethod
    def create(cls, **kwargs):
        """Create a new record and save it the database."""
        # 增加创建时间戳
        if hasattr(cls, 'createtime'):
            setattr(cls, 'createtime', int(time.time()))
        instance = cls(**kwargs)
        return instance.save()
    
    def update(self, **kwargs):
        """Update specific fields of a record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        # 增加更新时间戳
        if hasattr(self, 'updatetime'):
            setattr(self, 'updatetime', int(time.time()))
        
        return self.save() or self
    
    def save(self):
        """Save the record."""
        db.session.add(self)
        return self
    
    def delete(self):
        """Remove the record from the database."""
        return db.session.delete(self)
    
class Model(CRUDMixin, db.Model):
    """Base model class that includes CRUD convenience methods."""

    __abstract__ = True
    # def to_dict(self):
    #     return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}
    
class PkModel(Model):
    """Base model class that includes CRUD convenience methods, plus adds a 'primary key' column named ``id``."""
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    @classmethod
    def get_by_id(cls, record_id):
        ''' get record by id '''
        if any(
            (
                isinstance(record_id, (str, bytes)) and record_id.isdigit(),
                isinstance(record_id, (int, float)),
            )            
        ):
            
            return cls.query.get(int(record_id))
        return None