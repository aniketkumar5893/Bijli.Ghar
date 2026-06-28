// main.js - Handles Global UI, Session Security, and Floating Assistant

function getCurrentLang() {
    return localStorage.getItem('bijliLang') || 'en';
}

function getLanguageDict(lang = getCurrentLang()) {
    const translations = {
        en: {
            langLabel: 'Language',
            langOptionEnglish: 'English',
            langOptionHindi: 'Hindi',
            navHome: 'Home',
            navAbout: 'About',
            navMeters: 'Meters',
            navServices: 'Services',
            navConnection: 'New Connection',
            navLogin: 'Login',
            navMyAccount: 'My Account',
            navLogout: 'Logout',
            aboutDiscoverStory: 'DISCOVER OUR STORY',
            aboutPartnerTitle: 'Your Trusted Electrical Partner',
            aboutPartnerDesc: 'Providing safe, certified, and premium electrical solutions to Hazaribag and beyond.',
            aboutEmpoweringTitle: 'Empowering Homes & Businesses',
            aboutEmpoweringDesc1: 'Founded with a commitment to safety and transparency, <strong>Bijli Ghar</strong> is Hazaribag\'s premier hub for all electrical needs. We eliminate the hassle of unverified electricians and substandard materials by bringing everything under one roof.',
            aboutEmpoweringDesc2: 'As authorized <strong>JBVNL Partners</strong>, we specialize in seamless new connections, providing certified 1-Phase and 3-Phase smart meters, and dispatching expert engineers for custom residential and commercial wiring solutions.',
            aboutSafetyTitle: '100% Certified Safety',
            aboutSafetyDesc: 'Government approved standards.',
            aboutFeature1Title: 'Premium Meters',
            aboutFeature1Desc: 'We supply only industry-leading brands like Indotech and L&T, ensuring accurate readings and long-lasting durability.',
            aboutFeature2Title: 'Expert Engineers',
            aboutFeature2Desc: 'Our team consists of highly trained and verified electricians equipped to handle everything from basic wiring to complex industrial loads.',
            aboutFeature3Title: 'Fast Connections',
            aboutFeature3Desc: 'We bridge the gap between consumers and the electricity board, ensuring your new JBVNL connection is processed swiftly.',
            aboutHappyCustomers: 'Happy Customers',
            metersPageTitle: 'Premium Electric Meters',
            metersPageDesc: 'Certified equipment for domestic and commercial use.',
            metersCard1Title: 'Indotech 1-Phase Meter',
            metersCard1Subtitle: 'Standard Basic Unit (Without Box)',
            metersCard1SpecBrand: 'Brand',
            metersCard1SpecMaterial: 'Material',
            metersCard1SpecColor: 'Color',
            metersCard1SpecCert: 'Certification',
            metersCard2Title: 'Indotech Box Meter',
            metersCard2Subtitle: 'Complete Set with Protective Housing',
            metersCard2SpecType: 'Type',
            metersCard2SpecArea: 'Suitable Area',
            metersCard2SpecDim: 'Dimensions',
            metersCard2SpecHardware: 'Hardware',
            metersCard3Title: 'L&T Three Phase Meter',
            metersCard3Subtitle: 'Heavy Duty Industrial/Commercial Grade',
            metersCard3SpecBrand: 'Brand',
            metersCard3SpecPhase: 'Phase',
            metersCard3SpecUse: 'Use Case',
            metersCard3SpecAcc: 'Accuracy',
            metersQtyLabel: 'Quantity:',
            metersAddToCart: 'Add to Cart',
            metersInCart: 'currently in cart',
            servicesPageTitle: 'Professional Installation & Repairs',
            servicesPageDesc: 'Book certified electricians for meter fitting or custom troubleshooting directly to your home.',
            servicesCard1Title: 'Meter Fitting',
            servicesCard1Desc: 'Complete professional installation from the main pole to your internal switchboard.',
            servicesCard2Title: 'Meter Replacement',
            servicesCard2Desc: 'Safe removal of your old/faulty meter and installation of a new unit.',
            servicesBookPay: 'Book & Pay',
            servicesCustomTitle: 'Need a Custom Electrician?',
            servicesCustomDesc: 'Having short circuits, wiring issues, or need an appliance installed? Submit a request and our expert will visit your home. <span class="text-secondary font-black">Pay only after inspection.</span>',
            servicesCustomLi1: 'Fast Response Time',
            servicesCustomLi2: 'Verified Professionals',
            servicesCustomLi3: 'Transparent Estimates',
            servicesFormName: 'Your Name',
            servicesFormPhone: 'Phone Number',
            servicesFormIssue: 'Issue Details & Address',
            servicesFormSubmit: 'Submit Request',
            servicesModalTitle: 'Book Service',
            servicesModalConfirm: 'Proceed to Pay',
            servicesModalMaterial: 'I confirm I have the required meters/materials ready.',
            connectionPageTitle: 'New Connection Setup',
            connectionPageDesc: 'Complete your JBVNL application quickly and securely.',
            connectionStep1: '1. Installation Details',
            connectionApplicantName: 'Applicant Name',
            connectionPhone: 'Phone Number (10 Digits)',
            connectionAddress: 'Full Address',
            connectionLandmark: 'Landmark (Optional)',
            connectionConnectionType: 'Connection Type',
            connectionTypeDomestic: 'Domestic',
            connectionTypeCommercial: 'Commercial',
            connectionTypeIrrigation: 'Irrigation',
            connectionFloors: 'Number of Floors',
            connectionAcTons: 'Total AC Capacity (Tons)',
            connectionLoad: 'Calculated Load (kWh)',
            connectionLoadHelper: '1-5 kWh uses a standard Single Phase connection.',
            connectionPhaseRequired: 'Phase Required',
            connectionPhaseSingle: 'Single Phase (1-5 kWh)',
            connectionPhaseThree: '3-Phase (6+ kWh)',
            connectionStep2: '2. Mandatory Documents',
            connectionDocHelper: 'Select multiple files at once if your document has multiple pages. Supported formats: JPG, PNG, PDF.',
            connectionDocPhoto: 'Passport Photo',
            connectionDocIdProof: 'Valid ID Proof',
            connectionDocSignature: 'Signature',
            connectionDocLandProof: 'Land Proof',
            connectionDocClickPhoto: 'Click to Upload Photo',
            connectionDocClickId: 'Click to Upload ID',
            connectionDocClickSignature: 'Click to Upload Signature',
            connectionDocClickLand: 'Click to Upload Land Proof',
            connectionAgreementTitle: 'User Agreement',
            connectionAgreementCheckbox: 'I have read and agree to the Terms & Conditions. *',
            connectionTotalCostLabel: 'Total Estimated Cost',
            connectionProceedPay: 'Proceed to Pay',
            connectionSubmitUpload: 'Upload',
            connectionPreviewModalTitle: 'Document Preview',
            cartPageTitle: 'Secure Checkout',
            cartPageDesc: 'Review your items and enter delivery details.',
            cartEmptyTitle: 'Your Cart is Empty',
            cartEmptyDesc: 'Looks like you haven\'t added any meters to your cart yet.',
            cartEmptyBrowse: 'Browse Meters',
            cartOrderSummary: 'Order Summary',
            cartEmptyCart: 'Empty Cart',
            cartDeliveryCharge: 'Delivery Charge',
            cartDeliveryDetails: 'Delivery Details',
            cartFormName: 'Full Name',
            cartFormAddress: 'Flat, House No, Building',
            cartFormLandmark: 'Landmark',
            cartFormPhone: 'Phone Number',
            cartAddressMessage: 'Add a saved address (with optional landmark) from My Account before placing your order.',
            cartTotalToPay: 'Total to Pay',
            cartProceedToPay: 'Proceed to Pay',
            loginWelcome: 'Welcome',
            loginAccess: 'Access your Bijli Ghar account.',
            loginTab: 'Sign In',
            registerTab: 'Sign Up',
            loginEmailLabel: 'Email Address',
            loginPassLabel: 'Password',
            loginBtn: 'Sign In',
            registerNameLabel: 'Full Name',
            registerEmailLabel: 'Email Address',
            registerPassLabel: 'Password',
            registerMinNote: '(Min. 6 chars)',
            registerBtn: 'Create Account',
            loginOr: 'OR',
            loginGoogleCta: 'Continue with Google',
            indexHeroTag: '⚡ HAZARIBAG\'S NO. 1 ELECTRICAL SERVICE',
            indexHeroTitleSafety: 'Powering Homes with ',
            indexHeroSafety: 'Safety & Precision.',
            indexHeroDesc: 'Certified engineers at your doorstep. Whether you need a new JBVNL connection, premium smart meters, or expert appliance repair, we handle it all with professional gear.',
            indexApplyConnection: 'Apply for Connection',
            indexBookElectrician: 'Book Electrician',
            indexBuyMeters: 'Buy Meters',
            indexHireEngineers: 'Hire Engineers',
            indexNewConnection: 'New Connection',
            indexDiscoverStory: 'DISCOVER OUR STORY',
            indexPartnerTitle: 'Your Trusted Electrical Partner',
            footerQuickLinks: 'Quick Links',
            footerContactInfo: 'Contact Information',
            footerAboutUs: 'About Us',
            footerShopMeters: 'Shop Meters',
            footerBookElectrician: 'Book Electrician',
            footerApplyConnection: 'Apply for Connection',
            footerCopy: '© 2026 Bijli Ghar. All rights reserved.',
            footerAddress: 'Opposite Mission Hospital,<br>In front of JUVNL office,<br>Hazaribag, Jharkhand 825301',
            assistantHelpTitle: 'Need Help?',
            assistantHelpDesc: 'How would you like to connect with us?',
            assistantWhatsApp: 'WhatsApp Us',
            assistantCallExpert: 'Call an Expert',
            assistantEmailSupport: 'Email Support',
            footerBrandDesc: 'Your trusted partner for certified electrical equipment, secure installations, and fast JBVNL connections in Hazaribag.',
            accountWelcome: 'Welcome',
            accountManageProfile: 'Manage your profile, addresses, and view your bookings below.',
            accountMyAccount: 'My Account',
            accountProfile: 'Profile',
            accountServiceHistory: 'Service History',
            accountOrderHistory: 'Order History',
            accountConnectionHistory: 'New Connection History',
            accountYourProfileAddresses: 'Your Profile & Addresses',
            accountUpdateDetails: 'Update your details. You can also keep multiple addresses and select a default.',
            accountSaveChanges: 'Save Changes',
            accountPersonalInfo: 'Personal Info',
            accountName: 'Name',
            accountPhone: 'Phone',
            accountAddNewAddress: 'Add New Address',
            accountLabel: 'Label (Home/Office)',
            accountAddress: 'Address',
            accountLandmark: 'Landmark (optional)',
            accountAddrPhone: 'Phone for this address (optional)',
            accountAddAddress: 'Add Address',
            accountSavedAddresses: 'Saved Addresses',
            accountNoAddresses: 'No addresses saved yet. Add one using the form above.',
            accountServiceHistoryTitle: 'Service History',
            accountOrderHistoryTitle: 'Order History',
            accountConnectionHistoryTitle: 'New Connection History'
        },
        hi: {
            langLabel: 'भाषा',
            langOptionEnglish: 'अंग्रेज़ी',
            langOptionHindi: 'हिंदी',
            navHome: 'होम',
            navAbout: 'परिचय',
            navMeters: 'मीटर',
            navServices: 'सेवाएं',
            navConnection: 'नया कनेक्शन',
            navLogin: 'लॉगिन',
            navMyAccount: 'मेरा अकाउंट',
            navLogout: 'लॉगआउट',
            aboutDiscoverStory: 'हमारी कहानी जानें',
            aboutPartnerTitle: 'आपका भरोसेमंद इलेक्ट्रिकल पार्टनर',
            aboutPartnerDesc: 'हजारीबाग और उसके बाहर सुरक्षित, प्रमाणित और प्रीमियम इलेक्ट्रिकल समाधान उपलब्ध कराते हैं।',
            aboutEmpoweringTitle: 'घरों और व्यवसायों को सशक्त बनाना',
            aboutEmpoweringDesc1: 'सुरक्षा और पारदर्शिता के संकल्प के साथ, <strong>Bijli Ghar</strong> हजारीबाग के सभी इलेक्ट्रिकल जरूरतों के लिए प्रमुख केंद्र है। हम बिना सत्यापित इलेक्ट्रिशियन और घटिया सामग्री की समस्या को एक ही छत के नीचे समाप्त करते हैं।',
            aboutEmpoweringDesc2: 'प्राधिकृत <strong>JBVNL पार्टनर</strong> के रूप में, हम सहज नए कनेक्शन, प्रमाणित 1-फेज और 3-फेज स्मार्ट मीटर, और घरों/व्यवसायों के लिए विशेषज्ञ इंजीनियरों की सेवाएं उपलब्ध कराते हैं।',
            aboutSafetyTitle: '100% प्रमाणित सुरक्षा',
            aboutSafetyDesc: 'सरकारी मानक।',
            aboutFeature1Title: 'प्रीमियम मीटर',
            aboutFeature1Desc: 'हम केवल इंडोटेक और एलएंडटी जैसे अग्रणी ब्रांडों का ही उपयोग करते हैं, जिससे सही रीडिंग और लंबे समय तक उपयोग संभव होता है।',
            aboutFeature2Title: 'विशेषज्ञ इंजीनियर',
            aboutFeature2Desc: 'हमारी टीम अत्यधिक प्रशिक्षित और सत्यापित इलेक्ट्रिशियन से बनी है, जो बुनियादी वायरिंग से लेकर जटिल औद्योगिक लोड तक सब संभाल सकती है।',
            aboutFeature3Title: 'तेज़ कनेक्शन',
            aboutFeature3Desc: 'हम उपभोक्ताओं और बिजली बोर्ड के बीच पुल बनाते हैं, ताकि आपका नया JBVNL कनेक्शन तेज़ी से प्रक्रिया हो सके।',
            aboutHappyCustomers: 'खुश ग्राहक',
            metersPageTitle: 'प्रीमियम इलेक्ट्रिक मीटर',
            metersPageDesc: 'घरेलू और वाणिज्यिक उपयोग के लिए प्रमाणित उपकरण।',
            metersCard1Title: 'इंडोटेक 1-फेज मीटर',
            metersCard1Subtitle: 'मानक बेसिक यूनिट (बिना बॉक्स)',
            metersCard1SpecBrand: 'ब्रांड',
            metersCard1SpecMaterial: 'सामग्री',
            metersCard1SpecColor: 'रंग',
            metersCard1SpecCert: 'प्रमाणन',
            metersCard2Title: 'इंडोटेक बॉक्स मीटर',
            metersCard2Subtitle: 'सुरक्षात्मक आवास के साथ पूरा सेट',
            metersCard2SpecType: 'प्रकार',
            metersCard2SpecArea: 'उपयुक्त क्षेत्र',
            metersCard2SpecDim: 'आयाम',
            metersCard2SpecHardware: 'हार्डवेयर',
            metersCard3Title: 'एलएंडटी थ्री फेज मीटर',
            metersCard3Subtitle: 'हैवी ड्यूटी औद्योगिक/वाणिज्यिक ग्रेड',
            metersCard3SpecBrand: 'ब्रांड',
            metersCard3SpecPhase: 'फेज',
            metersCard3SpecUse: 'उपयोग',
            metersCard3SpecAcc: 'सटीकता',
            metersQtyLabel: 'मात्रा:',
            metersAddToCart: 'कार्ट में जोड़ें',
            metersInCart: 'कार्ट में वर्तमान',
            servicesPageTitle: 'पेशेवर स्थापना और मरम्मत',
            servicesPageDesc: 'अपने घर पर मीटर फिटिंग या कस्टम ट्रबलशूटिंग के लिए प्रमाणित इलेक्ट्रिशियन बुक करें।',
            servicesCard1Title: 'मीटर फिटिंग',
            servicesCard1Desc: 'मुख्य पोल से आपके अंदरूनी स्विचबोर्ड तक पूर्ण पेशेवर इंस्टॉलेशन।',
            servicesCard2Title: 'मीटर रिप्लेसमेंट',
            servicesCard2Desc: 'आपके पुराने/खराब मीटर को सुरक्षित रूप से हटाना और नया यूनिट लगाना।',
            servicesBookPay: 'बुक और पे',
            servicesCustomTitle: 'कस्टम इलेक्ट्रिशियन चाहिए?',
            servicesCustomDesc: 'क्या शॉर्ट सर्किट, वायरिंग समस्याएं हैं या कोई उपकरण इंस्टॉल करना है? अपनी रिक्वेस्ट सबमिट करें और हमारा विशेषज्ञ आपके घर आएगा। <span class="text-secondary font-black">निरीक्षण के बाद ही भुगतान करें।</span>',
            servicesCustomLi1: 'तेज़ प्रतिक्रिया समय',
            servicesCustomLi2: 'सत्यापित पेशेवर',
            servicesCustomLi3: 'पारदर्शी अनुमान',
            servicesFormName: 'आपका नाम',
            servicesFormPhone: 'फोन नंबर',
            servicesFormIssue: 'समस्या विवरण और पता',
            servicesFormSubmit: 'अनुरोध भेजें',
            servicesModalTitle: 'सेवा बुक करें',
            servicesModalConfirm: 'भुगतान जारी रखें',
            servicesModalMaterial: 'मैं पुष्टि करता हूँ कि मेरे पास आवश्यक मीटर/सामग्री तैयार है।',
            connectionPageTitle: 'नया कनेक्शन सेटअप',
            connectionPageDesc: 'अपना JBVNL आवेदन जल्दी और सुरक्षित रूप से पूरा करें।',
            connectionStep1: '1. इंस्टॉलेशन विवरण',
            connectionApplicantName: 'आवेदक नाम',
            connectionPhone: 'फोन नंबर (10 अंक)',
            connectionAddress: 'पूरा पता',
            connectionLandmark: 'लैंडमार्क (वैकल्पिक)',
            connectionConnectionType: 'कनेक्शन प्रकार',
            connectionTypeDomestic: 'घरेलू',
            connectionTypeCommercial: 'वाणिज्यिक',
            connectionTypeIrrigation: 'सिंचाई',
            connectionFloors: 'मंजिलों की संख्या',
            connectionAcTons: 'कुल एसी क्षमता (टन)',
            connectionLoad: 'गणना किया गया लोड (kWh)',
            connectionLoadHelper: '1-5 kWh पर मानक सिंगल फेज कनेक्शन लगता है।',
            connectionPhaseRequired: 'आवश्यक फेज',
            connectionPhaseSingle: 'सिंगल फेज (1-5 kWh)',
            connectionPhaseThree: '3-फेज (6+ kWh)',
            connectionStep2: '2. अनिवार्य दस्तावेज',
            connectionDocHelper: 'यदि आपके दस्तावेज़ में कई पेज हैं तो एक साथ कई फाइलें चुनें। समर्थित प्रारूप: JPG, PNG, PDF।',
            connectionDocPhoto: 'पासपोर्ट फोटो',
            connectionDocIdProof: 'मान्य आईडी प्रमाण',
            connectionDocSignature: 'हस्ताक्षर',
            connectionDocLandProof: 'भूमि प्रमाण',
            connectionDocClickPhoto: 'फोटो अपलोड करें',
            connectionDocClickId: 'आईडी अपलोड करें',
            connectionDocClickSignature: 'हस्ताक्षर अपलोड करें',
            connectionDocClickLand: 'भूमि प्रमाण अपलोड करें',
            connectionAgreementTitle: 'उपयोगकर्ता समझौता',
            connectionAgreementCheckbox: 'मैं नियम और शर्तें पढ़ चुका/चुकी हूँ और उनसे सहमत हूँ। *',
            connectionTotalCostLabel: 'कुल अनुमानित लागत',
            connectionProceedPay: 'भुगतान जारी रखें',
            connectionSubmitUpload: 'अपलोड',
            connectionPreviewModalTitle: 'दस्तावेज़ पूर्वावलोकन',
            cartPageTitle: 'सुरक्षित चेकआउट',
            cartPageDesc: 'अपने आइटम देखें और डिलीवरी विवरण दर्ज करें।',
            cartEmptyTitle: 'आपका कार्ट खाली है',
            cartEmptyDesc: 'लगता है आपने अपने कार्ट में कोई मीटर नहीं जोड़ा है।',
            cartEmptyBrowse: 'मीटर देखें',
            cartOrderSummary: 'ऑर्डर सारांश',
            cartEmptyCart: 'कार्ट साफ़ करें',
            cartDeliveryCharge: 'डिलीवरी शुल्क',
            cartDeliveryDetails: 'डिलीवरी विवरण',
            cartFormName: 'पूरा नाम',
            cartFormAddress: 'फ्लैट, घर नंबर, बिल्डिंग',
            cartFormLandmark: 'लैंडमार्क',
            cartFormPhone: 'फोन नंबर',
            cartAddressMessage: 'आर्डर करने से पहले अपने अकाउंट से सहेजा हुआ पता (वैकल्पिक लैंडमार्क सहित) जोड़ें।',
            cartTotalToPay: 'भुगतान योग्य कुल',
            cartProceedToPay: 'भुगतान जारी रखें',
            loginWelcome: 'स्वागत है',
            loginAccess: 'अपने Bijli Ghar खाते तक पहुँचें।',
            loginTab: 'साइन इन',
            registerTab: 'साइन अप',
            loginEmailLabel: 'ईमेल पता',
            loginPassLabel: 'पासवर्ड',
            loginBtn: 'साइन इन',
            registerNameLabel: 'पूरा नाम',
            registerEmailLabel: 'ईमेल पता',
            registerPassLabel: 'पासवर्ड',
            registerMinNote: '(न्यूनतम 6 अक्षर)',
            registerBtn: 'खाता बनाएं',
            loginOr: 'या',
            loginGoogleCta: 'Google से जारी रखें',
            indexHeroTag: '⚡ हजारिबाग की #1 इलेक्ट्रिकल सेवा',
            indexHeroTitleSafety: 'घरों को भरोसे के साथ ',
            indexHeroSafety: 'सुरक्षा एवं सटीकता।',
            indexHeroDesc: 'हम आपके दरवाजे पर प्रमाणित इंजीनियर उपलब्ध कराते हैं। नई JBVNL कनेक्शन, प्रीमियम स्मार्ट मीटर या विशेषज्ञ उपकरण मरम्मत—सब कुछ पेशेवर तरीके से।',
            indexApplyConnection: 'कनेक्शन के लिए आवेदन',
            indexBookElectrician: 'इलेक्ट्रिशियन बुक करें',
            indexBuyMeters: 'मीटर खरीदें',
            indexHireEngineers: 'इंजीनियर नियुक्त करें',
            indexNewConnection: 'नया कनेक्शन',
            indexDiscoverStory: 'हमारी कहानी जानें',
            indexPartnerTitle: 'आपका भरोसेमंद इलेक्ट्रिकल पार्टनर',
            footerQuickLinks: 'त्वरित लिंक',
            footerContactInfo: 'संपर्क जानकारी',
            footerAboutUs: 'हमारे बारे में',
            footerShopMeters: 'मीटर खरीदें',
            footerBookElectrician: 'इलेक्ट्रिशियन बुक करें',
            footerApplyConnection: 'कनेक्शन के लिए आवेदन',
            footerCopy: '© 2026 Bijli Ghar. सर्वाधिकार सुरक्षित।',
            footerAddress: 'मिशन हॉस्पिटल के सामने,<br>JUVNL ऑफिस के सामने,<br>हजारीबाग, झारखंड 825301',
            assistantHelpTitle: 'मदद चाहिए?',
            assistantHelpDesc: 'हमसे कैसे जुड़ना चाहेंगे?',
            assistantWhatsApp: 'व्हाट्सएप करें',
            assistantCallExpert: 'विशेषज्ञ को कॉल करें',
            assistantEmailSupport: 'ईमेल सहायता',
            footerBrandDesc: 'प्रमाणित विद्युत उपकरण, सुरक्षित स्थापना और हजारीबाग में तेज़ JBVNL कनेक्शन के लिए आपका भरोसेमंद पार्टनर।',
            accountWelcome: 'स्वागत है',
            accountManageProfile: 'अपनी प्रोफ़ाइल, पते प्रबंधित करें और अपनी बुकिंग नीचे देखें।',
            accountMyAccount: 'मेरा अकाउंट',
            accountProfile: 'प्रोफ़ाइल',
            accountServiceHistory: 'सेवा इतिहास',
            accountOrderHistory: 'ऑर्डर इतिहास',
            accountConnectionHistory: 'नया कनेक्शन इतिहास',
            accountYourProfileAddresses: 'आपकी प्रोफ़ाइल और पते',
            accountUpdateDetails: 'अपना विवरण अपडेट करें। आप कई पते रख सकते हैं और डिफ़ॉल्ट चुन सकते हैं।',
            accountSaveChanges: 'बदलाव सहेजें',
            accountPersonalInfo: 'व्यक्तिगत जानकारी',
            accountName: 'नाम',
            accountPhone: 'फ़ोन',
            accountAddNewAddress: 'नया पता जोड़ें',
            accountLabel: 'लेबल (घर/कार्यालय)',
            accountAddress: 'पता',
            accountLandmark: 'लैंडमार्क (वैकल्पिक)',
            accountAddrPhone: 'इस पते के लिए फ़ोन (वैकल्पिक)',
            accountAddAddress: 'पता जोड़ें',
            accountSavedAddresses: 'सहेजे गए पते',
            accountNoAddresses: 'अभी तक कोई पता सहेजा नहीं गया है। ऊपर दिए गए फ़ॉर्म का उपयोग करके एक जोड़ें।',
            accountServiceHistoryTitle: 'सेवा इतिहास',
            accountOrderHistoryTitle: 'ऑर्डर इतिहास',
            accountConnectionHistoryTitle: 'नया कनेक्शन इतिहास'
        }
    };
    return translations[lang] || translations.en;
}

function setTranslatedText(node, value) {
    if (!node || value === undefined || value === null) return;
    if (typeof value === 'string' && /<[^>]+>/.test(value)) {
        node.innerHTML = value;
    } else {
        node.textContent = value;
    }
}

function updateFloatingAssistantUI(dict = getLanguageDict()) {
    const title = document.getElementById('assistant-title');
    const desc = document.getElementById('assistant-desc');
    const whatsapp = document.getElementById('assistant-whatsapp');
    const call = document.getElementById('assistant-call');
    const email = document.getElementById('assistant-email');

    if (title) title.textContent = dict.assistantHelpTitle;
    if (desc) desc.textContent = dict.assistantHelpDesc;
    if (whatsapp) {
        const label = whatsapp.querySelector('span');
        if (label) label.textContent = dict.assistantWhatsApp;
    }
    if (call) {
        const label = call.querySelector('span');
        if (label) label.textContent = dict.assistantCallExpert;
    }
    if (email) {
        const label = email.querySelector('span');
        if (label) label.textContent = dict.assistantEmailSupport;
    }
}

function updateGlobalUI() {
    const lang = getCurrentLang();
    const dict = getLanguageDict(lang);

    // 1. Navigation Auth Buttons
    const user = JSON.parse(localStorage.getItem('bijliUser'));
    const authContainer = document.getElementById('auth-btn-container');
    
    if (authContainer) {
        if (user && user.uid) {
            authContainer.innerHTML = `
                <a href="account.html" class="bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition shadow mr-2">${dict.navMyAccount}</a>
                <button onclick="globalLogout()" class="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow">${dict.navLogout}</button>
            `;
        } else {
            authContainer.innerHTML = `<a href="login.html" class="bg-blue-600 text-white border border-blue-400 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow">${dict.navLogin}</a>`;
        }
    }

    // 2. Cart Badges
    const cart = JSON.parse(localStorage.getItem('bijliCart')) || [];
    const cartBadges = document.querySelectorAll('.cart-count-badge');
    cartBadges.forEach(badge => {
        let totalItems = cart.reduce((sum, item) => sum + parseInt(item.qty || item.quantity || 0, 10), 0);
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none'; 
    });

    // 3. Inject Floating Assistant (if not already injected)
    if (!document.getElementById('floating-assistant')) {
        injectFloatingAssistant();
    }
    updateFloatingAssistantUI(dict);
}

// -----------------------------------------------------
// FLOATING ASSISTANT LOGIC
// -----------------------------------------------------
function injectFloatingAssistant() {
    const assistantHTML = `
        <div id="floating-assistant" class="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <!-- Popup Menu -->
            <div id="assistant-menu" class="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 mb-4 w-64 transform translate-y-4 opacity-0 pointer-events-none transition-all duration-300 origin-bottom-right">
                <div class="flex justify-between items-center mb-3 border-b pb-2">
                    <h4 id="assistant-title" class="font-bold text-primary text-lg">Need Help?</h4>
                    <button onclick="toggleAssistant()" class="text-gray-400 hover:text-red-500 focus:outline-none"><i class="fas fa-times text-lg"></i></button>
                </div>
                <p id="assistant-desc" class="text-sm text-gray-600 mb-4">How would you like to connect with us?</p>
                
                <div class="space-y-3">
                    <a id="assistant-whatsapp" href="https://wa.me/918271747320" target="_blank" class="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition border border-green-100">
                        <i class="fab fa-whatsapp text-2xl mr-3"></i> 
                        <span class="font-bold text-sm">WhatsApp Us</span>
                    </a>
                    
                    <a id="assistant-call" href="tel:+918271747320" class="flex items-center p-3 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition border border-blue-100">
                        <i class="fas fa-phone-alt text-xl mr-3 ml-1"></i> 
                        <span class="font-bold text-sm">Call an Expert</span>
                    </a>
                    
                    <a id="assistant-email" href="mailto:aniketkumar5893@gmail.com" class="flex items-center p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-200 transition border border-gray-200">
                        <i class="fas fa-envelope text-xl mr-3 ml-1"></i> 
                        <span class="font-bold text-sm">Email Support</span>
                    </a>
                </div>
            </div>

            <button onclick="toggleAssistant()" class="bg-secondary text-primary w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-300 border-2 border-white focus:outline-none">
                <i id="assistant-icon" class="fas fa-headset drop-shadow-md"></i>
            </button>
        </div>
    `;
    
    // Add it directly to the bottom of the webpage
    document.body.insertAdjacentHTML('beforeend', assistantHTML);
}

// Function to open/close the assistant menu
window.toggleAssistant = function() {
    const menu = document.getElementById('assistant-menu');
    const icon = document.getElementById('assistant-icon');
    
    if (menu.classList.contains('opacity-0')) {
        // Open Animation
        menu.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        icon.classList.remove('fa-headset');
        icon.classList.add('fa-times');
    } else {
        // Close Animation
        menu.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-headset');
    }
}

// -----------------------------------------------------
// LOGOUT LOGIC
// -----------------------------------------------------
function globalLogout() {
    localStorage.removeItem('bijliUser');
    localStorage.removeItem('bijliCart'); 
    
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            window.location.assign('index.html');
        }).catch(() => window.location.assign('index.html'));
    } else {
        window.location.assign('index.html');
    }
}

function applyLanguage() {
    const lang = getCurrentLang();
    const dict = getLanguageDict(lang);
    const el = (id) => document.getElementById(id);

    const ids = {
        'nav-home': dict.navHome,
        'nav-about': dict.navAbout,
        'nav-meters': dict.navMeters,
        'nav-services': dict.navServices,
        'nav-connection': dict.navConnection,
        'index-hero-tag': dict.indexHeroTag,
        'index-hero-title-prefix': dict.indexHeroTitleSafety,
        'index-hero-safety': dict.indexHeroSafety,
        'index-hero-desc': dict.indexHeroDesc,
        'index-apply-connection': dict.indexApplyConnection,
        'index-book-electrician': dict.indexBookElectrician,
        'index-quick-buy-meters': dict.indexBuyMeters,
        'index-quick-hire-engineers': dict.indexHireEngineers,
        'index-quick-new-connection': dict.indexNewConnection,
        'index-discover-story': dict.indexDiscoverStory,
        'index-partner-title': dict.indexPartnerTitle,
        'about-discover-story': dict.aboutDiscoverStory,
        'about-partner-title': dict.aboutPartnerTitle,
        'about-partner-desc': dict.aboutPartnerDesc,
        'about-empowering-title': dict.aboutEmpoweringTitle,
        'about-empowering-desc1': dict.aboutEmpoweringDesc1,
        'about-empowering-desc2': dict.aboutEmpoweringDesc2,
        'about-safety-title': dict.aboutSafetyTitle,
        'about-safety-desc': dict.aboutSafetyDesc,
        'about-feature-1-title': dict.aboutFeature1Title,
        'about-feature-1-desc': dict.aboutFeature1Desc,
        'about-feature-2-title': dict.aboutFeature2Title,
        'about-feature-2-desc': dict.aboutFeature2Desc,
        'about-feature-3-title': dict.aboutFeature3Title,
        'about-feature-3-desc': dict.aboutFeature3Desc,
        'about-happy-customers': dict.aboutHappyCustomers,
        'meters-page-title': dict.metersPageTitle,
        'meters-page-desc': dict.metersPageDesc,
        'meters-card-1-title': dict.metersCard1Title,
        'meters-card-1-subtitle': dict.metersCard1Subtitle,
        'meters-card-1-spec-brand': dict.metersCard1SpecBrand,
        'meters-card-1-spec-material': dict.metersCard1SpecMaterial,
        'meters-card-1-spec-color': dict.metersCard1SpecColor,
        'meters-card-1-spec-cert': dict.metersCard1SpecCert,
        'meters-card-2-title': dict.metersCard2Title,
        'meters-card-2-subtitle': dict.metersCard2Subtitle,
        'meters-card-2-spec-type': dict.metersCard2SpecType,
        'meters-card-2-spec-area': dict.metersCard2SpecArea,
        'meters-card-2-spec-dim': dict.metersCard2SpecDim,
        'meters-card-2-spec-hardware': dict.metersCard2SpecHardware,
        'meters-card-3-title': dict.metersCard3Title,
        'meters-card-3-subtitle': dict.metersCard3Subtitle,
        'meters-card-3-spec-brand': dict.metersCard3SpecBrand,
        'meters-card-3-spec-phase': dict.metersCard3SpecPhase,
        'meters-card-3-spec-use': dict.metersCard3SpecUse,
        'meters-card-3-spec-acc': dict.metersCard3SpecAcc,
        'meters-card-1-qty-label': dict.metersQtyLabel,
        'meters-card-1-add': dict.metersAddToCart,
        'meters-card-2-qty-label': dict.metersQtyLabel,
        'meters-card-2-add': dict.metersAddToCart,
        'meters-card-3-qty-label': dict.metersQtyLabel,
        'meters-card-3-add': dict.metersAddToCart,
        'services-page-title': dict.servicesPageTitle,
        'services-page-desc': dict.servicesPageDesc,
        'services-card-1-title': dict.servicesCard1Title,
        'services-card-1-desc': dict.servicesCard1Desc,
        'services-card-1-book': dict.servicesBookPay,
        'services-card-2-title': dict.servicesCard2Title,
        'services-card-2-desc': dict.servicesCard2Desc,
        'services-card-2-book': dict.servicesBookPay,
        'services-custom-title': dict.servicesCustomTitle,
        'services-custom-desc': dict.servicesCustomDesc,
        'services-custom-li-1': dict.servicesCustomLi1,
        'services-custom-li-2': dict.servicesCustomLi2,
        'services-custom-li-3': dict.servicesCustomLi3,
        'services-form-name': dict.servicesFormName,
        'services-form-phone': dict.servicesFormPhone,
        'services-form-issue': dict.servicesFormIssue,
        'services-form-submit': dict.servicesFormSubmit,
        'services-modal-title': dict.servicesModalTitle,
        'services-modal-confirm': dict.servicesModalConfirm,
        'connection-page-title': dict.connectionPageTitle,
        'connection-page-desc': dict.connectionPageDesc,
        'connection-step-1': dict.connectionStep1,
        'connection-applicant-name': dict.connectionApplicantName,
        'connection-phone': dict.connectionPhone,
        'connection-address': dict.connectionAddress,
        'connection-landmark': dict.connectionLandmark,
        'connection-connection-type': dict.connectionConnectionType,
        'connection-type-domestic': dict.connectionTypeDomestic,
        'connection-type-commercial': dict.connectionTypeCommercial,
        'connection-type-irrigation': dict.connectionTypeIrrigation,
        'connection-floors': dict.connectionFloors,
        'connection-ac-tons': dict.connectionAcTons,
        'connection-load': dict.connectionLoad,
        'connection-load-helper': dict.connectionLoadHelper,
        'connection-phase-required': dict.connectionPhaseRequired,
        'connection-phase-single': dict.connectionPhaseSingle,
        'connection-phase-three': dict.connectionPhaseThree,
        'connection-step-2': dict.connectionStep2,
        'connection-doc-helper': dict.connectionDocHelper,
        'connection-doc-photo': dict.connectionDocPhoto,
        'connection-doc-id': dict.connectionDocIdProof,
        'connection-doc-signature': dict.connectionDocSignature,
        'connection-doc-land': dict.connectionDocLandProof,
        'connection-doc-preview-photo': dict.connectionDocClickPhoto,
        'connection-doc-preview-id': dict.connectionDocClickId,
        'connection-doc-preview-signature': dict.connectionDocClickSignature,
        'connection-doc-preview-land': dict.connectionDocClickLand,
        'connection-agreement-title': dict.connectionAgreementTitle,
        'connection-agreement-checkbox': dict.connectionAgreementCheckbox,
        'connection-total-cost-label': dict.connectionTotalCostLabel,
        'connection-proceed-pay': dict.connectionProceedPay,
        'connection-submit-upload': dict.connectionSubmitUpload,
        'preview-modal-title': dict.connectionPreviewModalTitle,
        'cart-page-title': dict.cartPageTitle,
        'cart-page-desc': dict.cartPageDesc,
        'cart-empty-title': dict.cartEmptyTitle,
        'cart-empty-desc': dict.cartEmptyDesc,
        'cart-empty-browse': dict.cartEmptyBrowse,
        'cart-order-summary': dict.cartOrderSummary,
        'cart-empty-cart': dict.cartEmptyCart,
        'cart-delivery-charge': dict.cartDeliveryCharge,
        'cart-delivery-details': dict.cartDeliveryDetails,
        'cart-form-name': dict.cartFormName,
        'cart-form-address': dict.cartFormAddress,
        'cart-form-landmark': dict.cartFormLandmark,
        'cart-form-phone': dict.cartFormPhone,
        'cart-address-message': dict.cartAddressMessage,
        'cart-total-to-pay': dict.cartTotalToPay,
        'cart-proceed-to-pay': dict.cartProceedToPay,
        'login-welcome': dict.loginWelcome,
        'login-access': dict.loginAccess,
        'tab-login': dict.loginTab,
        'tab-register': dict.registerTab,
        'login-email-label': dict.loginEmailLabel,
        'login-pass-label': dict.loginPassLabel,
        'btn-login': dict.loginBtn,
        'btn-register': dict.registerBtn,
        'register-name-label': dict.registerNameLabel,
        'register-email-label': dict.registerEmailLabel,
        'register-pass-label': dict.registerPassLabel,
        'register-min-note': dict.registerMinNote,
        'or-divider': dict.loginOr,
        'google-cta': dict.loginGoogleCta,
        'site-lang-label': dict.langLabel,
        'footer-quick-links': dict.footerQuickLinks,
        'footer-contact-information': dict.footerContactInfo,
        'footer-about-us': dict.footerAboutUs,
        'footer-shop-meters': dict.footerShopMeters,
        'footer-book-electrician': dict.footerBookElectrician,
        'footer-apply-connection': dict.footerApplyConnection,
        'footer-copyright': dict.footerCopy,
        'footer-address': dict.footerAddress,
        'footer-brand-desc': dict.footerBrandDesc,
        'assistant-help-title': dict.assistantHelpTitle,
        'assistant-help-desc': dict.assistantHelpDesc,
        'assistant-whatsapp': dict.assistantWhatsApp,
        'assistant-call-expert': dict.assistantCallExpert,
        'assistant-email-support': dict.assistantEmailSupport
    };

    Object.entries(ids).forEach(([id, value]) => {
        const node = el(id);
        if (node) setTranslatedText(node, value);
    });

    const placeholders = {
        connName: dict.connectionApplicantName,
        connPhone: dict.connectionPhone,
        connAddress: dict.connectionAddress,
        connLandmark: dict.connectionLandmark,
        custName: dict.servicesFormName,
        custPhone: dict.servicesFormPhone,
        custIssue: dict.servicesFormIssue,
        modalName: dict.servicesFormName,
        modalPhone: dict.servicesFormPhone,
        modalLocation: dict.servicesFormIssue,
        'checkout-name': dict.cartFormName,
        'checkout-address': dict.cartFormAddress,
        'checkout-landmark': dict.cartFormLandmark,
        'checkout-phone': dict.cartFormPhone,
        'login-email': dict.loginEmailLabel,
        'login-pass': dict.loginPassLabel,
        'reg-name': dict.registerNameLabel,
        'reg-email': dict.registerEmailLabel,
        'reg-pass': dict.registerPassLabel,
        profileName: dict.registerNameLabel
    };

    Object.entries(placeholders).forEach(([id, value]) => {
        const node = el(id);
        if (node) node.placeholder = value;
    });

    const selector = document.getElementById('site-lang');
    if (selector) {
        selector.value = lang;
        const optEn = selector.querySelector('option[value="en"]');
        const optHi = selector.querySelector('option[value="hi"]');
        if (optEn) optEn.textContent = dict.langOptionEnglish;
        if (optHi) optHi.textContent = dict.langOptionHindi;
    }

    document.documentElement.lang = lang;
    updateGlobalUI();
}

function initLanguageSelector() {
    const selector = document.getElementById('site-lang');
    if (!selector) return;
    selector.addEventListener('change', () => {
        const val = selector.value;
        localStorage.setItem('bijliLang', val);
        applyLanguage();
    });

    // Ensure default
    if (!localStorage.getItem('bijliLang')) localStorage.setItem('bijliLang', 'en');
    applyLanguage();
}

document.addEventListener('DOMContentLoaded', () => {
    updateGlobalUI();
    initLanguageSelector();
});
