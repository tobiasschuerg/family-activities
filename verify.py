import os
import re
import yaml

# Define the content path relative to the script location
content_path = 'content/activities'

# Define a regular expression pattern to check for the layout parameter in the front matter
layout_pattern = re.compile(r'^\s*layout\s*:\s*(.*)\s*')

# Function to check if the layout parameter is set in a file
def check_layout(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        match = re.match(r'---\s*([\s\S]*?)\s*---', content)
        if match:
            front_matter = match.group(1)
            data = yaml.safe_load(front_matter)
            if 'layout' not in data:
                print(f"Error: No layout provided in the front matter of {file_path}")
            if 'photos' not in data:
                print(f"Error: No photos parameter provided in the front matter of {file_path}")

# Iterate through all files in the content directory
for subdir, dirs, files in os.walk(content_path):
    for file in files:
        if file.endswith('.md'):
            file_path = os.path.join(subdir, file)
            check_layout(file_path)
