"use client"; // Needed for Next.js App Router
import React, { useState } from 'react'

const Ringsizeguide = () => {
    const [activeTab, setActiveTab] = useState("IN");
    const ringSize = [
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
        { india: 1.74, us: 3, uk: 'F', france: 44, germany: 14, china: 4, italy: 4 },
    ];

    return (
        <>
            <div className="">
                <div className="flex rounded-lg">
                    <button
                        onClick={() => setActiveTab("IN")}
                        className={`w-1/2 rounded text-[15px] outfit font-semibold py-[12px] ${activeTab === "IN"
                            ? "bg-black text-primary shadow-[0_0_8px_#ffffff66]"
                            : "bg-zinc-900 text-gray-400"
                            }`}
                    >
                        IN
                    </button>
                    <button
                        onClick={() => setActiveTab("CM")}
                        className={`w-1/2 py-[12px] text-[15px] outfit rounded font-semibold ${activeTab === "CM"
                            ? "bg-black text-primary shadow-[0_0_8px_#ffffff66]"
                            : "bg-zinc-900 text-gray-400"
                            }`}
                    >
                        CM
                    </button>
                </div>

                <div className="mt-10 text-primary">
                    {activeTab === "IN" ? (
                        <>
                            <div className='overflow-x-auto'>
                                <table className='border-collapse w-full border border-[#3d3d3d]'>
                                    <thead>
                                        <tr className='text-[14px] text-[#E7E7E7] text-left'>
                                            <th className='md:w-1/7 py-1 px-2 outfit font-light border border-[#3d3d3d]'>In</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>US, Canada, Mexico</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>UK, Australia, Ireland, New Zealand, South Africa</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>France</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>Germany, Russia, Ukraine, Asia</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>India, China, Japan, South America, Turkey, Israel</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>Italy, Spain, Netherlands, Switzerland</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ringSize.map((ring, index) => (
                                                <tr key={index} className='text-[14px] text-[#E7E7E7] odd:bg-[#151515] even:bg-transparent'>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.india}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.us}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.uk}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.france}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.germany}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.china}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.italy}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                   
                                </table>
                            </div>
                        </>

                    ) : (
                        <div className='overflow-x-auto'>
                                <table className='border-collapse w-full border border-[#3d3d3d]'>
                                    <thead>
                                        <tr className='text-[14px] text-[#E7E7E7] text-left'>
                                            <th className='md:w-1/7 py-1 px-2 outfit font-light border border-[#3d3d3d]'>In</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>US, Canada, Mexico</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>UK, Australia, Ireland, New Zealand, South Africa</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>France</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>Germany, Russia, Ukraine, Asia</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>India, China, Japan, South America, Turkey, Israel</th>
                                            <th className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>Italy, Spain, Netherlands, Switzerland</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ringSize.map((ring, index) => (
                                                <tr key={index} className='text-[14px] text-[#E7E7E7] odd:bg-[#151515] even:bg-transparent'>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.india}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.us}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.uk}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.france}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.germany}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.china}</td>
                                                    <td className='md:w-1/7 outfit font-light p-2 border border-[#3d3d3d]'>{ring.italy}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                   
                                </table>
                            </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Ringsizeguide
