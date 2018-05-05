import time
import math
import sys
import signal
import inspect

from core.bebop import *
drone=Bebop()

drone.takeoff()

drone.takePicture()
print('Picture taken')
drone.videoEnable()
print('Video on')

time.sleep(10)

drone.hover()
drone.land()

        
 