import React from 'react'

const Privacychoices = () => {
    return (
        <>
            <div className='pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white'>
                <div className='container max-w-[1350px] px-[15px] mx-auto'>
                    <h1 className='text-[56px] playfair text-primary'>Privacy Choices</h1>
                    <p className='text-[18px] font-regular text-primary outfit'>Last updated: April 14, 2025</p>

                    <div className='py-6'>
                        <p className='text-[14px] outfit font-light text-primary'>
                            At Bello Diamonds, we are committed to providing you with transparency and control over your personal information. This page outlines the privacy choices and rights you have when interacting with our website and services.
                        </p>
                    </div>

                    <div className='py-6'>
                        <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Managing Your Information</h5>
                        <p className='text-[14px] outfit font-light text-primary'>
                            You can manage your personal data, including updating or deleting your information, through the following options:
                        </p>
                        <ul className='list-disc pl-5 pt-3 text-[14px] outfit font-light text-primary'>
                            <li>Update your profile or account details from your user dashboard</li>
                            <li>Submit a request to delete your data via email</li>
                            <li>Adjust your marketing preferences through email opt-out links</li>
                        </ul>
                    </div>

                    <div className='py-6'>
                        <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Cookie Preferences</h5>
                        <p className='text-[14px] outfit font-light text-primary'>
                            You can choose how cookies are used on our site. Manage your preferences through our <span className='underline text-primary'>cookie settings panel</span> or change your browser settings to block or delete cookies.
                        </p>
                    </div>

                    <div className='py-6'>
                        <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Communication Preferences</h5>
                        <p className='text-[14px] outfit font-light text-primary'>
                            You have the option to choose the types of communication you receive from us. You can:
                        </p>
                        <ul className='list-disc pl-5 pt-3 text-[14px] outfit font-light text-primary'>
                            <li>Subscribe or unsubscribe from marketing emails</li>
                            <li>Opt out of promotional SMS messages</li>
                            <li>Control notification settings from your account panel</li>
                        </ul>
                    </div>

                    <div className='py-6'>
                        <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Exercising Your Rights</h5>
                        <p className='text-[14px] outfit font-light text-primary'>
                            Depending on your jurisdiction, you may have additional privacy rights such as the right to access, delete, correct, or restrict the use of your personal data. To make a formal request, please contact us using the details below.
                        </p>
                    </div>

                    <div className='py-6'>
                        <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Do Not Track and Global Privacy Controls</h5>
                        <p className='text-[14px] outfit font-light text-primary'>
                            Some browsers allow you to send “Do Not Track” signals. Our site currently does not respond to such signals. However, you may use browser extensions or privacy tools that respect your privacy preferences.
                        </p>
                    </div>

                    <div className='py-6'>
                        <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Contact Us</h5>
                        <p className='text-[14px] outfit font-light text-primary'>
                            If you have questions about your privacy choices or would like to exercise your data rights, please contact us at <a href='mailto:justin@bellodiamonds.com' className='underline text-primary'>justin@bellodiamonds.com</a> or write to us at 344 Wagaraw Road, Hawthorne, NJ, 07506, US.
                        </p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Privacychoices;
