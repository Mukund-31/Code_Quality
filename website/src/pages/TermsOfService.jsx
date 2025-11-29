import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-white pt-24 pb-16">
      <Container>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-primary-500 hover:text-primary-400 mb-8 transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
          
          <div className="bg-dark-900 rounded-xl p-8 md:p-10 shadow-2xl border border-dark-800">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">Terms of Service</h1>
              <p className="text-dark-400 mt-2">Last Updated: Feb 2025</p>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">Introduction</h2>
              <p className="text-dark-300 mb-4">
                This Terms of Service is a contract entered into by and between You ("you" or "User") and code_quality ("code_quality," "We," or "us") and our affiliates, to the extent expressly stated. These terms and conditions (together with our Privacy Policy, these "Terms of Service" or "Terms") govern your access to and use of https://getcq.netlify.app/ ("Website"), our web application (our "App") and any software, application, content, functionality, and services (collectively, the "Services") offered by code_quality, whether as a guest or registered user.
              </p>
              <p className="text-dark-300 mb-4">
                By using our Services, you accept and agree to be bound and abide by these Terms. Your use of the Services is subject to and governed by the Information Technology Act, 2000 and the rules, regulations, and guidelines framed thereunder, including the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the Digital Personal Data Protection Act, 2023. If you are not eligible or do not agree to these Terms of Service, then you do not have permission to use the Service and you must not access or use our Services.
              </p>
              <div className="bg-dark-800 p-4 rounded-lg my-4 border-l-4 border-yellow-500">
                <p className="font-semibold text-yellow-400">ARBITRATION NOTICE</p>
                <p className="text-dark-300 mt-2">
                  Except for certain kinds of disputes described in Section 18, you agree that disputes arising under these Terms will be resolved by binding, individual arbitration in India, and BY ACCEPTING THESE TERMS, YOU AND code_quality ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN ANY CLASS ACTION OR REPRESENTATIVE PROCEEDING.
                </p>
              </div>
              <p className="text-dark-300">
                Your ability to use or access the Services is dependent on third parties, such as GitHub or GitLab. You acknowledge and agree that your ability to access and use the Services is governed by the Terms of these third parties, and those Terms may change at their discretion.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">1. AGE RESTRICTIONS</h2>
              <p className="text-dark-300">
                The Website and Services are intended for users who are 13 years of age or older. By accessing or using the Services, You represent and warrant that you are at least thirteen (13) years old. If you are under 18 years of age, you must review these Terms with your parent or legal guardian to ensure both you and your parent or legal guardian understand and agree to these Terms. You further represent and warrant that you possess the legal right and ability to enter into this Terms of Service (or, if a minor, that you have the consent of your legal guardian) and to use the Services in accordance with these Terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">5. PROHIBITED USES</h2>
              <p className="text-dark-300 mb-4">
                You may use our Services only for lawful purposes and in accordance with these Terms of Service. You agree not to use the Services:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>In any way that violates any applicable law or regulation in force in the Republic of India or internationally.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
                <li>To impersonate or attempt to impersonate code_quality, a code_quality employee, another user, or any other person or entity.</li>
                <li>To violate, encourage others to violate, or provide instructions on how to violate, any right of a third party, including by infringing or misappropriating any third-party intellectual property right.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which, as determined by us, may harm code_quality or users of the Services, or expose them to liability.</li>
              </ul>
              <p className="text-dark-300 mb-4">
                Additionally, you agree not to host, display, upload, modify, publish, transmit, store, update or share any information that:
              </p>
              <ol className="list-decimal pl-6 text-dark-300 space-y-2 mb-6">
                <li>Belongs to another person and to which the user does not have any right;</li>
                <li>Is defamatory, obscene, pornographic, paedophilic, invasive of another's privacy, including bodily privacy, insulting or harassing on the basis of gender, libellous, racially or ethnically objectionable, relating or encouraging money laundering or gambling, or promoting enmity between different groups on the grounds of religion or caste with the intent to incite violence, or otherwise inconsistent with or contrary to the laws in force;</li>
                <li>Is harmful to a child;</li>
                <li>Infringes any patent, trademark, copyright or other proprietary rights;</li>
                <li>Deceives or misleads the addressee about the origin of the message or knowingly and intentionally communicates any misinformation or information which is patently false and untrue or misleading in nature;</li>
                <li>Threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign States, or public order, or causes incitement to the commission of any cognizable offence or prevents investigation of any offence or is insulting to any other nation.</li>
                <li>Is prohibited by the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.</li>
              </ol>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">7. TERMS OF SERVICE VIOLATIONS AND TERMINATION</h2>
              <p className="text-dark-300 mb-4">
                <span className="font-semibold">Termination.</span> Any violation of these Terms of Service shall result in immediate account termination without prior warning to you and without refund applied to your Account. In case of non-compliance with these Terms, code_quality reserves the right to terminate the access or usage rights of the users to the computer resource immediately or remove non-compliant information or both, as required under the IT Rules, 2021. You agree that any violation by you of these Terms of Service will constitute an unlawful and unfair business practice, and will cause irreparable harm to us.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">8. PRIVACY POLICY AND DATA PROTECTION</h2>
              <p className="text-dark-300 mb-4">
                Your use of the Services may involve the transmission of your personal information to us. Our policies regarding the collection, use, disclosure, and protection of such personal information are governed according to our <Link to="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>. We are committed to complying with the Digital Personal Data Protection Act, 2023 (DPDP Act, 2023) and related rules. By using our Services, you provide explicit consent to the collection, processing, and use of your personal data as outlined in our Privacy Policy and these Terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">12. GRIEVANCE REDRESSAL MECHANISM (MANDATORY UNDER IT RULES, 2021)</h2>
              <p className="text-dark-300 mb-4">
                In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, code_quality has established a Grievance Redressal Mechanism.
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Any user grievance regarding the violation of these Terms or any other matter must be addressed to the Grievance Officer via the email address provided below.</li>
                <li>The Grievance Officer shall acknowledge the complaint within twenty-four (24) hours of receipt.</li>
                <li>The Grievance Officer shall dispose of or resolve such complaint within fifteen (15) days from the date of its receipt.</li>
                <li>Complaints regarding content that exposes private areas, shows nudity, or is in the nature of impersonation must be resolved within twenty-four (24) hours.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">18. DISPUTE RESOLUTION AND ARBITRATION</h2>
              <p className="text-dark-300 mb-4">
                <span className="font-semibold">Generally.</span> You and code_quality agree that every dispute arising in connection with these Terms, the Service, or communications from us will be resolved through binding arbitration in India.
              </p>
              <p className="text-dark-300 mb-4">
                <span className="font-semibold">Governing Arbitration Law.</span> All disputes shall be finally settled by arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996, or any statutory modifications or re-enactment thereof, for the time being in force.
              </p>
              <p className="text-dark-300 mb-4">
                <span className="font-semibold">Arbitration Procedure.</span> The arbitration shall be conducted by a single arbitrator appointed by code_quality. The language of the arbitration shall be English. The arbitral award shall be final and binding on both parties.
              </p>
              <p className="text-dark-300 mb-4">
                <span className="font-semibold">Seat and Venue of Arbitration.</span> The seat and venue of the arbitration shall be exclusively in Bengaluru, Karnataka, India.
              </p>
              <div className="bg-dark-800 p-4 rounded-lg my-4 border-l-4 border-yellow-500">
                <p className="font-semibold text-yellow-400">EXCLUSION OF CLASS ACTIONS</p>
                <p className="text-dark-300 mt-2">
                  YOU AND code_quality AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                </p>
              </div>
              <p className="text-dark-300">
                <span className="font-semibold">Jurisdiction for Interim Relief.</span> Notwithstanding the above, the courts in Bengaluru shall have exclusive jurisdiction to grant interim or interlocutory relief in aid of arbitration.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">19. GOVERNING LAW</h2>
              <p className="text-dark-300">
                These Terms of Service and any claim arising out of these Terms will be governed by and construed in accordance with the laws of the Republic of India.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">23. ACCESS OF THE SITE OUTSIDE INDIA</h2>
              <p className="text-dark-300 mb-4">
                The Service is primarily intended for users located within India. We make no representation that the Service is appropriate or available for use outside of India. Users accessing the Service from outside India are responsible for compliance with all local laws and regulations.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">26. CONTACT INFORMATION</h2>
              <p className="text-dark-300 mb-4">
                For questions or concerns related to these Terms, please contact our support team at: <a href="mailto:codequality01@gmail.com" className="text-primary-500 hover:underline">codequality01@gmail.com</a>
              </p>
              <p className="text-dark-300">
                For user grievances, please contact our Grievance Officer at: <a href="mailto:codequality01@gmail.com" className="text-primary-500 hover:underline">codequality01@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 border-b border-dark-700 pb-2">26. MISCELLANEOUS</h2>
              <p className="text-dark-300 mb-4">
                <span className="font-semibold">Communications.</span> We may send you emails concerning our products and services, as well as those of third parties. You may opt out of promotional emails by following the unsubscribe instructions in the promotional email itself.
              </p>
              <p className="text-dark-300">
                <span className="font-semibold">Modification of the Service.</span> code_quality reserves the right to modify or discontinue all or any portion of the Service at any time (including by limiting or discontinuing certain features of the Service), temporarily or permanently, without notice to you. code_quality will have no liability for any change to the Service, including any paid-for functionalities of the Service, or any suspension or termination of your access to or use of the Service. You should retain copies of any User Content you upload to the Service so that you have permanent copies in the event the Service is modified in such a way that you lose access to User Content you upload to the Service.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfService;
