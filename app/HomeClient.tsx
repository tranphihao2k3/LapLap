"use client";

import Link from "next/link";
import Image from "next/image";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  MapPin, Phone, Mail, Shield, Truck, FlaskConical,
  Wrench, ArrowRight, ChevronRight, Star, Zap,
  Clock, Facebook, Laptop, Cpu, HardDrive, Wifi,
  Monitor, CheckCircle2, RefreshCw, Package
} from "lucide-react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px currentColor; }
    50% { opacity: 0.5; box-shadow: 0 0 3px currentColor; }
  }
`;

const HomeWrapper = styled.div`
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f5f7fa;
  color: #1a1a2e;
  -webkit-font-smoothing: antialiased;
`;

// ─────────────────────────────────────────────────────────
// KEYFRAMES
// ─────────────────────────────────────────────────────────
const shimmerAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const blobAnim = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
`;

// ─────────────────────────────────────────────────────────
// SHARED
// ─────────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 40px;
  @media (max-width: 768px) { padding: 0 20px; }
`;

const Section = styled.section<{ $bg?: string; $pt?: number; $pb?: number }>`
  background: ${p => p.$bg || "transparent"};
  padding-top: ${p => p.$pt ?? 80}px;
  padding-bottom: ${p => p.$pb ?? 80}px;
  @media (max-width: 768px) {
    padding-top: ${p => Math.round((p.$pt ?? 80) * 0.7)}px;
    padding-bottom: ${p => Math.round((p.$pb ?? 80) * 0.7)}px;
  }
`;

const Chip = styled.div<{ $color: string; $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  margin-bottom: 14px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(26px, 3.5vw, 42px);
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -1.2px;
  line-height: 1.1;
  margin-bottom: 14px;
`;

const SectionDesc = styled.p`
  font-size: 15.5px;
  line-height: 1.78;
  color: #64748b;
  max-width: 520px;
`;

const SectionHeader = styled.div<{ $center?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${p => p.$center ? "center" : "flex-start"};
  text-align: ${p => p.$center ? "center" : "left"};
  margin-bottom: 52px;
  ${p => p.$center && `${SectionDesc} { margin-left: auto; margin-right: auto; }`}
`;

// ─────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────
const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #05091f 0%, #091840 35%, #0b2158 65%, #0d2d70 100%);
  overflow: hidden;
`;

const HeroBlob = styled.div<{
  $top?: string; $bottom?: string;
  $left?: string; $right?: string;
  $size: number; $color: string;
}>`
  position: absolute;
  top: ${p => p.$top ?? "auto"};
  bottom: ${p => p.$bottom ?? "auto"};
  left: ${p => p.$left ?? "auto"};
  right: ${p => p.$right ?? "auto"};
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: ${p => p.$color};
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  filter: blur(80px);
  opacity: 0.3;
  animation: ${blobAnim} 9s ease-in-out infinite;
`;

const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 60px 60px;
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 0; left: 55%;
  width: 1px; height: 45%;
  background: linear-gradient(to bottom, transparent, rgba(0,210,255,0.45), transparent);
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1240px;
  margin: 0 auto;
  padding: 130px 40px 90px;
  display: flex;
  align-items: center;
  gap: 72px;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
    padding: 120px 24px 64px;
    gap: 44px;
  }
`;

const HeroLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 1024px) { align-items: center; }
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid rgba(0, 210, 255, 0.3);
  border-radius: 999px;
  padding: 6px 16px;
  margin-bottom: 28px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #00d2ff;
  text-transform: uppercase;
`;

const LiveDot = styled.div`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #00d2ff;
  animation: pulseGlow 2s ease-in-out infinite;
  color: #00d2ff;
`;

const HeroH1 = styled.h1`
  font-size: clamp(40px, 5.8vw, 74px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -2.5px;
  color: #fff;
  margin-bottom: 22px;
`;

const GradientSpan = styled.span`
  background: linear-gradient(270deg, #00d2ff, #3a7bd5, #00d2ff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmerAnim} 4s ease infinite;
`;

const HeroP = styled.p`
  font-size: 16px;
  line-height: 1.82;
  color: rgba(180, 210, 255, 0.82);
  max-width: 500px;
  margin-bottom: 38px;
  strong { color: #fff; font-weight: 600; }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 50px;
  @media (max-width: 1024px) { justify-content: center; }
`;

const BtnBlue = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 30px;
  background: linear-gradient(135deg, #1e5fff, #0a38d0);
  border-radius: 12px; color: #fff;
  font-weight: 700; font-size: 14px; text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 8px 32px rgba(30, 95, 255, 0.42);
  transition: transform 0.22s, box-shadow 0.22s;
  &:hover { transform: translateY(-2px); box-shadow: 0 14px 42px rgba(30, 95, 255, 0.55); }
`;

const BtnGlass = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px; color: #fff;
  font-weight: 600; font-size: 14px; text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  backdrop-filter: blur(8px);
  transition: all 0.22s;
  &:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.28); }
`;

const BtnCyanOutline = styled.a`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 26px;
  background: rgba(0,210,255,0.1);
  border: 1px solid rgba(0,210,255,0.32);
  border-radius: 12px; color: #00d2ff;
  font-weight: 600; font-size: 14px; text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.22s;
  &:hover { background: rgba(0,210,255,0.18); }
`;

const HeroStats = styled.div`
  display: flex;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 32px;
  width: 100%;
  max-width: 400px;
  @media (max-width: 1024px) { max-width: 360px; }
`;

const HeroStat = styled.div<{ $border?: boolean }>`
  flex: 1;
  padding: 0 22px;
  border-right: ${p => p.$border ? "1px solid rgba(255,255,255,0.1)" : "none"};
  @media (max-width: 1024px) { text-align: center; }
`;

const HeroStatNum = styled.div`
  font-size: 30px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -1.5px;
  line-height: 1;
`;

const HeroStatLabel = styled.div`
  font-size: 11px;
  color: rgba(160, 195, 255, 0.62);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 5px;
`;

const HeroRight = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1024px) { display: none; }
`;

const LaptopWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 490px;
  height: 370px;
`;

const LaptopGlow = styled.div`
  position: absolute;
  bottom: -10px; left: 8%; right: 8%;
  height: 110px;
  background: radial-gradient(ellipse, rgba(0, 175, 255, 0.42) 0%, transparent 70%);
  filter: blur(26px);
`;

const FloatBadge = styled(motion.div)`
  position: absolute;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 14px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12.5px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  font-family: 'Montserrat', sans-serif;
`;

const HeroWave = styled.div`
  position: absolute;
  bottom: -1px; left: 0; right: 0;
`;

// ─────────────────────────────────────────────────────────
// BENEFITS
// ─────────────────────────────────────────────────────────
const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  max-width: 1200px;
  margin: -52px auto 0;
  padding: 0 40px;
  position: relative; z-index: 10;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); margin-top: -32px; padding: 0 20px; }
  @media (max-width: 480px) { grid-template-columns: 1fr 1fr; gap: 12px; }
`;

const BCard = styled(motion.div)`
  background: #fff;
  border-radius: 18px;
  padding: 20px 18px;
  display: flex; align-items: center; gap: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  border: 1px solid rgba(0,0,0,0.05);
`;

const BIcon = styled.div<{ $bg: string }>`
  width: 46px; height: 46px;
  border-radius: 13px;
  background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
`;

const BTitle = styled.div` font-weight: 700; font-size: 14px; color: #1a1a2e; margin-bottom: 2px; `;
const BSub = styled.div` font-size: 12px; color: #94a3b8; `;

// ─────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────
const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: center;
  @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 44px; }
`;

const AboutImgBox = styled.div`
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  height: 460px;
  background: linear-gradient(135deg, #091840, #0c2258);
  display: flex; align-items: center; justify-content: center;
`;

const AboutGridBg = styled.div`
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.038) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.038) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const AboutLaptopAnim = styled.div`
  position: relative; z-index: 2;
  width: 330px; height: 250px;
  animation: floatY 4.5s ease-in-out infinite;
`;

const PinBadge = styled.div`
  position: absolute;
  background: #fff;
  border-radius: 16px;
  padding: 13px 17px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.14);
  font-family: 'Montserrat', sans-serif;
`;

const PointRow = styled.div` display: flex; gap: 15px; align-items: flex-start; `;

const PointIconBox = styled.div<{ $bg: string }>`
  width: 42px; height: 42px;
  border-radius: 12px;
  background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 2px;
`;

const PointTitle = styled.div` font-weight: 700; font-size: 15px; color: #0f172a; margin-bottom: 4px; `;
const PointDesc = styled.div` font-size: 13.5px; line-height: 1.68; color: #64748b; `;

// ─────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────
const ServGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const SCard = styled(motion.div) <{ $accent: string }>`
  background: #fff;
  border-radius: 22px;
  padding: 30px 26px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.05);
  position: relative; overflow: hidden;
  transition: all 0.3s;
  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: ${p => p.$accent};
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s ease;
  }
  &:hover { transform: translateY(-5px); box-shadow: 0 18px 52px rgba(0,0,0,0.1); }
  &:hover::before { transform: scaleX(1); }
`;

const SEmo = styled.div<{ $bg: string }>`
  width: 60px; height: 60px;
  border-radius: 18px;
  background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin-bottom: 18px;
`;

const STitle = styled.h3` font-weight: 800; font-size: 17px; color: #0f172a; margin-bottom: 10px; `;
const SDesc = styled.p` font-size: 13.5px; line-height: 1.72; color: #64748b; margin-bottom: 16px; `;

const SLink = styled(Link) <{ $c: string }>`
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 13px; font-weight: 700; color: ${p => p.$c};
  text-decoration: none; font-family: 'Montserrat', sans-serif;
  &:hover { text-decoration: underline; }
`;

// ─────────────────────────────────────────────────────────
// TOOLS
// ─────────────────────────────────────────────────────────
const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
`;

const TCard = styled(Link) <{ $c: string }>`
  background: #fff;
  border-radius: 18px;
  padding: 26px 20px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.05);
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 10px;
  text-decoration: none; color: inherit;
  transition: all 0.25s;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.1); border-color: ${p => p.$c}40; }
`;

const TIcon = styled.div<{ $bg: string }>`
  width: 54px; height: 54px;
  border-radius: 16px; background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center;
`;

const TName = styled.div` font-weight: 700; font-size: 14px; color: #1a1a2e; `;
const TFree = styled.div` font-size: 12px; color: #94a3b8; `;

// ─────────────────────────────────────────────────────────
// WHY
// ─────────────────────────────────────────────────────────
const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const WCard = styled(motion.div)`
  background: #fff; border-radius: 22px; padding: 30px 26px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s;
  &:hover { transform: translateY(-4px); box-shadow: 0 14px 44px rgba(0,0,0,0.1); }
`;

const WEmo = styled.div<{ $bg: string }>`
  width: 60px; height: 60px; border-radius: 18px;
  background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin-bottom: 20px;
`;
const WTitle = styled.h3` font-weight: 800; font-size: 17px; color: #0f172a; margin-bottom: 10px; `;
const WDesc = styled.p` font-size: 13.5px; line-height: 1.76; color: #64748b; `;

// ─────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────
const CTABox = styled(motion.div)`
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, #05091f 0%, #091840 40%, #0d2d70 100%);
  border-radius: 28px;
  padding: 64px 48px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  @media (max-width: 768px) { padding: 44px 24px; }
`;

const CTAGlow = styled.div`
  position: absolute; top: -40%; right: -8%;
  width: 520px; height: 520px;
  background: radial-gradient(circle, rgba(0,175,255,0.17) 0%, transparent 70%);
  border-radius: 50%; pointer-events: none;
`;

const CTAGlow2 = styled.div`
  position: absolute; bottom: -30%; left: -6%;
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(26,58,200,0.22) 0%, transparent 70%);
  border-radius: 50%; pointer-events: none;
`;

const CTAH2 = styled.h2`
  font-size: clamp(26px, 4vw, 46px);
  font-weight: 900; color: #fff;
  letter-spacing: -1.5px; line-height: 1.08;
  margin-bottom: 14px; position: relative;
`;

const CTADesc = styled.p`
  font-size: 15.5px; color: rgba(180,210,255,0.78);
  max-width: 460px; margin-bottom: 34px;
  line-height: 1.76; position: relative;
`;

const CTABtns = styled.div`
  display: flex; gap: 12px; flex-wrap: wrap;
  justify-content: center; position: relative; margin-bottom: 22px;
`;

const BtnCallCyan = styled.a`
  display: inline-flex; align-items: center; gap: 9px;
  padding: 15px 32px;
  background: linear-gradient(135deg, #00d2ff, #1a80ff);
  border-radius: 12px; color: #000;
  font-weight: 800; font-size: 15px; text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 8px 28px rgba(0,210,255,0.4);
  transition: all 0.22s;
  &:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(0,210,255,0.52); }
`;

const BtnDark = styled.a`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 15px 26px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px; color: #fff;
  font-weight: 600; font-size: 14px; text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.22s;
  &:hover { background: rgba(255,255,255,0.14); }
`;

const Hours = styled.div`
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; color: rgba(160,195,255,0.58); position: relative;
`;

// ─────────────────────────────────────────────────────────
// FRAMER VARIANTS
// ─────────────────────────────────────────────────────────
const FI_UP = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
};
const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
};

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
export default function HomeClient() {
  return (
    <HomeWrapper>
      <GlobalStyle />

      {/* ══════ HERO ══════ */}
      <HeroSection>
        <HeroBlob $top="-12%" $right="-6%" $size={640} $color="rgba(0,140,255,0.5)" />
        <HeroBlob $bottom="-18%" $left="-8%" $size={540} $color="rgba(26,50,200,0.6)" />
        <GridBg />
        <VerticalLine />

        <HeroInner>
          {/* LEFT */}
          <HeroLeft>
            <motion.div initial="hidden" animate="visible" variants={STAGGER} style={{ width: "100%" }}>
              <motion.div variants={FI_UP}>
                <LiveBadge>
                  <LiveDot />
                  <MapPin size={11} />
                  Cần Thơ · Đang mở cửa
                </LiveBadge>
              </motion.div>

              <motion.div variants={FI_UP}>
                <HeroH1>
                  Laptop Cũ<br />
                  <GradientSpan>Cần Thơ</GradientSpan>{" "}
                  Giá Tốt
                </HeroH1>
              </motion.div>

              <motion.div variants={FI_UP}>
                <HeroP>
                  Hệ thống mua bán <strong>laptop cũ Cần Thơ</strong> &amp; laptop mới chính hãng
                  giá tốt nhất. Dịch vụ <strong>sửa chữa, vệ sinh</strong> máy lấy liền chuyên nghiệp.
                </HeroP>
              </motion.div>

              <motion.div variants={FI_UP}>
                <BtnRow>
                  <BtnBlue href="/laptops">
                    Xem Laptop <ArrowRight size={15} />
                  </BtnBlue>
                  <BtnGlass href="/test">
                    <FlaskConical size={15} /> Test Máy Miễn Phí
                  </BtnGlass>
                  <BtnCyanOutline href="tel:0978648720">
                    <Phone size={15} /> 0978 648 720
                  </BtnCyanOutline>
                </BtnRow>
              </motion.div>

              <motion.div variants={FI_UP}>
                <HeroStats>
                  <HeroStat $border><HeroStatNum>100+</HeroStatNum><HeroStatLabel>Sản phẩm</HeroStatLabel></HeroStat>
                  <HeroStat $border><HeroStatNum>23/7</HeroStatNum><HeroStatLabel>Hỗ trợ</HeroStatLabel></HeroStat>
                  <HeroStat><HeroStatNum>100%</HeroStatNum><HeroStatLabel>Uy tín</HeroStatLabel></HeroStat>
                </HeroStats>
              </motion.div>
            </motion.div>
          </HeroLeft>

          {/* RIGHT */}
          <HeroRight>
            <motion.div
              style={{ width: "100%" }}
              initial={{ opacity: 0, x: 45, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <LaptopWrap>
                <LaptopGlow />
                <Image
                  src="https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/alienware-x16-r2-3.jpg?v=1716871837957"
                  alt="Laptop Cần Thơ - LapLap Store"
                  fill priority quality={95}
                  style={{
                    objectFit: "contain",
                    filter: "drop-shadow(0 28px 64px rgba(0,0,0,0.65))",
                    animation: "floatY 4.5s ease-in-out infinite",
                  }}
                />
                <FloatBadge
                  style={{ top: "4%", right: "-5%" }}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.95 }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
                  Còn hàng · Giao ngay
                </FloatBadge>
                <FloatBadge
                  style={{ bottom: "10%", left: "-7%" }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Shield size={16} color="#4d9fff" />
                  Bảo hành 12 tháng
                </FloatBadge>
              </LaptopWrap>
            </motion.div>
          </HeroRight>
        </HeroInner>

        <HeroWave>
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M0,36 C480,72 960,0 1440,36 L1440,72 L0,72 Z" fill="#f5f7fa" />
          </svg>
        </HeroWave>
      </HeroSection>

      {/* ══════ BENEFITS BAR ══════ */}
      <BenefitsGrid>
        {[
          { Icon: MapPin, title: "Tại Cần Thơ", sub: "Ninh Kiều, Cần Thơ", color: "#1e5fff", bg: "#eff4ff" },
          { Icon: Truck, title: "Giao Hàng Tận Nơi", sub: "Nội thành miễn phí", color: "#059669", bg: "#ecfdf5" },
          { Icon: Shield, title: "Bảo Hành Uy Tín", sub: "6–12 tháng rõ ràng", color: "#7c3aed", bg: "#f5f3ff" },
          { Icon: FlaskConical, title: "Test Máy Miễn Phí", sub: "Trực tiếp tại shop", color: "#ea580c", bg: "#fff7ed" },
        ].map(({ Icon, title, sub, color, bg }, i) => (
          <BCard
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -4, boxShadow: "0 12px 36px rgba(0,0,0,0.11)" }}
          >
            <BIcon $bg={bg}><Icon size={20} color={color} /></BIcon>
            <div><BTitle>{title}</BTitle><BSub>{sub}</BSub></div>
          </BCard>
        ))}
      </BenefitsGrid>

      {/* ══════ ABOUT ══════ */}
      <Section $bg="#fff" $pt={100} $pb={100}>
        <Container>
          <AboutGrid>
            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              <AboutImgBox>
                <AboutGridBg />
                <AboutLaptopAnim>
                  <Image
                    src="https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/alienware-x16-r2-3.jpg?v=1716871837957"
                    alt="LapLap Store"
                    fill style={{ objectFit: "contain", filter: "drop-shadow(0 22px 44px rgba(0,0,0,0.55))" }}
                  />
                </AboutLaptopAnim>
                <PinBadge style={{ bottom: 28, left: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Laptop size={18} color="#1e5fff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>100+ Laptop</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Đa dạng mẫu mã</div>
                  </div>
                </PinBadge>
                <PinBadge style={{ top: 28, right: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Star size={18} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>Uy tín #1</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Cần Thơ</div>
                  </div>
                </PinBadge>
              </AboutImgBox>
            </motion.div>

            {/* Content side */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
              <SectionHeader>
                <motion.div variants={FI_UP}>
                  <Chip $color="#1e5fff" $bg="#eff4ff"><Star size={11} /> Về LapLap Store</Chip>
                </motion.div>
                <motion.div variants={FI_UP}>
                  <SectionTitle>Địa chỉ laptop uy tín<br />hàng đầu Cần Thơ</SectionTitle>
                </motion.div>
                <motion.div variants={FI_UP}>
                  <SectionDesc>
                    LapLap là hệ thống chuyên mua bán laptop cũ, laptop mới chính hãng tại Cần Thơ.
                    Cam kết chất lượng, giá tốt và dịch vụ hậu mãi tận tâm cho mọi khách hàng.
                  </SectionDesc>
                </motion.div>
              </SectionHeader>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { Icon: CheckCircle2, color: "#059669", bg: "#ecfdf5", title: "Kiểm tra minh bạch 20+ điểm", desc: "Mỗi máy được test kỹ trước khi bán. Khách hàng có thể test lại trực tiếp tại cửa hàng miễn phí, không che giấu lỗi." },
                  { Icon: RefreshCw, color: "#1e5fff", bg: "#eff4ff", title: "Thu cũ đổi mới — giá cao nhất", desc: "Chương trình thu mua laptop cũ giá cao, hỗ trợ đổi sang máy mới nhanh chóng, thủ tục đơn giản." },
                  { Icon: Package, color: "#7c3aed", bg: "#f5f3ff", title: "Bảo hành 6–12 tháng rõ ràng", desc: "Cam kết bảo hành dài hạn bằng giấy tờ. Sửa chữa lấy liền, hỗ trợ kỹ thuật 23/7." },
                ].map(({ Icon, color, bg, title, desc }, i) => (
                  <motion.div key={i} variants={FI_UP}>
                    <PointRow>
                      <PointIconBox $bg={bg}><Icon size={18} color={color} /></PointIconBox>
                      <div><PointTitle>{title}</PointTitle><PointDesc>{desc}</PointDesc></div>
                    </PointRow>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={FI_UP} style={{ marginTop: 32 }}>
                <BtnBlue href="/gioi-thieu" style={{ display: "inline-flex" }}>
                  Tìm hiểu thêm <ChevronRight size={15} />
                </BtnBlue>
              </motion.div>
            </motion.div>
          </AboutGrid>
        </Container>
      </Section>

      {/* ══════ SERVICES ══════ */}
      <Section $bg="#f5f7fa">
        <Container>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
            <SectionHeader $center>
              <motion.div variants={FI_UP}><Chip $color="#ea580c" $bg="#fff7ed"><Wrench size={11} /> Dịch vụ</Chip></motion.div>
              <motion.div variants={FI_UP}><SectionTitle>Đầy đủ dịch vụ — một chỗ</SectionTitle></motion.div>
              <motion.div variants={FI_UP}><SectionDesc>Từ mua bán, sửa chữa đến nâng cấp — LapLap phục vụ trọn gói mọi nhu cầu laptop.</SectionDesc></motion.div>
            </SectionHeader>

            <ServGrid>
              {[
                { emo: "💻", bg: "#eff4ff", accent: "#1e5fff", title: "Mua Bán Laptop", desc: "Dell, HP, ThinkPad, MacBook cũ & mới chính hãng. Hàng tuyển chọn, kiểm tra kỹ, giá cạnh tranh nhất.", href: "/laptops", c: "#1e5fff" },
                { emo: "🔧", bg: "#fff7ed", accent: "#ea580c", title: "Sửa Chữa Laptop", desc: "Sửa bàn phím, màn hình, main, nguồn... Kỹ thuật viên giàu kinh nghiệm, linh kiện chính hãng, lấy liền.", href: "/sua-chua-laptop", c: "#ea580c" },
                { emo: "🧹", bg: "#ecfdf5", accent: "#059669", title: "Vệ Sinh Máy", desc: "Vệ sinh toàn bộ máy, thay keo tản nhiệt. Máy chạy mát, êm, hiệu suất được phục hồi hoàn toàn.", href: "/ve-sinh-laptop", c: "#059669" },
                { emo: "⚡", bg: "#f5f3ff", accent: "#7c3aed", title: "Nâng Cấp Linh Kiện", desc: "Nâng cấp RAM, SSD, màn hình. Tư vấn linh kiện phù hợp ngân sách, lắp đặt nhanh chóng.", href: "/nang-cap", c: "#7c3aed" },
                { emo: "🔄", bg: "#fefce8", accent: "#ca8a04", title: "Thu Cũ Đổi Mới", desc: "Thu mua laptop cũ giá cao. Định giá minh bạch, không ép giá, hỗ trợ đổi máy mới trong ngày.", href: "/thu-cu-doi-moi", c: "#ca8a04" },
                { emo: "💿", bg: "#fdf2f8", accent: "#db2777", title: "Cài Đặt Phần Mềm", desc: "Cài Windows, Office, Driver, diệt virus, tối ưu hệ thống. Nhanh chóng, an toàn, bảo hành dịch vụ.", href: "/cai-dat-phan-mem", c: "#db2777" },
              ].map(({ emo, bg, accent, title, desc, href, c }, i) => (
                <SCard
                  key={i} $accent={accent}
                  variants={FI_UP}
                  transition={{ delay: i * 0.07 } as any}
                >
                  <SEmo $bg={bg}>{emo}</SEmo>
                  <STitle>{title}</STitle>
                  <SDesc>{desc}</SDesc>
                  <SLink href={href} $c={c}>Xem thêm <ChevronRight size={13} /></SLink>
                </SCard>
              ))}
            </ServGrid>
          </motion.div>
        </Container>
      </Section>

      {/* ══════ ONLINE TOOLS ══════ */}
      <Section $bg="#fff">
        <Container>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
            <SectionHeader $center>
              <motion.div variants={FI_UP}><Chip $color="#0891b2" $bg="#ecfeff"><Zap size={11} /> Công cụ online</Chip></motion.div>
              <motion.div variants={FI_UP}><SectionTitle>Test laptop miễn phí online</SectionTitle></motion.div>
              <motion.div variants={FI_UP}><SectionDesc>Kiểm tra linh kiện laptop ngay trên trình duyệt — không cần cài phần mềm, hoàn toàn miễn phí.</SectionDesc></motion.div>
            </SectionHeader>

            <ToolsGrid>
              {[
                { Icon: Monitor, c: "#1e5fff", bg: "#eff4ff", name: "Test Màn Hình" },
                { Icon: Cpu, c: "#7c3aed", bg: "#f5f3ff", name: "Test CPU" },
                { Icon: HardDrive, c: "#059669", bg: "#ecfdf5", name: "Test SSD / HDD" },
                { Icon: Wifi, c: "#0891b2", bg: "#ecfeff", name: "Test WiFi / Net" },
              ].map(({ Icon, c, bg, name }, i) => (
                <motion.div
                  key={i}
                  style={{ display: 'contents' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TCard $c={c} href="/test">
                    <TIcon $bg={bg}><Icon size={22} color={c} /></TIcon>
                    <TName>{name}</TName>
                    <TFree>Miễn phí</TFree>
                  </TCard>
                </motion.div>
              ))}
            </ToolsGrid>

            <motion.div variants={FI_UP} style={{ textAlign: "center", marginTop: 28 }}>
              <BtnGlass href="/test" style={{ display: "inline-flex", background: "#0a1a45", border: "none", color: "#fff" }}>
                <FlaskConical size={15} /> Vào trang test ngay
              </BtnGlass>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* ══════ WHY CHOOSE US ══════ */}
      <Section $bg="#f5f7fa">
        <Container>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
            <SectionHeader $center>
              <motion.div variants={FI_UP}><Chip $color="#1e5fff" $bg="#eff4ff"><Star size={11} /> Tại sao chọn LapLap</Chip></motion.div>
              <motion.div variants={FI_UP}><SectionTitle>Uy tín là trên hết</SectionTitle></motion.div>
            </SectionHeader>

            <WhyGrid>
              {[
                { emo: "🔍", bg: "#eff4ff", title: "Kiểm tra minh bạch", desc: "Mỗi máy được test 20+ điểm trước khi bán. Khách hàng test lại trực tiếp tại cửa hàng miễn phí, không che giấu lỗi." },
                { emo: "💰", bg: "#ecfdf5", title: "Giá tốt nhất Cần Thơ", desc: "Cam kết giá cạnh tranh nhất thị trường. Nếu tìm được nơi rẻ hơn cùng chất lượng, LapLap hoàn tiền chênh lệch." },
                { emo: "🛡️", bg: "#f5f3ff", title: "Bảo hành & hỗ trợ lâu dài", desc: "Bảo hành 6–12 tháng bằng giấy tờ rõ ràng. Hỗ trợ kỹ thuật 23/7, sửa chữa lấy liền." },
              ].map((w, i) => (
                <WCard key={i} variants={FI_UP}>
                  <WEmo $bg={w.bg}>{w.emo}</WEmo>
                  <WTitle>{w.title}</WTitle>
                  <WDesc>{w.desc}</WDesc>
                </WCard>
              ))}
            </WhyGrid>
          </motion.div>
        </Container>
      </Section>

      {/* ══════ CTA BANNER ══════ */}
      <Section $bg="#f5f7fa" $pb={100}>
        <Container>
          <CTABox
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <CTAGlow />
            <CTAGlow2 />
            <Chip $color="#00d2ff" $bg="rgba(0,210,255,0.12)" style={{ border: "1px solid rgba(0,210,255,0.28)" }}>
              <Zap size={11} /> Liên hệ tư vấn
            </Chip>
            <CTAH2>
              Tìm laptop phù hợp?<br />
              <span style={{ background: "linear-gradient(90deg,#00d2ff,#3a7bd5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Tư vấn miễn phí ngay!
              </span>
            </CTAH2>
            <CTADesc>
              Đội ngũ tư vấn giàu kinh nghiệm sẵn sàng giúp bạn chọn chiếc laptop phù hợp nhất
              với nhu cầu và ngân sách — hoàn toàn không phí tư vấn.
            </CTADesc>
            <CTABtns>
              <BtnCallCyan href="tel:0978648720">
                <Phone size={16} /> 0978 648 720
              </BtnCallCyan>
              <BtnDark href="https://facebook.com/profile.php?id=61582947329036" target="_blank" rel="noopener">
                <Facebook size={16} /> Ghé thăm Fanpage
              </BtnDark>
              <BtnDark href="mailto:laplapcantho@gmail.com">
                <Mail size={16} /> laplapcantho@gmail.com
              </BtnDark>
            </CTABtns>
            <Hours>
              <Clock size={14} />
              Mở cửa T2–T7: 8:00–21:00 &nbsp;·&nbsp; Chủ nhật: 8:00–18:00
            </Hours>
          </CTABox>
        </Container>
      </Section>
    </HomeWrapper>
  );
}