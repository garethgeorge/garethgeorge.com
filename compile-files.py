import os
import glob
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import Terminal256Formatter

dir = os.path.dirname(os.path.realpath(__file__))

def addslashes(str):
    return str.replace("\\", "\\\\").replace("$", "\\$").replace("`", "\\`")


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
                content = content.read()
                if file.endswith(".py"):
                    lexer = get_lexer_by_name("python", stripall=True)
                    formatter = Terminal256Formatter()
                    content = highlight(content, lexer, formatter)
                elif file.endswith(".md"):
                    lexer = get_lexer_by_name("md", stripall=True)
                    formatter = Terminal256Formatter()
                    content = highlight(content, lexer, formatter)

                f.write("""fs.writeFileSync("/home/user/%s", `%s`);\n""" %
                        (relfilepath, addslashes(content)))
