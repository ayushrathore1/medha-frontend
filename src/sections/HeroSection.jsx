import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../lib/motionPresets';
import { Link } from 'react-router-dom';

const HeroSection = ({ totalStudents }) => {
  const headlines = ["The Last-Minute", "Exam Prep Tool", "for RTU Students."];

  return (
    <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#F2EDE4', paddingTop: 72 }}>
      {/* BG Layer 1 — Grain */}
      <div className="grain" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* BG Layer 2 — Gradient Mesh */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 700px 500px at 75% 45%, rgba(125,198,122,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 500px 400px at 15% 75%, rgba(245,158,11,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 400px 300px at 90% 90%, rgba(139,92,246,0.04) 0%, transparent 60%)`
      }} />

      {/* BG Layer 3 — Decorative rings */}
      <div className="ring" style={{ width: 600, height: 600, right: -120, top: -80 }} />
      <div className="ring" style={{ width: 380, height: 380, right: 40, top: 60, borderColor: 'rgba(125,198,122,0.06)' }} />

      {/* BG Layer 4 — Large watermark */}
      <div style={{
        position: 'absolute', userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        fontSize: 220, fontWeight: 900, color: 'rgba(26,26,46,0.025)',
        letterSpacing: '-0.05em', lineHeight: 1, top: '10%', left: '-2%'
      }}>RTU</div>

      {/* Inner Layout */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 'calc(100vh - 72px)', position: 'relative', zIndex: 10
      }}>
        {/* LEFT COLUMN */}
        <div style={{ width: '45%' }}>
          {/* Pre-label */}
          <motion.div {...fadeIn} transition={{ delay: 0 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(125,198,122,0.1)', border: '1px solid rgba(125,198,122,0.25)',
              borderRadius: 999, padding: '6px 16px',
              fontSize: 11, fontWeight: 600, color: '#7DC67A',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7DC67A' }} />
              The Last-Minute Exam Tool for RTU Students
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginTop: 20 }}>
            {headlines.map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <motion.h1
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.15 }}
                  style={{
                    fontSize: 'clamp(48px, 5.5vw, 72px)', fontWeight: 800,
                    letterSpacing: '-0.04em', lineHeight: 1.0, color: '#1A1A2E', margin: 0
                  }}
                >
                  {i === 2 ? (
                    <>for RTU Students<span style={{ color: '#F59E0B' }}>.</span></>
                  ) : i === 1 ? (
                    <><span className="wavy-underline">Exam Prep</span> Tool</>
                  ) : line}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            style={{ marginTop: 24, fontSize: 18, color: '#6B6B6B', lineHeight: 1.7, maxWidth: 480 }}
          >
            AI-powered notes, past papers, and exam strategies —
            built for when you have 3 days and 6 units to cover.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={{
              marginTop: 36, display: 'flex', alignItems: 'center',
              background: 'white', borderRadius: 14, border: '1.5px solid #E8E4DC',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden', width: 'fit-content'
            }}
          >
            <div style={{ position: 'relative', paddingLeft: 16, paddingRight: 4 }}>
              <div style={{
                width: 16, height: 16, border: '2px solid #9A9A9A', borderRadius: '50%', position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', bottom: -4, right: -3,
                  width: 6, height: 2, background: '#9A9A9A',
                  transform: 'rotate(45deg)', borderRadius: 1
                }} />
              </div>
            </div>
            <input
              placeholder="Find your subject or topic..."
              style={{
                padding: '16px 12px', fontSize: 16, color: '#1A1A2E',
                border: 'none', outline: 'none', background: 'transparent', width: 340,
                fontFamily: "'DM Sans', sans-serif"
              }}
            />
            <Link to="/rtu-exams" style={{
              padding: '16px 28px', background: '#7DC67A', color: 'white', fontWeight: 700,
              fontSize: 16, display: 'flex', alignItems: 'center', gap: 8,
              border: 'none', cursor: 'pointer', textDecoration: 'none',
              transition: 'background 150ms', alignSelf: 'stretch'
            }}>
              GO <span style={{ fontSize: 14 }}>→</span>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ display: 'flex' }}>
              {[
                { initials: 'RS', from: '#7DC67A', to: '#4A9E47' },
                { initials: 'PM', from: '#F59E0B', to: '#D97706' },
                { initials: 'AK', from: '#8B5CF6', to: '#6D28D9' },
                { initials: 'DP', from: '#EF4444', to: '#DC2626' },
                { initials: '+5', from: '#1A1A2E', to: '#2D2D3F' },
              ].map((a, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: '50%', border: '2px solid #F2EDE4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white',
                  background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                  marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i
                }}>{a.initials}</div>
              ))}
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#7DC67A',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>
            </div>
            <p style={{ fontSize: 14, color: '#6B6B6B', margin: 0 }}>
              <span style={{ fontWeight: 700, color: '#1A1A2E' }}>{totalStudents}</span>{' '}students crushed their exams
            </p>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: '52%', position: 'relative', height: 580 }}>
          {/* Card 1 */}
          <motion.div
            initial={{ x: -40, y: 60, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            whileHover={{ scale: 1.03, rotate: -1 }}
            className="card-shine"
            style={{
              position: 'absolute', width: 260, height: 420, left: 0, top: 0,
              borderRadius: 20, overflow: 'hidden', cursor: 'pointer'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #2D1B0E 0%, #1A1A2E 50%, #0D0D1A 100%)' }} />
            <div style={{ position: 'absolute', top: '18%', right: '10%', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.45) 0%, transparent 70%)', filter: 'blur(25px)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(245,158,11,0.06) 0%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,0.97) 0%, rgba(26,26,46,0.3) 50%, transparent 100%)' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>100 TOPICS</div>
            <div style={{ position: 'absolute', top: 20, left: 20, width: 32, height: 32, border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>↗</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white', lineHeight: 1.2, letterSpacing: '-0.02em' }}>RTU PYQ<br />Analysis</div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ x: -40, y: 60, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            whileHover={{ scale: 1.03, rotate: 1 }}
            className="card-shine"
            style={{ position: 'absolute', width: 220, height: 380, left: 200, top: 40, borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #1a2e20 0%, #0d1a10 100%)' }} />
            {[
              { top: '15%', left: '20%', size: 5, opacity: 0.8 },
              { top: '22%', left: '55%', size: 3, opacity: 0.6 },
              { top: '10%', left: '75%', size: 4, opacity: 0.9 },
              { top: '35%', left: '35%', size: 3, opacity: 0.5 },
              { top: '28%', left: '10%', size: 4, opacity: 0.7 },
              { top: '18%', left: '88%', size: 3, opacity: 0.6 },
            ].map((dot, i) => (
              <div key={i} style={{
                position: 'absolute', top: dot.top, left: dot.left,
                width: dot.size, height: dot.size, borderRadius: '50%',
                background: `rgba(245,158,11,${dot.opacity})`,
                boxShadow: `0 0 ${dot.size * 3}px rgba(245,158,11,0.8)`,
                animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`
              }} />
            ))}
            <div style={{ position: 'absolute', bottom: '30%', left: '50%', transform: 'translateX(-50%)', width: 100, height: 60, background: 'rgba(125,198,122,0.15)', filter: 'blur(20px)', borderRadius: 8 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,0.97) 0%, rgba(26,26,46,0.2) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(125,198,122,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(125,198,122,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#7DC67A', letterSpacing: '0.06em' }}>Writing</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>AI Notes</div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ x: -40, y: 60, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            className="card-shine"
            style={{ position: 'absolute', width: 200, height: 340, left: 370, top: 80, borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #1e2d35 0%, #0f1a20 100%)' }} />
            {[
              { left: '15%', top: '30%', w: 60, h: 80, color: 'rgba(255,255,255,0.06)' },
              { left: '40%', top: '20%', w: 60, h: 90, color: 'rgba(255,255,255,0.05)' },
              { left: '65%', top: '25%', w: 55, h: 80, color: 'rgba(255,255,255,0.06)' },
            ].map((p, i) => (
              <div key={i} style={{ position: 'absolute', left: p.left, top: p.top, width: p.w, height: p.h, background: p.color, borderRadius: '40% 40% 0 0' }} />
            ))}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(125,198,122,0.08) 0%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,0.97) 0%, rgba(26,26,46,0.2) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.06em' }}>Business</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>Exam Prep</div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#9A9A9A' }}>Scroll to explore</span>
            <div className="scroll-arrow" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
