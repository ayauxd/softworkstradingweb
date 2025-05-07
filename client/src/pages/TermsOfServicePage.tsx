import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const TermsOfServicePage = () => {
  return (
    <PolicyLayout 
      title="Terms of Service" 
      description="Softworks Trading Company's Terms of Service - The terms that govern your use of our website and services."
    >
      <div className="policy-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: May 6, 2025</p>

        {/* Table of Contents */}
        <div className="toc">
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#agreement">1. Agreement to Terms</a></li>
            <li><a href="#use">2. Use of the Site</a></li>
            <li><a href="#intellectual-property">3. Intellectual Property Rights</a></li>
            <li><a href="#services">4. Services</a></li>
            <li><a href="#payments">5. Payments and Billing</a></li>
            <li><a href="#disclaimer">6. Disclaimer of Warranties</a></li>
            <li><a href="#liability">7. Limitation of Liability</a></li>
            <li><a href="#indemnification">8. Indemnification</a></li>
            <li><a href="#governing-law">9. Governing Law</a></li>
            <li><a href="#changes">10. Changes to These Terms</a></li>
            <li><a href="#contact">11. Contact Us</a></li>
          </ul>
        </div>

        <section id="agreement">
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using the Softworks Trading Company website ("Site"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, please do not use our Site or services.</p>
        </section>

        <section id="use">
          <h2>2. Use of the Site</h2>
          <h3>2.1 Eligibility</h3>
          <p>You must be at least 18 years old to use our Site and services. By using our Site, you represent and warrant that you meet this requirement.</p>

          <h3>2.2 Account Responsibility</h3>
          <p>If you create an account with us, you are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
          
          <h3>2.3 Prohibited Activities</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Site in any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>Use the Site to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Site</li>
            <li>Use the Site in any manner that could disable, overburden, damage, or impair the Site</li>
            <li>Use any robot, spider, or other automatic device to access the Site for any purpose</li>
            <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Site</li>
          </ul>
        </section>

        <section id="intellectual-property">
          <h2>3. Intellectual Property Rights</h2>
          <p>The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by Softworks Trading Company, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
          <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Site without our prior written consent.</p>
        </section>

        <section id="services">
          <h2>4. Services</h2>
          <p>We provide various AI automation and workflow optimization services. All services are subject to the following conditions:</p>
          <ul>
            <li>Services are provided "as is" without any guarantees or warranties</li>
            <li>Service availability, features, and pricing may change at any time</li>
            <li>We reserve the right to refuse service to anyone for any reason at any time</li>
          </ul>
        </section>

        <section id="payments">
          <h2>5. Payments and Billing</h2>
          <p>If you purchase any services from us, you agree to provide accurate and complete billing information. All fees are non-refundable unless otherwise specified at the time of purchase.</p>
        </section>

        <section id="disclaimer">
          <h2>6. Disclaimer of Warranties</h2>
          <p>YOUR USE OF THE SITE, ITS CONTENT, AND ANY SERVICES OBTAINED THROUGH THE SITE IS AT YOUR OWN RISK. THE SITE AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
        </section>

        <section id="liability">
          <h2>7. Limitation of Liability</h2>
          <p>IN NO EVENT WILL SOFTWORKS TRADING COMPANY, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE SITE OR SUCH OTHER WEBSITES, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SITE OR SUCH OTHER WEBSITES.</p>
        </section>

        <section id="indemnification">
          <h2>8. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless Softworks Trading Company, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Site.</p>
        </section>

        <section id="governing-law">
          <h2>9. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without giving effect to any principles of conflicts of law.</p>
        </section>

        <section id="changes">
          <h2>10. Changes to These Terms</h2>
          <p>We may revise and update these Terms from time to time at our sole discretion. All changes are effective immediately when we post them, and apply to all access to and use of the Site thereafter.</p>
          <p>Your continued use of the Site following the posting of revised Terms means that you accept and agree to the changes.</p>
        </section>

        <section id="contact">
          <h2>11. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>Email: <a href="mailto:agent@softworkstrading.com">agent@softworkstrading.com</a></p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default TermsOfServicePage;