# -*- coding: utf-8 -*-

"""
Create on 2023.08.08
author: claudio.ag
"""

import os
import shutil
import subprocess

VER = "1.1.0"
TOOL_NAME = f"SVP_Issues_Report_{VER}"
PATH = os.path.dirname(os.path.abspath(__file__))
MAIN_FILE = "main.py"
PYTHON_PATH = (
    r"D:\SQI\Automacao\GitHub\SVP_Issues_Report\venv\Lib\site-packages"
)

with open(MAIN_FILE, "r") as f:
    data = f.read()

with open(MAIN_FILE, "w") as f:
    f.write(data.replace("{VERSION}", VER))

# Generate EXE
subprocess.call(
    [
        "pyinstaller",
        "--path",
        PYTHON_PATH,
        "--add-data",
        ".env;.",
        "--hidden-import",
        "win32timezone",
        "--onefile",
        os.path.join(MAIN_FILE),
    ]
)

with open(os.path.join(MAIN_FILE), "w") as f:
    f.write(data.replace(VER, "{VERSION}"))

shutil.copy2(
    os.path.join(PATH, "Release_Notes.txt"),
    os.path.join(PATH, "dist", "Release_Notes.txt"),
)
shutil.copy2(
    os.path.join(PATH, "input.txt"),
    os.path.join(PATH, "dist", "input.txt"),
)
shutil.copytree(os.path.join(PATH, "Historic"), os.path.join(PATH, "dist", "Historic"))

# Removing unecessary folders and files
os.remove(os.path.join(PATH, MAIN_FILE.replace("py", "spec")))
shutil.rmtree(os.path.join(PATH, "build"))

# Renaming exe folder
os.rename(os.path.join(PATH, "dist"), os.path.join(PATH, TOOL_NAME))
os.rename(
    os.path.join(PATH, TOOL_NAME, "main.exe"),
    os.path.join(PATH, TOOL_NAME, "{}.exe".format(TOOL_NAME)),
)
