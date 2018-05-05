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


if __name__ == "__main__":
    
    drone.hover()
    print"Flying To Altitude Of 1.5"
    drone.flyToAltitude(1.5, timeout=20, speed=50) 
    time.sleep(3)
    
    drone.hover()
    drone.land()
    print "Python Executed"