import argparse 
import os
from github import Github
import github 
import base64
import re 

parser = argparse.ArgumentParser(description="scrape my projects from github")
parser.add_argument("github_token", type=str, help="auth token to scrape projects")

args = parser.parse_args()
dir = os.path.dirname(os.path.realpath(__file__))

g = Github(args.github_token)
for repo in g.get_user().get_repos():
    if repo.owner.login in ["garethgeorge"]:
        print("RESPOSITORY: " + repo.full_name)
        try:
            os.makedirs(os.path.join(dir, repo.full_name))
        except FileExistsError: 
            pass

        with open(os.path.join(dir, repo.full_name, "link.href"), "w") as f:
            f.write(repo.html_url)

        try:
            resp = repo.get_contents("README.md")
            assert(resp.encoding == "base64")
            print("WRITING OUT README FILE")
            with open(os.path.join(dir, repo.full_name, "readme.md"), "w") as f:
                content = base64.b64decode(resp.content).decode("utf-8", "ignore")
                f.write("".join(c for c in content if ord(c) < 128))
        except Exception as e:
            print(e)