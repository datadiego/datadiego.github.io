#npm install 
#instala chromium
#npm install -g @mermaid-js/mermaid-cli
#export PUPPETEER_EXECUTABLE_PATH=$(which chromium)
import os

def get_all_files(directory, extension=None):
    """Recursively get all files in the given directory."""
    all_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if extension is None or file.endswith(extension):
                all_files.append(os.path.join(root, file))
    return all_files

files = get_all_files('.', '.mmd')
print(f"Found {len(files)} files with .mmd extension.")

for file in files:
    try:
        print(f"Processing {file}...")
        os.system(f"mmdc -i {file} -o {file.replace('.mmd', '.png')} -t dark -b transparent --width 1800 --height 720")
    except Exception as e:
        print(f"Error processing {file}: {e}")