import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        offer: false,
        parking: false,
        furnished: false,
        sort: 'created_at',
        order: "desc",
    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState(false)
    // console.log(listings);
    const navigate = useNavigate()
    // console.log(sidebarData);
    const handleChange = (event) => {
        if (event.target.id === 'all' || event.target.id === 'rent' || event.target.id === 'sale') {
            setSidebarData({
                ...sidebarData,
                type: event.target.id,
            })
        }
        if (event.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: event.target.value,
            })
        }
        if (event.target.id === 'parking' || event.target.id === 'offer' || event.target.id === 'furnished') {
            setSidebarData({
                ...sidebarData,
                [event.target.id]: event.target.checked || event.target.checked === 'true' ? true : false,
            })
        }
        if (event.target.id === 'sort_order') {
            const sort = event.target.value.split('_')[0] || 'created_at'
            const order = event.target.value.split('_')[1] || 'desc'
            setSidebarData({
                ...sidebarData,
                sort,
                order,
            })
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        if (
            searchTermFromUrl ||
            typeFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                offer: offerFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                parking: parkingFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            })
        }
        const fetchListings = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()
            setListings(data)
            setLoading(false)
        }
        fetchListings()
    }, [location.search])
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>
                            Search Term
                        </label>
                        <input
                            type="text"
                            id='searchTerm'
                            placeholder='Search'
                            className='border rounded-lg p-3 w-full'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className='font-semibold'>Type</label>
                        <div className="flex gap-2">
                            <input type="checkbox" id="all" className='w-5' onChange={handleChange} checked={sidebarData.type === "all"} />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={sidebarData.type === "rent"} />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className='w-5' onChange={handleChange} checked={sidebarData.type === "sale"} />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={sidebarData.offer === true} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className='font-semibold'>Amenities:</label>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={sidebarData.parking === true} />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={sidebarData.furnished === true} />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='font-semibold'>Sort:</label>
                        <select id="sort_order" className='border rounded-lg p-3' onChange={handleChange} defaultValue={'created_at_desc'}>
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className="">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing Results:</h1>
            </div>
        </div>
    )
}

export default Search
