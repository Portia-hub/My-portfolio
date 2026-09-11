#!/usr/bin/env python3
"""
generate_site.py
-----------------
A small, dependency-free static site generator for this portfolio.

Why this exists: instead of hand-editing skills, experience, and
project details across index.html and projects.html separately (and
inevitably letting them drift out of sync), this script reads a single
source of truth (content.json) and renders the dynamic sections of the
HTML pages from it.

Usage:
    python3 generate_site.py

It reads:
    content.json           -- all resume/portfolio data
    templates/index.tpl.html
    templates/projects.tpl.html

It writes:
    index.html
    projects.html

Each template contains simple placeholder markers like
{{SKILLS}}, {{EXPERIENCE}}, {{PROJECTS}}, {{LANGUAGES}} which this
script replaces with generated HTML fragments. No external templating
library is used on purpose, so the whole build has zero dependencies
and works anywhere Python 3 runs.
"""

import json
from pathlib import Path

ROOT = Path(__file__).parent
CONTENT_FILE = ROOT / "content.json"
TEMPLATE_DIR = ROOT / "templates"


def load_content():
    with open(CONTENT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def render_languages(languages):
    items = []
    for lang in languages:
        items.append(
            f'<div class="lang-row"><span>{lang["name"]}</span>'
            f'<span class="lang-level">{lang["level"]}</span></div>'
        )
    return "\n".join(items)


def render_skills(skills):
    items = []
    for skill in skills:
        items.append(
            '<div class="skill-row">'
            f'<h3>{skill["title"]}</h3>'
            f'<p>{skill["detail"]}</p>'
            "</div>"
        )
    return "\n".join(items)


def render_experience(experience):
    items = []
    for job in experience:
        points = "\n".join(f"<li>{p}</li>" for p in job["points"])
        items.append(
            '<article class="timeline-item">'
            f'<span class="timeline-date">{job["dates"]}</span>'
            f'<h3>{job["title"]}</h3>'
            f'<span class="timeline-org">{job["org"]}</span>'
            f'<ul>{points}</ul>'
            "</article>"
        )
    return "\n".join(items)


def render_projects(projects, compact=False):
    items = []
    for p in projects:
        tools = "".join(f'<span class="tag">{t}</span>' for t in p["tools"])
        link_html = ""
        card_class = "project-card"
        title_html = f'<h3>{p["title"]}</h3>'
        if p.get("link"):
            card_class += " is-clickable"
            title_html = (
                f'<h3><a href="{p["link"]}" target="_blank" '
                f'rel="noopener">{p["title"]}</a></h3>'
            )
            link_html = (
                f'<a class="project-link" href="{p["link"]}" target="_blank" '
                f'rel="noopener">{p["linkLabel"]} <span aria-hidden="true">&#8599;</span></a>'
            )
        items.append(
            f'<article class="{card_class}">'
            f'<span class="project-tag">{p["tag"]}</span>'
            f'{title_html}'
            f'<p>{p["summary"]}</p>'
            f'<div class="tags">{tools}</div>'
            f'{link_html}'
            "</article>"
        )
    return "\n".join(items)


def render_template(template_name, replacements):
    template_path = TEMPLATE_DIR / template_name
    html = template_path.read_text(encoding="utf-8")
    for key, value in replacements.items():
        html = html.replace("{{" + key + "}}", value)
    return html


def main():
    data = load_content()

    shared = {
        "NAME": data["identity"]["name"],
        "ROLE": data["identity"]["role"],
        "TAGLINE": data["identity"]["tagline"],
        "LOCATION": data["identity"]["location"],
        "EMAIL": data["identity"]["email"],
        "PHONE": data["identity"]["phone"],
        "WHATSAPP": "https://wa.me/233" + data["identity"]["phone"].lstrip("0"),
        "LANGUAGES": render_languages(data["languages"]),
    }

    index_html = render_template("index.tpl.html", {
        **shared,
        "SKILLS": render_skills(data["skills"]),
        "EXPERIENCE": render_experience(data["experience"]),
        "FEATURED_PROJECTS": render_projects(data["projects"][:2]),
    })
    (ROOT / "index.html").write_text(index_html, encoding="utf-8")

    projects_html = render_template("projects.tpl.html", {
        **shared,
        "ALL_PROJECTS": render_projects(data["projects"]),
    })
    (ROOT / "projects.html").write_text(projects_html, encoding="utf-8")

    print("Built index.html and projects.html from content.json")


if __name__ == "__main__":
    main()
