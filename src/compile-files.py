import os 


dir = os.path.dirname(os.path.realpath(__file__))
for file in os.listdir(dir + "/files"):
    print(file)  21