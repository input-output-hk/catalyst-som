from supabase import create_client
import orjson

from manager.config import settings

class AttrDict(dict):
    def __init__(self, *args, **kwargs):
        super(AttrDict, self).__init__(*args, **kwargs)
        self.__dict__ = self

class SB():
    def __init__(self):
        self.client = create_client(settings.supabase_url, settings.service_role_key)
        #self.user = self.client.auth.sign_in(email=settings.admin_email, password=settings.admin_password)
        #postgrest_client = self.client.postgrest
        #postgrest_client.auth(self.user.access_token)

    #def __del__(self):
    #    self.client.auth.sign_out()

    def push_entities(self, proposals, entity):
        results = self.client.table(entity).insert(proposals).execute()
        return results.data

    def upsert_entities(self, _data, entity, fields=None):
        data = self.prepare_data(_data, fields)
        results = self.client.table(entity).upsert(data).execute()
        return results.data

    def get_entity(self, entity, model=None):
        results = self.client.table(entity).select("*").execute()
        if model:
            return [model(**el) for el in results.data]
        else:
            return [AttrDict(el) for el in results.data]
    
    def create_user(self, email, password):
        user = self.client.auth.sign_up({ "email": email, "password": password })
        return user
    
    def prepare_data(self, _data, fields=None):
        data = []
        for element in _data:
            if fields:
                _serialized = element.json(include=fields)
            else:
                _serialized = element.json()
            data.append(orjson.loads(_serialized))
        return data