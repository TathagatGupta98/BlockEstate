import { useEffect } from "react";

export default function Webpage() {
  useEffect(() => {
    const sections = document.querySelectorAll(".left-section, .right-section");

    sections.forEach(section => {
      section.addEventListener("click", function (e) {
        const ripple = document.createElement("div");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: radial-gradient(circle, rgba(139, 21, 56, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: rippleEffect 0.8s ease-out;
          z-index: 1;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
      });
    });

    const style = document.createElement("style");
    style.textContent = `
      @keyframes rippleEffect {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    let lastTouchEnd = 0;
    document.addEventListener("touchend", e => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    });

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Oranienbaum&display=swap"
        rel="stylesheet"
      />

      <style>{`/* === ORIGINAL CSS (UNCHANGED) === */
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Oranienbaum',serif;height:100vh;width:100vw;overflow:hidden;background:linear-gradient(90deg,#ffffff 0%,#fafafa 25%,#f5f5f5 50%,#fafafa 75%,#ffffff 100%);}
.main-container{width:100%;height:100vh;display:flex;flex-direction:row;position:relative;}
.left-section,.right-section{flex:1;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .6s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;}
.left-section::before,.right-section::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at center,rgba(139,21,56,.05) 0%,transparent 70%);opacity:0;transition:opacity .6s ease;}
.left-section:hover::before,.right-section:hover::before{opacity:1;}
.left-section:hover{transform:translateX(-15px);background:linear-gradient(90deg,#fefefe 0%,#f9f9f9 100%);}
.right-section:hover{transform:translateX(15px);background:linear-gradient(90deg,#f9f9f9 0%,#fefefe 100%);}
.vertical-divider{position:absolute;left:50%;top:0;width:3px;height:100%;transform:translateX(-50%);background:linear-gradient(to bottom,transparent 0%,#8b1538 10%,#6b0f2a 30%,#4a0a1c 50%,#6b0f2a 70%,#8b1538 90%,transparent 100%);z-index:100;box-shadow:0 0 25px rgba(139,21,56,.4);}
.section-content{text-align:center;padding:60px 40px;position:relative;z-index:10;max-width:600px;}
.brand-logo{position:absolute;top:50px;left:50%;transform:translateX(-50%);font-size:2.2rem;color:#8b1538;letter-spacing:4px;text-transform:uppercase;opacity:0;animation:fadeInDown 1s ease forwards .2s;}
.icon-circle{width:150px;height:150px;margin:0 auto 35px;background:linear-gradient(135deg,#8b1538 0%,#6b0f2a 50%,#4a0a1c 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 45px rgba(139,21,56,.35);transition:all .5s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;}
.icon-circle::after{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,.15) 50%,transparent 70%);transform:rotate(45deg);transition:all .8s ease;}
.left-section:hover .icon-circle,.right-section:hover .icon-circle{transform:scale(1.15) rotate(-5deg);}
.section-icon{width:75px;height:75px;fill:#fff;}
.section-heading{font-size:4rem;color:#2c2c2c;margin-bottom:25px;letter-spacing:3px;opacity:0;animation:fadeInUp 1s ease forwards;}
.section-description{font-size:1.4rem;color:#666;margin-bottom:45px;line-height:1.8;opacity:0;animation:fadeInUp 1s ease forwards;}
.enter-button{display:inline-block;padding:20px 55px;background:linear-gradient(135deg,#8b1538 0%,#6b0f2a 50%,#4a0a1c 100%);color:#fff;text-decoration:none;border-radius:60px;font-size:1.3rem;transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 10px 30px rgba(139,21,56,.35);opacity:0;animation:fadeInUp 1s ease forwards;}
@keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInDown{from{opacity:0;transform:translate(-50%,-20px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>

      <div className="brand-logo">PROPOSALS</div>

      <div className="main-container">
        <div
          className="left-section"
          onClick={() => (window.location.href = "company-portal.html")}
        >
          <div className="section-content">
            <div className="icon-circle">
              <svg className="section-icon" viewBox="0 0 24 24">
                <path d="M12 7V3H2v18h20V7H12z" />
              </svg>
            </div>
            <h1 className="section-heading">Companies</h1>
            <p className="section-description">
              Discover and bid on proposals<br />from society residents
            </p>
            <a
              href="company-portal.html"
              className="enter-button"
              onClick={e => e.stopPropagation()}
            >
              Enter Portal
            </a>
          </div>
        </div>

        <div className="vertical-divider" />

        <div
          className="right-section"
          onClick={() => (window.location.href = "resident-portal.html")}
        >
          <div className="section-content">
            <div className="icon-circle">
              <svg className="section-icon" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3z" />
              </svg>
            </div>
            <h1 className="section-heading">Residents</h1>
            <p className="section-description">
              Submit your proposals and<br />connect with service providers
            </p>
            <a
              href="resident-portal.html"
              className="enter-button"
              onClick={e => e.stopPropagation()}
            >
              Enter Portal
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
