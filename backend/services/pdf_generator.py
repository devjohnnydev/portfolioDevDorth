import io
import traceback
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# Color palette
PRIMARY = HexColor('#3B82F6')
DARK = HexColor('#0F172A')
GRAY_800 = HexColor('#1E293B')
GRAY_600 = HexColor('#475569')
GRAY_400 = HexColor('#94A3B8')
GRAY_200 = HexColor('#E2E8F0')
WHITE = HexColor('#FFFFFF')


def safe_text(text):
    """Remove non-ASCII characters that Helvetica can't render."""
    if not text:
        return ''
    # Replace common emoji/unicode with ASCII equivalents
    replacements = {
        '\u2709': '[E]',     # ✉
        '\U0001f4cd': '[L]', # 📍
        '\u2022': '-',       # •
        '\u2013': '-',       # –
        '\u2014': '-',       # —
        '\u2018': "'",       # '
        '\u2019': "'",       # '
        '\u201c': '"',       # "
        '\u201d': '"',       # "
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    # Strip remaining non-latin1 characters
    return text.encode('latin-1', errors='replace').decode('latin-1')


def generate_resume_pdf(profile, experiences, projects, skills, certifications=None):
    buffer = io.BytesIO()
    
    try:
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=30,
            leftMargin=30,
            topMargin=25,
            bottomMargin=25,
        )

        styles = getSampleStyleSheet()
        
        # ─── Custom Styles ───
        name_style = ParagraphStyle(
            'NameStyle',
            parent=styles['Heading1'],
            fontSize=26, leading=30, spaceAfter=2,
            textColor=DARK, fontName='Helvetica-Bold',
        )
        
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Normal'],
            fontSize=13, leading=16, spaceAfter=8,
            textColor=PRIMARY, fontName='Helvetica',
        )
        
        contact_style = ParagraphStyle(
            'ContactStyle',
            parent=styles['Normal'],
            fontSize=9, leading=12, spaceAfter=4,
            textColor=GRAY_600, fontName='Helvetica',
        )
        
        section_title_style = ParagraphStyle(
            'SectionTitleStyle',
            parent=styles['Heading2'],
            fontSize=13, leading=16, spaceBefore=16, spaceAfter=6,
            textColor=PRIMARY, fontName='Helvetica-Bold',
            borderWidth=0, borderPadding=0,
        )
        
        body_style = ParagraphStyle(
            'BodyStyle',
            parent=styles['Normal'],
            fontSize=10, leading=14,
            textColor=GRAY_800, fontName='Helvetica',
        )
        
        item_title_style = ParagraphStyle(
            'ItemTitleStyle',
            parent=styles['Heading3'],
            fontSize=11, leading=14, spaceBefore=8, spaceAfter=1,
            textColor=DARK, fontName='Helvetica-Bold',
        )
        
        item_subtitle_style = ParagraphStyle(
            'ItemSubStyle',
            parent=styles['Normal'],
            fontSize=9, leading=12, spaceAfter=3,
            textColor=GRAY_400, fontName='Helvetica-Oblique',
        )

        bio_style = ParagraphStyle(
            'BioStyle',
            parent=styles['Normal'],
            fontSize=10, leading=14, spaceAfter=6,
            textColor=GRAY_600, fontName='Helvetica',
        )

        story = []

        # ═══════════════════════════════════════
        # HEADER — Name + Title + Contact
        # ═══════════════════════════════════════
        name = safe_text(getattr(profile, 'name', '') or 'Desenvolvedor')
        title = safe_text(getattr(profile, 'title', '') or 'Fullstack Developer')
        
        story.append(Paragraph(name, name_style))
        story.append(Paragraph(title, title_style))
        
        contact_parts = []
        email = getattr(profile, 'email', '') or ''
        location = getattr(profile, 'location', '') or ''
        social_links = getattr(profile, 'social_links', None) or {}
        
        if email:
            contact_parts.append(safe_text(f'Email: {email}'))
        if location:
            contact_parts.append(safe_text(f'Local: {location}'))
        if social_links.get('github'):
            contact_parts.append(safe_text(f'GitHub: {social_links["github"]}'))
        if social_links.get('linkedin'):
            contact_parts.append(safe_text(f'LinkedIn: {social_links["linkedin"]}'))
        
        if contact_parts:
            story.append(Paragraph(' | '.join(contact_parts), contact_style))
        
        # Separator line
        story.append(Spacer(1, 6))
        story.append(HRFlowable(
            width="100%", thickness=1.5,
            color=PRIMARY, spaceAfter=8, spaceBefore=2
        ))
        
        # Bio / Summary
        bio = safe_text(getattr(profile, 'bio', '') or '')
        if bio:
            story.append(Paragraph('<b>RESUMO PROFISSIONAL</b>', ParagraphStyle(
                'SummaryLabel', parent=styles['Normal'],
                fontSize=10, textColor=DARK, fontName='Helvetica-Bold',
                spaceAfter=3,
            )))
            story.append(Paragraph(bio, bio_style))

        # ═══════════════════════════════════════
        # SKILLS — Grouped by category
        # ═══════════════════════════════════════
        if skills:
            story.append(Paragraph('HABILIDADES TECNICAS', section_title_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
            
            categories = {}
            for skill in skills:
                cat = getattr(skill, 'category', 'Geral') or 'Geral'
                if cat not in categories:
                    categories[cat] = []
                categories[cat].append(skill)
            
            for category, skill_list in categories.items():
                skill_names = ', '.join([
                    safe_text(f'{s.name} ({s.proficiency}%)') 
                    for s in skill_list
                ])
                story.append(Paragraph(
                    f'<b>{safe_text(category)}:</b> {skill_names}',
                    body_style
                ))
                story.append(Spacer(1, 3))

        # ═══════════════════════════════════════
        # EXPERIENCE
        # ═══════════════════════════════════════
        if experiences:
            story.append(Paragraph('EXPERIENCIA PROFISSIONAL', section_title_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
            
            for exp in experiences:
                exp_title = safe_text(getattr(exp, 'title', '') or '')
                exp_period = safe_text(getattr(exp, 'period', '') or '')
                exp_company = safe_text(getattr(exp, 'company', '') or '')
                exp_desc = safe_text(getattr(exp, 'description', '') or '')
                
                # Title + Period in a table
                title_para = Paragraph(f'<b>{exp_title}</b>', item_title_style)
                period_para = Paragraph(exp_period, ParagraphStyle(
                    'PeriodStyle', parent=styles['Normal'],
                    fontSize=9, textColor=GRAY_400, fontName='Helvetica',
                    alignment=TA_RIGHT,
                ))
                
                t = Table([[title_para, period_para]], colWidths=['70%', '30%'])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ]))
                story.append(t)
                
                if exp_company:
                    story.append(Paragraph(exp_company, item_subtitle_style))
                if exp_desc:
                    for line in exp_desc.split('\n'):
                        line = line.strip()
                        if line:
                            story.append(Paragraph(f'  {line}', body_style))
                story.append(Spacer(1, 4))

        # ═══════════════════════════════════════
        # PROJECTS (Featured first, then rest)
        # ═══════════════════════════════════════
        if projects:
            featured = [p for p in projects if getattr(p, 'featured', False)]
            if not featured:
                featured = projects[:4]
            
            if featured:
                story.append(Paragraph('PROJETOS EM DESTAQUE', section_title_style))
                story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
                
                for proj in featured:
                    proj_title = safe_text(getattr(proj, 'title', '') or '')
                    proj_tech = safe_text(getattr(proj, 'tech', '') or '')
                    proj_desc = safe_text(getattr(proj, 'description', '') or '')
                    proj_github = getattr(proj, 'github_url', '') or ''
                    proj_demo = getattr(proj, 'demo_url', '') or ''
                    
                    story.append(Paragraph(f'<b>{proj_title}</b>', item_title_style))
                    
                    if proj_tech:
                        story.append(Paragraph(f'<i>Tecnologias: {proj_tech}</i>', item_subtitle_style))
                    if proj_desc:
                        story.append(Paragraph(proj_desc, body_style))
                    
                    urls = []
                    if proj_github:
                        urls.append(safe_text(f'GitHub: {proj_github}'))
                    if proj_demo:
                        urls.append(safe_text(f'Demo: {proj_demo}'))
                    if urls:
                        story.append(Paragraph(' | '.join(urls), ParagraphStyle(
                            'URLStyle', parent=styles['Normal'],
                            fontSize=8, textColor=PRIMARY, fontName='Helvetica',
                        )))
                    story.append(Spacer(1, 4))

        # ═══════════════════════════════════════
        # CERTIFICATIONS
        # ═══════════════════════════════════════
        if certifications:
            story.append(Paragraph('CERTIFICACOES', section_title_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
            
            for cert in certifications:
                cert_title = safe_text(getattr(cert, 'title', '') or '')
                cert_date = safe_text(getattr(cert, 'date', '') or '')
                cert_inst = safe_text(getattr(cert, 'institution', '') or '')
                cert_desc = safe_text(getattr(cert, 'description', '') or '')
                
                title_p = Paragraph(f'<b>{cert_title}</b>', item_title_style)
                date_p = Paragraph(cert_date, ParagraphStyle(
                    'CertDate', parent=styles['Normal'],
                    fontSize=9, textColor=GRAY_400, fontName='Helvetica',
                    alignment=TA_RIGHT,
                ))
                
                t = Table([[title_p, date_p]], colWidths=['70%', '30%'])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ]))
                story.append(t)
                if cert_inst:
                    story.append(Paragraph(cert_inst, item_subtitle_style))
                if cert_desc:
                    story.append(Paragraph(cert_desc, body_style))
                story.append(Spacer(1, 3))

        # ═══════════════════════════════════════
        # LINKS IMPORTANTES
        # ═══════════════════════════════════════
        if social_links and any(social_links.values()):
            story.append(Paragraph('LINKS IMPORTANTES', section_title_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
            
            link_labels = {
                'github': 'GitHub',
                'linkedin': 'LinkedIn',
                'email': 'Email',
                'instagram': 'Instagram',
                'whatsapp': 'WhatsApp',
            }
            for key, label in link_labels.items():
                url = social_links.get(key, '')
                if url:
                    story.append(Paragraph(
                        f'<b>{label}:</b> {safe_text(url)}',
                        body_style
                    ))

        # ═══════════════════════════════════════
        # STATS footer
        # ═══════════════════════════════════════
        stats = getattr(profile, 'stats', None) or []
        if stats and len(stats) > 0:
            story.append(Spacer(1, 10))
            story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=8))
            stats_parts = []
            for s in stats:
                val = safe_text(str(s.get('value', '')))
                lbl = safe_text(str(s.get('label', '')))
                if val or lbl:
                    stats_parts.append(f'<b>{val}</b> {lbl}')
            if stats_parts:
                story.append(Paragraph(
                    ' | '.join(stats_parts),
                    ParagraphStyle(
                        'StatsStyle', parent=styles['Normal'],
                        fontSize=10, textColor=GRAY_600, fontName='Helvetica',
                        alignment=TA_CENTER,
                    )
                ))

        # Build PDF
        doc.build(story)
        
    except Exception as e:
        # If something goes wrong, return a minimal PDF with error info
        print(f"PDF generation error: {e}")
        traceback.print_exc()
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        story = [
            Paragraph("Erro ao gerar curriculo", styles['Heading1']),
            Spacer(1, 20),
            Paragraph(f"Detalhes: {str(e)}", styles['Normal']),
        ]
        doc.build(story)
    
    buffer.seek(0)
    return buffer
