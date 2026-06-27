with open('src/App.js', 'r', encoding='utf-8') as f:
    c = f.read()

old = 'import { useState, useRef, useCallback } from "react";\nconst PASSWORD'
new = 'import { useState, useRef, useCallback } from "react";\nconst PASSWORD'

if old in c:
    print("FOUND - fixing")
    c = c.replace(old, new)
else:
    bad = '} from "react";`nconst PASSWORD'
    if bad in c:
        print("FOUND backtick - fixing")
        c = c.replace(bad, '} from "react";\nconst PASSWORD')
        c = 'import { useState, useRef, useCallback ' + c

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(c)
print("Done")
