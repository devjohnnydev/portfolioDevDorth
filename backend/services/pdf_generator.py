import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from ..models import Profile, Experience, Project, Skill

def generate_resume_pdf(profile, experiences, projects, skills):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=5,
        textColor='#1E293B', # Slate 800
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=14,
        spaceAfter=15,
        textColor='#3B82F6', # Blue 500
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        spaceBefore=20,
        spaceAfter=10,
        textColor='#0F172A',
        borderWidth=0,
        borderPadding=0,
    )
    
    normal_style = styles['Normal']
    normal_style.fontSize = 11
    normal_style.textColor = '#334155'
    normal_style.leading = 16

    item_title_style = ParagraphStyle(
        'ItemTitle',
        parent=styles['Heading3'],
        fontSize=12,
        spaceBefore=10,
        spaceAfter=2,
        textColor='#1E293B',
    )
    
    item_subtitle_style = ParagraphStyle(
        'ItemSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=5,
        textColor='#64748B',
    )

    story = []

    # Profile Section
    if profile:
        story.append(Paragraph(profile.name, title_style))
        story.append(Paragraph(profile.title, subtitle_style))
        
        contact_info = []
        if profile.email: contact_info.append(profile.email)
        if profile.location: contact_info.append(profile.location)
        if profile.social_links:
            if 'github' in profile.social_links:
                contact_info.append(f"GitHub: {profile.social_links['github']}")
            if 'linkedin' in profile.social_links:
                contact_info.append(f"LinkedIn: {profile.social_links['linkedin']}")
        
        if contact_info:
            story.append(Paragraph(" | ".join(contact_info), item_subtitle_style))
            story.append(Spacer(1, 15))
            
        if profile.bio:
            story.append(Paragraph(profile.bio, normal_style))
            story.append(Spacer(1, 20))

    # Experience Section
    if experiences:
        story.append(Paragraph("Experiência Profissional", section_title_style))
        # Add a subtle line
        story.append(Paragraph("<font color='#E2E8F0'>_________________________________________________________________________________</font>", normal_style))
        story.append(Spacer(1, 10))
        
        for exp in experiences:
            story.append(Paragraph(exp.title, item_title_style))
            story.append(Paragraph(f"{exp.company} | {exp.period}", item_subtitle_style))
            if exp.description:
                story.append(Paragraph(exp.description, normal_style))
            story.append(Spacer(1, 5))

    # Projects Section (Featured only maybe? Or all of them)
    if projects:
        story.append(Paragraph("Projetos em Destaque", section_title_style))
        story.append(Paragraph("<font color='#E2E8F0'>_________________________________________________________________________________</font>", normal_style))
        story.append(Spacer(1, 10))
        
        for proj in [p for p in projects if p.featured]:
            story.append(Paragraph(proj.title, item_title_style))
            
            tech_str = proj.tech if proj.tech else ""
            if tech_str:
                story.append(Paragraph(f"Tecnologias: {tech_str}", item_subtitle_style))
                
            if proj.description:
                story.append(Paragraph(proj.description, normal_style))
            story.append(Spacer(1, 5))

    # Skills Section
    if skills:
        story.append(Paragraph("Habilidades Técnicas", section_title_style))
        story.append(Paragraph("<font color='#E2E8F0'>_________________________________________________________________________________</font>", normal_style))
        story.append(Spacer(1, 10))
        
        categories = {}
        for skill in skills:
            if skill.category not in categories:
                categories[skill.category] = []
            categories[skill.category].append(skill.name)
            
        for category, skill_list in categories.items():
            story.append(Paragraph(f"<b>{category}:</b> {', '.join(skill_list)}", normal_style))
            story.append(Spacer(1, 5))

    # Build PDF
    doc.build(story)
    
    buffer.seek(0)
    return buffer
