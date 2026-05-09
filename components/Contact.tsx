'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type ContactRow = {
  label: string;
  value: string;
};

const CONTACTS: readonly ContactRow[] = [
  { label: 'EMAIL', value: '2499694881@qq.com' },
  { label: 'PHONE', value: '157 0012 9377' },
  { label: 'WECHAT', value: 'Rnlfd-7' },
  { label: 'WECHAT QR', value: '/images/wechat-qr.jpg' },
];

const SLOGAN_LINES: readonly string[] = ["LET'S BUILD", 'SOMETHING', 'SHARP.'];

export default function Contact() {
  const [qrOpen, setQrOpen] = useState(false);
  return (
    <section
      className="contact-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        color: 'var(--color-ink)',
        borderTop: '1px solid var(--color-border)',
        padding: '0 8vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        className="contact-layout"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: '6vw',
          paddingTop: '120px',
          paddingBottom: '96px',
        }}
      >
        <div
          className="contact-slogan"
          style={{
            fontFamily: 'var(--font-condensed), sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(64px, 8vw, 112px)',
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            paddingLeft: 'clamp(24px, 5vw, 80px)',
          }}
        >
          {SLOGAN_LINES.map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left center', willChange: 'transform, opacity' }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        <motion.ul
          className="contact-table"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            width: '100%',
          }}
        >
          {CONTACTS.map((row) => (
            <li
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: row.label === 'WECHAT QR' && qrOpen ? 'start' : 'center',
                minHeight: row.label === 'WECHAT QR' && qrOpen ? 'auto' : '56px',
                paddingTop: row.label === 'WECHAT QR' && qrOpen ? '36px' : undefined,
                paddingBottom: row.label === 'WECHAT QR' && qrOpen ? '36px' : undefined,
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                }}
              >
                {row.label}
              </span>
              {row.label === 'WECHAT QR' ? (
                qrOpen ? (
                  <div
                    style={{
                      position: 'relative',
                      justifySelf: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <img
                      src={row.value}
                      alt="微信二维码"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      style={{
                        height: '260px',
                        width: '260px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                    <button
                      type="button"
                      aria-label="关闭二维码"
                      onClick={() => setQrOpen(false)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '40px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        fontSize: '14px',
                        lineHeight: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => setQrOpen(true)}
                    style={{
                      justifySelf: 'end',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-accent)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    点击获取
                  </span>
                )
              ) : (
                <span
                  style={{
                    justifySelf: 'end',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-ink)',
                  }}
                >
                  {row.value}
                </span>
              )}
            </li>
          ))}
        </motion.ul>
      </div>

      <footer
        className="contact-footer"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: 'var(--color-muted)',
          paddingBottom: '48px',
          paddingTop: '20px',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <span>© LIU SHENGRUI · JASON LIU</span>
        <span style={{ letterSpacing: '0.15em' }}>THANK YOU FOR VISITING</span>
      </footer>
    </section>
  );
}
