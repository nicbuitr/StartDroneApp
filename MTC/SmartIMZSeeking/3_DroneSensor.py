from openmtc_app import DA
from openmtc_app.flask_runner import FlaskRunner
from random import randint
import time
import sys
import traceback


class DroneSensor(DA):

    def __init__(self):
        DA.__init__(self)
        self.container_id = 'zoneInfoContainer'

    def _on_register(self):
        print '_on_register'
        try:
            self.container = self.get_application('DroneSensor/containers/' + self.container_id)
            print "Container Found"
        except Exception:
            print "Container Not Found , Creating container"
            self.container = self.create_container(self.application, self.container_id)

        # while True:
        #     match_percentage = randint(0,100)
        #     lat = randint(-90,90)
        #     lon = randint(-180,180)
        #     data = {
        #         "match_percentage": match_percentage,
        # 		"latitude": lat,
        # 		"longitude": lon,
        #         "drone_id":1,
        #         "base64image": "base64imageLongString"
        #     }
        #     self.push_content(self.container, data)
        #     print data
        #     time.sleep(5)


app_instance = DroneSensor()
app_instance.app_id = 'DroneSensor'
app_instance.search_strings = ('ZonesInfo', )
gateway_add = 'localhost:4000'
runner = FlaskRunner(app_instance,port=5001)
runner.run(gateway_add)







