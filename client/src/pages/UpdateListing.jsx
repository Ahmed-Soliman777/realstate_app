import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase.js'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const UpdateListing = () => {
    const { currentUser } = useSelector(state => state.user)
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bathroom: 1,
        bedroom: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
        userRef: ''
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
    // console.log(formData);
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    // console.log(`Uploading ${progress} %`);
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }
    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            for (let index = 0; index < files.length; index++) {
                promises.push(storeImage(files[index]))
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploading(false)
            }).catch((error) => {
                setImageUploadError("Image upload failed (2 MB Max / Image)")
                setUploading(false)
            })
        } else {
            setImageUploadError("You can only upload maximum 6 images / listing")
            setUploading(false)

        }
    }
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }
    const handleChange = (event) => {
        if (event.target.id === 'sell' || event.target.id === 'rent') {
            setFormData({
                ...formData,
                type: event.target.id,
            })
        }
        if (event.target.id === 'parking' || event.target.id === 'furnished' || event.target.id === 'offer') {
            setFormData({
                ...formData,
                [event.target.id]: event.target.checked,
            })
        }
        if (event.target.type === 'number' || event.target.type === 'text' || event.target.type === 'textarea') {
            setFormData({
                ...formData,
                [event.target.id]: event.target.value,
            })
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            if (formData.imageUrls.length < 1) {
                return setError("You must upload at least one image")
            }
            if (+formData.regularPrice < +formData.discountPrice) {
                return setError("Discount price must be less than regular price")
            }
            setLoading(true)
            setError(false)
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })
            const data = await res.json()
            setLoading(false)
            navigate(`/listing/${data._id}`)
            if (data.success === false) {
                setError(data.message)
            }
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId
            const res = await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json()
            if (data.success === false) {
                console.log(data.message);
                return
            }
            setFormData(data)
        }
        fetchListing()
    }, [])
    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update a listing</h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" onChange={handleChange} value={formData.name} placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <textarea type='text' onChange={handleChange} value={formData.description} placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                    <input type="text" onChange={handleChange} value={formData.address} placeholder='Address' className='border p-3 rounded-lg' id='address' maxLength='62' minLength='10' required />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sell" className='w-5' onChange={handleChange} checked={formData.type === 'sell'} />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={formData.parking} />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="" id="furnished" className='w-5' onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="" id="offer" className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" name="" id="bedroom" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedroom} />
                            <p>Bedrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="" id="bathroom" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathroom} />
                            <p>Bathrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="" id="regularPrice" min='50' max='1000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice} />
                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                <span className='text-xs'>($ / Month)</span>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input type="number" name="" id="discountPrice" min='0' max='10000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice} />
                                <div className="flex flex-col items-center">
                                    <p>Discounted price</p>
                                    <span className='text-xs'>($ / Month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images :</p>
                    <span className="font-normal text-gray-600 ml-2">The first image will be cover (max 6)</span>
                    <div className="flex gap-4">
                        <input onChange={(event) => setFiles(event.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" name="" id="images" accept='image/*' multiple />
                        <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>{uploading ? "Uplaoding..." : "Upload"}</button>
                    </div>
                    <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    }
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80" disabled={loading || uploading}>{loading ? "Update..." : "update List"}</button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    )
}

export default UpdateListing
