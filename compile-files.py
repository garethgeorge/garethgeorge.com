import os
import glob

dir = os.path.dirname(os.path.realpath(__file__))


def addslashes(str):
    return str.replace("$", "\\$").replace("`", "\\`")


with open(os.path.join(dir, "./src/files/files.js"), "w") as f:
    f.write("""import fs from "memfs";\n""")
    f.write("""
fs.mkdirSync("/home");
fs.mkdirSync("/home/user");
""")

    for file in glob.glob("./files/**", recursive=True):
        if file == "./files/":
            continue
        relfilepath = os.path.relpath(file, "./files/")

        if os.path.isdir(file):
            f.write("""fs.mkdirSync("/home/user/%s");\n""" % relfilepath)
        elif os.path.isfile(file):
            with open(os.path.join(dir, file), "r") as content:
                f.write("""fs.writeFileSync("/home/user/%s", `%s`);\n""" %
                        (relfilepath, addslashes(content.read())))
