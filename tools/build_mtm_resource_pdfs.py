from html import escape
from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    LongTable,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
WEB_DIR = ROOT / "assets" / "downloads"

PAGE_W, PAGE_H = A4
LEFT = 18 * mm
RIGHT = 18 * mm
TOP = 24 * mm
BOTTOM = 20 * mm

RED = HexColor("#963f2d")
RED_DARK = HexColor("#753022")
RED_SOFT = HexColor("#f6e9e4")
TEAL = HexColor("#276c6c")
TEAL_DARK = HexColor("#1d5051")
TEAL_SOFT = HexColor("#e4f0ed")
GREEN = HexColor("#2e6a4c")
GREEN_SOFT = HexColor("#e7f1eb")
INK_950 = HexColor("#181a1f")
INK_900 = HexColor("#22242a")
INK_700 = HexColor("#444851")
INK_600 = HexColor("#5b606a")
INK_500 = HexColor("#717680")
INK_300 = HexColor("#bfc1c5")
INK_200 = HexColor("#d9d9d7")
INK_100 = HexColor("#f1efeb")
WARM = HexColor("#f8f7f4")
WHITE = colors.white


def register_fonts():
    pdfmetrics.registerFont(TTFont("Georgia", r"C:\Windows\Fonts\georgia.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", r"C:\Windows\Fonts\georgiab.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-Italic", r"C:\Windows\Fonts\georgiai.ttf"))
    pdfmetrics.registerFont(TTFont("Arial", r"C:\Windows\Fonts\arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Bold", r"C:\Windows\Fonts\arialbd.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Italic", r"C:\Windows\Fonts\ariali.ttf"))


def make_styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "Kicker",
            parent=base["Normal"],
            fontName="Arial-Bold",
            fontSize=7.8,
            leading=10,
            textColor=RED,
            spaceAfter=7,
            keepWithNext=True,
        ),
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Georgia-Bold",
            fontSize=26,
            leading=31,
            textColor=INK_950,
            alignment=TA_LEFT,
            spaceAfter=8,
            keepWithNext=True,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName="Georgia",
            fontSize=11.2,
            leading=16.2,
            textColor=INK_600,
            spaceAfter=15,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Georgia-Bold",
            fontSize=15.2,
            leading=19,
            textColor=INK_950,
            spaceBefore=10,
            spaceAfter=7,
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "H3",
            parent=base["Heading3"],
            fontName="Georgia-Bold",
            fontSize=11.2,
            leading=14.5,
            textColor=INK_950,
            spaceBefore=7,
            spaceAfter=5,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Arial",
            fontSize=9.5,
            leading=14,
            textColor=INK_700,
            spaceAfter=7.2,
        ),
        "body_small": ParagraphStyle(
            "BodySmall",
            parent=base["BodyText"],
            fontName="Arial",
            fontSize=8.4,
            leading=12.2,
            textColor=INK_600,
            spaceAfter=5,
        ),
        "quote": ParagraphStyle(
            "Quote",
            parent=base["BodyText"],
            fontName="Georgia-Italic",
            fontSize=9.8,
            leading=14.3,
            textColor=INK_700,
            leftIndent=7 * mm,
            rightIndent=5 * mm,
            borderColor=TEAL,
            borderWidth=0,
            borderPadding=0,
            spaceBefore=4,
            spaceAfter=9,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName="Arial",
            fontSize=9.2,
            leading=13.4,
            textColor=INK_700,
            leftIndent=5.5 * mm,
            firstLineIndent=-3.6 * mm,
            bulletIndent=0,
            spaceAfter=4.2,
        ),
        "numbered": ParagraphStyle(
            "Numbered",
            parent=base["BodyText"],
            fontName="Arial",
            fontSize=9.3,
            leading=13.5,
            textColor=INK_700,
            leftIndent=7 * mm,
            firstLineIndent=-5.2 * mm,
            spaceAfter=6,
        ),
        "box_title": ParagraphStyle(
            "BoxTitle",
            parent=base["Normal"],
            fontName="Arial-Bold",
            fontSize=8.2,
            leading=10.4,
            textColor=INK_950,
            spaceAfter=4,
            keepWithNext=True,
        ),
        "box_body": ParagraphStyle(
            "BoxBody",
            parent=base["Normal"],
            fontName="Arial",
            fontSize=8.6,
            leading=12.4,
            textColor=INK_700,
        ),
        "table_head": ParagraphStyle(
            "TableHead",
            parent=base["Normal"],
            fontName="Arial-Bold",
            fontSize=8,
            leading=10.5,
            textColor=WHITE,
        ),
        "table_body": ParagraphStyle(
            "TableBody",
            parent=base["Normal"],
            fontName="Arial",
            fontSize=8.3,
            leading=11.3,
            textColor=INK_700,
        ),
        "option_letter": ParagraphStyle(
            "OptionLetter",
            parent=base["Normal"],
            fontName="Georgia-Bold",
            fontSize=11,
            leading=14,
            textColor=WHITE,
            alignment=TA_CENTER,
        ),
        "option_body": ParagraphStyle(
            "OptionBody",
            parent=base["Normal"],
            fontName="Arial",
            fontSize=8.9,
            leading=12.6,
            textColor=INK_700,
        ),
        "citation": ParagraphStyle(
            "Citation",
            parent=base["Normal"],
            fontName="Arial",
            fontSize=7.8,
            leading=11.1,
            textColor=INK_500,
            spaceAfter=4,
        ),
    }


STYLES = {}


def para(text, style="body", raw=False):
    return Paragraph(text if raw else escape(text), STYLES[style])


def h2(text):
    return para(text, "h2")


def h3(text):
    return para(text, "h3")


def bullet_list(items):
    return [para(f"• {item}", "bullet") for item in items]


def numbered_list(items, start=1):
    return [para(f"{index}. {item}", "numbered") for index, item in enumerate(items, start=start)]


def title_block(kicker, title, subtitle, badge, tone=RED):
    badge_table = Table(
        [[para(badge.upper(), "table_head")]],
        colWidths=[46 * mm],
        hAlign="LEFT",
    )
    badge_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), tone),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return [
        badge_table,
        Spacer(1, 8 * mm),
        para(kicker.upper(), "kicker"),
        para(title, "title"),
        para(subtitle, "subtitle"),
    ]


def callout(title, body, tone="teal"):
    if tone == "red":
        fill, line, title_color = RED_SOFT, RED, RED_DARK
    elif tone == "green":
        fill, line, title_color = GREEN_SOFT, GREEN, GREEN
    elif tone == "ink":
        fill, line, title_color = INK_100, INK_500, INK_900
    else:
        fill, line, title_color = TEAL_SOFT, TEAL, TEAL_DARK

    title_style = ParagraphStyle(
        f"CalloutTitle{tone}",
        parent=STYLES["box_title"],
        textColor=title_color,
    )
    cell = [
        Paragraph(escape(title.upper()), title_style),
        para(body, "box_body"),
    ]
    box = Table([[cell]], colWidths=[PAGE_W - LEFT - RIGHT])
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), fill),
                ("BOX", (0, 0), (-1, -1), 0.8, line),
                ("LINEBEFORE", (0, 0), (0, -1), 4, line),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return KeepTogether([box, Spacer(1, 4 * mm)])


def options_table(options, tone=RED):
    rows = []
    for letter, text in options:
        rows.append(
            [
                para(letter, "option_letter"),
                para(text, "option_body"),
            ]
        )
    table = Table(
        rows,
        colWidths=[12 * mm, PAGE_W - LEFT - RIGHT - 12 * mm],
        hAlign="LEFT",
        repeatRows=0,
    )
    style = [
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BACKGROUND", (0, 0), (0, -1), tone),
        ("BOX", (0, 0), (-1, -1), 0.6, INK_200),
        ("INNERGRID", (0, 0), (-1, -1), 0.45, INK_200),
        ("LEFTPADDING", (0, 0), (0, -1), 4),
        ("RIGHTPADDING", (0, 0), (0, -1), 4),
        ("TOPPADDING", (0, 0), (0, -1), 8),
        ("BOTTOMPADDING", (0, 0), (0, -1), 8),
        ("LEFTPADDING", (1, 0), (1, -1), 10),
        ("RIGHTPADDING", (1, 0), (1, -1), 10),
        ("TOPPADDING", (1, 0), (1, -1), 8),
        ("BOTTOMPADDING", (1, 0), (1, -1), 8),
    ]
    for row in range(len(rows)):
        style.append(("BACKGROUND", (1, row), (1, row), WHITE if row % 2 == 0 else WARM))
    table.setStyle(TableStyle(style))
    return table


def schedule_table(rows, widths=None):
    data = [
        [para("Day", "table_head"), para("Team allocation", "table_head")]
    ]
    for day, allocation in rows:
        data.append([para(day, "table_body"), para(allocation, "table_body")])
    if widths is None:
        widths = [28 * mm, PAGE_W - LEFT - RIGHT - 28 * mm]
    table = LongTable(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), INK_900),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.45, INK_200),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, WARM]),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def research_note(text, citation, link):
    link_markup = (
        f'<link href="{escape(link)}" color="#963f2d">{escape(link)}</link>'
    )
    content = [
        Paragraph("RESEARCH BASIS", STYLES["box_title"]),
        para(text, "box_body"),
        Spacer(1, 4),
        Paragraph(escape(citation), STYLES["citation"]),
        Paragraph(link_markup, STYLES["citation"]),
    ]
    table = Table([[content]], colWidths=[PAGE_W - LEFT - RIGHT])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WARM),
                ("BOX", (0, 0), (-1, -1), 0.8, INK_300),
                ("LINEABOVE", (0, 0), (-1, 0), 4, TEAL),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    return table


def final_credit(kind):
    return Paragraph(
        f"<b>{escape(kind)} developed by Joost van de Brake.</b> "
        "h.j.van.de.brake@rug.nl  |  Supported by the Dutch Research Council (NWO).",
        STYLES["citation"],
    )


class ResourceDocTemplate(BaseDocTemplate):
    def __init__(self, filename, footer_label, title, subject):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=LEFT,
            rightMargin=RIGHT,
            topMargin=TOP,
            bottomMargin=BOTTOM,
            pageCompression=1,
            title=title,
            author="Joost van de Brake",
            subject=subject,
            creator="Joost van de Brake",
        )
        self.footer_label = footer_label
        frame = Frame(
            LEFT,
            BOTTOM,
            PAGE_W - LEFT - RIGHT,
            PAGE_H - TOP - BOTTOM,
            id="normal",
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )
        self.addPageTemplates(PageTemplate(id="main", frames=[frame], onPage=self.draw_page))

    def draw_page(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(WHITE)
        canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        canvas.setFillColor(RED)
        canvas.rect(0, PAGE_H - 4 * mm, PAGE_W, 4 * mm, fill=1, stroke=0)

        header_y = PAGE_H - 12.5 * mm
        canvas.setFillColor(INK_500)
        canvas.setFont("Arial-Bold", 6.9)
        canvas.drawString(LEFT, header_y, "JOOST VAN DE BRAKE")
        canvas.setFont("Arial", 6.9)
        canvas.drawRightString(PAGE_W - RIGHT, header_y, "MULTIPLE TEAM MEMBERSHIP RESOURCES")

        footer_line_y = 13.5 * mm
        canvas.setStrokeColor(INK_200)
        canvas.setLineWidth(0.5)
        canvas.line(LEFT, footer_line_y + 3 * mm, PAGE_W - RIGHT, footer_line_y + 3 * mm)
        canvas.setFillColor(INK_500)
        canvas.setFont("Arial", 6.6)
        canvas.drawString(LEFT, footer_line_y, f"{self.footer_label}  |  Supported by NWO")
        canvas.drawCentredString(PAGE_W / 2, footer_line_y, "h.j.van.de.brake@rug.nl")
        canvas.drawRightString(PAGE_W - RIGHT, footer_line_y, f"Page {doc.page}")
        canvas.restoreState()


def build_pdf(filename, story, footer_label, title, subject):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    WEB_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / filename
    web_copy = WEB_DIR / filename
    doc = ResourceDocTemplate(
        str(output),
        footer_label=footer_label,
        title=title,
        subject=subject,
    )
    doc.build(story)
    copyfile(output, web_copy)
    return output, web_copy


def status_case_story():
    story = []
    story += title_block(
        "Multiple team membership | Learner case",
        "Back in the regular team",
        "How can a team leader use experience gained in another team?",
        "Learner case · 30 to 40 minutes",
        RED,
    )
    story.append(
        callout(
            "The decision",
            "Sam has ten minutes before the weekly meeting. Maya knows a new handover method. Ruben knows how Atlas works. Sam needs a first step that uses both.",
            "teal",
        )
    )
    for text in [
        "Atlas is the afternoon team at a large distribution centre. Its eighteen members prepare shipments, answer drivers’ questions, and solve delays. Maya has worked in Atlas for four years. Her colleagues trust her, but she has no senior role. Team leader Sam and two senior coordinators usually decide how the work is organised.",
        "For six weeks, Maya also worked in Helix. This was a temporary improvement team with employees from four locations. Its job was to reduce late departures. Senior managers followed the work because the delays were expensive and customers were complaining.",
        "Maya knew a lot about the daily operation. That knowledge became important in Helix. Colleagues often asked for her opinion. She tested a new handover method and presented the results to the operations director. In Helix, people listened to Maya more than they usually did in Atlas.",
        "Maya has now returned to her normal work in Atlas. Her job has not changed. Sam welcomes her back and gives her the same duties as before.",
    ]:
        story.append(para(text))

    story.append(PageBreak())
    story.append(h2("The first week back"))
    for text in [
        "During her first week back, Maya often mentions Helix. When Atlas has a problem, she explains how Helix handled something similar. Some colleagues are interested. Others become annoyed. One colleague says, “Helix had time to make plans. We have trucks waiting outside.”",
        "Ruben, one of the senior coordinators, reacts most strongly. He designed the handover sheet that Atlas uses. Maya says that late order changes are still being missed. She suggests trying the handover board used in Helix. Ruben thinks it will not work in Atlas. The discussion ends without a decision.",
        "The problem is real. Earlier that week, the loading team prepared the wrong shipment because it did not receive a late change. Ruben knows the Atlas process well. Maya has seen another method work, although she does not yet know whether it will fit Atlas.",
        "Sam wants to use Maya’s new experience and Ruben’s local knowledge. He also wants them to work together rather than compete over whose opinion matters most.",
    ]:
        story.append(para(text))

    story.append(h2("What should Sam do first?"))
    story.append(
        options_table(
            [
                ("A", "Praise Maya in the meeting and ask her to present everything she learned in Helix."),
                ("B", "Let Maya replace the Atlas handover method with the Helix method."),
                ("C", "Ask Maya and Ruben to adapt one Helix idea and test it together for one week."),
                ("D", "Return to the old routine and stop discussing Helix."),
            ],
            RED,
        )
    )

    story.append(h2("Map the situation before choosing"))
    story.append(
        callout(
            "Who gets listened to?",
            "In every team, some people’s views carry more weight than others. Maya’s views carried more weight in Helix than they normally do in Atlas. What happens now that she is back?",
            "red",
        )
    )
    story += bullet_list(
        [
            "Who usually gets listened to in Atlas.",
            "How Maya’s role was different in Helix.",
            "What useful idea Maya brings back.",
            "Which Atlas problem could benefit from that idea.",
        ]
    )
    story.append(PageBreak())
    story.append(h2("Discussion questions"))
    story += numbered_list(
        [
            "Whose opinion usually matters most in Atlas? How was Maya’s role different in Helix?",
            "Why might Ruben react badly to Maya’s suggestion?",
            "Which option should Sam choose? Explain your choice.",
            "What should Sam say to Maya and Ruben?",
            "How should the one-week test work? What should Maya and Ruben each contribute?",
            "What result should they measure at the end of the week?",
        ]
    )
    story.append(Spacer(1, 3 * mm))
    story.append(
        research_note(
            "This fictional case draws on an observational study of 692 returns by professional football players. Players created more scoring opportunities for club teammates when their relative standing in the club and national teams differed more. The association was stronger when the national team had higher public standing. The same pattern did not appear in the players’ own shots or their total recorded activity. These findings do not show that status differences caused the behaviour. The Atlas situation is a teaching adaptation, not an additional study.",
            "Current research by Joost van de Brake on status differences across team memberships.",
            "https://joostvandebrake.com/#research",
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(final_credit("Learner case"))
    return story


def status_guide_story():
    story = []
    story += title_block(
        "Instructor guide | Suggested responses",
        "Back in the regular team",
        "A guide to the case about returning to a team with useful experience from another team.",
        "Instructor guide",
        TEAL,
    )
    story.append(h2("Central idea"))
    for text in [
        "People may be listened to more in one team than in another. Maya became an important voice in Helix. Back in Atlas, she returns to her old role and works with colleagues who know the local process.",
        "Sam can make the return easier by giving Maya and Ruben a small problem to solve together. Maya brings a new idea. Ruben brings detailed knowledge of Atlas. The team can then judge the result of their work.",
    ]:
        story.append(para(text))
    story.append(h2("Recommended answer"))
    story.append(
        callout(
            "Choose Option C",
            "Ask Maya and Ruben to adapt one idea and test it together. Atlas already needs to solve the handover problem. Maya knows another method and Ruben knows the local process. Their joint test gives the team a clear result to judge.",
            "green",
        )
    )
    story.append(h3("Why the other choices are weaker"))
    for title, text in [
        ("Option A", "Maya receives recognition, but Atlas still cannot judge her idea."),
        ("Option B", "Maya can use her idea, but Ruben’s local knowledge is left out."),
        ("Option D", "Atlas avoids the disagreement but keeps its handover problem."),
    ]:
        story.append(para(f"<b>{escape(title)}.</b> {escape(text)}", raw=True))

    story.append(PageBreak())
    story.append(h2("Suggested wording for Sam"))
    story.append(
        callout(
            "A workable opening",
            "“Maya, you saw a different handover method in Helix. Ruben, you know our current process. Please choose one small change together that could help us catch late order updates. Adapt it to this shift and test it for one week. Then tell us what happened and whether we should continue.”",
            "teal",
        )
    )
    story.append(
        para(
            "This wording gives each person a clear contribution. Maya brings the new idea and Ruben brings local knowledge. The team judges their result."
        )
    )
    story.append(h2("Suggested responses"))
    answers = [
        (
            "1. Whose views carry more weight?",
            "Maya is a respected team member in Atlas, but senior colleagues usually make the decisions. In Helix, people often asked for her opinion and used her work. Her views therefore carried more weight in Helix than in Atlas.",
        ),
        (
            "2. Why might Helix’s visibility matter?",
            "Senior managers followed Helix because it worked on an important company problem. Maya and her colleagues may therefore give more weight to what she did there. The research also found a stronger pattern when the other team had higher public standing.",
        ),
        (
            "3. What could explain Ruben’s reaction?",
            "Ruben may feel that Maya is criticising a process he designed. He may also have real doubts about whether the Helix method fits Atlas. Students do not have enough information to know his exact reason.",
        ),
    ]
    for question, answer in answers:
        story.append(h3(question))
        story.append(para(answer))

    answers = [
        (
            "4. Why is Option C preferable?",
            "It gives Maya and Ruben a shared task. Maya can show whether her new idea helps Atlas. Ruben can make the idea fit the local work. A small test also limits the cost if the method does not work.",
        ),
        (
            "5. What should Sam say?",
            "A good answer explains why Maya and Ruben are both needed. It names the problem, keeps the test small, and gives them shared responsibility for the result.",
        ),
        (
            "6. What should the test contain?",
            "Maya explains how the Helix method records late changes. Ruben checks whether it fits the timing, staffing, and layout at Atlas. Together they make a simple handover board. One shift uses it for a week. They record how many late changes were received and missed. They also ask users whether the board caused extra work or confusion. Maya and Ruben present the result together.",
        ),
    ]
    for question, answer in answers:
        story.append(h3(question))
        story.append(para(answer))

    story.append(h2("Teaching plan"))
    story.append(para("A 30- to 40-minute discussion works well."))
    story += numbered_list(
        [
            "Allow five minutes for individual reading and a private vote.",
            "Ask pairs to map Maya’s two team positions and evaluate the four choices.",
            "Take a second vote and ask students to defend their choice.",
            "Develop Sam’s exact wording and the one-week test as a group.",
            "End by separating the practical recommendation from the limits of the evidence.",
        ]
    )
    story.append(h3("Useful extensions"))
    story.append(
        para(
            "Ask whether the advice would change if Helix were a little-known temporary group. The paper suggests that the comparison carries less weight when the outside team has lower public standing, although it does not show that the issue disappears."
        )
    )
    story.append(
        para(
            "Then reverse the situation: Maya holds high standing in Atlas but had low standing in Helix. The study found no reliable difference between the two directions of the status gap. Students can discuss why the same joint-work response may still be useful."
        )
    )
    story.append(h2("Evidence note for instructors"))
    story.append(
        para(
            "The paper analyses 692 returns by 364 outfield players in the 2017/18 men’s Big Five European football leagues. Greater differences between focal-team and referent-team status were associated with more chances created for teammates after returning. The relationship became stronger as the external status of the referent team increased. The pattern did not appear for returners’ own shots or total recorded activity. When chance creation was summed across returners in the same match, it was positively associated with team performance."
        )
    )
    story.append(
        callout(
            "Evidence boundary",
            "The study is observational. It does not establish that status differences cause teammate-enabling behaviour, that teammate-enabling behaviour causes performance, or that the intervention proposed in this case will work in every workplace. The intervention is a grounded teaching application that managers can test on a small scale.",
            "red",
        )
    )
    story.append(
        research_note(
            "Further information about Joost van de Brake’s research on multiple team membership is available on his research page.",
            "Current research by Joost van de Brake on status differences across team memberships.",
            "https://joostvandebrake.com/#research",
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(final_credit("Instructor guide"))
    return story


RUBEN_WEEK = [
    ("Monday", "Outbound, 8 hours"),
    ("Tuesday", "Outbound, 8 hours"),
    ("Wednesday", "Outbound, 6 hours; Safety, 2 hours"),
    ("Thursday", "Outbound, 8 hours"),
    ("Friday", "Onboarding, 4 hours; Route Change, 4 hours"),
]


AISHA_WEEK = [
    ("Monday", "Returns, 4 hours; Scanner Pilot, 2 hours; Inventory Accuracy, 2 hours"),
    ("Tuesday", "Customer Recovery, 4 hours; Returns, 2 hours; Scanner Pilot, 2 hours"),
    ("Wednesday", "Inventory Accuracy, 4 hours; Customer Recovery, 2 hours; Returns, 2 hours"),
    ("Thursday", "Scanner Pilot, 4 hours; Inventory Accuracy, 2 hours; Customer Recovery, 2 hours"),
    ("Friday", "Returns, 2 hours; Scanner Pilot, 2 hours; Inventory Accuracy, 2 hours; Customer Recovery, 2 hours"),
]


REVISED_AISHA_WEEK = [
    ("Monday", "Returns, 8 hours"),
    ("Tuesday", "Returns, 8 hours"),
    ("Wednesday", "Scanner Pilot, 8 hours"),
    ("Thursday", "Returns, 4 hours; Inventory Accuracy, 4 hours"),
    ("Friday", "Customer Recovery, 4 hours; Returns, 4 hours"),
]


def four_teams_case_story():
    story = []
    story += title_block(
        "Multiple team membership | Learner case",
        "Four teams, two very different weeks",
        "Why the number of teams is only the start of a good diagnosis.",
        "Learner case · 30 to 40 minutes",
        TEAL,
    )
    story.append(
        callout(
            "The decision",
            "Eva must approve the roster for the next eight weeks. Should she limit team memberships, give employees full calendar control, or redesign how the work is divided?",
            "teal",
        )
    )
    for text in [
        "At 6:45 on Monday morning, Eva Martens was looking at two names on her screen. Both employees belonged to four teams. The staffing dashboard marked both of them amber.",
        "One employee seemed comfortable with the arrangement. The other had just told Eva, “I spend most of the day leaving one job half-finished so that I can join another.”",
        "Eva manages operations at Haven Foods, a fictional regional distribution centre that supplies schools, restaurants, and care homes. Its 180 employees receive goods, prepare orders, check food safety, and load delivery vehicles. Most employees have a regular shift team. Experienced employees are often asked to join additional groups concerned with training, safety, customer problems, stock accuracy, or temporary improvement work.",
        "The arrangement usually helps Haven Foods. People who know the operation well can share their experience beyond their regular shift. The same arrangement can also make the working week difficult to follow. A person may have four team names beside their name, but those four memberships reveal little about what the person actually does from one hour to the next.",
        "HR has suggested a simple rule: nobody should belong to more than three teams. The operations director prefers another response. He thinks employees should be allowed to organise their own calendars. Eva is unconvinced by either answer. She starts by comparing Ruben and Aisha.",
    ]:
        story.append(para(text))

    story.append(PageBreak())
    story.append(h2("Ruben’s four teams"))
    for text in [
        "Ruben has worked at Haven Foods for eight years. His main responsibility is the Outbound team, which prepares orders for the afternoon loading window. He also belongs to the Safety group, the Onboarding team, and a temporary Route Change project.",
        "Everybody refers to Outbound as Ruben’s home team. He has worked with most of its members for several years. The Safety group includes two former Outbound colleagues. He knows the trainer with whom he handles onboarding, and the Route Change project is led by a supervisor he has worked with before.",
    ]:
        story.append(para(text))
    story.append(schedule_table(RUBEN_WEEK))
    story.append(Spacer(1, 3 * mm))
    story.append(
        para(
            "Ruben spends 30 of his 40 hours with Outbound. His other memberships involve smaller and clearly scheduled contributions. He changes team context twice during the week."
        )
    )
    story.append(
        callout(
            "Ruben’s view",
            "“Four teams sounds busier than it feels. Most days I am with Outbound, and everybody knows where to find me. Friday is for the extra work. If somebody from Route Change sends me a message on Tuesday, it usually waits until Friday.”",
            "ink",
        )
    )
    story.append(h2("Aisha’s four teams"))
    story.append(
        para(
            "Aisha has worked at Haven Foods for six years. She knows the returns process better than almost anyone, so four different team leaders have asked for her help. She now belongs to Returns, the Scanner Pilot, Inventory Accuracy, and Customer Recovery."
        )
    )

    story.append(PageBreak())
    for text in [
        "Each team expects Aisha to remain involved throughout the week. Returns wants her available when damaged orders arrive. The Scanner Pilot asks for quick feedback whenever staff test a new device. Inventory Accuracy needs someone to investigate discrepancies near the end of each shift. Customer Recovery assigns cases as soon as complaints come in.",
        "Nobody has agreed which team should come first.",
    ]:
        story.append(para(text))
    story.append(schedule_table(AISHA_WEEK))
    story.append(Spacer(1, 3 * mm))
    for text in [
        "Aisha spends ten hours with each team. Her roster contains eleven changes from one team context to another. The formal blocks also hide interruptions. Team leaders regularly call or message her when she is working for somebody else.",
        "Aisha knows most members of Returns, but the other groups draw people from different shifts. Several Scanner Pilot members joined Haven Foods recently. Membership of Customer Recovery rotates, and Aisha often needs to work out who owns a case before she can act.",
    ]:
        story.append(para(text))
    story.append(
        callout(
            "Aisha’s view",
            "“I still like the work. The scanner project is interesting, and I asked to join it because I want to become a supervisor. I do not want the solution to be taking me off everything that might help me develop. I am tired of changing gears. At the end of most days, I cannot tell what I finished.”",
            "red",
        )
    )

    story.append(PageBreak())
    story.append(h2("Four reasonable requests"))
    for text in [
        "The Returns supervisor wants Aisha present every morning. Returns become harder to process when questions wait until the following day.",
        "The Scanner Pilot leader wants Aisha for two fixed sessions each week, but also expects her to answer short questions between sessions. He says that most questions take only ten minutes.",
        "Inventory Accuracy needs Aisha’s experience but does not need her every day. Another experienced employee could handle part of the work after a proper handover.",
        "Customer Recovery values Aisha’s judgment. Its coordinator is willing to group cases into a fixed weekly block, except when a major customer problem requires an immediate response.",
        "Each request sounds reasonable when considered separately. Together, they divide Aisha’s week into small pieces.",
    ]:
        story.append(para(text))
    story.append(h2("The decision"))
    story.append(
        options_table(
            [
                ("A", "Introduce a three-team rule. Remove Aisha from one team and apply the same maximum throughout Haven Foods."),
                ("B", "Give Aisha complete control over her calendar. Keep all four memberships and let her decide when to work for each team."),
                ("C", "Keep the memberships but redesign their shape. Name one home team, group the other work into larger blocks, reduce interruptions, and clarify each contribution."),
                ("D", "Keep the roster unchanged. Offer Aisha time-management or resilience training so that she can handle the existing arrangement better."),
            ],
            TEAL,
        )
    )
    story.append(Spacer(1, 3 * mm))
    story.append(
        para(
            "Eva can combine parts of these options, but she must explain what problem each action is meant to solve. She also needs a fallback if the four team leaders refuse to change their expectations."
        )
    )

    story.append(PageBreak())
    story.append(h2("A simple way to map the situation"))
    for heading, text in [
        ("How many teams?", "Count the teams to which the employee formally belongs."),
        ("How often does the employee switch?", "Mark each move from one team’s work, people, tools, and expectations to another team context."),
        ("Is there a clear core team?", "Ask whether one membership receives sustained attention while the other memberships involve smaller, bounded contributions."),
        ("How familiar are the coworkers?", "Ask whether the employee has worked with the people in these teams before. Familiarity can make expectations and coordination easier, but it does not remove the time lost through constant switching."),
    ]:
        story.append(h3(heading))
        story.append(para(text))
    story.append(h2("Your task"))
    story.append(para("Prepare a 30-day plan for Eva."))
    story += numbered_list(
        [
            "Compare Ruben’s and Aisha’s team arrangements. Why does the shared number “four” hide more than it reveals?",
            "Identify the most pressing problem in Aisha’s current roster.",
            "Decide whether Aisha should leave one team. Explain what information you would need before making that decision.",
            "Redesign Aisha’s week. Show which team becomes her core team and how the remaining work will be grouped.",
            "Decide how Eva should respond to team leaders who still expect immediate answers outside their agreed blocks.",
            "Write the first three sentences Eva should use in her conversation with Aisha.",
            "Select two or three things Eva should monitor during the following month. Explain what would count as improvement.",
            "Would the same solution be suitable for Ruben? Why or why not?",
        ]
    )

    story.append(h2("Research behind the case"))
    story.append(
        research_note(
            "This fictional case is informed by research showing that the number of teams beside a person’s name does not fully describe multiple team membership. How people divide their time, how often they change team context, whether they have a clear core team, and whether they know their teammates can matter. The underlying study followed 1,345 employees involved in 4,329 project teams in one large research organisation. Haven Foods and its employees are fictional. The study was observational, so it can guide diagnosis and work design but cannot prove that a particular roster causes exhaustion or resignation.",
            "Van de Brake, Van der Vegt, and Essens (2024). “More Than Just a Number.” Journal of Applied Psychology, 109(5), 714–729.",
            "https://doi.org/10.1037/apl0001168",
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(final_credit("Learner case"))
    return story


def four_teams_guide_story():
    story = []
    story += title_block(
        "Instructor guide | Suggested responses",
        "Four teams, two very different weeks",
        "A guide to diagnosing switching, coreness, familiarity, and team count.",
        "Instructor guide",
        TEAL,
    )
    story.append(h2("Purpose of the case"))
    story.append(
        para(
            "The case helps students and practitioners move beyond team count as the default way to diagnose multiple team membership. Ruben and Aisha both belong to four teams, yet their time is organised very differently. The useful question is not simply whether four is too many. Participants need to examine what happens during the working week."
        )
    )
    story.append(
        callout(
            "Suggested format",
            "Allow 30 to 40 minutes. The case works with undergraduate students, master’s students, supervisors, project leaders, and HR professionals. No prior knowledge of multiple team membership is required.",
            "ink",
        )
    )
    story.append(h2("Learning objectives"))
    story += bullet_list(
        [
            "Distinguish team count from switching between team contexts.",
            "Recognise the difference between a clear core membership and several equally demanding memberships.",
            "Explain why familiarity may support a core-and-peripheral arrangement without making frequent switching harmless.",
            "Design a practical intervention that changes the work instead of placing responsibility solely on the employee.",
            "Separate an evidence-informed recommendation from a causal claim.",
        ]
    )
    story.append(h2("The central diagnosis"))
    for text in [
        "Ruben and Aisha should not receive the same intervention merely because both belong to four teams.",
        "Ruben has a clear home team. Most of his working time remains with Outbound, and his additional contributions are placed in bounded blocks. He also knows many of the people with whom he works. His schedule contains some switching, but it does not show the same fragmentation as Aisha’s schedule. Nothing in the case proves that Ruben is thriving, so students should still ask him. The team count alone provides no good reason to remove one of his memberships.",
        "Aisha has no agreed core team. Her time is distributed evenly across four memberships, and she changes team context repeatedly throughout the week. Each team also expects access to her outside its scheduled blocks. Her roster therefore understates the switching she experiences. Her own report of fatigue and unfinished work gives Eva a direct reason to intervene, even though the case does not show that multiple team membership caused those experiences.",
        "Lower familiarity adds another difficulty. Aisha must repeatedly work out who does what and how each group handles its work. The underlying study does not show that familiarity protects employees from the consequences of frequent switching. Familiarity was relevant to the benefits associated with a clear core team. It should be treated as part of a workable portfolio, not as permission to leave a fragmented roster unchanged.",
    ]:
        story.append(para(text))

    story.append(PageBreak())
    story.append(h2("Recommended first response"))
    story.append(
        callout(
            "Choose Option C",
            "Keep Aisha’s development interests in view while redesigning how the four memberships make claims on her time.",
            "green",
        )
    )
    story.append(para("One workable first roster is shown below."))
    story.append(schedule_table(REVISED_AISHA_WEEK))
    story.append(Spacer(1, 3 * mm))
    for text in [
        "This roster makes Returns the clear core team, with 24 of Aisha’s 40 hours. Scanner Pilot remains a meaningful development opportunity. Inventory Accuracy and Customer Recovery receive fixed blocks. The team count remains four, but the number of within-day changes falls considerably.",
        "The roster only works if the team leaders change their expectations. During a Scanner Pilot block, Aisha should not be treated as continuously available to Returns. During a Returns day, minor Scanner Pilot questions should wait. Each peripheral team needs another contact for routine issues and a clear definition of what qualifies as urgent.",
        "Eva should also give the peripheral assignments an end point. For example, the four-team arrangement could run for eight weeks before the team leads decide whether Aisha’s contribution is still needed. A small side assignment easily becomes a permanent source of interruption when nobody identifies an end point.",
    ]:
        story.append(para(text))

    story.append(h2("When reducing the number of teams is appropriate"))
    for text in [
        "Keeping four memberships is not an objective in itself. Eva should pause or remove one assignment if the team leaders cannot group the work into blocks, if all four teams genuinely require daily availability, or if Aisha continues to report serious difficulty after the roster has been redesigned.",
        "Inventory Accuracy is the easiest membership to transfer because its supervisor has already identified another employee who could take over after a handover. Scanner Pilot should not automatically be removed because it is connected to Aisha’s development goals. Removing the work she values while leaving fragmented routine work in place would solve the manager’s scheduling problem at Aisha’s expense.",
        "A three-team rule may be useful as a prompt for review, but it is weak as a general decision rule. In the published study, team number, switching, and coreness described different aspects of the arrangement. Once switching and coreness were considered, team number no longer predicted emotional exhaustion in the reported models.",
    ]:
        story.append(para(text))
    story.append(h2("Why complete scheduling autonomy is insufficient"))
    for text in [
        "Giving Aisha more voice is sensible. Giving her sole responsibility for resolving four competing team demands is not.",
        "In the underlying study, scheduling autonomy was unexpectedly associated with more switching and less coreness. The finding was observational and should not be interpreted as proof that autonomy is harmful. It does show why “let the employee sort it out” is not a sufficient solution. Aisha cannot create protected blocks if four team leaders continue to expect immediate access to her.",
        "The better response is constrained choice. Eva and Aisha can design the blocks together, while Eva negotiates and enforces the boundaries with the team leaders.",
    ]:
        story.append(para(text))
    story.append(h2("Suggested opening for Eva"))
    story.append(
        callout(
            "Conversation opener",
            "“I do not think the problem is that you are involved in four teams. The problem I see is that your week is divided into small pieces, and every team still expects access to you between those pieces. I would like Returns to be your home team for the next eight weeks and keep the Scanner Pilot as a protected development block, but I want to design the arrangement with you.”",
            "teal",
        )
    )

    story.append(h2("What Eva should monitor"))
    for text in [
        "Eva should begin with a small set of measures that can be discussed with Aisha rather than turning the intervention into surveillance.",
        "One useful measure is the number of actual team-context changes during the week, including unscheduled interruptions. A second is whether Aisha can complete the work planned for each block without carrying unfinished tasks into the next one. Eva should also ask Aisha for a short weekly assessment of her energy and ability to focus.",
        "Operational measures may include delayed returns, unresolved inventory cases, or errors caused by incomplete handovers. These measures should be interpreted alongside Aisha’s experience. A faster process would not count as a successful redesign if the same fragmentation simply became less visible.",
        "The first review can take place after two weeks, followed by a fuller decision after six or eight weeks.",
    ]:
        story.append(para(text))
    story.append(h2("Suggested responses: questions 1 to 4"))
    responses = [
        ("1. Why does the number four hide more than it reveals?", "Ruben concentrates most of his time in one team and handles other memberships in bounded periods. Aisha distributes her time evenly and moves repeatedly between four active contexts. Formal membership count captures neither difference."),
        ("2. What is the most pressing problem?", "Aisha’s week is fragmented, and the formal roster does not protect her from interruptions between blocks. The lack of a shared priority order makes every team’s request appear equally urgent."),
        ("3. Should Aisha leave one team?", "Possibly, but team removal should follow an attempt to clarify priorities and group work. Participants should ask whether each team truly needs Aisha, whether daily access is necessary, whether responsibilities can be transferred, and which assignment matters to her development."),
        ("4. What should become the core team?", "Returns is the most defensible core because it uses Aisha’s established expertise and already receives the largest single share of her current attention. Another choice is acceptable when the response explains the operational reason and preserves a real development opportunity."),
    ]
    for question, answer in responses:
        story.append(h3(question))
        story.append(para(answer))

    story.append(h2("Suggested responses: questions 5 to 8"))
    responses = [
        ("5. How should Eva handle demands outside the blocks?", "Each team needs a backup contact and an agreed definition of urgency. Routine requests wait until Aisha’s next block. Eva, rather than Aisha alone, must defend this arrangement."),
        ("6. What should Eva say?", "A strong opening describes the fragmented week, invites Aisha into the redesign, and avoids treating four memberships as evidence that she has made a poor choice."),
        ("7. What counts as improvement?", "Fewer unplanned switches, more completed work within blocks, clearer ownership, and a better experience for Aisha. Participants should avoid claiming success from a single measure."),
        ("8. Does Ruben need the same intervention?", "The case gives no direct reason to redesign Ruben’s work. Eva should still check his experience because a neat roster can hide interruptions or other demands."),
    ]
    for question, answer in responses:
        story.append(h3(question))
        story.append(para(answer))
    story.append(h2("Research evidence for the debrief"))
    for text in [
        "The published study found a positive association between switching and emotional exhaustion while holding team count constant. Switching also had a positive indirect association with later turnover through emotional exhaustion.",
        "Coreness did not have an unconditional main effect on exhaustion. It was associated with lower emotional exhaustion when employees had relatively high prior familiarity with members across their teams. Familiarity did not weaken the switching-exhaustion relationship.",
        "These findings support the distinction used in the case. They do not establish that the fictional roster would cause exhaustion, nor do they establish a universal maximum number of teams.",
    ]:
        story.append(para(text))

    story.append(h2("Evidence boundaries"))
    for text in [
        "The original sample consisted of employees in a large research organisation. The Haven Foods setting broadens the classroom discussion, but it does not broaden the empirical sample. Participants should treat the case as an opportunity to test the usefulness of the concepts in another setting.",
        "The study was observational. Weekly work records also provide a conservative view of switching because employees can move between teams several times within a day. The case makes within-day changes visible for teaching purposes, but those fictional schedule details are not reported study data.",
    ]:
        story.append(para(text))
    story.append(h2("Suggested class sequence"))
    story += numbered_list(
        [
            "Ask participants to vote on Options A through D before introducing the research.",
            "Have pairs mark every team-context change in each roster.",
            "Ask the class to identify Ruben’s and Aisha’s core teams.",
            "Let groups redesign Aisha’s week while keeping all four memberships initially.",
            "Introduce the findings on switching, coreness, familiarity, and exhaustion.",
            "Revisit the first vote and ask what changed.",
            "Close by asking when reducing the number of teams would still be the right decision.",
        ]
    )
    story.append(h2("Short assessment rubric"))
    story.append(para("A strong response:"))
    story += bullet_list(
        [
            "Diagnoses the arrangement using switching and coreness rather than team count alone.",
            "Treats familiarity accurately and does not claim that it removes switching costs.",
            "Produces a workable roster with protected blocks and clear ownership.",
            "Includes Aisha’s development goals and voice.",
            "Names a fallback if team demands cannot be grouped.",
            "Acknowledges that the research informs the recommendation without proving causality.",
        ]
    )
    story.append(
        research_note(
            "The published study followed 1,345 employees involved in 4,329 project teams and combined detailed weekly work-hour records with surveys, project records, HR records, and later turnover.",
            "Van de Brake, Van der Vegt, and Essens (2024). “More Than Just a Number.” Journal of Applied Psychology, 109(5), 714–729.",
            "https://doi.org/10.1037/apl0001168",
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(final_credit("Instructor guide"))
    return story


def build_all():
    global STYLES
    register_fonts()
    STYLES = make_styles()

    outputs = []
    outputs.append(
        build_pdf(
            "mtm-status-reentry-mini-case.pdf",
            status_case_story(),
            "Status re-entry learner case",
            "Back in the Regular Team",
            "Multiple team membership, status differences, and team re-entry",
        )
    )
    outputs.append(
        build_pdf(
            "mtm-status-reentry-instructor-guide.pdf",
            status_guide_story(),
            "Status re-entry instructor guide",
            "Instructor Guide: Back in the Regular Team",
            "Suggested responses for the status re-entry teaching case",
        )
    )
    outputs.append(
        build_pdf(
            "mtm-four-teams-two-weeks-case.pdf",
            four_teams_case_story(),
            "Four teams learner case",
            "Four Teams, Two Very Different Weeks",
            "Multiple team membership, switching, coreness, and work design",
        )
    )
    outputs.append(
        build_pdf(
            "mtm-four-teams-two-weeks-instructor-guide.pdf",
            four_teams_guide_story(),
            "Four teams instructor guide",
            "Instructor Guide: Four Teams, Two Very Different Weeks",
            "Suggested responses for the multiple team membership work-design case",
        )
    )
    for output, web_copy in outputs:
        print(output)
        print(web_copy)


if __name__ == "__main__":
    build_all()
