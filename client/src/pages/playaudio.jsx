useEffect(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;
    audio.play(); // Auto play when component mounts
  
    const handleAudioLoad = () => {
      setAudioLoaded(true);
    };
  
    audio.addEventListener('canplaythrough', handleAudioLoad);
  
    return () => {
      audio.removeEventListener('canplaythrough', handleAudioLoad);
      audio.pause();
      audio.currentTime = 0;
    };
  },); // Empty dependency array ensures this effect runs only once
return 