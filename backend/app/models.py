from sqlalchemy import Column, Integer, String
from app.database import Base
class Interaction(Base):
    __tablename__="interactions"
    id = Column(Integer,primary_key=True,index=True)
    hcp_name=Column(String)
    hospital=Column(String)
    summary=Column(String)
    sentiment=Column(String)
    follow_up_date=Column(String)