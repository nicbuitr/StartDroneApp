#!/usr/bin/python
"""
    Starting for usage at the computer
    Do not delete the except Typer error. GPS data error, added when include GPS
"""
import time
import math
import sys
import signal
import inspect

from core.bebop import *
drone=Bebop()

#INITIAL POSITION
lat1 = 4.652775
lon1 = -74.107582

#CHANGE THIS TO YOUR GPS POINT TO GO
lat = 4.652775
lon = -74.107582
altitude = 2

#CAMERA MOVEMENT
dX = 1 # 2 mts Forward
dY = 1
dZ = 0
dPsi = math.pi #180 degrees rotation

#press Ctrl+C twice to land
cancelButton = False

def main():
    signal.signal(signal.SIGINT, signal_handler)
    try:
        drone.takeoff()
        time.sleep(2)
        print('Drone in the air at position: ' + str(lat1) + ', ' + str(lon1))
        #drone.moveTo( lat, lon, altitude)
        drone.moveBy( 6, 0, 0, 0)
        #drone.flyToAltitude(7)
        print('Moving to position: ' + str(lat) + ', ' + str(lon))
        time.sleep(5) #??
        print('Arrived at position: ' + str(lat) + ', ' + str(lon))
        drone.takePicture()
        print('Picture taken')
        drone.videoEnable()
        print('Video on')
        drone.moveBy( 0, dY, 0, dPsi)
        time.sleep(10) #??
        print('Finished first rotation')
        drone.takePicture()
        print('Picture taken')
        #drone.moveBy( dX, dY, dZ, dPsi)
        time.sleep(10) #??
        #print('Finished second rotation')
        #drone.takePicture()
        #print('Picture taken')
        drone.moveBy( 0, 6, 0, dPsi)
        #drone.moveTo( lat1, lon1, 1)
        print('Returning to position: ' + str(lat1) + ', ' + str(lon1))
        time.sleep(5) #??
        print('Arrived at position: ' + str(lat1) + ', ' + str(lon1))
        drone.hover()
        drone.land()
        print('Drone landed')
        sys.exit(0)
    except (TypeError):
        pass

def signal_handler(signal, frame):
    drone.moveToCancel()
    drone.hover()
    print('You pressed Ctrl+C!')
    print('Landing')
    drone.hover()
    if drone.flyingState is None or drone.flyingState == 1: # taking off
        drone.emergency()
    if cancelButton == True:
        drone.land()
        sys.exit(0)
    cancelButton = True




if __name__ == "__main__":
    main()
