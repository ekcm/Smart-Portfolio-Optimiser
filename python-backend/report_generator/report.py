from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
import json

def generate():
    with open("data.json", "r") as f:
        data = json.load(f)

    pie_chart_fillColors = [colors.blue, colors.green, colors.red, colors.orange, colors.purple, colors.yellow, colors.pink, colors.cyan, colors.brown, colors.grey]

    # Create the PDF document
    filename = "output.pdf"
    pdf = SimpleDocTemplate(filename, pagesize=A4)

    # Set up styles for headings and body text
    styles = getSampleStyleSheet()
    portfolio_heading_style = styles['Heading1']
    heading_style = styles['Heading2']
    body_style = styles['BodyText']

    # print(data['portfolio_details']['portfolio_name'])
    heading = Paragraph(f"Portfolio report for {data['portfolio_details']['portfolio_name']}", portfolio_heading_style)

    # Porfolio Summary
    portfolio_summary_heading = Paragraph("Portfolio Summary", heading_style)
    portfolio_summary_data = data['portfolio_summary']

    # asset_allocation
    assets_allocation_data = portfolio_summary_data['assets_allocation']
    assets_name_list = list(assets_allocation_data.keys())
    assets_allocation_list = list(assets_allocation_data.values())
    assets_allocation_summary_data = [["ID", "Asset Name", "Asset Allocation"]]
    for i in range(len(assets_name_list)):
        assets_allocation_summary_data.append([i+1, list(assets_name_list)[i], list(assets_allocation_list)[i]])

    assets_allocation_table = Table(assets_allocation_summary_data)
    assets_allocation_table.hAlign = 'LEFT'
    assets_allocation_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.red),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    # top holdings by weight
    top_holdings_by_weight_heading = Paragraph("Top Holdings by Weight", heading_style)
    top_holdings_by_weight_data = portfolio_summary_data['top_holdings_by_weight']

    drawing = Drawing(400, 200)
    top_holdings_by_weight_pie_chart = Pie()
    top_holdings_by_weight_pie_chart.data = list(top_holdings_by_weight_data.values())
    top_holdings_by_weight_pie_chart.labels = list(top_holdings_by_weight_data.keys())
    top_holdings_by_weight_pie_chart.x = 50
    top_holdings_by_weight_pie_chart.y = 50
    top_holdings_by_weight_pie_chart.width = 150
    top_holdings_by_weight_pie_chart.height = 150

    for i in range(len(top_holdings_by_weight_pie_chart.data)):
        top_holdings_by_weight_pie_chart.slices[i].fillColor = pie_chart_fillColors[i]
    drawing.hAlign = 'LEFT'
    drawing.add(top_holdings_by_weight_pie_chart)

    elements = [heading, portfolio_summary_heading, assets_allocation_table, top_holdings_by_weight_heading, drawing]
    pdf.build(elements)

if __name__ == "__main__":
    generate()