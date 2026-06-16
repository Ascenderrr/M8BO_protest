
import RPi.GPIO as GPIO
import pyautogui
from time import sleep
import RPi.GPIO as GPIO



GPIO.cleanup()

GPIO.setmode(GPIO.BCM)

GPIO.setup(14, GPIO.OUT)

while True:
        if GPIO.input(14):
                pyautogui.press('F')
                sleep(0.15)

        
GPIO.cleanup()