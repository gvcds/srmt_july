import re
from datetime import datetime

def folderStage(folder: str):
    if  "[" not in folder and ")" not in folder and "LA" in folder:
        return "Main Folder - LA"
    elif "[" not in folder and ")" not in folder:
        return "Main Folder - BB"
    elif "SM-" not in folder:
        return "App folder"
    elif  "for Next SW" in folder:
        return "App folder"
    elif "MMI" in folder:
        return "App folder"
    elif "[MR]" in folder :
        return "MR"
    else:
        return "MR"
def modificationRate(folder: str, resolveMedium: str, resolveSmall: str):
    if  "Issue Fixed(Source changes)" == resolveMedium or "Issue Fixed(Except Source changes)" == resolveMedium or "App Update via App Store" == resolveMedium:
        return 'Good'
    elif "Not reproduced" == resolveMedium or "Maintain current status" == resolveMedium or "Request to 3rd Party(Non Samsung Issue)" == resolveMedium or "Duplicated issue(Cause side)" == resolveMedium:
        return 'Neutral'
    elif "Insufficient Defect Info."  == resolveMedium:
        return 'Bad'
    elif "Not problem" == resolveMedium and "A test error/mistake" == resolveSmall:
        return 'Bad'
    elif "Carrier Requirement" == resolveSmall or "Intentional operation/Phenomenon/Unsupported" == resolveSmall:
        return 'Neutral'
    elif "Product Requirement, UX Guide, Standard Technical Specification"==resolveSmall and "[" not in folder and ")" not in folder:
        return 'Neutral'
    elif "Product Requirement, UX Guide, Standard Technical Specification"==resolveSmall:
        return 'Bad'
    else:
        return 'Verificar'
def read_txt(team : str):
    """
    Convert input.txt in to an array
    """
    result = []
    with open(team) as f:
        while line := f.readline():
            line = re.sub(r"\s+", "", str(line))
            result.append(line)

    return ";".join(result)


def read_model(model: str):
    """
    Convert input.txt in to an array
    """
    result = []
    with open(model) as f:
        while line := f.readline():
            line = re.sub(r"\s+", "", str(line))
            result.append(line)

    return result


def get_modelName_from_problem(text: str):
    newText = re.sub(r"\s+", "", text)
    newText = newText[:1000]
    wrong_pattern = newText
    newText = re.findall(r"\[.*?\]", newText)
    for i in newText:
        if "SM" in i:
            return i.replace("[", "").replace("]", "")

    return f"Wrong Pattern [{wrong_pattern}]"


def check_date(value: str):
    if value == 'NaT':
        return ''
    elif not value:
        return ''
    else:
        objeto_data= datetime.fromisoformat(value)
        data_formatada= objeto_data.strftime("%d/%m/%Y %H:%M:%S")
        return data_formatada
