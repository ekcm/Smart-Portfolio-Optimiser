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
from datetime import datetime
import requests
import os

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

@app.get("/trade_executions")
def generate_trade_executions():
    with open("data.json", "r") as f:
        data = json.load(f)

        pie_chart_fillColors = [colors.blue, colors.green, colors.red, colors.orange, colors.purple, colors.yellow, colors.pink, colors.cyan, colors.brown, colors.grey]

        pdf_buffer = io.BytesIO()
        pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4)

        # Set up styles for headings and body text
        styles = getSampleStyleSheet()
        h1_heading_style = styles['Heading1']
        h2_heading_style = styles['Heading2']
        body_style = styles['BodyText']

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
            trade_execution_heading,
            trade_execution_body,
            trade_execution_table
        ]
        pdf.build(elements)

        pdf_buffer.seek(0)

        current_date = datetime.now().strftime("%d/%m/%y")
        filename = f"{data['portfolio_details']['portfolio_name']}_trade_executions_{current_date}.pdf"
        
        directory = os.path.dirname(filename)
        if not os.path.exists(directory):
            os.makedirs(directory)

        with open(filename, "wb") as output_pdf:
            output_pdf.write(pdf_buffer.read())

        headers = {
            'Content-Disposition': f'attachment; filename={filename}'
        }
        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)

@app.get("/report")
def generate_report(id: str):
    url = f"http://localhost:8000/report/{id}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        # print(data)
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP error occurred: {e}"}

    pie_chart_fillColors = [colors.blue, colors.green, colors.red, colors.orange, colors.purple, colors.yellow, colors.pink, colors.cyan, colors.brown, colors.grey, colors.beige, colors.black, colors.whitesmoke, colors.lightgrey, colors.darkgrey]
    pdf_buffer = io.BytesIO()
    pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4)

    # Set up styles for headings and body text
    styles = getSampleStyleSheet()
    h1_heading_style = styles['Heading1']
    h2_heading_style = styles['Heading2']
    body_style = styles['BodyText']

    # print(data['portfolioDetails']['portfolioName'])
    portfolio_report_heading = Paragraph(f"Portfolio report for {data['portfolioDetails']['portfolioName']}", h1_heading_style)
    
    # Portfolio Summary
    portfolio_summary_heading = Paragraph("Assets Allocation", h2_heading_style)
    portfolio_summary_data = data['portfolioSummary']

    # Asset Allocation
    assets_allocation_data = portfolio_summary_data['assetsAllocation']
    assets_name_list = list(assets_allocation_data.keys())
    assets_allocation_list = list(assets_allocation_data.values())

    assets_allocation_summary_data = [["ID", "Asset Ticker", "Cost", "Quantity", "Asset Type"]]

    count = 1
    for asset in assets_allocation_data.values():
        assets_allocation_summary_data.append([count, asset['ticker'], round(asset['cost'],2), asset['quantity'], asset['assetType']])
        count += 1

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

    # Top Holdings
    top_holdings_by_weight_heading = Paragraph("Top Holdings by Weight", h2_heading_style)
    top_holdings_data = portfolio_summary_data['topHoldings']

    top_holdings_drawing = Drawing(400, 200)
    top_holdings_by_weight_pie_chart = Pie()
    top_holdings_by_weight_pie_chart.data = list(top_holdings_data.values())
    top_holdings_by_weight_pie_chart.labels = list(top_holdings_data.keys())
    top_holdings_by_weight_pie_chart.x = 50
    top_holdings_by_weight_pie_chart.y = 50
    top_holdings_by_weight_pie_chart.width = 150
    top_holdings_by_weight_pie_chart.height = 150

    for i in range(len(top_holdings_by_weight_pie_chart.data)):
        top_holdings_by_weight_pie_chart.slices[i].fillColor = pie_chart_fillColors[i]
    top_holdings_drawing.hAlign = 'LEFT'
    top_holdings_drawing.add(top_holdings_by_weight_pie_chart)

    # Sector Allocation
    sector_allocation_heading = Paragraph("Sector Allocation", h2_heading_style)
    sector_allocation_data = portfolio_summary_data['sectorAllocation']

    print(sector_allocation_data)
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

    elements = [
        portfolio_report_heading,
        portfolio_summary_heading,
        assets_allocation_table,
        top_holdings_by_weight_heading,
        top_holdings_drawing,
        sector_allocation_heading,
        sector_allocation_drawing,
    ]

    pdf.build(elements)
    pdf_buffer.seek(0)

    current_date = datetime.now().strftime("%d/%m/%y")
    filename = f"{data['portfolioDetails']['portfolioName']}_{current_date}.pdf"
    
    # directory = os.path.dirname(filename)
    # if not os.path.exists(directory):
    #     os.makedirs(directory)

    # with open(filename, "wb") as output_pdf:
    #     output_pdf.write(pdf_buffer.read())

    headers = {
        'Content-Disposition': f'attachment; filename={filename}'
    }
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)

if __name__ == "__main__":
    uvicorn.run("report:app", host='127.0.0.1', port=5002, reload=True)