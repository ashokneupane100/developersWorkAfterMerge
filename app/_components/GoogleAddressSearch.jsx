"use client"
import Image from 'next/image';
import React from 'react'
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'

function GoogleAddressSearch({selectedAddress,setCoordinates}) {
  return (
    <div className='flex items-stretch w-full'>
        <div className='flex-shrink-0'>
            <Image src="/pin.png"
            width={43}
            height={43}
            className="h-full p-1 rounded-l-lg bg-purple-200"
            alt='Icon' />
        </div>

        <div className='flex-grow'>
            <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                apiOptions={{ region: "np" }}
                autocompletionRequest={{
                    componentRestrictions: {
                        country: ["np"],
                    },
                }}
                selectProps={{
                    placeholder:'Write address of your property',
                    isClearable:true,
                    className:'w-full',
                    styles: {
                        control: (provided) => ({
                            ...provided,
                            height: '100%',
                            minHeight: '43px',
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        }),
                        container: (provided) => ({
                            ...provided,
                            height: '100%',
                        }),
                        input: (provided) => ({
                            ...provided,
                            height: '100%',
                        }),
                    },
                    onChange:(place)=>{
                        console.log(place);
                        selectedAddress(place);
                        geocodeByAddress(place?.label)
                        .then(result=>getLatLng(result[0]))
                        .then(({lat,lng})=>{
                            setCoordinates({lat,lng})
                        })
                    }
                }}
            />
        </div>
    </div>
  )
}

export default GoogleAddressSearch