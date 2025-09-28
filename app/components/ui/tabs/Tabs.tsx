import React, {
  useState,
  Children,
  isValidElement,
  ReactNode,
  ReactElement,
  FC,
  useRef,
  useEffect,
} from 'react';
import linkArrow from '~/assets/images/svg/link_icon.svg';
import leftArrow from '~/assets/images/svg/left-opacity-arrow.svg';
import ArrowIcon from '~/assets/svg/ArrowIcon';

/**
 * Props for individual Tab component
 * @param label - The display label for the tab
 * @param children - The content to be displayed when tab is active
 */
type TabProps = {
  label: string;
  children: ReactNode;
};

/**
 * Props for Tabs container component
 * @param children - Single tab or array of tabs
 */
type TabsProps = {
  children: ReactElement<TabProps>[] | ReactElement<TabProps>;
};

const Tabs: FC<TabsProps> & {Tab: FC<TabProps>} = ({children}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const childrenArray = Array.isArray(children) ? children : [children];
  const validTabs = Children.toArray(childrenArray).filter(isValidElement);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const container = tabsRef.current;
      const scrollAmount =
        direction === 'left'
          ? -container.offsetWidth * 0.8
          : container.offsetWidth * 0.8;

      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToSelectedTab = (index: number) => {
    if (tabsRef.current && tabRefs.current[index]) {
      const selectedTab = tabRefs.current[index];
      const tabContainer = tabsRef.current;

      if (selectedTab) {
        const tabWidth = selectedTab.offsetWidth;
        const tabLeft = selectedTab.offsetLeft;
        const tabRight = tabLeft + tabWidth;
        const containerLeft = tabContainer.scrollLeft;
        const containerRight = containerLeft + tabContainer.offsetWidth;

        if (tabLeft < containerLeft) {
          tabContainer.scrollTo({
            left: tabLeft,
            behavior: 'smooth',
          });
        } else if (tabRight > containerRight) {
          tabContainer.scrollTo({
            left: tabRight - tabContainer.offsetWidth + 20,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  useEffect(() => {
    scrollToSelectedTab(activeIndex);
  }, [activeIndex]);

  const handleTabSelect = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full relative">
      <div className="centermake  mb-4 relative flex items-center justify-between sm:justify-center lg:mb-16 md:mb-8">
        <div className=" sm:max-w-full">
          <div
            ref={tabsRef}
            className=" flex gap-2 sm:flex-row overflow-auto w-[252px] sm:w-auto scrollbar-hide"
          >
            {validTabs.map((tab, index) => {
              const tabElement = tab as ReactElement<TabProps>;
              return (
                <button
                  ref={(el) => (tabRefs.current[index] = el)}
                  key={tabElement.props.label}
                  onClick={() => handleTabSelect(index)}
                  className={`text-[rgba(0,0,0,0.8)] border-b  border-transparent outfit lg:text-[20px] text-[16px] cursor-pointer lg:mr-14 md:mr-6 mr-2 md:py-2 py-[4px] font-regular transition 
  focus:outline-none focus:ring-0 whitespace-nowrap
  ${
    index === activeIndex
      ? 'text-primary border-b border-[1px] border-solid custom-border-bottom'
      : 'border-transparent hover:text-primary'
  }`}
                >
                  {tabElement.props.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Icon buttons on the right */}
        <div className="text-primary md:hidden flex items-center justify-between w-[50px] customdisplay">
          {/* Previous Tab */}
          <button
            className="w-[20px] disabled:opacity-50 cursor-pointer"
            onClick={() => {
              const newIndex = Math.max(activeIndex - 1, 0);
              setActiveIndex(newIndex);
              scrollToSelectedTab(newIndex);
            }}
            disabled={activeIndex === 0}
          >
            <ArrowIcon rotate={180} className="text-primary" />
          </button>

          {/* Next Tab */}
          <button
            className="w-[20px] disabled:opacity-50 cursor-pointer"
            onClick={() => {
              const newIndex = Math.min(activeIndex + 1, validTabs.length - 1);
              setActiveIndex(newIndex);
              scrollToSelectedTab(newIndex);
            }}
            disabled={activeIndex === validTabs.length - 1}
          >
            <ArrowIcon rotate={0} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="shadow tab-delivery">
        {validTabs.map((tab, index) => (
          <div
            key={(tab as ReactElement<TabProps>).props.label}
            style={{display: activeIndex === index ? 'block' : 'none'}}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Individual Tab component - used as child of Tabs
 * @param children - Content to display when tab is active
 */
Tabs.Tab = ({children}: TabProps) => <>{children}</>;

export default Tabs;
