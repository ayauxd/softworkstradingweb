import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const PrivacyPolicyPage = () => {
  return (
    <PolicyLayout 
      title="Privacy Policy" 
      description="Softworks Trading Company's Privacy Policy - Learn how we collect, use, and protect your personal information."
    >
      <div className="policy-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: May 6, 2025</p>

        {/* Table of Contents */}
        <div className="toc">
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#introduction">1. Introduction</a></li>
            <li><a href="#information">2. Information We Collect</a></li>
            <li><a href="#use">3. How We Use Your Information</a></li>
            <li><a href="#security">4. Data Security</a></li>
            <li><a href="#third-party">5. Third-Party Services</a></li>
            <li><a href="#cookies">6. Cookies</a></li>
            <li><a href="#rights">7. Your Data Protection Rights</a></li>
            <li><a href="#changes">8. Changes to This Privacy Policy</a></li>
            <li><a href="#contact">9. Contact Us</a></li>
          </ul>
        </div>

        <section id="introduction">
          <h2>1. Introduction</h2>
          <p>Softworks Trading Company ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
          <p>Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.</p>
        </section>

        <section id="information">
          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Data</h3>
          <p>We may collect personal identification information, including but not limited to:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company name</li>
            <li>Messages or inquiries you submit through our contact forms</li>
          </ul>

          <h3>2.2 Usage Data</h3>
          <p>We may also collect information about how the website is accessed and used ("Usage Data"). This may include:</p>
          <ul>
            <li>Your computer's IP address</li>
            <li>Browser type and version</li>
            <li>Pages of our website that you visit</li>
            <li>Time and date of your visit</li>
            <li>Time spent on those pages</li>
            <li>Other diagnostic data</li>
          </ul>
        </section>

        <section id="use">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To respond to your inquiries, questions, and requests</li>
            <li>To process transactions and send related information</li>
            <li>To improve our website and services</li>
            <li>To send newsletters, updates, and marketing communications (with your consent)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section id="security">
          <h2>4. Data Security</h2>
          <p>We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal data. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section id="third-party">
          <h2>5. Third-Party Services</h2>
          <p>We may use third-party service providers to:</p>
          <ul>
            <li>Facilitate our website and services</li>
            <li>Perform service-related functions</li>
            <li>Assist us in analyzing how our website is used</li>
          </ul>
          <p>These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
        </section>

        <section id="cookies">
          <h2>6. Cookies</h2>
          <p>We use cookies to enhance your experience on our website. For more information about how we use cookies, please refer to our <a href="/cookie-policy">Cookie Policy</a>.</p>
        </section>

        <section id="rights">
          <h2>7. Your Data Protection Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
          <ul>
            <li>The right to access, update, or delete your information</li>
            <li>The right to rectification if your information is inaccurate or incomplete</li>
            <li>The right to object to our processing of your personal data</li>
            <li>The right to request restriction of processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
        </section>

        <section id="changes">
          <h2>8. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        </section>

        <section id="contact">
          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: <a href="mailto:agent@softworkstrading.com">agent@softworkstrading.com</a></p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default PrivacyPolicyPage;