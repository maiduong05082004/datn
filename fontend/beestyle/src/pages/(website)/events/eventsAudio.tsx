import React, { useEffect, useRef, useState } from 'react'

type Props = {}

const EventsAudio = (props: Props) => {

  const audioRef1 = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audioRef1.current) {
      audioRef1.current.volume = 0.4
      audioRef1.current.play().catch((error: any) => {
        console.log("Không thể phát âm thanh tự động.", error);
      });
    }
  };

  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 10000);
    })
  };

  return (
    <div>
      <div onClick={() => { playAudio(), handleClick() }}>
        <div className="animate-bounce cursor-pointer w-[60px] h-[60px] fixed bottom-0 z-40 bg-cover bg-center bg-no-repeat " style={{ backgroundImage: `url(https://res.cloudinary.com/dg4yxsmhs/image/upload/v1731257004/soavd5q9ummqwzcfl6cv.png` }}>
        </div>
      </div>
      <audio ref={audioRef1} src="https://res.cloudinary.com/dg4yxsmhs/video/upload/v1731396227/eusjauwtoi10hzzhg847.mp3" preload="auto" />
      <div className={`w-[100%] bottom-0 z-50 ${isAnimating ? 'marquee' : ''}`}>
        <img
          src="https://vector6.com/wp-content/uploads/2022/02/png0000706-ong-gia-noel-xe-keo-tuan-loc-giang-sinh-file-png.png"
          alt="Santa with Reindeer"
          className='fixed bottom-0 z-50 w-[200px] -left-[40%] lg:w-[300px]'
        />
      </div>
    </div>
  )
}

export default EventsAudio