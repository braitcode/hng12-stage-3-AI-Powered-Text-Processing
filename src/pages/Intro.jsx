import React from 'react'
import ai from "../assets/images/Frame 33.png"
import { NavLink } from 'react-router-dom'

const Intro = () => {
  return (
    <>
      <div className="bg-white w-full h-[100vh] flex justify-center items-center">
        <div className="xl:w-[30%] border border-blue-600 lg:w-[70%] w-[95%] h-[80%] bg-white rounded-3xl p-6 flex flex-col relative">
          <div className="flex flex-col gap-20">
            <span className='flex flex-col gap-4 items-center'>
              <h1 className='text-blue-600 text-[26px] text-center items-center'>AI-Powered Text Processing Interface</h1>
              <p className='text-center text-[14px] text-gray-500'>This application enables users to input text and leverage powerful AI-driven features, including language detection, text summarization, and translation into multiple languages.  🚀</p>
            </span>
            <div className="flex justify-center">
              <img src={ai} alt="" className='' />
            </div>
            <div className="flex justify-center ">
              <NavLink to='/home'>

              <button className='bg-blue-600 w-[333px] h-[56px] rounded-2xl text-white cursor-pointer hover:bg-blue-400'>Continue →</button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Intro