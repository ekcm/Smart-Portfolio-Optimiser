from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import io

app = FastAPI()

# Allow all origins
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def generate():
    # should be replaced with data from api endpoint
    with open("data.json", "r") as f:
        data = json.load(f)

    pie_chart_fillColors = [colors.blue, colors.green, colors.red, colors.orange, colors.purple, colors.yellow, colors.pink, colors.cyan, colors.brown, colors.grey]

    # Create the PDF document
    filename = "output.pdf"

    pdf_buffer = io.BytesIO()
    pdf = SimpleDocTemplate(filename, pagesize=A4)

    # Set up styles for headings and body text
    styles = getSampleStyleSheet()
    h1_heading_style = styles['Heading1']
    h2_heading_style = styles['Heading2']
    body_style = styles['BodyText']

    # print(data['portfolio_details']['portfolio_name'])
    portfolio_report_heading = Paragraph(f"Portfolio report for {data['portfolio_details']['portfolio_name']}", h1_heading_style)

    # Porfolio Summary
    portfolio_summary_heading = Paragraph("Assets Allocation", h2_heading_style)
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
    top_holdings_by_weight_heading = Paragraph("Top Holdings by Weight", h2_heading_style)
    top_holdings_by_weight_data = portfolio_summary_data['top_holdings_by_weight']

    top_holdings_drawing = Drawing(400, 200)
    top_holdings_by_weight_pie_chart = Pie()
    top_holdings_by_weight_pie_chart.data = list(top_holdings_by_weight_data.values())
    top_holdings_by_weight_pie_chart.labels = list(top_holdings_by_weight_data.keys())
    top_holdings_by_weight_pie_chart.x = 50
    top_holdings_by_weight_pie_chart.y = 50
    top_holdings_by_weight_pie_chart.width = 150
    top_holdings_by_weight_pie_chart.height = 150

    for i in range(len(top_holdings_by_weight_pie_chart.data)):
        top_holdings_by_weight_pie_chart.slices[i].fillColor = pie_chart_fillColors[i]
    top_holdings_drawing.hAlign = 'LEFT'
    top_holdings_drawing.add(top_holdings_by_weight_pie_chart)

    # sector allocation
    sector_allocation_heading = Paragraph("Sector Allocation", h2_heading_style)
    sector_allocation_data = portfolio_summary_data['sector_allocation']

    sector_allocation_drawing = Drawing(400, 200)
    sector_allocation_pie_chart = Pie()
    sector_allocation_pie_chart.data = list(sector_allocation_data.values())
    sector_allocation_pie_chart.labels = list(sector_allocation_data.keys())
    sector_allocation_pie_chart.x = 50
    sector_allocation_pie_chart.y = 50
    sector_allocation_pie_chart.width = 150
    sector_allocation_pie_chart.height = 150

    for i in range(len(sector_allocation_pie_chart.data)):
        sector_allocation_pie_chart.slices[i].fillColor = pie_chart_fillColors[i]
    sector_allocation_drawing.hAlign = 'LEFT'
    sector_allocation_drawing.add(sector_allocation_pie_chart)

    # commentary and market outlook
    commentary_heading = Paragraph("Commentary and Market Outlook", h2_heading_style)
    commentary_data = portfolio_summary_data["commentary_and_market_outlook"]
    commentary = Paragraph(commentary_data, body_style)

    # trade execution
    spacer = Spacer(1, 0.2 * inch)
    trade_execution_heading = Paragraph("Trade Execution", h1_heading_style)

    trade_execution_time_period = data['trade_execution_summary']['time_period']
    trade_execution_performance = data['trade_execution_summary']['execution_performance']
    trade_execution_body = Paragraph(f"The following are the trade executions for the portfolio conducted between {trade_execution_time_period}. During this time period, the trades conducted had an execution performance of {trade_execution_performance}", body_style)

    # trade execution transactions
    trade_execution_data = data['trade_execution_summary']
    trade_execution_transactions = trade_execution_data['transactions']

    trade_execution_table_data = [["ID", "Asset Name", "Direction", "Quantity", "Price"]]
    for i in range(len(trade_execution_transactions)):
        trade_execution_table_data.append([i+1, trade_execution_transactions[i]['asset'], trade_execution_transactions[i]['direction'], trade_execution_transactions[i]['quantity'], trade_execution_transactions[i]['strike_price']])

    trade_execution_table = Table(trade_execution_table_data)
    trade_execution_table.hAlign = 'LEFT'
    trade_execution_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.red),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    elements = [
        portfolio_report_heading,
        portfolio_summary_heading,
        assets_allocation_table,
        top_holdings_by_weight_heading,
        top_holdings_drawing,
        sector_allocation_heading,
        sector_allocation_drawing,
        commentary_heading,
        commentary,
        spacer,
        trade_execution_heading,
        trade_execution_body,
        trade_execution_table
    ]
    pdf.build(elements)

    pdf_buffer.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename=output.pdf'
    }
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)


if __name__ == "__main__":
    uvicorn.run("report:app", host='127.0.0.1', port=5002, reload=True)