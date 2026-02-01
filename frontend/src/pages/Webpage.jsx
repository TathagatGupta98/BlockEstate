import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 👉 two different backgrounds
import leftBg from "../assets/left-bg.jpg";
import rightBg from "../assets/right-bg.jpg";

export default function Webpage() {
  const navigation = useNavigate();

  const handleRedienceSumbit = () => navigation("/signup");
  const handleCompaniesSumbit = () => navigation("/companyregister");

  useEffect(() => {
    const sections = document.querySelectorAll(".left-section, .right-section");

    sections.forEach((section) => {
      section.addEventListener("click", function (e) {
        const ripple = document.createElement("div");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position:absolute;
          width:${size}px;
          height:${size}px;
          left:${x}px;
          top:${y}px;
          background:rgba(255,255,255,.25);
          border-radius:50%;
          pointer-events:none;
          animation:rippleEffect .8s ease-out;
          z-index:2;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
      });
    });

    const style = document.createElement("style");
    style.textContent = `
      @keyframes rippleEffect {
        from {transform:scale(0);opacity:1;}
        to {transform:scale(2);opacity:0;}
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Oranienbaum&display=swap"
        rel="stylesheet"
      />

      <style>{`
*{margin:0;padding:0;box-sizing:border-box;}

body{
  font-family:'Oranienbaum',serif;
  height:100vh;
  overflow:hidden;
}

.main-container{
  width:100%;
  height:100vh;
  display:flex;
  position:relative;
}

/* ================= LEFT SIDE ================= */

.left-section{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  position:relative;
  overflow:hidden;

  background-image:url(${leftBg});
  background-size:cover;
  background-position:center;
}

/* ================= RIGHT SIDE ================= */

.right-section{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  position:relative;
  overflow:hidden;

  background-image:url(${rightBg});
  background-size:cover;
  background-position:center;
}

/* ===== dark overlay for readability ===== */

.left-section::after,
.right-section::after{
  content:'';
  position:absolute;
  inset:0;
  background:rgba(0,0,0,.45);
  z-index:0;
  transition:.5s;
}

.left-section:hover::after,
.right-section:hover::after{
  background:rgba(0,0,0,.25);
}

/* ================= CENTER LINE ================= */

.vertical-divider{
  position:absolute;
  left:50%;
  top:0;
  width:4px;
  height:100%;
  transform:translateX(-50%);
  background:#d6b38c;
  z-index:10;
  box-shadow:0 0 25px rgba(214,179,140,.6);
}

/* ================= CONTENT ================= */

.section-content{
  text-align:center;
  padding:60px 40px;
  position:relative;
  z-index:5;
  color:#fff;
  max-width:600px;
}

.icon-circle{
  width:140px;
  height:140px;
  margin:0 auto 35px;
  background:#2B1B12;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 12px 40px rgba(0,0,0,.5);
  transition:.4s;
}

.left-section:hover .icon-circle,
.right-section:hover .icon-circle{
  transform:scale(1.15) rotate(-5deg);
}

.section-icon{
  width:70px;
  height:70px;
  fill:#fff;
}

.section-heading{
  font-size:4rem;
  letter-spacing:3px;
  margin-bottom:20px;
}

.section-description{
  font-size:1.4rem;
  line-height:1.7;
  margin-bottom:45px;
  opacity:.9;
}

.enter-button{
  padding:18px 55px;
  background:#d6b38c;
  color:#2B1B12;
  border-radius:60px;
  font-size:1.3rem;
  text-decoration:none;
  cursor:pointer;
  transition:.3s;
  box-shadow:0 10px 30px rgba(0,0,0,.4);
}

.enter-button:hover{
  background:#cfa87c;
  transform:translateY(-3px);
}

      `}</style>

      <div className="main-container">

        {/* LEFT */}
        <div className="left-section">
          <div className="section-content">
            <div className="icon-circle">
              <svg className="section-icon" viewBox="0 0 24 24">
                <path d="M12 7V3H2v18h20V7H12z" />
              </svg>
            </div>

            <h1 className="section-heading">Companies</h1>

            <p className="section-description">
              Discover and bid on proposals<br />
              from society residents
            </p>

            <a className="enter-button" onClick={handleCompaniesSumbit}>
              Enter Portal
            </a>
          </div>
        </div>

        <div className="vertical-divider" />

        {/* RIGHT */}
        <div className="right-section">
          <div className="section-content">
            <div className="icon-circle">
              <svg className="section-icon" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3z" />
              </svg>
            </div>

            <h1 className="section-heading">Residents</h1>

            <p className="section-description">
              Submit your proposals and<br />
              connect with service providers
            </p>

            <a className="enter-button" onClick={handleRedienceSumbit}>
              Enter Portal
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
