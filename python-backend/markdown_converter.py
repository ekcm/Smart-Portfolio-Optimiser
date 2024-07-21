import json

def read_markdown_file(file_path):
    with open(file_path, "r") as file:
        md_text = file.read()
    return md_text

def convert_markdown_to_json(md_text):
    lines = md_text.strip().split("\n")
    json_data = {"FinancialNewsReport": {"weekOf": "", "sections": {}}}
    current_section = None
    current_subsection = None

    for line in lines:
        if line.startswith("# Financial News Report for the Week of"):
            json_data["FinancialNewsReport"]["weekOf"] = line.split("of ")[-1]
        elif line.startswith("## "):
            current_section = line[3:]
            json_data["FinancialNewsReport"]["sections"][current_section] = {}
            current_subsection = None
        elif line.startswith("### "):
            current_subsection = line[4:]
            json_data["FinancialNewsReport"]["sections"][current_section][current_subsection] = {
                "summary": "",
                "details": [],
                "references": []
            }
        elif line.startswith("- "):
            if current_subsection:
                json_data["FinancialNewsReport"]["sections"][current_section][current_subsection]["references"].append({
                    "source": line.split(". ")[1],
                    "url": line.split(". ")[-1]
                })
        elif line.startswith("(") and "url" in line:
            if current_subsection:
                json_data["FinancialNewsReport"]["sections"][current_section][current_subsection]["references"].append({
                    "source": line.split(" ")[1].strip("(").strip(")"),
                    "url": line.split(" ")[-1].strip(")")
                })
        else:
            if current_subsection:
                if json_data["FinancialNewsReport"]["sections"][current_section][current_subsection]["summary"] == "":
                    json_data["FinancialNewsReport"]["sections"][current_section][current_subsection]["summary"] = line
                else:
                    json_data["FinancialNewsReport"]["sections"][current_section][current_subsection]["details"].append(line)
            elif current_section:
                if json_data["FinancialNewsReport"]["sections"][current_section].get("summary", "") == "":
                    json_data["FinancialNewsReport"]["sections"][current_section]["summary"] = line
                else:
                    json_data["FinancialNewsReport"]["sections"][current_section].setdefault("details", []).append(line)

    return json_data

def convert_json_to_string(json_data):
    json_formatted_str = json.dumps(json_data, indent=2)
    # print(json_formatted_str)
    return json_formatted_str

if __name__ == "__main__":
    md_text = read_markdown_file("research_report.txt")
    convert_json_to_string(md_text)