# Accessing the Microprocessor 
# Installation Instructions
  1. install boot.py on the device using the webrepl to transfer the file (replacing the default boot.py)

## Micropython Tips

download files from
 - download micropython builds for esp8266 here: https://micropython.org/download/esp8266/
 - instructions for flashing here: https://docs.micropython.org/en/latest/esp8266/tutorial/intro.html

flashing commands:
```
esptool.py --port /dev/tty.SLAB_USBtoUART erase_flash
esptool.py --port /dev/tty.SLAB_USBtoUART --baud 460800 write_flash --flash_size=detect 0 Documents/workspaces-projects/solarwatch/3rdparty/esp8266-20191220-v1.12.bin
```

### Connecting to the REPL
```
screen /dev/tty.SLAB_USBtoUART 115200
```

### Connecting to WebRepl
The password is set to `solar!`. To connect download `https://github.com/micropython/webrepl` and enter the device's IP address (default if you are connected to the device's access point, otherwise run `print('network config:', sta_if.ifconfig())` to get its IP via the Serial REPL)

NOTE: webrepl_cli can be used for copying files conveniently 

### Connecting the Chip to WiFi W/Serial REPL
```python
def do_connect():
    import network
    sta_if = network.WLAN(network.STA_IF)
    if not sta_if.isconnected():
        print('connecting to network...')
        sta_if.active(True)
        sta_if.connect('<WIFI NETWORK>', '<WIFI PASS>')
        while not sta_if.isconnected():
            pass
    print('network config:', sta_if.ifconfig())
```
original network config: ('192.168.180.189', '255.255.255.0', '192.168.180.1', '192.168.180.1')