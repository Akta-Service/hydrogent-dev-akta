// Icons
import { BENEFIT_ICONS, BENEFITS } from '~/helpers/constants';
import orderIcon from "~/assets/images/svg/freeship.svg"
import freeIcon from "~/assets/images/svg/free.svg"
import secureIcon from "~/assets/images/svg/secure.svg"
import guaranteeIcon from "~/assets/images/svg/gurantee.svg"
import shopifyIcon from "~/assets/images/svg/bagg.png"

const benefitIcons = {
  order: orderIcon,
  free: freeIcon,
  secure: secureIcon,
  guarantee: guaranteeIcon,
  shopify: shopifyIcon,
}

export default function ProductBenefits() {
  return (
    <div className="pb-[25px] mb-[25px] border-bottom-gradient-white">
      <ul>
        {BENEFITS.map(({ icon, text }) => (
          <li key={text} className="flex items-center text-[15px] md:text-[16px] leading-[18px] outfit font-light text-primary mb-3">
            <span className="pr-2">
              <img src={benefitIcons[icon as keyof typeof benefitIcons] || "/placeholder.svg"} alt="" aria-hidden="true" className="w-[27px] md:h-auto h-[24px]" />
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
