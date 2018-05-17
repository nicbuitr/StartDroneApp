from openmtc_app.flask_runner import FlaskRunner
from openmtc_app import ContentSubscription, NA


class Central(NA):

    data = []
    alertContainers = []

    def _on_register(self):

        container = 'zoneInfoContainer'

        zone_info_subscription = ContentSubscription(
            None, #App names
            (container,), #Containers
            ("ZonesInfo",), #application_search_strings
            content_handler=self._consumption_data
        )

        self.add_content_subscription(zone_info_subscription)
        print "Content_subscription to Zone Info  Container:" + container

        #Zone alerts container
        alert_container_name =  "alertContainer"
        try:
            alertcontainer = self.get_application('Central/containers/' + alert_container_name)
            print "Container Alert Found"
            self.alertContainers.append(alertcontainer)
        except Exception:
            print "Container Alert Not Found , Creating container"
            alertcontainer = self.create_container(self.application, alert_container_name)
            self.alertContainers.append(alertcontainer)

    def _consumption_data(self, application, container, content):
        print "Got content at Central"
        for i in content:
            match_percentage = i['match_percentage']
            lat = i['latitude']
            lon = i['longitude']
            drone_id = i['drone_id']
            image = i['base64image']
            self.data.append(match_percentage)
            if match_percentage > 85:
                data = {
                    "match_percentage": match_percentage,
                    "latitude": lat,
                    "longitude": lon,
                    "drone_id": drone_id,
                    "base64image": image
                }
                self.push_content(self.alertContainers[drone_id-1], data)
                print "ALERT SENT - Possible Mining Zone detected at [Latitude, Longitude]: [",lat,",",lon, "] with a dominant color match  of", match_percentage, "% by Drone ", drone_id, "- information stored at container:", container.name
            else:
                print "Zone OK - dominant color match of", match_percentage, "% - Drone", drone_id, "at [Latitude, Longitude]: [",lat,",",lon, "]","- Container:", container.name


app_instance = Central()

core_ip = 'localhost:4000'
runner = FlaskRunner(app_instance, port=5076, host='localhost')
runner.run(core_ip)