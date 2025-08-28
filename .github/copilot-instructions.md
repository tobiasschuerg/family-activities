# Copilot Instructions for family-activities

## Purpose
This repository is for managing and publishing family activity content, likely using a static site generator (such as Hugo). The content is organized by categories and tags, with a focus on structured markdown files for activities, links, and related data.

## Content Structure
- **Activities**: Markdown files for each activity are stored in `content/activities/` and its subfolders (e.g., `ausflüge`, `museen`, `parks`, `schwimmen`, `sonstiges`, `spielplätze`).
  - Each subfolder represents a category of activity, supporting clear organization and filtering.
  - Activity filenames follow a descriptive pattern, typically `<location>-<activity>.md` or `<short-description>.md`, ensuring uniqueness and clarity.
  - Each activity file contains structured front matter (YAML or TOML) at the top, specifying metadata fields as defined in the archetype (see below for details).
  - The main content provides a summary, details, tips, and may include images or links.
  - Consistent use of front matter fields and naming conventions is essential for site generation and navigation.
- **Links**: General links are in `content/links.md`.
- **Archetypes**: Templates for new content are in `archetypes/` (e.g., `activity.md`, `default.md`).
- **Data**: Structured data (YAML, TOML, or JSON) can be placed in `data/`.
- **Layouts**: HTML templates for rendering content are in `layouts/` (with subfolders for partials, tags, and default activity layouts).
- **Static**: Images and static files are in `static/`.
- **Public**: The generated site output is in `public/`.

## Copilot Usage Guidelines
**Content Creation**:
  - When creating a new activity, always use the archetype in `archetypes/activity.md` as a template to ensure all required fields are present.
  - Place new activity markdown files in the correct subfolder under `content/activities/` according to the activity type (e.g., `parks`, `museen`).
  - Use clear and complete front matter (YAML or TOML) for metadata:
  - Always include all fields from the archetype (see below), even if some are left empty or as placeholders.
  - Use descriptive and unique filenames for each activity.
  - Reference images with relative paths (e.g., `images/<image-name>.jpg`).
  - For links or general resources, update `content/links.md`.
## Activity Archetype Fields

Each activity file must use the following front matter fields as defined in `archetypes/activity.md`:

- `title`: Name of the activity (in German)
- `date`: Date of creation or last update
- `layout`: Should be set to `activity`
- `duration`: Duration or time required (optional)
- `season`: Recommended season(s) (optional)
- `price`: Entry or participation cost (optional)
- `website`: Official website or further info (optional)
- `age`: Recommended age or age range (optional)
- `categories`: List of main and subcategories (at least one required)
- `tags`: List of relevant tags (at least one recommended)
- `hints`: List of tips or insider hints (optional)
- `warnings`: List of warnings or caveats (optional)
- `photos`: List of image paths (relative to `static/images/`)
- `kinderwagentauglich`: Indicate if stroller-friendly ("ja", "nein", or "?")
- `latitude`: Latitude coordinate (optional)
- `longitude`: Longitude coordinate (optional)

All fields should be present in every activity file, even if left empty or as a placeholder. This ensures consistency and supports future automation or filtering.
  - Write activity descriptions in a neutral, non-advertising tone. Avoid promotional language; instead, provide concise, highly informative, and factual details. Aim for an "insider tip" style that is helpful and direct.
  - **All activity content (Markdown files) must be written in German.**
**Content Structure**:
  - Organize activities by type using subfolders for each main category.
  - Use tags and categories in front matter to enable filtering, navigation, and search.
  - Ensure all images referenced in activities are placed in `static/images/` and linked with relative paths.
  - Maintain consistency in front matter fields and formatting across all activity files.
  - Avoid duplicate or ambiguous filenames.
**Templates and Layouts**:
  - To change how activities are displayed, edit the relevant layout in `layouts/_default/activity.html` or use partials in `layouts/partials/`.
**Site Generation**:
  - The `public/` folder is generated and should not be edited directly.
  - Use the static site generator's build command (e.g., `hugo`) to regenerate the site after content changes.
**General Best Practices**:
  - Keep content well-structured, consistent, and up to date.
  - Use descriptive, unique file and folder names for all activities.
  - Avoid duplicating content or metadata.
  - Regularly review and update archetypes/templates to reflect new content requirements or best practices.
  - Ensure all activities have complete metadata for optimal site generation and user experience.

## Example: Creating a New Activity
1. Copy `archetypes/activity.md` to `content/activities/<category>/<activity-name>.md`.
2. Fill in the front matter (title, date, tags, etc.) and content.
3. Add any images to `static/images/` and reference them in the markdown.
4. Run the site generator to preview changes.

## Activity File Example

```markdown
---
title: "Beispiel Aktivitätstitel"
date: 2025-08-28
tags: ["outdoor", "familie", "natur"]
categories: ["parks", "wandern"]
images:
  - images/beispiel-aktivitaet.jpg
---

Kurze, neutrale Zusammenfassung der Aktivität.

## Details
- Beschreibung, Tipps, Besonderheiten
- Öffnungszeiten, Preise, Adresse (falls relevant)

![Beispielbild](../static/images/beispiel-aktivitaet.jpg)
```

## Additional Notes
- For verification or automation, see `verify.py`.
- For configuration, see `config.toml`.
- For more information, refer to `README.md`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages to ensure clarity and consistency in version history.
