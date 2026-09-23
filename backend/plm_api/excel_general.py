from datetime import date, datetime

import pandas as pd


class Excel:
    def __init__(self):
        pass

    def export(self, result, resultRegister):
        file_label = f"{date.today()}_{datetime.now().hour}-{datetime.now().minute}-{datetime.now().second}.xlsx"

        df = pd.DataFrame.from_dict(result)
        dfRegister= pd.DataFrame.from_dict(resultRegister)
        
        writer = pd.ExcelWriter(f"Historic/Report_PowerBI_issues{file_label}", engine="xlsxwriter")
        df.to_excel(writer, sheet_name="issueClose", index=False)
        dfRegister.to_excel(writer, sheet_name="issueRegister", index=False)
        workbook = writer.book
        worksheet = writer.sheets["issueClose"]

        title_format = workbook.add_format(
            {"fg_color": "#82cbff", "align": "center", "bold": True}
        )
        center_wrap = workbook.add_format(
            {"align": "center", "valign": "vcenter", "text_wrap": True}
        )
        left_wrap = workbook.add_format(
            {"align": "left", "valign": "vcenter", "text_wrap": True}
        )
                
        '''worksheet.write_row(
            "A1",
            (
                "Case Code",
                "Dev. Mdl. Name/Item Name",
                "Reg. by",
                "Reg. by ID",
                "Registered Date",
                "Title"
            ),
            title_format,
        )'''

        worksheet.set_column("A:A", 18, center_wrap)
        worksheet.set_column("B:B", 22, center_wrap)
        worksheet.set_column("C:C", 22, center_wrap)
        worksheet.set_column("D:D", 22, center_wrap)
        worksheet.set_column("E:E", 22, center_wrap)
        worksheet.set_column("F:F", 22, center_wrap)
        worksheet.set_column("G:G", 22, center_wrap)
        worksheet.set_column("H:H", 22, center_wrap)
        worksheet.set_column("I:I", 22, center_wrap)
        worksheet.set_column("J:J", 22, center_wrap)
        worksheet.set_column("K:K", 22, center_wrap)
        worksheet.set_column("L:L", 22, center_wrap)
        worksheet.set_column("M:M", 22, center_wrap)
        worksheet.set_column("N:N", 22, center_wrap)
        worksheet.set_column("O:O", 22, center_wrap)

        workbook1 = writer.book
        worksheet1 = writer.sheets["issueRegister"]
                
        worksheet1.set_column("A:A", 22, center_wrap)
        worksheet1.set_column("B:B", 28, center_wrap)
        worksheet1.set_column("C:C", 28, center_wrap)
        worksheet1.set_column("D:D", 22, center_wrap)
        worksheet1.set_column("E:E", 22, left_wrap)
        worksheet1.set_column("F:F", 100, center_wrap)
        
       
        
        writer.close()
        print("\nExcel File Exported!")
        print("\nAll Finished!")
