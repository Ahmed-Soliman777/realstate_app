import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase.js"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserSuccess, deleteUserStart, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "../redux/user/user.slice"
import { useDispatch } from 'react-redux'
import { Link } from "react-router-dom"

const Profile = () => {
  const { currentUser, loading, error } = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSucces, setUpdateSucces] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [userListing, setUserListing] = useState([])
  // console.log(formData);
  ////////////////////////////////////////////////////////////////////////////////////////////////
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      // console.log("Progress: " + progress + "% done");
      setFilePercentage(Math.round(progress))
    },
      (error) => {
        setFileError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSucces(true)

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    dispatch(signOutUserStart())
    try {
      const res = await fetch("api/auth/signout")
      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
        setShowListingError(true)
        return
      }
      setUserListing(data)
    } catch (error) {
      setShowListingError(true)
    }
  }
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        console.log(error.message);
        return
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(event) => setFile(event.target.files[0])} type="file" hidden accept='image/*' ref={fileRef} />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className="text-sm self-center">
          {fileError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username} onChange={handleChange} />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? "Loading..." : "Update"}</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>Sign out</span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">{updateSucces ? "User updated successfully" : ""}</p>
      <button className="text-green-700 w-full " onClick={handleShowListings}>Show Listing</button>
      <p className="text-red-700 mt-5">{showListingError ? "Error showing listings" : ""}</p>
      {
        userListing && userListing.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListing.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center">
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain' />
              </Link>
              <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate ml-3" to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={() => handleListingDelete(listing._id)} className="text-red-700">Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-slate-700">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      }
    </div>
  )
}

export default Profile
