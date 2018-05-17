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
        print "Battery:", drone.battery
        drone.trim()
        drone.takeoff()
        time.sleep(3)
        print "Take Off Successfull"

        drone.takePicture()
        time.sleep(1)
        print "Picture Taken."
        print "Rotating by " + str(dPsi)
        drone.moveBy( 0, 0, 0, dPsi)
        print "Waiting " + str(5) +" seconds"
        time.sleep(5)
        print "Finished first rotation"    

        drone.takePicture()
        time.sleep(1)
        print "Picture Taken."
        print "Rotating by " + str(dPsi)
        drone.moveBy( 0, 0, 0, dPsi)
        print "Waiting " + str(5) +" seconds"
        time.sleep(5)
        print "Finished second rotation"

        drone.land()

    except ManualControlException, e:
        print
        print "ManualControlException"
        if drone.flyingState is None or drone.flyingState == 1: # taking off
            drone.emergency()
        print("Landing.")
        drone.land()


if __name__ == "__main__":
    # drone = Bebop()
    # startDroneRoutine( drone )
    print "Python Executed"

# vim: expandtab sw=4 ts=4 

