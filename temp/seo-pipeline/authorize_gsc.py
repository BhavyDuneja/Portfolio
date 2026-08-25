# -*- coding: utf-8 -*-
"""ONE-TIME: authorize Google Search Console access via OAuth.
Prereq: put the downloaded OAuth client file as  seo-pipeline/client_secret.json
Run once:  python authorize_gsc.py
It opens a browser -> you log in & allow -> saves seo-pipeline/gsc-token.json (refresh token).
After that the daily job pulls data with no interaction.
"""
import os
from google_auth_oauthlib.flow import InstalledAppFlow

BASE = os.path.dirname(os.path.abspath(__file__))
CLIENT = os.path.join(BASE, "client_secret.json")
TOKEN = os.path.join(BASE, "gsc-token.json")
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

def main():
    if not os.path.exists(CLIENT):
        print("MISSING client_secret.json in", BASE)
        print("Download the OAuth client (Desktop app) JSON from Google Cloud -> rename to client_secret.json here.")
        return
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT, SCOPES)
    creds = flow.run_local_server(port=0, prompt="consent", authorization_prompt_message="")
    with open(TOKEN, "w", encoding="utf-8") as f:
        f.write(creds.to_json())
    print("SUCCESS — token saved to", TOKEN)
    print("You can delete client_secret.json now if you want (token is enough), or keep it.")

if __name__ == "__main__":
    main()
