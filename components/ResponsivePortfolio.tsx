'use client';

import Hero from './Hero';
import IntroVideo from './IntroVideo';
import AboutMe from './AboutMe';
import WhatICanDo from './WhatICanDo';
import WhatIHaveDone from './WhatIHaveDone';
import Collaborators from './Collaborators';
import Contact from './Contact';
import IntroAnimation from './IntroAnimation';
import ScrollHint from './ScrollHint';
import AnimatedLineBackground from './AnimatedLineBackground';
import CursorDepression from './CursorDepression';
import FullscreenToggle from './FullscreenToggle';
import AnimationActivity from './AnimationActivity';
import MobilePortfolio from './MobilePortfolio';
import { useCompactLayout } from './responsive';

export default function ResponsivePortfolio() {
  const compact = useCompactLayout();

  return (
    <>
      {/* CSS selects the correct layout before hydration. Content stays available in the HTML. */}
      <div className="compact-portfolio"><MobilePortfolio /></div>
      <div className="desktop-portfolio">
        {/* Unmount desktop scroll effects and video on compact screens. */}
        {!compact && <DesktopPortfolio />}
      </div>
    </>
  );
}

function DesktopPortfolio() {
  return (
    <>
      <AnimationActivity />
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <AnimatedLineBackground />
      </div>
      <IntroAnimation />
      <CursorDepression />
      <ScrollHint />
      <FullscreenToggle />
      <div id="site" style={{ position: 'relative', zIndex: 1 }}>
        <IntroVideo><Hero /></IntroVideo>
        <div data-cursor-depression-zone style={{ backgroundColor: 'rgba(245,245,243,0.52)' }}>
          <AboutMe />
          <WhatICanDo />
          <WhatIHaveDone />
          <Collaborators />
          <Contact />
        </div>
      </div>
    </>
  );
}
