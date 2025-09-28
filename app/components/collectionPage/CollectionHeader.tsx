import { Link } from "@remix-run/react"

interface CollectionHeaderProps {
  collection: any
}

export default function CollectionHeader({ collection }: CollectionHeaderProps) {
  return (
    <>
      <div className="collectionBanner">
        <div className="container max-w-[1350px] mx-auto px-4">
          <div className="h-52 flex justify-center items-center bg-[url('/ring-catalogue-banner.png')] bg-no-repeat bg-cover bg-center">
            <h1 className="w-full text-center titleborder playfair font-normal md:text-5xl text-2xl text-white md:leading-[65px] pb-2.5 leading-8">
              {collection.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full bg-white pt-6">
        <div className="container max-w-[1350px] mx-auto px-4">
          <nav className="breadcrum border-b border-[#454545] pb-2">
            <ul className="flex items-center">
              <li className="m-0 text-sm outfit font-light text-[#454545]">
                <Link to="/">Home</Link>
              </li>
              <li className="mx-1.5 text-sm outfit font-light text-primary">/</li>
              <li className="m-0 text-sm outfit font-light text-primary">
                <Link to={collection.handle}>{collection.title}</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
