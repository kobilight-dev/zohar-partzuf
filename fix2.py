
with open('src/App.js', 'r', encoding='utf-8') as f:
    c = f.read()

old = 'const[appMode,setAppMode]=useState("home");'
new = 'const[isAuth,setIsAuth]=useState(false);\nconst[pwInput,setPwInput]=useState("");\nconst[appMode,setAppMode]=useState("home");'
c = c.replace(old, new)

old2 = 'return('
new2 = 'if(!isAuth)return(<div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"#1A1208",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999}}><h2 style={{color:"#C9A84C",marginBottom:"20px"}}>הזן סיסמה</h2><input type="password" value={pwInput} onChange={e=>setPwInput(e.target.value)} style={{padding:"10px",fontSize:"18px",textAlign:"center",borderRadius:"8px",border:"2px solid #C9A84C",background:"#2C1F0A",color:"white",marginBottom:"15px"}} /><button onClick={()=>{if(pwInput===PASSWORD)setIsAuth(true);else alert("סיסמה שגויה");}} style={{padding:"10px 30px",background:"#C9A84C",color:"#1A1208",fontWeight:"bold",fontSize:"16px",borderRadius:"8px",border:"none",cursor:"pointer"}}>כניסה</button></div>);\nreturn('
c = c.replace(old2, new2, 1)

with open('src/App.js', 'w', encoding='utf-8') as f:
    f.write(c)
print("Done")

