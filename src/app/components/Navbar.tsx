"use client";

import Link from "next/link";
import { useState } from "react";


export default function Navbar(){
      const [darkMode, setDarkMode]     = useState(false);
    
      const border  = darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.11)";

    return (
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", background:"#272537", borderBottom:`1px solid ${border}`, padding:"10px 20px", flexShrink:0}}>
          <Link href="/" className="logo">
            <div className="logo-icon" style={{ width: 22, height: 22, fontSize: 11 }}>⚒</div>
            ForgeCodeHub
          </Link>
          <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:500, color:"rgb(232, 105, 42)", textDecoration:"none", padding:"6px 8px", borderRadius:6, whiteSpace:"nowrap", transition:"color 0.15s" }}>
            ← All Tools
          </Link>
        </div>
    );

}