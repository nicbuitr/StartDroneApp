#!/usr/bin/python
"""
  ARDrone3 demo with autonomous navigation to two color Parrot Cap
  usage:
       ./demo.py <task> [<metalog> [<F>]]
"""
import sys
import cv2
import time
import math
import datetime

from bebop import Bebop
from commands import movePCMDCmd
from capdet import detectTwoColors, loadColors

# this will be in new separate repository as common library fo robotika Python-powered robots
from apyros.metalog import MetaLog, disableAsserts
from apyros.manual import myKbhit, ManualControlException

def startDroneRoutine( drone ):
    altitude = 2 # mts
    dPsi = math.pi # 0 rad
    try:
        print "Taking Off."
        drone.takeoff()
        time.sleep(1)
        print "Take Off Successfull"

        drone.hover()
        print "Flying To Altitude Of " + str(altitude)
        drone.flyToAltitude(2, timeout=20, speed=100) 
        time.sleep(3)
      
        print "Taking Picture."
        drone.takePicture()

        drone.hover()
        print "Rotating by " + str(dPsi)
        drone.moveBy( 0, 0, 0, dPsi)
        print "Waiting " + str(3) +" seconds"
        time.sleep(3)
        print "Finished first rotation"

        print "Taking Picture."
        drone.takePicture()

        drone.hover()
        print "Rotating by " + str(dPsi)
        drone.moveBy( 0, 0, 0, dPsi)
        print "Waiting " + str(3) +" seconds"
        time.sleep(3)
        print "Finished second rotation"

        print "Starting Landing"
        drone.hover()
        print "Flying To Altitude Of 1.5"
        drone.flyToAltitude(1.5, timeout=20, speed=50) 
        time.sleep(3)    
        
        drone.hover()
        drone.land()
        time.sleep(3)
        print "Python Executed"
    except ManualControlException, e:
        print
        print "ManualControlException"
        if drone.flyingState is None or drone.flyingState == 1: # taking off
            drone.emergency()
        print("Landing.")
        drone.land()


if __name__ == "__main__":
    drone = Bebop()
    startDroneRoutine( drone )

# vim: expandtab sw=4 ts=4 

