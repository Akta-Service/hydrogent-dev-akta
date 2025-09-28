import {Collection} from '~/lib/types';
import Tabs from '~/components/ui/tabs/Tabs';
import SliderComponent from '~/components/ui/slider/SliderComponent';
import BasicCard from '~/components/ui/cards/basicCard';
import Button from '~/components/ui/buttons/Button';
import { collectionData } from '~/helpers/constants';

interface CollectionsSectionProps {
  collections: {node: Collection}[];
}

const CollectionsSection = ({collections}: CollectionsSectionProps) => {

  return (
    <div className="w-full lg:pt-[125px] md:pt-[60px] pt-[75px] md:pb-[85px] pb-[35px] bg-transparent sm:bg-unset bg-[length:100%]">
      <div className="container max-w-[1440px] mx-auto px-[19px] md:px-[40px]">
        <h2 className="text-center playfairsb text-primary text-[32px] md:text-[48px] lg:text-[64px]">
          Crafted to Captivate
        </h2>
        <p className="text-center lg:mt-[15px] mt-[08px] font-medium md:font-light outfit text-black text-[16px] lg:text-[20px] md:text-[18px]">
          Explore our iconic collections, where elegance meets excellence.
        </p>
        <div className="max-w-full mx-auto lg:mt-10 md:mt-6 mt-4">
          <Tabs>
            {collectionData
              .filter(
                ({node: collection}) =>
                  collection.displayInTabs?.value === 'true',
              )
              .map(({node: collection}) => (
                <Tabs.Tab key={collection.id} label={collection.title}>
                  {collection.products.edges.length > 0 ? (
                    collection.handle === 'jewelry-set' ||
                    collection.title.toUpperCase() === 'JEWELRY SET' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {collection.products.edges
                          .slice(0, 2)
                          .map((product) => (
                            <div key={product.node.id} className="w-full">
                              <SliderComponent
                                 images={
                                collection.products.edges[0]?.node?.media?.edges[0]?.node.image?.url || []
                              }
                                handle={`/collections/${product.node.handle}`}
                                title=''
                                productTitle={product?.node?.title || ''}
                                price = {product?.node?.priceRange?.minVariantPrice.amount}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {collection.products.edges.length > 0 && (
                          <div className="w-full">
                            <SliderComponent
                              images={
                                collection.products.edges[0]?.node?.media?.edges[0]?.node.image?.url || []
                              }
                              handle={
                               `/products/${ collection.products.edges[0]?.node?.handle}` || ''
                              }
                              title={collection.products.edges[0]?.node?.description || ''}
                              productTitle={collection.products.edges[0]?.node?.title || ''}
                              price = {collection.products.edges[0]?.node?.priceRange?.minVariantPrice.amount}
                            />
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {collection.products.edges.map((product, index) =>
                            index > 0 && index < 5 ? (
                              <div
                                key={product.node.id}
                                className="w-full sm:max-w-[315px] max-w-[100%] md:w-full sm:mx-auto mx-auto md:mx-0"
                              >
                                <BasicCard
                                  media={product.node.media}
                                  title={product.node.title}
                                  handle={product.node.handle}
                                  price={product?.node?.priceRange?.minVariantPrice.amount}
                                  fallbackImage={
                                    product.node.featuredImage?.url || ''
                                  }
                                />
                              </div>
                            ) : null,
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="text-center lg:mt-[15px] mt-[08px] font-medium md:font-light outfit text-black text-[16px] lg:text-[20px] md:text-[18px]">
                      No products found in this collection.
                    </p>
                  )}
                </Tabs.Tab>
              ))}
          </Tabs>
        </div>
        <div className="text-center md:mt-[55px] mt-[25px] relative md:max-w-[230px] w-full mx-auto">
          <Button className="md:w-[250px] w-full" to="/collections">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionsSection;