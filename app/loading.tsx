import Loading from '@/assets/loader.gif'
import Image from 'next/image'

const LoadingScreen = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}
    >
      <Image src={Loading} width={150} height={150} alt='Loading...' />
    </div>
  )
}

export default LoadingScreen
