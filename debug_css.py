
import re

file_path = r'c:\Users\YASH\Desktop\yash\my projects\aiforbharatcopy\Vertsion\styles.css'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

balance = 0
in_comment = False
line = 1
last_zero_balance_index = 0

print("Scanning for content at root level (balance 0)...")

i = 0
n = len(content)
while i < n:
    # Track line numbers
    if content[i] == '\n':
        line += 1
        i += 1
        continue
        
    # Handle comments
    if not in_comment and i + 1 < n and content[i:i+2] == '/*':
        in_comment = True
        i += 2
        continue
    if in_comment:
        if i + 1 < n and content[i:i+2] == '*/':
            in_comment = False
            i += 2
        else:
            i += 1
        continue

    # Handle braces
    if content[i] == '{':
        balance += 1
        i += 1
        continue
    elif content[i] == '}':
        balance -= 1
        if balance == 0:
            # We just closed a block.
            pass
        i += 1
        continue
    
    # Check for content at balance 0
    if balance == 0:
        # We are at root level. We expect selectors or @rules.
        # If we see something that looks like a property (e.g. "color:"), it's suspicious.
        # But selectors can look like anything properly.
        # However, usually selectors don't have ';'.
        
        if content[i] == ';':
            # Semicolon at root level is suspicious unless it's @import ... ;
            # Let's peek back to see if it was an @ rule
            print(f"Suspicious semicolon at line {line}")
            
        # Let's just print non-whitespace content at line 2420-2440 at root level
        if 2420 <= line <= 2440:
             if not content[i].isspace():
                 # Capture a chunk around here
                 snippet = content[i:i+20].replace('\n', '\\n')
                 print(f"Content at root L{line}: {snippet}")
                 # Skip a bit to avoid spam
                 # i += 10 # Don't skip, we want to see it.
                 pass
                 
    i += 1
