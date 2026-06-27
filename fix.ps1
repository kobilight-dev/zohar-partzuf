\$c = Get-Content src\App.js -Raw; \$c = \$c.Replace('import { useState, useRef, useCallback } from \"react\";\
const PASSWORD', 'import { useState, useRef, useCallback } from \"react\";' + \\
 + 'const PASSWORD'); Set-Content src\App.js \$c
