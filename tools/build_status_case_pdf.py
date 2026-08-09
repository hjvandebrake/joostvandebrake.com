from pathlib import Path
from shutil import copyfile

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "mtm-status-reentry-mini-case.pdf"
WEB_COPY = ROOT / "assets" / "downloads" / "mtm-status-reentry-mini-case.pdf"

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm

INK = HexColor("#17343B")
TEAL = HexColor("#236B69")
RUST = HexColor("#A44A3F")
CREAM = HexColor("#F7F1E8")
PALE_TEAL = HexColor("#E4EFEC")
PALE_RUST = HexColor("#F3E3DE")
PAPER = HexColor("#FFFDFC")
MUTED = HexColor("#5D6C6E")
LINE = HexColor("#D9D2C8")


def register_fonts():
    pdfmetrics.registerFont(TTFont("Georgia", r"C:\Windows\Fonts\georgia.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", r"C:\Windows\Fonts\georgiab.ttf"))
    pdfmetrics.registerFont(TTFont("Arial", r"C:\Windows\Fonts\arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Bold", r"C:\Windows\Fonts\arialbd.ttf"))


STYLES = {
    "kicker": ParagraphStyle(
        "kicker", fontName="Arial-Bold", fontSize=8.2, leading=10,
        textColor=RUST, spaceAfter=0, uppercase=True,
    ),
    "title": ParagraphStyle(
        "title", fontName="Georgia-Bold", fontSize=27, leading=31,
        textColor=INK, spaceAfter=0,
    ),
    "subtitle": ParagraphStyle(
        "subtitle", fontName="Georgia", fontSize=11, leading=15,
        textColor=MUTED, spaceAfter=0,
    ),
    "body": ParagraphStyle(
        "body", fontName="Arial", fontSize=9.4, leading=13.2,
        textColor=INK, spaceAfter=0,
    ),
    "body_small": ParagraphStyle(
        "body_small", fontName="Arial", fontSize=8.2, leading=11.2,
        textColor=MUTED, spaceAfter=0,
    ),
    "box_title": ParagraphStyle(
        "box_title", fontName="Arial-Bold", fontSize=9.6, leading=12,
        textColor=INK, spaceAfter=0,
    ),
    "question": ParagraphStyle(
        "question", fontName="Georgia-Bold", fontSize=12, leading=15,
        textColor=INK, spaceAfter=0,
    ),
    "option": ParagraphStyle(
        "option", fontName="Arial", fontSize=8.2, leading=10.4,
        textColor=INK, leftIndent=0, spaceAfter=0,
    ),
    "discussion": ParagraphStyle(
        "discussion", fontName="Arial", fontSize=9.2, leading=12.4,
        textColor=INK, leftIndent=7 * mm, firstLineIndent=-7 * mm,
    ),
}


def paragraph(c, text, style_name, x, top, width, max_height=100 * mm):
    item = Paragraph(text, STYLES[style_name])
    used_w, used_h = item.wrap(width, max_height)
    item.drawOn(c, x, top - used_h)
    return top - used_h


def rounded_box(c, x, y, width, height, fill, stroke=LINE, radius=4 * mm):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.7)
    c.roundRect(x, y, width, height, radius, fill=1, stroke=1)


def page_footer(c, page_no):
    y = 11 * mm
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(MARGIN, y + 5 * mm, PAGE_W - MARGIN, y + 5 * mm)
    c.setFillColor(MUTED)
    c.setFont("Arial", 7.2)
    c.drawString(MARGIN, y, "Joost van de Brake | MTM Status Re-entry Mini-case | Version 1.0 | 9 August 2026")
    c.drawRightString(PAGE_W - MARGIN, y, str(page_no))


def brand_flag(c, page_label):
    c.setFillColor(TEAL)
    c.roundRect(PAGE_W - MARGIN - 55 * mm, PAGE_H - 28 * mm, 55 * mm, 11 * mm, 2 * mm, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Arial-Bold", 7.4)
    c.drawString(PAGE_W - MARGIN - 50.5 * mm, PAGE_H - 23.4 * mm, "NWO VENI  VI.Veni.211E.027")
    c.setFont("Arial", 7.2)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 34 * mm, page_label)


def draw_page_one(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(RUST)
    c.rect(0, PAGE_H - 8 * mm, PAGE_W, 8 * mm, fill=1, stroke=0)
    brand_flag(c, "STUDENT HANDOUT | 12-15 MINUTES")

    top = PAGE_H - 22 * mm
    paragraph(c, "MULTIPLE TEAM MEMBERSHIP | MINI-CASE", "kicker", MARGIN, top, 95 * mm)
    top -= 12 * mm
    top = paragraph(c, "The returning specialist", "title", MARGIN, top, 128 * mm)
    top -= 3 * mm
    top = paragraph(
        c,
        "How should a leader handle status inconsistency when someone returns from a prominent outside team?",
        "subtitle", MARGIN, top, 148 * mm,
    )
    top -= 8 * mm

    story_x = MARGIN
    story_w = 111 * mm
    side_x = story_x + story_w + 7 * mm
    side_w = PAGE_W - MARGIN - side_x

    story_top = top
    story_top = paragraph(
        c,
        "Maya is a data specialist in the Atlas product team. Inside Atlas, she is respected but occupies a middle position: the product lead and two senior engineers usually shape the major decisions. For six weeks, Maya also joins Helix, a prominent client taskforce. Her expertise is scarce there. The client chair asks for her judgment directly, and several recommendations carry her name.",
        "body", story_x, story_top, story_w,
    )
    story_top -= 4.2 * mm
    story_top = paragraph(
        c,
        "When Maya returns to Atlas, her formal role has not changed. The product lead welcomes her back, briefly praises the prestigious assignment, and asks her to resume routine reporting. Maya starts mentioning how Helix handled similar problems. Some Atlas colleagues are interested; others hear an implicit claim that the outside team valued her more. Meanwhile, her colleague Ruben is struggling to translate a customer-data pattern into a product recommendation.",
        "body", story_x, story_top, story_w,
    )
    story_top -= 4.2 * mm
    story_top = paragraph(
        c,
        "The product lead has ten minutes before the weekly planning meeting. The question is not whether Maya deserves a promotion. It is how to design her return so that outside experience becomes useful to Atlas without turning recognition into a direct status contest.",
        "body", story_x, story_top, story_w,
    )

    box_y = 86 * mm
    rounded_box(c, side_x, box_y, side_w, 91 * mm, PALE_TEAL, stroke=TEAL)
    y = box_y + 84 * mm
    y = paragraph(c, "YOUR TASK", "kicker", side_x + 5 * mm, y, side_w - 10 * mm)
    y -= 3 * mm
    y = paragraph(c, "What should the product lead do first?", "question", side_x + 5 * mm, y, side_w - 10 * mm)
    y -= 5 * mm
    options = [
        ("A", "Highlight Maya's prestigious taskforce publicly."),
        ("B", "Give Maya a visible solo assignment."),
        ("C", "Pair Maya with Ruben on a usable recommendation."),
        ("D", "Treat the return as routine and leave Helix unspoken."),
    ]
    for letter, option in options:
        c.setStrokeColor(TEAL)
        c.setLineWidth(0.8)
        c.circle(side_x + 8 * mm, y - 2.2 * mm, 2.6 * mm, fill=0, stroke=1)
        c.setFillColor(TEAL)
        c.setFont("Arial-Bold", 7.2)
        c.drawCentredString(side_x + 8 * mm, y - 3.1 * mm, letter)
        y = paragraph(c, option, "option", side_x + 13 * mm, y, side_w - 18 * mm)
        y -= 3 * mm

    prompt_y = 50 * mm
    rounded_box(c, MARGIN, prompt_y, PAGE_W - 2 * MARGIN, 34 * mm, CREAM)
    x = MARGIN + 6 * mm
    y = prompt_y + 27 * mm
    y = paragraph(c, "FIRST, MAP THE CONFIGURATION", "kicker", x, y, PAGE_W - 2 * MARGIN - 12 * mm)
    y -= 2.5 * mm
    y = paragraph(
        c,
        "Do not begin with Maya's number of team memberships. Identify instead: (1) her relative position in Atlas and Helix, (2) the prominence of the outside team, (3) what travelled back with her, and (4) whose current work could benefit.",
        "body", x, y, PAGE_W - 2 * MARGIN - 12 * mm,
    )

    page_footer(c, 1)
    c.showPage()


def draw_page_two(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(0, PAGE_H - 8 * mm, PAGE_W, 8 * mm, fill=1, stroke=0)
    brand_flag(c, "DISCUSSION WORKSHEET")

    top = PAGE_H - 22 * mm
    paragraph(c, "FROM STATUS COMPARISON TO TEAMMATE VALUE", "kicker", MARGIN, top, 120 * mm)
    top -= 12 * mm
    top = paragraph(c, "Designing the re-entry", "title", MARGIN, top, 130 * mm)
    top -= 4 * mm
    paragraph(
        c,
        "Use the questions below to test your choice. The aim is not to diagnose Maya, but to redesign the transition around observable work.",
        "subtitle", MARGIN, top, 150 * mm,
    )

    questions = [
        "1. Where does Maya occupy higher and lower relative status, and compared with whom?",
        "2. Why might a status difference make recognition in Atlas less self-evident?",
        "3. What contribution could Maya make that another Atlas member can use immediately?",
        "4. Which response turns her outside experience into value for Atlas rather than a direct status claim?",
        "5. What evidence would be needed before claiming that status inconsistency caused Maya's behavior?",
    ]
    start_y = 197 * mm
    box_h = 24.3 * mm
    for index, question in enumerate(questions):
        y = start_y - index * 27.4 * mm
        rounded_box(c, MARGIN, y, PAGE_W - 2 * MARGIN, box_h, white, stroke=LINE, radius=2.6 * mm)
        paragraph(c, question, "discussion", MARGIN + 5 * mm, y + 18.5 * mm, PAGE_W - 2 * MARGIN - 10 * mm)
        c.setStrokeColor(Color(0.36, 0.42, 0.43, alpha=0.38))
        c.setLineWidth(0.45)
        c.line(MARGIN + 12 * mm, y + 6.5 * mm, PAGE_W - MARGIN - 7 * mm, y + 6.5 * mm)

    note_y = 35 * mm
    rounded_box(c, MARGIN, note_y, PAGE_W - 2 * MARGIN, 31 * mm, PALE_RUST, stroke=RUST)
    x = MARGIN + 6 * mm
    y = note_y + 24 * mm
    y = paragraph(c, "RESEARCH NOTE", "kicker", x, y, 55 * mm)
    y -= 2 * mm
    paragraph(
        c,
        "This teaching case is informed by a current manuscript under review at Organization Science. The evidence comes from 692 return episodes in professional football: larger focal-versus-referent status differences were associated with more opportunities created for teammates, especially when the referent team was prominent. The study is observational. This organizational scenario is a teaching adaptation, not an additional study, and it does not establish causality.",
        "body_small", x, y, PAGE_W - 2 * MARGIN - 12 * mm,
    )

    c.setFillColor(MUTED)
    c.setFont("Arial", 7.2)
    c.drawString(MARGIN, 27.5 * mm, "Evidence link: https://osf.io/esg7p/?view_only=7e898bf9fec24336b081e5c1e4b5ac10")
    c.drawString(MARGIN, 23.5 * mm, "Developed as part of the NWO Veni project 'The consequences of working in multiple teams at the same time'.")
    c.drawString(MARGIN, 19.5 * mm, "Funded by the Dutch Research Council (NWO), grant VI.Veni.211E.027. NWO did not evaluate or endorse this teaching adaptation.")

    page_footer(c, 2)
    c.showPage()


def build():
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    WEB_COPY.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("The Returning Specialist - MTM Status Re-entry Mini-case")
    c.setAuthor("Joost van de Brake")
    c.setSubject("Multiple team membership, status inconsistency, and re-entry")
    c.setCreator("Joost van de Brake | NWO Veni VI.Veni.211E.027")
    draw_page_one(c)
    draw_page_two(c)
    c.save()
    copyfile(OUTPUT, WEB_COPY)
    print(OUTPUT)
    print(WEB_COPY)


if __name__ == "__main__":
    build()
