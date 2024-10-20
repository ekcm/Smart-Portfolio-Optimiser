from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie


# Create a PDF file
def generate_pdf(filename):
    # Create the PDF document
    pdf = SimpleDocTemplate(filename, pagesize=A4)

    # Set up styles for headings and body text
    styles = getSampleStyleSheet()
    heading_style = styles['Heading1']
    body_style = styles['BodyText']

    # Add heading and body text
    heading = Paragraph("Portfolio report for Portfolio1", heading_style)
    body_text = Paragraph("Portfolio changes.", body_style)

    # Create a table with sample data
    data = [
        ["ID", "Asset", "Asset Quantity", "Asset Value Change"],
        ["1", "AAPL", "10", "+$5000"],
        ["2", "GS", "20", "+$2000"],
        ["3", "JPM", "30", "+$3000"],
    ]
    
    # Create the table object
    table = Table(data)
    table.hAlign = 'LEFT'
    
    # Style the table
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.red),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    pie_text = Paragraph("Asset Allocation some gibberish", body_style)

    drawing = Drawing(400, 200)
    pie_chart = Pie()
    
    # Sample pie chart data
    pie_chart.data = [5000, 2000, 3000]
    pie_chart.labels = ['AAPL', 'GS', 'JPM']

    # Set pie chart position and size
    pie_chart.x = 50
    pie_chart.y = 50
    pie_chart.width = 150
    pie_chart.height = 150
    
    # Customize chart colors
    pie_chart.slices[0].fillColor = colors.blue
    pie_chart.slices[1].fillColor = colors.green
    pie_chart.slices[2].fillColor = colors.red

    drawing.hAlign = 'LEFT'

    drawing.add(pie_chart)


    # Build the PDF with the heading, body, and table
    elements = [heading, body_text, table, pie_text, drawing]
    pdf.build(elements)


if __name__ == "__main__":
  generate_pdf("output.pdf")