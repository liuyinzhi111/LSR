import Hero from '@/components/Hero';
import IntroVideo from '@/components/IntroVideo';
import AboutMe from '@/components/AboutMe';
import WhatICanDo from '@/components/WhatICanDo';
import WhatIHaveDone from '@/components/WhatIHaveDone';
import Collaborators from '@/components/Collaborators';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main>
      <IntroVideo>
        <Hero />
      </IntroVideo>
      <div
        data-cursor-depression-zone
        style={{
          backgroundColor: 'rgba(245,245,243,0.52)',
        }}
      >
        <AboutMe />
        <WhatICanDo />
        <WhatIHaveDone />
        <Collaborators />
        <Contact />
      </div>
    </main>
  );
}
