import { useState } from "react";



function App() {

  const [playing, setPlaying] = useState(false);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };
  return (
    <>
      <div>
       <h2 className="text-blue-700">Hello world</h2>
      </div>
    </>
  )
}

export default App
