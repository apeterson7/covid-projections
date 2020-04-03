import React from 'react';
import Logo from 'assets/images/footerlogoDarkWithURL';
import { useLocation } from 'react-router-dom';

import { useHistory } from 'react-router-dom';

import {
  StyledFooter,
  StyledFooterContent,
  StyledFooterBodyLinks,
  StyledFooterBodyNav,
  StyledFooterBodyButton,
  StyledFooterDivider,
} from './Footer.style';

const FooterButton = props => (
  <StyledFooterBodyButton
    href="https://forms.gle/JTCcqrGb5yzoD6hg6"
    target="_blank"
    {...props}
  >
    Contribute to this tool
  </StyledFooterBodyButton>
);

const Footer = ({ children }) => {
  const history = useHistory();

  const goTo = route => {
    history.push(route);

    window.scrollTo(0, 0);
  };

  const { pathname } = useLocation();
  let page = 'normal';
  if (pathname === '/') {
    page = 'home';
  } else if (pathname.includes('/state/')) {
    page = 'map';
  } else if (pathname.includes('/endorsements')) {
    page = 'endorsements';
  }

  return (
    <div>
      <StyledFooter page={page}>
        <StyledFooterContent>
          <Logo />
          <StyledFooterBodyNav>
            <span onClick={() => goTo('/')}>Map</span>
            <span onClick={() => goTo('/about')}>FAQ</span>
            <span onClick={() => goTo('/model')}>Model</span>
            <span onClick={() => goTo('/endorsements')}>Endorsements</span>
          </StyledFooterBodyNav>
          <FooterButton className="footer__narrow-screen-only" />
          <StyledFooterDivider />
          <StyledFooterBodyLinks>
            <span onClick={() => goTo('/contact')}>Contact</span>
            {' ∙ '}
            <span onClick={() => goTo('/terms')}>Terms</span>
            {' ∙ '}
            <a href="mailto:press@covidactnow.org">Press</a>
          </StyledFooterBodyLinks>
        </StyledFooterContent>
        <FooterButton className="footer__wide-screen-only" />
      </StyledFooter>
    </div>
  );
};

export default Footer;
