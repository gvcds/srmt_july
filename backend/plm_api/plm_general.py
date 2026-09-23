from sqlite3 import DatabaseError
import time
from datetime import date, timedelta, datetime
from numpy import void
import requests
from settings import settings
import json
from aux_functions import get_modelName_from_problem, read_txt, check_date, read_model, folderStage, modificationRate

session = requests.Session()
'''USERNAME = "alexsandro.l"
PASSWORD = "@svp2326@"'''

class PLM:
    def __init__(self):
        pass
    def login(self, USERNAME: str, PASSWORD: str):
        url = "http://105.112.150.108:105/auth/login"

        payload = {
            "username": USERNAME,
            "password": PASSWORD
        }

        try:
            response = requests.post(url, data=payload)
            response.raise_for_status()
            return response.text
        except requests.exceptions.RequestException as e:
            print(e)
            raise
    

    def get_issues(self, ids: str, token: str):
        print("Getting Issues...")
        
        today = date.today().strftime("%Y.%m.%d")
        tomorrow = date.today() + timedelta(days=1)
        f_tomorrow = tomorrow.strftime("%Y.%m.%d")

        data=read_model("data.txt")
        
        url= f"{settings.PLM_HOST}/plm/issues"
        params={
                "registerStartDate": data[0],
                "registerEndDate": data[1],
                "registerId": ids,
                "progressStatus": "OPEN,RESOLVE,CLOSE"
         }
        headers = {
            "Authorization": f"Bearer {token}"
        }
        try:
            response = session.post(
                url=url,
                json=params,
                headers=headers
            ).json()
        
            #response.raise_for_status()

            return response
        except requests.exceptions.RequestException as e:
            print(e)
            return None
        except json.JSONDecodeError as e:
            print(e)
            return None

    def get_powerbi_issues(self, ids: str, token: str):
        print("Getting Issues...")
        
        today = date.today().strftime("%Y.%m.%d")
        tomorrow = date.today() + timedelta(days=1)
        f_tomorrow = tomorrow.strftime("%Y.%m.%d")
                     
        url= f"{settings.PLM_HOST}/plm/issues"
        params={
                "resolveStartDate": "2025.11.01",
                "resolvedEndDate": f_tomorrow,
                "registerId": ids,
                "progressStatus": "CLOSE"
         }
        headers = {
            "Authorization": f"Bearer {token}"
        }
        try:
            response = session.post(
                url=url,
                json=params,
                headers=headers
            ).json()
        
            #response.raise_for_status()

            return response
        except requests.exceptions.RequestException as e:
            print(e)
            return None
        except json.JSONDecodeError as e:
            print(e)
            return None
    def get_close_issues(self, ids: str, dataStart: str, dataEnd: str, token: str):
        print("Getting Issues...")
        
        today = date.today().strftime("%Y.%m.%d")
        tomorrow = date.today() + timedelta(days=1)
        f_tomorrow = tomorrow.strftime("%Y.%m.%d")
        
        url= f"{settings.PLM_HOST}/plm/issues"
        params = {
            "resolveStartDate": dataStart,
            "resolvedEndDate": dataEnd,
            "progressStatus": "Close",
            "registerId": ids

        }
        headers = {
            "Authorization": f"Bearer {token}"
        }
        try:
            response = session.post(
                url=url,
                json=params,
                headers=headers
            ).json()
        
            #response.raise_for_status()

            return response
        except requests.exceptions.RequestException as e:
            print(e)
            return None
        except json.JSONDecodeError as e:
            print(e)
            return None     
    

    """def get_total_release(self, model: str, customer: str):
        while True:
            try:
                res = session.get(
                    url=f"{settings.PLM_HOST}/plm/binary_releases_info",
                    params={"model": model, "customer": customer, "end_date": ""},
                ).json()

                return len(res)

            except requests.exceptions.RequestException:
                print("Error Occurred. Trying Again...")
                time.sleep(2)
                
    def get_release_number_label_date(self, model, customer=None):
        while True:
            try:
                res = session.get(
                    url=f"{settings.PLM_HOST}/plm/latest_noSmrRelease_modelCustomer",
                    params={"model": model, "customer": customer},
                ).json()

                ap = res["AP"][-4:]
                csc = res["CSC"][-8:]
                date = res["approval_date"].split()[0]

                if res["CP"] is None:
                    return f"{ap}/{csc} ({date})"

                else:
                    cp = res["CP"][-4:]
                    return f"{ap}/{cp}/{csc} ({date})"

            except Exception:
                return "No release available"

    def get_release_information(self, model: str, issue_list: dict):
        # In case model name was not found
        if "Wrong Pattern" in model:
            return "No Release Found"

        else:

            # In case model name and release info are already in list
            for i in issue_list:
                if i['model_name'] == model:

                    return i['release_info']

            else:

                if model in [
                    "SM-S721BE_LA_TPA",
                    "SM-S928BE_LA_15_TPA",
                    "SM-S921BE_LA_15_TPA",
                    "SM-S926BE_LA_15_TPA"
                ]:  # !Remove this exception as soon this project finish
                    return self.get_release_number_label_date(model, "OWO")

                # Searching on plm sw coop
                if self.get_total_release(model, "OXM") != 0:
                    return self.get_release_number_label_date(model, "OXM")
                elif self.get_total_release(model, "OWO") != 0:
                    return self.get_release_number_label_date(model, "OWO")
                elif self.get_total_release(model, "TPA") != 0:
                    return self.get_release_number_label_date(model, "TPA")
                elif self.get_total_release(model, "OWA") != 0:
                    return self.get_release_number_label_date(model, "OWA")
                else:
                    return "No Release Available"
                """
# plm = PLM()
# plm.get_issues('M220606172907C101154;M210825211332C108401')
