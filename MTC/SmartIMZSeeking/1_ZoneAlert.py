from openmtc_app.flask_runner import FlaskRunner
from openmtc_app import ContentSubscription, DA


class Alert(DA):

    data = []
    container_name = "alertContainer"
    def _on_register(self):

        alert_subscription = ContentSubscription(
            None,
            self.container_name,
            content_handler=self._consumption_data
        )
        self.add_content_subscription(alert_subscription)
        print "alert_subscription to: Alert Container:" + self.container_name

    def _consumption_data(self, application, container, content):
        print "Got content at ZoneAlert"
        for i in content:
            match_percentage = i['match_percentage']
            lat = i['latitude']
            lon = i['longitude']
            drone_id = i['drone_id']
            base64image = i['base64image']
            self.data.append(match_percentage)
            print "ALERT!!! - Possible Mining Zone detected at [Latitude, Longitude]: [",lat,",",lon,"] with a dominant color match of:", match_percentage, "% by Drone", drone_id, "Subscribe to this container to retrieve Base64 Image String"

app_instance = Alert()
gateway_ip= 'localhost:4000'
runner = FlaskRunner(app_instance, port=5097, host='localhost')
runner.run(gateway_ip)
