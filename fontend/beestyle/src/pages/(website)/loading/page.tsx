import React from 'react'

type Props = {}

const LoadingPage = (props: Props) => {
  return (
    <div className="fixed z-20 top-0 left-0 w-full h-[100%] text-center bg-black bg-opacity-[0.5]">
      <div className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage