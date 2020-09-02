import argparse 
import os
from github import Github
import github 
import base64

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
        try:
            resp = repo.get_contents("README.md")
            assert(resp.encoding == "base64")
            print("WRITING OUT README FILE")
            with open(os.path.join(dir, repo.full_name, "README.md"), "w") as f:
                f.write(base64.b64decode(resp.content).decode("ascii"))
        except Exception as e:
            print(e)