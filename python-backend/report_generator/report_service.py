from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import io
from datetime import datetime
import requests
import os
from pymongo import MongoClient
from datetime import datetime, timezone
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path="../.env")
uri = os.getenv("MONGO_URI")

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

def get_latest_market_commentary():
    try:
        client = MongoClient(uri)
        database = client.get_database("FYP-Test-DB")
        collection = database.get_collection("MarketCommentary")

        # Get the latest document by date
        latest_commentary = collection.find_one(
            {},
            sort=[('date', -1)]  # Sort by date in descending order
        )
        
        if latest_commentary:
            # Convert MongoDB ObjectId to string for JSON serialization
            latest_commentary['_id'] = str(latest_commentary['_id'])
            return latest_commentary
        return None
    except Exception as e:
        return {"error": str(e)}
    
def generate_positions_summary(assets_allocation_data):
    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": 
            '''
            You are a financial analyst. 
            You are given a list of assets and their allocation in a portfolio.
            You are to highlight any significant changes in the portfolio.
            Use less than 100 words.
            ''' 
            },
            {"role": "user", "content": f"Assets Allocation: {assets_allocation_data}"}
        ],
        temperature=0,
    )
    return response.choices[0].message.content

@app.get("/trade_executions")
def generate_trade_executions(id: str, startDate: str, endDate: str):
    url = f"http://localhost:8000/report/order/date?id={id}&startDate={startDate}&endDate={endDate}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        # Create PDF
        pdf_buffer = io.BytesIO()
        pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
        
        # Set up styles for headings and body text
        styles = getSampleStyleSheet()
        h1_heading_style = styles['Heading1']
        h1_heading_style.fontSize = 24
        h1_heading_style.spaceAfter = 30
        h1_heading_style.textColor = colors.black
        h1_heading_style.alignment = 1  # Center alignment

        h2_heading_style = styles['Heading2']
        h2_heading_style.fontSize = 18
        h2_heading_style.spaceBefore = 20
        h2_heading_style.spaceAfter = 20
        h2_heading_style.textColor = colors.black

        body_style = styles['BodyText']
        body_style.fontSize = 12
        body_style.leading = 16
        body_style.textColor = colors.black
        
        # Create elements for the PDF
        elements = []
        
        # Add heading
        heading = Paragraph(f"Trade Executions Report ({startDate} to {endDate})", h1_heading_style)
        elements.append(heading)
        elements.append(Spacer(1, 20))
        
        # Create table data
        table_data = [["Date", "Order Type", "Asset", "Quantity", "Price", "Order Status"]]
        # Sort trades by orderDate
        sorted_trades = sorted(data, key=lambda x: x.get('orderDate', '') if x.get('orderDate') else '')
        
        for trade in sorted_trades:
            table_data.append([
                datetime.strptime(trade.get('orderDate', ''), '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%d/%m/%y') if trade.get('orderDate') else '',
                trade.get('orderType', ''),
                trade.get('assetName', ''),
                trade.get('quantity', ''),
                f"${round(trade.get('price', 0), 2):,.2f}",
                trade.get('orderStatus', '')
            ])
        
        # Create and style the table
        trade_table = Table(table_data, colWidths=[60, 80, 100, 80, 100, 80])
        trade_table.hAlign = 'CENTER'
        trade_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.red),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#ECF0F1')),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8F9F9')]),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        
        elements.append(trade_table)
        
        # Build PDF
        pdf.build(elements)
        pdf_buffer.seek(0)
        
        # Generate filename
        current_date = datetime.now().strftime("%d_%m_%y")
        filename = f"trade_executions_{current_date}.pdf"
        
        headers = {
            'Content-Disposition': f'attachment; filename={filename}'
        }
        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)
        
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP error occurred: {e}"}

@app.get("/report")
def generate_report(id: str):
    url = f"http://localhost:8000/report/{id}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP error occurred: {e}"}

    pie_chart_fillColors = [colors.HexColor('#2E86C1'), colors.HexColor('#28B463'), colors.HexColor('#E74C3C'), 
                           colors.HexColor('#F39C12'), colors.HexColor('#8E44AD'), colors.HexColor('#F1C40F'),
                           colors.HexColor('#E67E22'), colors.HexColor('#16A085'), colors.HexColor('#95A5A6'),
                           colors.HexColor('#34495E'), colors.HexColor('#D35400'), colors.HexColor('#2ECC71'),
                           colors.HexColor('#E74C3C'), colors.HexColor('#9B59B6'), colors.HexColor('#1ABC9C')]
    
    pdf_buffer = io.BytesIO()
    pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)

    # Set up styles for headings and body text
    styles = getSampleStyleSheet()
    h1_heading_style = styles['Heading1']
    h1_heading_style.fontSize = 24
    h1_heading_style.spaceAfter = 30
    h1_heading_style.textColor = colors.black
    h1_heading_style.alignment = 1  # Center alignment

    h2_heading_style = styles['Heading2']
    h2_heading_style.fontSize = 18
    h2_heading_style.spaceBefore = 20
    h2_heading_style.spaceAfter = 20
    h2_heading_style.textColor = colors.black

    body_style = styles['BodyText']
    body_style.fontSize = 12
    body_style.leading = 16
    body_style.textColor = colors.black

    portfolio_report_heading = Paragraph(f"Portfolio Report for {data['portfolioDetails']['portfolioName']}", h1_heading_style)
    
    # Portfolio Summary
    portfolio_summary_heading = Paragraph("Assets Allocation", h2_heading_style)
    portfolio_summary_data = data['portfolioSummary']

    # Asset Allocation
    assets_allocation_data = portfolio_summary_data['assetsAllocation']
    assets_name_list = list(assets_allocation_data.keys())
    assets_allocation_list = list(assets_allocation_data.values())

    assets_allocation_summary_data = [["ID", "Asset Ticker", "Cost", "Last", "Quantity", "Asset Type", "Weight"]]

    # Convert dictionary values to list and sort by positionRatio (weight) in descending order
    sorted_assets = sorted(assets_allocation_data.values(), key=lambda x: x['positionRatio'], reverse=True)
    
    # Process top 10 assets
    for i, asset in enumerate(sorted_assets[:10], 1):
        assets_allocation_summary_data.append([
            i, 
            asset['ticker'], 
            f"${round(asset['cost'],2):,.2f}", 
            f"${round(asset['last'],2):,.2f}", 
            asset['quantity'], 
            asset['assetType'], 
            f"{round(asset['positionRatio']*100,2)}%"
        ])
    
    # Calculate and add "Others" if there are more than 10 assets
    if len(sorted_assets) > 10:
        others_ratio = sum(asset['positionRatio'] for asset in sorted_assets[10:])
        assets_allocation_summary_data.append([
            11, 
            "Others", 
            "—", 
            "—", 
            "—", 
            "—", 
            f"{round(others_ratio*100,2)}%"
        ])

    assets_allocation_table = Table(assets_allocation_summary_data, colWidths=[40, 80, 100, 80, 100])
    assets_allocation_table.hAlign = 'CENTER'
    assets_allocation_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.red),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),  # Set text color to black for data rows
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#ECF0F1')),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8F9F9')]),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    positions_summary = generate_positions_summary(assets_allocation_data)
    positions_summary_paragraph = Paragraph(positions_summary, body_style)

    # Top Holdings
    top_holdings_by_weight_heading = Paragraph("Top Holdings by Weight", h2_heading_style)
    top_holdings_data = portfolio_summary_data['topHoldings']

    top_holdings_drawing = Drawing(500, 250)
    top_holdings_by_weight_pie_chart = Pie()
    top_holdings_by_weight_pie_chart.data = list(top_holdings_data.values())
    top_holdings_by_weight_pie_chart.labels = [f"{k} ({v*100:.2f}%)" for k, v in top_holdings_data.items()]
    top_holdings_by_weight_pie_chart.x = 150
    top_holdings_by_weight_pie_chart.y = 0
    top_holdings_by_weight_pie_chart.width = 200
    top_holdings_by_weight_pie_chart.height = 200
    top_holdings_by_weight_pie_chart.sideLabels = True
    top_holdings_by_weight_pie_chart.simpleLabels = False

    for i in range(len(top_holdings_by_weight_pie_chart.data)):
        top_holdings_by_weight_pie_chart.slices[i].fillColor = pie_chart_fillColors[i]
    top_holdings_drawing.hAlign = 'CENTER'
    top_holdings_drawing.add(top_holdings_by_weight_pie_chart)

    # Sector Allocation
    sector_allocation_heading = Paragraph("Sector Allocation", h2_heading_style)
    sector_allocation_data = portfolio_summary_data['sectorAllocation']

    sector_allocation_drawing = Drawing(500, 250)
    sector_allocation_pie_chart = Pie()
    sector_allocation_pie_chart.data = list(sector_allocation_data.values())
    sector_allocation_pie_chart.labels = [f"{k} ({v:.1f}%)" for k, v in sector_allocation_data.items()]
    sector_allocation_pie_chart.x = 150
    sector_allocation_pie_chart.y = 0
    sector_allocation_pie_chart.width = 200
    sector_allocation_pie_chart.height = 200
    sector_allocation_pie_chart.sideLabels = True
    sector_allocation_pie_chart.simpleLabels = False

    for i in range(len(sector_allocation_pie_chart.data)):
        sector_allocation_pie_chart.slices[i].fillColor = pie_chart_fillColors[i]
    sector_allocation_drawing.hAlign = 'CENTER'
    sector_allocation_drawing.add(sector_allocation_pie_chart)

    market_commentary = get_latest_market_commentary()
    if market_commentary:
        market_commentary_heading = Paragraph("Market Commentary", h2_heading_style)
        market_commentary_paragraph = Paragraph(market_commentary['market_commentary'], body_style)

    elements = [
        portfolio_report_heading,
        Spacer(1, 20),
        portfolio_summary_heading,
        assets_allocation_table,
        positions_summary_paragraph,
        Spacer(1, 30),
        top_holdings_by_weight_heading,
        top_holdings_drawing,
        Spacer(1, 20),
        sector_allocation_heading,
        sector_allocation_drawing,
        Spacer(1, 20),
        market_commentary_heading,
        market_commentary_paragraph
    ]

    pdf.build(elements)
    pdf_buffer.seek(0)

    current_date = datetime.now().strftime("%d_%m_%y")
    filename = f"{data['portfolioDetails']['portfolioName']}_{current_date}.pdf"

    headers = {
        'Content-Disposition': f'attachment; filename={filename}'
    }
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)

if __name__ == "__main__":
    uvicorn.run("report:app", host='127.0.0.1', port=5002, reload=True)