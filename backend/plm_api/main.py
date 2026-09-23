import token
from numpy import void
from numpy._typing import _VoidCodes
from plm_general import PLM
from excel_general import Excel
from aux_functions import get_modelName_from_problem, read_txt, check_date, read_model, folderStage, modificationRate
from datetime import datetime
import json

plm = PLM()
excel = Excel()

def busca (valor: str):
    lst= []
    login=read_model("login.txt")
    token= plm.login(str(login[0]), str(login[1]))
    token= token.replace('"', "")
    #con=plm.post_login()
    issues = plm.get_issues(read_txt(activeteam), token)
    issues_result = issues['data']
    
    if issues_result:
        cont = 1
        lst = []
        #total = len(issues_result)
        for i in issues_result:
             
             if valor in i['Title']:
               lst.append(
                    {
                        'case_code': i['Case Code'],
                        'main_folder': i['Dev. Mdl. Name/Item Name'],
                        'priority': i['Priority'],
                        'reg_id': i['Reg. by ID'],
                        'title': i['Title'],
                        'prog_stat': i['Progr.Stat.'],
                        'sw_ver': i['S/W Ver.'],
                        'resolve_option_medium': i['Resolve Option(Medium)'],
                        'resolve_option_small': i['Resolve Option(Small)']
                    }
                )
        
        
        return lst
        
    else:
        return void
def close_issues(activeteam: str):
    login=read_model("login.txt")
    token= plm.login(str(login[0]), str(login[1]))
    token= token.replace('"', "")
    #con=plm.post_login()
    issues = plm.get_close_issues(read_txt(activeteam),"2025.01.01", "2026.12.31", token)
    issues_result = issues['data']
    '''
    #issues_result= json.loads(issues_result)
    lst = []
    if issues_result:
        print("Done!\n")
        #print(issues_result)
        # Getting release info and merging with issues information
        cont = 1
        total = len(issues_result)
        for i in issues_result:
           lst.append(
               {
                        'case_code': i['Case Code'],
                        'model_name': i['Pjt. Name'],
                        'main_folder': i['Dev. Mdl. Name/Item Name'],
                        'Must Check': i['Must Check'],
                        'reg_id': i['Reg. by ID'],
                        'priority': i['Priority'],
                        'title': i['Title'],
                        'registered_date': check_date(i['Registered Date']),
                        'prog_stat': i['Progr.Stat.'],
                        'sw_ver': i['S/W Ver.'],
                        'resolve_option_medium': i['Resolve Option(Medium)'],
                        'resolve_option_small': i['Resolve Option(Small)']
                }
           )
           print(
               f"{cont}/{total}. {i['Case Code']} [{i['Reg. by ID']}]  : "
           )
           cont += 1'''
   
    lst1= [linha for linha in issues_result if any(linha.values())]
    excel.export(lst1) 
    
def closeTat(activeteam: str):
    lstTat= []
    login=read_model("login.txt")
    token= plm.login(str(login[0]), str(login[1]))
    token= token.replace('"', "")
    #con=plm.post_login()
    issuesTat= plm.get_powerbi_issues(read_txt(activeteam), token)
    resultissuesTat= issuesTat['data']
    
    if resultissuesTat:
        print("Done!\n")
        #print(issues_result)
        # Getting release info and merging with issues information
        cont = 1
        total = len(resultissuesTat)
        data=read_model("data.txt")
        dataInicio=datetime.fromisoformat(data[0])
        dataFim=datetime.fromisoformat(data[1])
        for i in resultissuesTat:            
            if (i['Resloved Confirm Date']) and datetime.fromisoformat(i['Resloved Confirm Date']) >= dataInicio and datetime.fromisoformat(i['Resloved Confirm Date']) <= dataFim:
                region= folderStage(i['Dev. Mdl. Name/Item Name'])
                rate= modificationRate(i['Dev. Mdl. Name/Item Name'], i['Resolve Option(Medium)'], i['Resolve Option(Small)'])
                lstTat.append(
                    {
                        'case_code': i['Case Code'],
                        'Dev. Mdl. Name/Item Name': i['Dev. Mdl. Name/Item Name'],
                        'Backbone/LA': region,
                        'reg': i['Reg. by'],
                        'reg_id': i['Reg. by ID'],
                        'Resolve Option(Medium)': i['Resolve Option(Medium)'],
                        'Resolve Option(Small)': i['Resolve Option(Small)'],
                        'Modification rate': rate,
                        'Registered Date': datetime.fromisoformat(i['Registered Date']),
                        'S/W Ver.(Date)': i['S/W Ver.(Date)'],
                        'Resolve Date': i['Resolve Date'],
                        'Resolve confirmer ID':i['Resolve confirmer ID'],
                        'Resloved Confirm Date': datetime.fromisoformat(i['Resloved Confirm Date']),
                        'Resolution Confirmation S/W Ver.(Date)': i['Resolution Confirmation S/W Ver.(Date)'],
                        'Close Option': i['Close Option'],
                        'title': i['Title'],
                        
                    }
                )         
           
            print(
                f"{cont}/{total}. {i['Case Code']} [{i['Reg. by ID']}]  : "
            )
            cont += 1
        if lstTat:
            for i in lstTat:
                if i['S/W Ver.(Date)']:
                    aux= i['S/W Ver.(Date)']
                    i['S/W Ver.(Date)']= datetime.fromisoformat(i['S/W Ver.(Date)'])
                if i['Resolve Date']:
                    aux= i['Resolve Date']
                    i['Resolve Date']= datetime.fromisoformat(i['Resolve Date'])
                if i['Resolution Confirmation S/W Ver.(Date)']:
                    aux= i['Resolution Confirmation S/W Ver.(Date)']
                    i['Resolution Confirmation S/W Ver.(Date)']= datetime.fromisoformat(i['Resolution Confirmation S/W Ver.(Date)'])
        lst1= [linha for linha in lstTat if any(linha.values())]
        return lst1
        


def register(activeteam: str):
    login=read_model("login.txt")
    token= plm.login(str(login[0]), str(login[1]))
    token= token.replace('"', "")
    lst = []
    issues = plm.get_issues(read_txt(activeteam), token)
    issues_result = issues['data']
    #issues_result= json.loads(issues_result)
        
    if issues_result:
        print("Done!\n")
        #print(issues_result)
        # Getting release info and merging with issues information
        cont = 1
        total = len(issues_result)
        for i in issues_result:
            if (i['Registered Date']):
                lst.append(
                    {
                        'case_code': i['Case Code'],
                        'Dev. Mdl. Name/Item Name': i['Dev. Mdl. Name/Item Name'],
                        'Reg. by': i['Reg. by'],
                        'Reg. by ID': i['Reg. by ID'],
                        'Registered Date': datetime.fromisoformat(i['Registered Date']),
                        'Title': i['Title']
                    }
                )
            
           
            print(
                f"{cont}/{total}. {i['Case Code']} [{i['Reg. by ID']}]  : "
            )
            cont += 1
   
    #lst1= [linha for linha in lst if any(linha.values())]
    return lst
    

#main_regular()
#main_regular("inputSVP.txt")

team= input("Digite: \n1 para UIT \n2 para FOTA \n3 para Bixby \n4 para Compatibility \n5 para SVP \n6 todos: ")
def selected_team(team):
    match team:
        case "1":
            return "inputUIT.txt"
        case "2":
            return "inputFOTA.txt"
        case "3":
            return "inputBixby.txt"
        case "4":
            return "inputCompatibility.txt"
        case "5":

            return "inputSVP.txt"
        case _:
            return "inputatualizado.txt"
activeteam= selected_team(team)
print(activeteam)
if activeteam == "inputSVP.txt":
    lst=[]
    closelst= closeTat("inputUIT.txt")
    lst.extend(closelst)
    closelst= closeTat("inputBixby.txt")
    lst.extend(closelst)
    closelst= closeTat("inputCompatibility.txt")
    lst.extend(closelst)
    
    lst1=[]
    registerlst= register("inputUIT.txt")
    lst1.extend(registerlst)
    registerlst= register("inputBixby.txt")
    lst1.extend(registerlst)
    registerlst= register("inputCompatibility.txt")
    lst1.extend(registerlst)
    excel.export(lst, lst1)
elif activeteam=="inputatualizado.txt":
    lst=[]
    closelst= closeTat("inputUIT.txt")
    lst.extend(closelst)
    closelst= closeTat("inputBixby.txt")
    lst.extend(closelst)
    closelst= closeTat("inputCompatibility.txt")
    lst.extend(closelst)
    closelst= closeTat("inputFOTA.txt")
    lst.extend(closelst)
    
    lst1=[]
    registerlst= register("inputUIT.txt")
    lst1.extend(registerlst)
    registerlst= register("inputBixby.txt")
    lst1.extend(registerlst)
    registerlst= register("inputCompatibility.txt")
    lst1.extend(registerlst)
    registerlst= register("inputFOTA.txt")
    lst1.extend(registerlst)
    excel.export(lst, lst1)
else:
    lst=[]
    closelst= closeTat(activeteam)
    lst.extend(closelst)
    lst1=[]
    registerlst= register(activeteam)
    lst1.extend(registerlst)
    excel.export(lst, lst1)
'''opcao= input("Digite 1 main e regular 2 especifico: ")


if opcao== "1":
    main_regular(activeteam)
elif opcao== "2":
    lst=[]
    issues_esp = (read_model("model.txt"))
    
    for item in issues_esp:
        print (item)
        temp=[]
        temp= busca(str(item))
        if temp != []:
            lst.extend(temp)
    

    if lst!=[]:
        excel.export(lst)
    else:
        print("Nao encontrado")
elif opcao == "3":
    close_issues(activeteam)
else:
    print("Invalido")
    '''


#opcao= input("Digite 1 para main e regular folder ou 2 para busca por arquivo")