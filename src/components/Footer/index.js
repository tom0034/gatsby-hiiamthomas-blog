import React from 'react';

import ExternalLink from '../ExternalLink';
import { config } from '../../../data';

import './index.scss';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-12 text-center">
          <div className="row-sm-12">
            <p className="architecture">
              Build with&nbsp;
            <ExternalLink href="https://www.gatsbyjs.org/" title="GatsbyJS" />
            &nbsp;and&nbsp;
            <ExternalLink
                href="https://reactjs.org/"
                title={`React ${React.version}`}
              />
            .&nbsp;Hosted on&nbsp;
            <ExternalLink href="https://www.netlify.com/" title="Netlify" />
              <br />
            The code is open source and available at&nbsp;
            <ExternalLink
                href="https://github.com/tom0034/gatsby-hiiamthomas-blog"
                title="tom0034/gatsby-hiiamthomas-blog"
              />
            </p>
          </div>
          <div className="row-sm-12">
            <p className="copyright">
              Copyright&nbsp;
            <ExternalLink href="https://hiiamthomas.me/" title="&copy;hiiamthomas" />
            &nbsp;
            {config.title}
              {new Date().getFullYear()}

              <br />
              <p>&nbsp;Theme by <ExternalLink href="https://github.com/calpa/gatsby-starter-calpa-blog" title="Calpa" /></p>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
