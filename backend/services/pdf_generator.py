import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.units import mm, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from models import Profile, Experience, Project, Skill, Certification

# Color palette
PRIMARY = HexColor('#3B82F6')
DARK = HexColor('#0F172A')
GRAY_800 = HexColor('#1E293B')
GRAY_600 = HexColor('#475569')
GRAY_400 = HexColor('#94A3B8')
GRAY_200 = HexColor('#E2E8F0')
GRAY_50 = HexColor('#F8FAFC')
WHITE = HexColor('#FFFFFF')
ACCENT = HexColor('#8B5CF6')

def generate_resume_pdf(profile, experiences, projects, skills, certifications=None):
    buffer = io.BytesIO()
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
        fontSize=26,
        leading=30,
        spaceAfter=2,
        textColor=DARK,
        fontName='Helvetica-Bold',
    )
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Normal'],
        fontSize=13,
        leading=16,
        spaceAfter=8,
        textColor=PRIMARY,
        fontName='Helvetica',
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        spaceAfter=4,
        textColor=GRAY_600,
        fontName='Helvetica',
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitleStyle',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        spaceBefore=16,
        spaceAfter=6,
        textColor=PRIMARY,
        fontName='Helvetica-Bold',
        borderWidth=0,
        borderPadding=0,
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=GRAY_800,
        fontName='Helvetica',
    )
    
    item_title_style = ParagraphStyle(
        'ItemTitleStyle',
        parent=styles['Heading3'],
        fontSize=11,
        leading=14,
        spaceBefore=8,
        spaceAfter=1,
        textColor=DARK,
        fontName='Helvetica-Bold',
    )
    
    item_subtitle_style = ParagraphStyle(
        'ItemSubStyle',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        spaceAfter=3,
        textColor=GRAY_400,
        fontName='Helvetica-Oblique',
    )

    bio_style = ParagraphStyle(
        'BioStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        spaceAfter=6,
        textColor=GRAY_600,
        fontName='Helvetica',
    )

    skill_tag_style = ParagraphStyle(
        'SkillTag',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=GRAY_800,
        fontName='Helvetica',
    )

    story = []

    # ═══════════════════════════════════════
    # HEADER — Name + Title + Contact
    # ═══════════════════════════════════════
    if profile:
        story.append(Paragraph(profile.name or 'Desenvolvedor', name_style))
        story.append(Paragraph(profile.title or 'Fullstack Developer', title_style))
        
        contact_parts = []
        if profile.email:
            contact_parts.append(f'✉ {profile.email}')
        if profile.location:
            contact_parts.append(f'📍 {profile.location}')
        if profile.social_links:
            if profile.social_links.get('github'):
                contact_parts.append(f'GitHub: {profile.social_links["github"]}')
            if profile.social_links.get('linkedin'):
                contact_parts.append(f'LinkedIn: {profile.social_links["linkedin"]}')
        
        if contact_parts:
            story.append(Paragraph(' &nbsp;|&nbsp; '.join(contact_parts), contact_style))
        
        # Separator line
        story.append(Spacer(1, 6))
        story.append(HRFlowable(
            width="100%", thickness=1.5,
            color=PRIMARY, spaceAfter=8, spaceBefore=2
        ))
        
        # Bio / Summary
        if profile.bio:
            story.append(Paragraph('<b>Resumo Profissional</b>', ParagraphStyle(
                'SummaryLabel',
                parent=styles['Normal'],
                fontSize=10,
                textColor=DARK,
                fontName='Helvetica-Bold',
                spaceAfter=3,
            )))
            story.append(Paragraph(profile.bio, bio_style))

    # ═══════════════════════════════════════
    # EXPERIENCE
    # ═══════════════════════════════════════
    if experiences:
        story.append(Paragraph('EXPERIÊNCIA PROFISSIONAL', section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
        
        for exp in experiences:
            # Title + Period in a table for alignment
            title_para = Paragraph(f'<b>{exp.title}</b>', item_title_style)
            period_para = Paragraph(exp.period or '', ParagraphStyle(
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
            
            story.append(Paragraph(exp.company or '', item_subtitle_style))
            if exp.description:
                # Handle multi-line descriptions
                for line in exp.description.split('\n'):
                    line = line.strip()
                    if line:
                        if line.startswith('-') or line.startswith('•'):
                            story.append(Paragraph(f'&nbsp;&nbsp;{line}', body_style))
                        else:
                            story.append(Paragraph(line, body_style))
            story.append(Spacer(1, 4))

    # ═══════════════════════════════════════
    # PROJECTS (Featured)
    # ═══════════════════════════════════════
    featured_projects = [p for p in (projects or []) if p.featured]
    if not featured_projects:
        featured_projects = (projects or [])[:4]  # Show up to 4 if none are featured
    
    if featured_projects:
        story.append(Paragraph('PROJETOS EM DESTAQUE', section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
        
        for proj in featured_projects:
            story.append(Paragraph(f'<b>{proj.title}</b>', item_title_style))
            
            tech_str = proj.tech if proj.tech else ""
            if tech_str:
                story.append(Paragraph(f'<i>Tecnologias: {tech_str}</i>', item_subtitle_style))
                
            if proj.description:
                story.append(Paragraph(proj.description, body_style))
            
            urls = []
            if proj.github_url:
                urls.append(f'GitHub: {proj.github_url}')
            if proj.demo_url:
                urls.append(f'Demo: {proj.demo_url}')
            if urls:
                story.append(Paragraph(' | '.join(urls), ParagraphStyle(
                    'URLStyle', parent=styles['Normal'],
                    fontSize=8, textColor=PRIMARY, fontName='Helvetica',
                )))
            story.append(Spacer(1, 4))

    # ═══════════════════════════════════════
    # SKILLS — Grouped by category with visual bars
    # ═══════════════════════════════════════
    if skills:
        story.append(Paragraph('HABILIDADES TÉCNICAS', section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
        
        categories = {}
        for skill in skills:
            if skill.category not in categories:
                categories[skill.category] = []
            categories[skill.category].append(skill)
        
        for category, skill_list in categories.items():
            skill_names = ', '.join([f'{s.name} ({s.proficiency}%)' for s in skill_list])
            story.append(Paragraph(
                f'<b>{category}:</b> {skill_names}',
                body_style
            ))
            story.append(Spacer(1, 3))

    # ═══════════════════════════════════════
    # CERTIFICATIONS
    # ═══════════════════════════════════════
    if certifications:
        story.append(Paragraph('CERTIFICAÇÕES', section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=6))
        
        for cert in certifications:
            cert_title = Paragraph(f'<b>{cert.title}</b>', item_title_style)
            cert_date = Paragraph(cert.date or '', ParagraphStyle(
                'CertDate', parent=styles['Normal'],
                fontSize=9, textColor=GRAY_400, fontName='Helvetica',
                alignment=TA_RIGHT,
            ))
            
            t = Table([[cert_title, cert_date]], colWidths=['70%', '30%'])
            t.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ]))
            story.append(t)
            story.append(Paragraph(cert.institution, item_subtitle_style))
            if cert.description:
                story.append(Paragraph(cert.description, body_style))
            story.append(Spacer(1, 3))

    # ═══════════════════════════════════════
    # STATS (if available)
    # ═══════════════════════════════════════
    if profile and profile.stats and len(profile.stats) > 0:
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_200, spaceAfter=8))
        stats_text = ' &nbsp;•&nbsp; '.join([
            f'<b>{s.get("value", "")}</b> {s.get("label", "")}'
            for s in profile.stats
        ])
        story.append(Paragraph(stats_text, ParagraphStyle(
            'StatsStyle', parent=styles['Normal'],
            fontSize=10, textColor=GRAY_600, fontName='Helvetica',
            alignment=TA_CENTER,
        )))

    # Build PDF
    doc.build(story)
    
    buffer.seek(0)
    return buffer
