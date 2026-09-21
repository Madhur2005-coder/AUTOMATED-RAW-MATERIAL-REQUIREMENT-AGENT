import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Color Palette - Symbiosis Theme
    C_RED = RGBColor(140, 29, 34)       # Symbiosis Crimson
    C_RED_LIGHT = RGBColor(253, 242, 242)
    C_DARK = RGBColor(30, 41, 59)       # Slate 800
    C_MUTED = RGBColor(100, 116, 139)   # Slate 500
    C_CARD_BG = RGBColor(248, 250, 252) # Slate 50
    C_WHITE = RGBColor(255, 255, 255)
    C_BORDER = RGBColor(226, 232, 240)  # Slate 200
    C_AMBER = RGBColor(217, 119, 6)     # Amber 600
    C_GREEN = RGBColor(22, 163, 74)     # Green 600
    C_BLUE = RGBColor(37, 99, 235)      # Blue 600
    C_PURPLE = RGBColor(124, 58, 237)

    def add_header_footer(slide, title_text, category_text="Mini Project Presentation", page_num=1):
        # Top banner bar
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = C_RED
        top_bar.line.fill.background()

        # College title left
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.25), Inches(7.0), Inches(0.4))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = "SYMBIOSIS INSTITUTE OF TECHNOLOGY, NAGPUR"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_RED

        # Category / Flow tag right
        cat_box = slide.shapes.add_textbox(Inches(7.8), Inches(0.25), Inches(4.7), Inches(0.4))
        ctf = cat_box.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = 0
        cp = ctf.paragraphs[0]
        cp.alignment = PP_ALIGN.RIGHT
        cp.text = category_text.upper()
        cp.font.size = Pt(10)
        cp.font.bold = True
        cp.font.color.rgb = C_MUTED

        # Main Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(11.7), Inches(0.7))
        ttf = title_box.text_frame
        ttf.word_wrap = True
        ttf.margin_left = ttf.margin_top = ttf.margin_right = ttf.margin_bottom = 0
        tp = ttf.paragraphs[0]
        tp.text = title_text
        tp.font.size = Pt(22)
        tp.font.bold = True
        tp.font.color.rgb = C_DARK

        # Bottom Bar
        bot_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.15), Inches(13.333), Inches(0.1))
        bot_bar.fill.solid()
        bot_bar.fill.fore_color.rgb = C_RED
        bot_bar.line.fill.background()

        # Footer Text
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.22), Inches(10.5), Inches(0.25))
        ftf = footer_box.text_frame
        ftf.word_wrap = True
        ftf.margin_left = ftf.margin_top = ftf.margin_right = ftf.margin_bottom = 0
        fp = ftf.paragraphs[0]
        fp.text = "SYMBIOSIS INTERNATIONAL (DEEMED UNIVERSITY) | Automated Raw Material Requirement Agent"
        fp.font.size = Pt(8.5)
        fp.font.color.rgb = C_MUTED

        # Page Number
        pg_box = slide.shapes.add_textbox(Inches(11.8), Inches(7.22), Inches(0.7), Inches(0.25))
        ptf = pg_box.text_frame
        ptf.word_wrap = True
        ptf.margin_left = ptf.margin_top = ptf.margin_right = ptf.margin_bottom = 0
        pp = ptf.paragraphs[0]
        pp.alignment = PP_ALIGN.RIGHT
        pp.text = str(page_num)
        pp.font.size = Pt(9)
        pp.font.bold = True
        pp.font.color.rgb = C_RED

    def add_card(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_slide_layout)
    
    # Header institution ribbon
    top_ribbon = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.18))
    top_ribbon.fill.solid()
    top_ribbon.fill.fore_color.rgb = C_RED
    top_ribbon.line.fill.background()

    # Symbiosis logo simulation / title
    inst_box = s1.shapes.add_textbox(Inches(1.0), Inches(0.6), Inches(11.3), Inches(1.1))
    itf = inst_box.text_frame
    itf.word_wrap = True
    ip1 = itf.paragraphs[0]
    ip1.alignment = PP_ALIGN.CENTER
    ip1.text = "SYMBIOSIS INSTITUTE OF TECHNOLOGY, NAGPUR"
    ip1.font.size = Pt(24)
    ip1.font.bold = True
    ip1.font.color.rgb = C_RED

    ip2 = itf.add_paragraph()
    ip2.alignment = PP_ALIGN.CENTER
    ip2.text = "Constituent of SYMBIOSIS INTERNATIONAL (DEEMED UNIVERSITY) | Pune, India"
    ip2.font.size = Pt(12)
    ip2.font.color.rgb = C_MUTED

    # Presentation Category Badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.6), Inches(1.85), Inches(4.1), Inches(0.55))
    badge.fill.solid()
    badge.fill.fore_color.rgb = C_RED_LIGHT
    badge.line.color.rgb = C_RED
    badge.line.width = Pt(1.5)
    btf = badge.text_frame
    bp = btf.paragraphs[0]
    bp.alignment = PP_ALIGN.CENTER
    bp.text = "MINI PROJECT PRESENTATION"
    bp.font.size = Pt(15)
    bp.font.bold = True
    bp.font.color.rgb = C_RED

    # Main Project Title Box
    title_banner = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(2.65), Inches(13.333), Inches(1.8))
    title_banner.fill.solid()
    title_banner.fill.fore_color.rgb = C_RED
    title_banner.line.fill.background()

    t_box = s1.shapes.add_textbox(Inches(1.0), Inches(2.75), Inches(11.333), Inches(1.6))
    ttf = t_box.text_frame
    ttf.word_wrap = True
    tp1 = ttf.paragraphs[0]
    tp1.alignment = PP_ALIGN.CENTER
    tp1.text = "Automated Raw Material Requirement Agent"
    tp1.font.size = Pt(32)
    tp1.font.bold = True
    tp1.font.color.rgb = C_WHITE

    tp2 = ttf.add_paragraph()
    tp2.alignment = PP_ALIGN.CENTER
    tp2.text = "An Autonomous Agentic AI Assistant for Manufacturing Supply Chain & Procurement Planning"
    tp2.font.size = Pt(15)
    tp2.font.color.rgb = RGBColor(254, 226, 226)

    # Presenter & Guide Card
    meta_card = add_card(s1, Inches(2.5), Inches(4.8), Inches(8.333), Inches(1.9), C_WHITE, C_BORDER)
    mtf = meta_card.text_frame
    mtf.word_wrap = True
    mtf.margin_top = Inches(0.2)
    mtf.margin_left = Inches(0.4)
    mtf.margin_right = Inches(0.4)

    mp1 = mtf.paragraphs[0]
    mp1.alignment = PP_ALIGN.CENTER
    mp1.text = "Presented By: [Student Name / Group Members]"
    mp1.font.size = Pt(16)
    mp1.font.bold = True
    mp1.font.color.rgb = C_DARK

    mp2 = mtf.add_paragraph()
    mp2.alignment = PP_ALIGN.CENTER
    mp2.text = "Semester: VI / VII  |  Department of Computer Science / AI & ML"
    mp2.font.size = Pt(13)
    mp2.font.color.rgb = C_MUTED

    mp3 = mtf.add_paragraph()
    mp3.alignment = PP_ALIGN.CENTER
    mp3.text = "Under the guidance of: [Dr. / Prof. Guide Name]"
    mp3.font.size = Pt(14)
    mp3.font.bold = True
    mp3.font.color.rgb = C_RED

    # Bottom ribbon
    bot_ribbon = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.15), Inches(13.333), Inches(0.12))
    bot_ribbon.fill.solid()
    bot_ribbon.fill.fore_color.rgb = C_RED
    bot_ribbon.line.fill.background()

    # Footer note
    f_box = s1.shapes.add_textbox(Inches(1.0), Inches(7.22), Inches(11.3), Inches(0.25))
    ftf = f_box.text_frame
    fp = ftf.paragraphs[0]
    fp.alignment = PP_ALIGN.CENTER
    fp.text = "Symbiosis Institute of Technology, Nagpur Campus | Re-accredited by NAAC with 'A++' Grade"
    fp.font.size = Pt(9)
    fp.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 2: Presentation Flow 1 (01 - 04)
    # ==========================================
    s2 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s2, "Presentation Outline (Part 1)", "1. Presentation Flow", 2)

    flow_items_1 = [
        ("01", "Problem Statements", "Challenges in manufacturing raw material planning, stockout risks, and inventory holding penalties in SMEs.", C_RED),
        ("02", "Research Initiatives / Objectives", "Goals of autonomous agentic reasoning, dynamic BOM explosion, and safety stock reserve preservation.", C_BLUE),
        ("03", "Existing Processes / Solutions", "Analysis of manual Excel spreadsheets, static calculators, and rigid legacy ERP systems.", C_AMBER),
        ("04", "Compare & Contrast Alternatives", "Feature-by-feature evaluation: Static calculators vs. Multi-step Agentic AI systems.", C_GREEN)
    ]

    lefts = [Inches(1.0), Inches(6.8)]
    tops = [Inches(1.8), Inches(4.3)]
    for idx, (num, heading, desc, col) in enumerate(flow_items_1):
        x = lefts[idx % 2]
        y = tops[idx // 2]
        card = add_card(s2, x, y, Inches(5.5), Inches(2.1), C_WHITE, C_BORDER)
        
        # Badge
        badge_shape = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.3), y + Inches(0.3), Inches(0.85), Inches(0.55))
        badge_shape.fill.solid()
        badge_shape.fill.fore_color.rgb = col
        badge_shape.line.fill.background()
        btf = badge_shape.text_frame
        bp = btf.paragraphs[0]
        bp.alignment = PP_ALIGN.CENTER
        bp.text = num
        bp.font.size = Pt(16)
        bp.font.bold = True
        bp.font.color.rgb = C_WHITE

        # Text
        t_box = s2.shapes.add_textbox(x + Inches(1.35), y + Inches(0.25), Inches(3.9), Inches(1.6))
        tf = t_box.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = heading
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = C_DARK

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 3: 01. Problem Statements
    # ==========================================
    s3 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s3, "01. Problem Statement: Manufacturing Supply Chain Hurdles", "Problem Formulation", 3)

    problems = [
        ("Stockout vs. Overstocking Dilemma",
         "SMEs face high costs from production halts due to material stockouts, or excessive capital tie-up from over-purchasing without demand visibility.",
         "Impact: Halts assembly lines, inflates holding costs by 15-25%."),
        ("Safety Stock Buffer Violations",
         "Traditional estimators treat all on-hand warehouse inventory as spendable, inadvertently consuming emergency safety stock reserves.",
         "Impact: Leaves zero resilience against sudden demand spikes or supply delays."),
        ("Manual & Error-Prone BOM Explosion",
         "Calculating multi-part Bill of Materials (BOM) for customized batch sizes is manually calculated via error-prone spreadsheets.",
         "Impact: Mismatched procurement quantities and delayed purchase order approvals."),
        ("Black-Box Procurement Decisions",
         "Standard tools output flat numbers without auditable justification, chain of thought, or executive explanation for procurement managers.",
         "Impact: Lack of managerial trust and slow decision verification.")
    ]

    for idx, (title, body, impact) in enumerate(problems):
        row = idx // 2
        col = idx % 2
        x = Inches(1.0) if col == 0 else Inches(7.0)
        y = Inches(1.7) + Inches(row * 2.6)
        
        card = add_card(s3, x, y, Inches(5.3), Inches(2.35), C_WHITE, C_BORDER)
        tb = s3.shapes.add_textbox(x + Inches(0.3), y + Inches(0.2), Inches(4.7), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = f"• {title}"
        p1.font.size = Pt(15)
        p1.font.bold = True
        p1.font.color.rgb = C_RED

        p2 = tf.add_paragraph()
        p2.text = body
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = C_DARK

        p3 = tf.add_paragraph()
        p3.text = impact
        p3.font.size = Pt(11)
        p3.font.bold = True
        p3.font.color.rgb = C_AMBER

    # ==========================================
    # SLIDE 4: 02. Research Initiatives / Objectives
    # ==========================================
    s4 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s4, "02. Research Initiatives & Project Objectives", "Project Scope & Goals", 4)

    objectives = [
        ("Autonomous Agentic Pipeline", "Transform static calculations into a multi-step perception-action-reasoning workflow that self-orchestrates sub-goals.", C_BLUE),
        ("Dynamic Safety Stock Protection", "Strictly enforce Available Usable = Current Stock - Safety Stock, ensuring emergency reserves are never depleted.", C_GREEN),
        ("BOM Explosion & Real-Time Sync", "Directly integrate with live warehouse storage bays and relational recipes to explode BOMs accurately in real-time.", C_AMBER),
        ("Auditable Chain-of-Thought Log", "Generate a transparent 18+ step Agent Decision Log with timestamped deductions for regulatory and viva scrutiny.", C_PURPLE),
        ("Dual-Agent Reliability Architecture", "Provide hybrid AI reasoning (OpenAI GPT-4o-mini with seamless offline deterministic fallback) for 100% viva uptime.", C_RED)
    ]

    for idx, (title, desc, col) in enumerate(objectives):
        y = Inches(1.65) + Inches(idx * 1.05)
        card = add_card(s4, Inches(1.0), y, Inches(11.333), Inches(0.9), C_WHITE, C_BORDER)
        
        # Indicator strip
        strip = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), y, Inches(0.18), Inches(0.9))
        strip.fill.solid()
        strip.fill.fore_color.rgb = col
        strip.line.fill.background()

        tb = s4.shapes.add_textbox(Inches(1.4), y + Inches(0.12), Inches(10.7), Inches(0.65))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = f"{idx+1}. {title}: "
        p1.font.size = Pt(13.5)
        p1.font.bold = True
        p1.font.color.rgb = C_DARK

        run = p1.add_run()
        run.text = desc
        run.font.bold = False
        run.font.size = Pt(12)
        run.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 5: 03. Existing Processes & Limitations
    # ==========================================
    s5 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s5, "03. Existing Processes vs. Industrial Realities", "Literature & Current Practices", 5)

    methods = [
        ("Manual Spreadsheets (Excel)",
         ["Prone to formula and copy-paste errors across sheets",
          "Decoupled from real-time warehouse storage bay updates",
          "Lacks automated validation and supplier quotation integration",
          "High human labor cost for multi-product production schedules"],
         C_RED),
        ("Static Software Calculators",
         ["Isolated equations executing simple Qty * Unit Rate",
          "Completely ignores safety stock buffers and location bay locks",
          "No tool calling capability; cannot inspect database state",
          "Outputs raw scalar numbers without decision rationale or warnings"],
         C_AMBER),
        ("Monolithic Enterprise ERPs (SAP/Oracle)",
         ["High capital expenditure and prohibitive licensing fees for SMEs",
          "Complex configuration taking months to adapt to custom workflows",
          "Heavy UI that overwhelms floor supervisors with unnecessary bloat",
          "Requires dedicated database administrators and custom consultants"],
         C_BLUE)
    ]

    for idx, (title, points, col) in enumerate(methods):
        x = Inches(1.0) + Inches(idx * 3.9)
        card = add_card(s5, x, Inches(1.7), Inches(3.6), Inches(5.1), C_WHITE, C_BORDER)

        top_strip = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.7), Inches(3.6), Inches(0.65))
        top_strip.fill.solid()
        top_strip.fill.fore_color.rgb = col
        top_strip.line.fill.background()
        stf = top_strip.text_frame
        sp = stf.paragraphs[0]
        sp.alignment = PP_ALIGN.CENTER
        sp.text = title
        sp.font.size = Pt(13)
        sp.font.bold = True
        sp.font.color.rgb = C_WHITE

        tb = s5.shapes.add_textbox(x + Inches(0.2), Inches(2.5), Inches(3.2), Inches(4.1))
        tf = tb.text_frame
        tf.word_wrap = True
        for p_idx, pt_text in enumerate(points):
            p = tf.paragraphs[0] if p_idx == 0 else tf.add_paragraph()
            p.text = f"✖  {pt_text}"
            p.font.size = Pt(11)
            p.font.color.rgb = C_DARK
            p.space_after = Pt(12)

    # ==========================================
    # SLIDE 6: 04. Compare & Contrast Alternative Solutions
    # ==========================================
    s6 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s6, "04. Comparative Analysis: Static Tools vs. Agentic AI", "Compare & Contrast", 6)

    # Table comparison
    table_shape = s6.shapes.add_table(6, 4, Inches(1.0), Inches(1.8), Inches(11.333), Inches(4.8))
    table = table_shape.table
    table.columns[0].width = Inches(2.5)
    table.columns[1].width = Inches(2.8)
    table.columns[2].width = Inches(2.8)
    table.columns[3].width = Inches(3.233)

    headers = ["Evaluation Dimension", "Static Calculator / Excel", "Legacy Monolithic ERP", "Our Agentic AI Solution"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_RED if i == 3 else C_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.CENTER

    data = [
        ("Reasoning & Logic", "Hardcoded formula (Qty × Unit)", "Rigid rules requiring batch MRP run", "Autonomous 7-step perception-action-reasoning loop"),
        ("Safety Stock Buffer", "Ignored; risks zero stockout buffer", "Configurable but often overridden", "Strictly enforced: Available = Stock - Safety"),
        ("Context & Tools", "Zero external awareness", "Internal siloed relational DB", "Dynamic tool calling (DB, BOM, Inventory, Shortage)"),
        ("Explainability", "Black-box scalar output", "Complex multi-tab report tables", "18+ step transparent Chain-of-Thought Decision Log"),
        ("Deployment & Cost", "Low cost, high error risk", "Extremely expensive ($50k+ / year)", "Lightweight, zero-cost SQLite native, fast web UI")
    ]

    for row_idx, row_data in enumerate(data):
        for col_idx, text in enumerate(row_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(254, 242, 242) if col_idx == 3 else (C_WHITE if row_idx % 2 == 0 else C_CARD_BG)
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.size = Pt(10.5)
            p.font.color.rgb = C_RED if col_idx == 3 else C_DARK
            p.font.bold = (col_idx == 3 or col_idx == 0)

    # ==========================================
    # SLIDE 7: Presentation Flow 2 (05 - 08)
    # ==========================================
    s7 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s7, "Presentation Outline (Part 2)", "2. Presentation Flow", 7)

    flow_items_2 = [
        ("05", "Problem Modeling & Algorithms", "Mathematical equations, safety constraints, and the 7-step reasoning pipeline architecture.", C_RED),
        ("06", "Implementation of Project Features", "Full-stack implementation (React 18, Vite, Express, SQLite, OpenAI GPT-4o-mini fallback).", C_BLUE),
        ("07", "Results & Benchmark Demonstration", "Empirical validation on 500-unit Office Chair benchmark, financial synthesis, and PO generation.", C_GREEN),
        ("08", "Analysis of Developed Solution", "Critical evaluation of strengths, technical constraints, operational boundaries, and future scope.", C_PURPLE)
    ]

    for idx, (num, heading, desc, col) in enumerate(flow_items_2):
        x = lefts[idx % 2]
        y = tops[idx // 2]
        card = add_card(s7, x, y, Inches(5.5), Inches(2.1), C_WHITE, C_BORDER)
        
        badge_shape = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.3), y + Inches(0.3), Inches(0.85), Inches(0.55))
        badge_shape.fill.solid()
        badge_shape.fill.fore_color.rgb = col
        badge_shape.line.fill.background()
        btf = badge_shape.text_frame
        bp = btf.paragraphs[0]
        bp.alignment = PP_ALIGN.CENTER
        bp.text = num
        bp.font.size = Pt(16)
        bp.font.bold = True
        bp.font.color.rgb = C_WHITE

        t_box = s7.shapes.add_textbox(x + Inches(1.35), y + Inches(0.25), Inches(3.9), Inches(1.6))
        tf = t_box.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = heading
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = C_DARK

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 8: 05. Problem Modeling & Math Formulation
    # ==========================================
    s8 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s8, "05. Problem Modeling & Mathematical Formulation", "Mathematical Formulation", 8)

    formulas = [
        ("1. Gross Requirement Calculation",
         "Total Required (R_i) = Q × r_i",
         "Where Q is the production batch quantity (e.g. 500 units), and r_i is the unit ratio of material i defined in the Bill of Materials (BOM)."),
        ("2. Net Available Usable Stock",
         "Available Usable (U_i) = max( 0, S_i - B_i )",
         "Where S_i is the current warehouse stock and B_i is the mandatory safety stock reserve. Prevents emergency buffer cannibalization."),
        ("3. Shortage Deficit Identification",
         "Shortage (D_i) = max( 0, R_i - U_i )",
         "If D_i > 0, material is flagged with a warning (⚠) and queued for procurement. If D_i = 0, status is marked sufficient (✓)."),
        ("4. Financial Procurement Synthesis",
         "Total Procurement Cost (C) = Σ ( D_i × c_i )",
         "Where c_i is supplier unit cost. The agent auto-batches purchase quantities to prevent incomplete assemblies and financial overhead.")
    ]

    for idx, (f_title, formula, explanation) in enumerate(formulas):
        row = idx // 2
        col = idx % 2
        x = Inches(1.0) if col == 0 else Inches(7.0)
        y = Inches(1.7) + Inches(row * 2.6)

        card = add_card(s8, x, y, Inches(5.3), Inches(2.35), C_WHITE, C_BORDER)
        tb = s8.shapes.add_textbox(x + Inches(0.3), y + Inches(0.2), Inches(4.7), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = f_title
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = C_DARK

        p2 = tf.add_paragraph()
        p2.text = formula
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_RED
        p2.space_before = Pt(4)
        p2.space_after = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = explanation
        p3.font.size = Pt(11)
        p3.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 9: 05. Autonomous Agent Algorithm (7-Step Pipeline)
    # ==========================================
    s9 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s9, "05. Algorithm Development: 7-Step Reasoning Pipeline", "Agentic Architecture", 9)

    steps_7 = [
        ("Step 1: Perceive Order", "Parse target product, batch qty, and schedule."),
        ("Step 2: Retrieve BOM", "Query SQLite for component ratios & unit costs."),
        ("Step 3: Audit Warehouse", "Fetch storage bay stock & lock safety buffers."),
        ("Step 4: Gross Requirements", "Multiply batch size by BOM unit proportions."),
        ("Step 5: Detect Shortages", "Evaluate Usable Stock vs. Gross Requirements."),
        ("Step 6: Plan Procurement", "Batch orders by supplier and estimate costs."),
        ("Step 7: Executive Synthesis", "Generate narrative report & auditable log.")
    ]

    for idx, (stitle, sdesc) in enumerate(steps_7):
        y = Inches(1.65) + Inches(idx * 0.76)
        card = add_card(s9, Inches(1.0), y, Inches(11.333), Inches(0.68), C_WHITE, C_BORDER)

        num_box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.15), y + Inches(0.09), Inches(0.5), Inches(0.5))
        num_box.fill.solid()
        num_box.fill.fore_color.rgb = C_RED
        num_box.line.fill.background()
        ntf = num_box.text_frame
        np = ntf.paragraphs[0]
        np.alignment = PP_ALIGN.CENTER
        np.text = str(idx + 1)
        np.font.size = Pt(12)
        np.font.bold = True
        np.font.color.rgb = C_WHITE

        tb = s9.shapes.add_textbox(Inches(1.85), y + Inches(0.1), Inches(10.3), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{stitle}: "
        p.font.size = Pt(12.5)
        p.font.bold = True
        p.font.color.rgb = C_DARK

        run = p.add_run()
        run.text = sdesc
        run.font.bold = False
        run.font.size = Pt(11.5)
        run.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 10: 06. Implementation of Project Features
    # ==========================================
    s10 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s10, "06. Implementation: Full-Stack Tech Stack & System Design", "System Implementation", 10)

    tech_components = [
        ("Frontend Application", "React 18, Vite 5 & Tailwind CSS",
         ["Modular responsive dashboard with live KPIs",
          "Interactive BOM explorer and warehouse stock editor",
          "Recharts interactive bar and pie deficit charts",
          "Printable executive procurement modal report"],
         C_BLUE),
        ("Backend REST Services", "Node.js & Express API Server",
         ["High-throughput modular micro-endpoints",
          "Direct integration with agent planning engine",
          "CORS enabled with real-time JSON payload validation",
          "Persistent history management for viva demo runs"],
         C_GREEN),
        ("Database & Persistence", "SQLite (Native `node:sqlite`)",
         ["Zero external C++ build tools required (Python/gyp-free)",
          "ACID-compliant relational schema (Products, BOM, Stock)",
          "Foreign key constraints & cascade protection",
          "Fast local in-memory & file-based query resolution"],
         C_AMBER),
        ("AI Reasoning Engine", "Dual-Agent Architecture",
         ["OpenAI GPT-4o-mini for natural-language synthesis",
          "Autonomous Deterministic Agent for offline execution",
          "100% viva resilience: zero crash on network loss",
          "Enforces exact mathematical checks across LLM outputs"],
         C_RED)
    ]

    for idx, (title, sub, bullets, col) in enumerate(tech_components):
        row = idx // 2
        col_idx = idx % 2
        x = Inches(1.0) if col_idx == 0 else Inches(7.0)
        y = Inches(1.7) + Inches(row * 2.6)

        card = add_card(s10, x, y, Inches(5.3), Inches(2.35), C_WHITE, C_BORDER)
        tb = s10.shapes.add_textbox(x + Inches(0.3), y + Inches(0.15), Inches(4.7), Inches(2.05))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = C_DARK
        p2.space_after = Pt(4)

        for b in bullets:
            pb = tf.add_paragraph()
            pb.text = f"• {b}"
            pb.font.size = Pt(10)
            pb.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 11: 06. Key System Features & Interactive Dashboard
    # ==========================================
    s11 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s11, "06. Key Features: Dashboard & Explainable Decision Log", "Feature Capabilities", 11)

    features = [
        ("Real-Time Warehouse Stock Audit",
         "Managers can view, edit, and monitor physical warehouse bays, safety stock thresholds, and current stock in real-time.",
         "Safety Stock Guardian: Automatically warns whenever current stock dips into safety thresholds."),
        ("One-Click Agentic Planning Execution",
         "Select any product (e.g. Office Chair, Gaming Desk) and batch quantity to trigger the multi-step reasoning workflow.",
         "Live Execution Visualizer: Displays active animated progress badges across each reasoning step."),
        ("18+ Step Chain-of-Thought Decision Log",
         "Every calculation, database lookup, and shortage deduction is logged with timestamp, icon badge (✓ / ⚠ / ℹ), and details.",
         "Regulatory & Viva Auditability: Complete visibility into why each procurement recommendation was made."),
        ("Executive Procurement Report & PDF Export",
         "Synthesizes an executive narrative detailing total required capital, prioritized supplier purchase orders, and urgency.",
         "Printable Documentation: Ready for management sign-off and immediate purchase execution.")
    ]

    for idx, (ftitle, fbody, fbenefit) in enumerate(features):
        row = idx // 2
        col = idx % 2
        x = Inches(1.0) if col == 0 else Inches(7.0)
        y = Inches(1.7) + Inches(row * 2.6)

        card = add_card(s11, x, y, Inches(5.3), Inches(2.35), C_WHITE, C_BORDER)
        tb = s11.shapes.add_textbox(x + Inches(0.3), y + Inches(0.2), Inches(4.7), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = ftitle
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = C_RED

        p2 = tf.add_paragraph()
        p2.text = fbody
        p2.font.size = Pt(11)
        p2.font.color.rgb = C_DARK
        p2.space_before = Pt(4)
        p2.space_after = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = fbenefit
        p3.font.size = Pt(10.5)
        p3.font.bold = True
        p3.font.color.rgb = C_GREEN

    # ==========================================
    # SLIDE 12: 07. Results & Benchmark Demonstration
    # ==========================================
    s12 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s12, "07. Experimental Results: Benchmark Case Study (Office Chair)", "Experimental Results", 12)

    # Top summary card
    summary_card = add_card(s12, Inches(1.0), Inches(1.65), Inches(11.333), Inches(0.9), C_RED_LIGHT, C_RED)
    stf = summary_card.text_frame
    stf.word_wrap = True
    sp1 = stf.paragraphs[0]
    sp1.text = "Benchmark Test: Production of 500 Units of 'Office Chair' | Target Schedule: 7 Days"
    sp1.font.size = Pt(14)
    sp1.font.bold = True
    sp1.font.color.rgb = C_RED
    sp2 = stf.add_paragraph()
    sp2.text = "Result: Agent detected 2 material shortages, preserved 400 units of safety buffer, and generated $1,820 procurement plan."
    sp2.font.size = Pt(11.5)
    sp2.font.color.rgb = C_DARK

    # Table of benchmark
    t_shape = s12.shapes.add_table(5, 7, Inches(1.0), Inches(2.75), Inches(11.333), Inches(2.8))
    table = t_shape.table
    table.columns[0].width = Inches(1.8)
    table.columns[1].width = Inches(1.3)
    table.columns[2].width = Inches(1.6)
    table.columns[3].width = Inches(1.6)
    table.columns[4].width = Inches(1.6)
    table.columns[5].width = Inches(1.6)
    table.columns[6].width = Inches(1.833)

    t_headers = ["Raw Material", "BOM Ratio", "Total Req", "On-Hand Stock", "Safety Stock", "Net Shortage", "Procurement Cost"]
    for i, h in enumerate(t_headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.CENTER

    bench_data = [
        ("Steel (Alloy)", "2.0 kg", "1,000 kg", "700 kg", "100 kg", "400 kg (Deficit)", "400 kg × $2.80 = $1,120"),
        ("Plastic (Molded)", "1.5 kg", "750 kg", "900 kg", "100 kg", "0 kg (Sufficient)", "$0.00 (In Stock)"),
        ("Foam (High Dens.)", "0.8 kg", "400 kg", "300 kg", "100 kg", "200 kg (Deficit)", "200 kg × $3.50 = $700"),
        ("Fabric (Textile)", "1.2 m", "600 m", "700 m", "100 m", "0 m (Sufficient)", "$0.00 (In Stock)")
    ]

    for r_idx, r_data in enumerate(bench_data):
        for c_idx, val in enumerate(r_data):
            cell = table.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            is_deficit = "Deficit" in val or "$" in val and val != "$0.00 (In Stock)"
            cell.fill.fore_color.rgb = RGBColor(254, 242, 242) if (c_idx >= 5 and "Deficit" in bench_data[r_idx][5]) else (C_WHITE if r_idx % 2 == 0 else C_CARD_BG)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(10.5)
            p.font.color.rgb = C_RED if is_deficit else C_DARK
            p.font.bold = (c_idx == 0 or is_deficit)

    # Bottom metric cards
    m1 = add_card(s12, Inches(1.0), Inches(5.8), Inches(3.6), Inches(1.1), C_WHITE, C_BORDER)
    mtf1 = m1.text_frame
    mtf1.paragraphs[0].text = "Total Procurement Budget"
    mtf1.paragraphs[0].font.size = Pt(11)
    mtf1.paragraphs[0].font.color.rgb = C_MUTED
    mp1 = mtf1.add_paragraph()
    mp1.text = "$1,820.00 USD"
    mp1.font.size = Pt(18)
    mp1.font.bold = True
    mp1.font.color.rgb = C_RED

    m2 = add_card(s12, Inches(4.866), Inches(5.8), Inches(3.6), Inches(1.1), C_WHITE, C_BORDER)
    mtf2 = m2.text_frame
    mtf2.paragraphs[0].text = "Safety Buffer Protected"
    mtf2.paragraphs[0].font.size = Pt(11)
    mtf2.paragraphs[0].font.color.rgb = C_MUTED
    mp2 = mtf2.add_paragraph()
    mp2.text = "100% Buffer Retained"
    mp2.font.size = Pt(18)
    mp2.font.bold = True
    mp2.font.color.rgb = C_GREEN

    m3 = add_card(s12, Inches(8.733), Inches(5.8), Inches(3.6), Inches(1.1), C_WHITE, C_BORDER)
    mtf3 = m3.text_frame
    mtf3.paragraphs[0].text = "Agent Execution Latency"
    mtf3.paragraphs[0].font.size = Pt(11)
    mtf3.paragraphs[0].font.color.rgb = C_MUTED
    mp3 = mtf3.add_paragraph()
    mp3.text = "< 180 ms (Deterministic)"
    mp3.font.size = Pt(18)
    mp3.font.bold = True
    mp3.font.color.rgb = C_BLUE

    # ==========================================
    # SLIDE 13: RESERVED FOR USER TO EDIT
    # ==========================================
    s13 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s13, "[Reserved Slide: Student Demonstration / Custom Edit]", "Live Demonstration & Custom Notes", 13)

    # Big placeholder card for user customization
    reserved_card = add_card(s13, Inches(1.0), Inches(1.65), Inches(11.333), Inches(5.2), C_WHITE, C_RED)
    rtf = reserved_card.text_frame
    rtf.word_wrap = True
    rtf.margin_top = Inches(0.4)
    rtf.margin_left = Inches(0.6)
    rtf.margin_right = Inches(0.6)

    rp1 = rtf.paragraphs[0]
    rp1.text = "★ THIS PAGE IS RESERVED FOR YOUR CUSTOM EDITS & LIVE DEMONSTRATION"
    rp1.font.size = Pt(18)
    rp1.font.bold = True
    rp1.font.color.rgb = C_RED

    rp2 = rtf.add_paragraph()
    rp2.text = "You can customize this slide before or during your presentation with your preferred content:"
    rp2.font.size = Pt(13)
    rp2.font.color.rgb = C_DARK
    rp2.space_before = Pt(8)
    rp2.space_after = Pt(14)

    suggestions = [
        "1. Live Software Demo Screenshots: Insert screenshots of the Dashboard, Orders View, or Inventory View.",
        "2. Agent Decision Log Snapshots: Paste a screenshot of the 18-step Chain-of-Thought logs generated during runtime.",
        "3. Team Contributions & Division of Work: Detail individual team member responsibilities for project evaluation.",
        "4. Examiner Question / Custom Faculty Notes: Use this slide to address specific advisor feedback or viva rubrics."
    ]

    for s in suggestions:
        sp = rtf.add_paragraph()
        sp.text = f"•  {s}"
        sp.font.size = Pt(12)
        sp.font.color.rgb = C_MUTED
        sp.space_after = Pt(8)

    # Dotted mockup box inside slide 13
    mock_box = s13.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(2.0), Inches(4.5), Inches(9.333), Inches(2.0))
    mock_box.fill.solid()
    mock_box.fill.fore_color.rgb = C_CARD_BG
    mock_box.line.color.rgb = C_MUTED
    mock_box.line.width = Pt(1.5)
    mtf = mock_box.text_frame
    mp = mtf.paragraphs[0]
    mp.alignment = PP_ALIGN.CENTER
    mp.text = "\n[ CLICK HERE IN POWERPOINT TO INSERT SCREENSHOT / CODE / CUSTOM DIAGRAM ]"
    mp.font.size = Pt(13)
    mp.font.bold = True
    mp.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 14: 08. Analysis of Developed Solution
    # ==========================================
    s14 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s14, "08. Solution Analysis: Strengths & Weaknesses", "Analysis of Solution", 14)

    # Strengths column
    scard = add_card(s14, Inches(1.0), Inches(1.7), Inches(5.4), Inches(5.1), C_WHITE, C_BORDER)
    s_top = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.7), Inches(5.4), Inches(0.6))
    s_top.fill.solid()
    s_top.fill.fore_color.rgb = C_GREEN
    s_top.line.fill.background()
    stf = s_top.text_frame
    sp = stf.paragraphs[0]
    sp.alignment = PP_ALIGN.CENTER
    sp.text = "Strengths & Competitive Advantages"
    sp.font.size = Pt(13)
    sp.font.bold = True
    sp.font.color.rgb = C_WHITE

    stb = s14.shapes.add_textbox(Inches(1.2), Inches(2.45), Inches(5.0), Inches(4.2))
    sttf = stb.text_frame
    sttf.word_wrap = True
    strengths = [
        ("Zero-Failure Viva Reliability", "Dual-agent fallback ensures 100% operational uptime even without internet access or OpenAI keys."),
        ("Rigorous Buffer Preservation", "Prevents stockouts by guaranteeing that emergency safety stock is strictly excluded from consumable production pool."),
        ("Complete Auditability", "Every single inference and calculation step is recorded with timestamps in persistent SQLite tables."),
        ("Modern Lightweight Footprint", "Built using Node.js native SQLite and Vite React — zero heavy build chains, C++ compiler or license costs.")
    ]
    for s_title, s_desc in strengths:
        p = sttf.add_paragraph() if sttf.paragraphs[0].text else sttf.paragraphs[0]
        p.text = f"✔ {s_title}"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_GREEN
        p2 = sttf.add_paragraph()
        p2.text = s_desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = C_DARK
        p2.space_after = Pt(8)

    # Weaknesses column
    wcard = add_card(s14, Inches(6.9), Inches(1.7), Inches(5.4), Inches(5.1), C_WHITE, C_BORDER)
    w_top = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(1.7), Inches(5.4), Inches(0.6))
    w_top.fill.solid()
    w_top.fill.fore_color.rgb = C_RED
    w_top.line.fill.background()
    wtf = w_top.text_frame
    wp = wtf.paragraphs[0]
    wp.alignment = PP_ALIGN.CENTER
    wp.text = "Limitations & Operational Weaknesses"
    wp.font.size = Pt(13)
    wp.font.bold = True
    wp.font.color.rgb = C_WHITE

    wtb = s14.shapes.add_textbox(Inches(7.1), Inches(2.45), Inches(5.0), Inches(4.2))
    wttf = wtb.text_frame
    wttf.word_wrap = True
    weaknesses = [
        ("Deterministic Lead-Time Assumption", "Current logic assumes fixed supplier lead times (e.g. 7 days); does not yet model stochastic supply chain delays."),
        ("Single-Currency Cost Estimation", "Financial calculations currently compute USD/INR in a single baseline currency without real-time exchange rates."),
        ("Single-Warehouse Topology", "Currently optimizes for centralized storage bays rather than multi-echelon geographical depot distribution."),
        ("Manual PO Dispatch", "Generated procurement orders currently export as PDF/JSON rather than directly triggering EDI / ERP supplier webhooks.")
    ]
    for w_title, w_desc in weaknesses:
        p = wttf.add_paragraph() if wttf.paragraphs[0].text else wttf.paragraphs[0]
        p.text = f"✖ {w_title}"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_RED
        p2 = wttf.add_paragraph()
        p2.text = w_desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = C_DARK
        p2.space_after = Pt(8)

    # ==========================================
    # SLIDE 15: Conclusion, Future Scope & Viva Defense
    # ==========================================
    s15 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(s15, "Conclusion & Future Research Initiatives", "Conclusion & Defense", 15)

    c_card1 = add_card(s15, Inches(1.0), Inches(1.7), Inches(5.4), Inches(2.4), C_WHITE, C_BORDER)
    ctb1 = s15.shapes.add_textbox(Inches(1.2), Inches(1.85), Inches(5.0), Inches(2.1))
    ctf1 = ctb1.text_frame
    ctf1.word_wrap = True
    cp1 = ctf1.paragraphs[0]
    cp1.text = "Project Summary & Achievements"
    cp1.font.size = Pt(14)
    cp1.font.bold = True
    cp1.font.color.rgb = C_RED
    achievements = [
        "Replaced manual, error-prone calculations with autonomous agentic intelligence.",
        "Enforced strict mathematical preservation of warehouse safety stock buffers.",
        "Engineered zero-dependency SQLite architecture with complete reasoning logs.",
        "Empirically verified on benchmark manufacturing scenarios with high fidelity."
    ]
    for a in achievements:
        p = ctf1.add_paragraph()
        p.text = f"• {a}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_DARK

    c_card2 = add_card(s15, Inches(6.9), Inches(1.7), Inches(5.4), Inches(2.4), C_WHITE, C_BORDER)
    ctb2 = s15.shapes.add_textbox(Inches(7.1), Inches(1.85), Inches(5.0), Inches(2.1))
    ctf2 = ctb2.text_frame
    ctf2.word_wrap = True
    cp2 = ctf2.paragraphs[0]
    cp2.text = "Future Research & Enhancements"
    cp2.font.size = Pt(14)
    cp2.font.bold = True
    cp2.font.color.rgb = C_BLUE
    future_work = [
        "Dynamic Supplier Bidding: Reverse auctions to dynamically choose optimal supplier.",
        "Predictive Demand Forecasting: LSTM/Transformer integration for seasonality prediction.",
        "ERP Webhook Integration: Direct dispatch of purchase orders via SAP/Netsuite APIs.",
        "Multi-Echelon Optimization: Multi-hub inventory balancing across distributed warehouses."
    ]
    for f in future_work:
        p = ctf2.add_paragraph()
        p.text = f"• {f}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_DARK

    # Bottom Viva Q&A Banner
    qa_card = add_card(s15, Inches(1.0), Inches(4.35), Inches(11.333), Inches(2.45), C_RED, C_RED)
    qtf = qa_card.text_frame
    qtf.word_wrap = True
    qtf.margin_top = Inches(0.3)
    qp1 = qtf.paragraphs[0]
    qp1.alignment = PP_ALIGN.CENTER
    qp1.text = "Thank You! Questions & Discussion"
    qp1.font.size = Pt(24)
    qp1.font.bold = True
    qp1.font.color.rgb = C_WHITE

    qp2 = qtf.add_paragraph()
    qp2.alignment = PP_ALIGN.CENTER
    qp2.text = "Automated Raw Material Requirement Agent | Symbiosis Institute of Technology, Nagpur"
    qp2.font.size = Pt(13)
    qp2.font.color.rgb = RGBColor(254, 226, 226)
    qp2.space_before = Pt(4)
    qp2.space_after = Pt(12)

    qp3 = qtf.add_paragraph()
    qp3.alignment = PP_ALIGN.CENTER
    qp3.text = "Core Viva Takeaway: 'An agent is not just a formula; it is a multi-step perception, verification, and audit loop that preserves safety reserves and guarantees operational continuity.'"
    qp3.font.size = Pt(12)
    qp3.font.color.rgb = C_WHITE

    output_path = os.path.join(os.path.dirname(__file__), "Automated_Raw_Material_Requirement_Agent_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation successfully saved to: {output_path}")

if __name__ == "__main__":
    create_presentation()
