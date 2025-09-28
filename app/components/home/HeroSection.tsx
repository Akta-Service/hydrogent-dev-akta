import { useEffect } from 'react';
import Button from '~/components/ui/buttons/Button';

const HeroSection = () => {

  useEffect(() => {
    // window.fbq('track', 'AddToCart')
      if(window.location.hostname.includes("bellodiamonds"))
       window.fbq('track', 'PageView')
    // window?.fbq('track', 'Purchase', {
    //   value: 100.00,
    //   currency: 'USD',
    // });
  }, []);
  return (
    <div>
      <div className="w-full md:py-[110px] sm:pb-[80px]">
        <div className="container max-w-[1440px] mx-auto px-[19px] md:px-[40px]">
          <div className=" flex flex-col justify-between sm:h-[auto] sm:justify-unset">
            {/* <h1 className="text-[34px] md:text-[55px] lg:text-[76px] leading-[43px] md:leading-[58px] lg:leading-[71px] playfairsc">
              <span className="block drop-shadow-[0px_0px_13.1px_rgba(0,0,0,0.65)] text-transparent bg-clip-text bg-[linear-gradient(to_right,_#ffffff_100%,_#ffffff_20%)]">
                Timeless elegance
              </span>
              <span className="lg:pl-[182px] md:pl-[80px] pl-[35px] drop-shadow-[0px_0px_13.1px_rgba(0,0,0,0.65)] text-transparent bg-clip-text bg-[linear-gradient(to_right,_#ffffff_100%,_#ffffff_20%)]">
                in every{' '}
              </span>
              <span className="text-primary drop-shadow-[0px_0px_20px_rgba(255,_255,_255,_0.72)]">
                diamond
              </span>
            </h1> */}
            <div className='md:pt-[60px] uppercase poppins max-w-[700px] text-center'>
              <h1 className='text-[32px] leading-[35px] md:leading-[63px] md:text-[64px] font-bold gradient-banner-text'>Excessive Sparkle</h1>
              <h5 className='font-medium text-[20px] md:text-[36px] gradient-banner-text'>Endless Compliments</h5>
              <h2 className='text-[28px] leading-[38px] md:leading-[63px] md:text-[64px] font-bold gradient-banner-text'>All Day... Every Day.</h2>
            </div>
            <div className="lg:ml-[190px] md:ml-[80px] sm:ml-[80px]">
               {/* <p className="lg:mt-[40px] mt-[25px] outfit font-medium md:font-light text-[16px] leading-[26px] text-[rgba(255,255,255,0.8)] md:max-w-[401px]">
                Discover handcrafted fine jewelry designed to celebrate life's
                most precious moments. From iconic engagement rings to
                everyday luxury — crafted to shine forever.
              </p> */}
              <p className="md:hidden lg:mt-[40px] mt-[35px] outfit font-medium md:font-light text-[16px] leading-[26px] text-primary md:max-w-[401px]">
                Discover handcrafted fine jewelry designed to celebrate life's
                most precious moments. From iconic engagement rings to
                everyday luxury — crafted to shine forever.
              </p>
              <div className="lg:mt-[45px] mt-[25px] sm:inline-block block relative">
                <Button to='/collections' className="sm:w-[200px] w-[100%]">Shop Now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;