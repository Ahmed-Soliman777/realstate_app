import React from 'react'

const CreateListing = () => {
    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Create a listing</h1>
            <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' maxLength='62' minLength='10' required />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" name="" id="sell" className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="" id="rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="" id="parking" className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="" id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="" id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" name="" id="bedroom" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <p>Bedrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="" id="bathroom" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <p>Bathrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="" id="regularPrice" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                <span className='text-xs'>($ / Month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="" id="discountPrice" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <div className="flex flex-col items-center">
                                <p>Discounted price</p>
                                <span className='text-xs'>($ / Month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images :</p>
                    <span className="font-normal text-gray-600 ml-2">The first image will be cover (max 6)</span>
                    <div className="flex gap-4">
                        <input className='p-3 border-gray-300 rounded w-full' type="file" name="" id="images" accept='image/*' multiple />
                        <button className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>Upload</button>
                    </div>
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create list</button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing
