import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Link } from "react-router-dom";

// Memuat GSAP dari CDN
import { gsap } from "gsap";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
  connectButton?: ReactNode; // Menambahkan prop baru untuk tombol
}

const Navbar: React.FC<PillNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
  connectButton, // Menerima prop tombol
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<any | null>>([]);
  const activeTweenRefs = useRef<Array<any | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<any | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);
  const sidebarOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        if (typeof gsap !== 'undefined') {
          gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin: `50% ${originY}px`,
          });

          const label = pill.querySelector<HTMLElement>(".pill-label");
          const white = pill.querySelector<HTMLElement>(".pill-label-hover");

          if (label) gsap.set(label, { y: 0 });
          if (white) gsap.set(white, { y: h + 12, opacity: 0 });

          const index = circleRefs.current.indexOf(circle);
          if (index === -1) return;

          tlRefs.current[index]?.kill();
          const tl = gsap.timeline({ paused: true });

          tl.to(
            circle,
            { scale: 1.2, xPercent: -50, duration: 2, ease: "power3.easeOut", overwrite: "auto" },
            0
          );

          if (label) {
            tl.to(
              label,
              { y: -(h + 8), duration: 2, ease: "power3.easeOut", overwrite: "auto" },
              0
            );
          }

          if (white) {
            gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
            tl.to(
              white,
              { y: 0, opacity: 1, duration: 2, ease: "power3.easeOut", overwrite: "auto" },
              0
            );
          }

          tlRefs.current[index] = tl;
        }
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    const overlay = sidebarOverlayRef.current;
    if (menu && overlay && typeof gsap !== 'undefined') {
      gsap.set(menu, { x: "-100%", visibility: "hidden" });
      gsap.set(overlay, { opacity: 0, visibility: "hidden" });
    }

    if (initialLoadAnimation && typeof gsap !== 'undefined') {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease: "power3.easeOut",
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, {
          width: "auto",
          duration: 0.6,
          ease: "power3.easeOut",
        });
      }
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl || typeof gsap === 'undefined') return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl || typeof gsap === 'undefined') return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img || typeof gsap === 'undefined') return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;
    const overlay = sidebarOverlayRef.current;

    if (typeof gsap !== 'undefined' && menu && overlay) {
      const tl = gsap.timeline({ paused: true });

      if (newState) {
        gsap.set([menu, overlay], { visibility: "visible" });
        tl.to(overlay, { opacity: 1, duration: 0.3, ease: "power3.easeOut" }, 0);
        tl.to(menu, { x: 0, duration: 0.5, ease: "power3.easeOut" }, 0);
      } else {
        tl.to(menu, { x: "-100%", duration: 0.4, ease: "power3.easeIn" }, 0);
        tl.to(overlay, { opacity: 0, duration: 0.4, ease: "power3.easeIn", onComplete: () => {
          gsap.set([menu, overlay], { visibility: "hidden" });
        }}, 0);
      }

      tl.play();

      if (hamburger) {
        const lines = hamburger.querySelectorAll(".hamburger-line");
        if (newState) {
          gsap.to(lines[0], { rotation: 45, y: 4.5, duration: 0.3, ease: "power3.easeOut" });
          gsap.to(lines[1], { rotation: -45, y: -4.5, duration: 0.3, ease: "power3.easeOut" });
        } else {
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: "power3.easeOut" });
          gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: "power3.easeOut" });
        }
      }

    } else {
      if (menu) {
        menu.style.visibility = newState ? 'visible' : 'hidden';
        menu.style.transform = newState ? 'translateX(0)' : 'translateX(-100%)';
        menu.style.transition = 'transform 0.5s ease-out';
      }
      if (overlay) {
        overlay.style.visibility = newState ? 'visible' : 'hidden';
        overlay.style.opacity = newState ? '1' : '0';
        overlay.style.transition = 'opacity 0.5s ease-out';
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = (href: string) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ["--base"]: baseColor,
    ["--pill-bg"]: pillColor,
    ["--hover-text"]: hoveredPillTextColor,
    ["--pill-text"]: resolvedPillTextColor,
    ["--nav-h"]: "42px",
    ["--logo"]: "36px",
    ["--pill-pad-x"]: "18px",
    ["--pill-gap"]: "3px",
  } as React.CSSProperties;

  return (
    <div className="absolute top-[1em] z-[1000] w-full left-0 md:w-auto md:left-auto">
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {isRouterLink(items?.[0]?.href) ? (
          <Link
            to={items[0].href}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={(el) => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
            style={{
              width: "var(--nav-h)",
              height: "var(--nav-h)",
              background: "var(--base, #000)",
            }}
          >
            <img
              src={logo}
              alt={logoAlt}
              ref={logoImgRef}
              className="w-full h-full object-cover block"
            />
          </Link>
        ) : (
          <a
            href={items?.[0]?.href || "#"}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={(el) => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
            style={{
              width: "var(--nav-h)",
              height: "var(--nav-h)",
              background: "var(--base, #000)",
            }}
          >
            <img
              src={logo}
              alt={logoAlt}
              ref={logoImgRef}
              className="w-full h-full object-cover block"
            />
          </a>
        )}

        {/* Item Navigasi Desktop */}
        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-2"
          style={{
            height: "var(--nav-h)",
            background: "var(--base, #000)",
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: "var(--pill-gap)" }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle: React.CSSProperties = {
                background: "var(--pill-bg, #fff)",
                color: "var(--pill-text, var(--base, #000))",
                paddingLeft: "var(--pill-pad-x)",
                paddingRight: "var(--pill-pad-x)",
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: "var(--base, #000)",
                      willChange: "transform",
                    }}
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: "transform" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: "var(--hover-text, #fff)",
                        willChange: "transform, opacity",
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: "var(--base, #000)" }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                "relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0";

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tombol Hamburger Menu (Hanya untuk Mobile) */}
        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative ml-auto"
          style={{
            width: "var(--nav-h)",
            height: "var(--nav-h)",
            background: "var(--base, #000)",
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: "var(--pill-bg, #fff)" }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: "var(--pill-bg, #fff)" }}
          />
        </button>
      </nav>
      
      {/* Overlay Sidebar (Hanya untuk Mobile) */}
      <div
        ref={sidebarOverlayRef}
        onClick={toggleMobileMenu}
        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[997]"
        style={{
          visibility: 'hidden',
          opacity: 0,
        }}
        aria-hidden={!isMobileMenuOpen}
      />

      {/* Menu Sidebar Mobile (Tersembunyi secara default, ditampilkan saat di-toggle) */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed top-0 left-0 h-full w-[80%] max-w-xs shadow-lg z-[998] p-4 pt-16 flex flex-col justify-between"
        style={{
          ...cssVars,
          background: "var(--base, #060010)",
          transform: 'translateX(-100%)',
          visibility: 'hidden',
        }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div>
          <ul className="list-none m-0 p-0 flex flex-col gap-[8px]">
            {items.map((item) => {
              const defaultStyle: React.CSSProperties = {
                background: "var(--pill-bg, #fff)",
                color: "var(--pill-text, #fff)",
              };
              const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = "var(--base)";
                e.currentTarget.style.color = "var(--hover-text, #fff)";
              };
              const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = "var(--pill-bg, #fff)";
                e.currentTarget.style.color = "var(--pill-text, #fff)";
              };

              const linkClasses =
                "block py-3 px-4 text-[18px] font-medium rounded-[12px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]";

              return (
                <li key={item.href} role="none">
                  {isRouterLink(item.href) ? (
                    <Link
                      to={item.href}
                      className={linkClasses}
                      style={defaultStyle}
                      onMouseEnter={hoverIn}
                      onMouseLeave={hoverOut}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className={linkClasses}
                      style={defaultStyle}
                      onMouseEnter={hoverIn}
                      onMouseLeave={hoverOut}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Tombol Hubungkan Dompet di dalam sidebar mobile */}
        {connectButton && (
          <div className="mt-auto p-4 w-full">
            {connectButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
