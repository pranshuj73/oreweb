import { QRCode } from 'react-qrcode-logo';

export default function SenderQR (props: { value: string }) {
  return (
    <div className='w-full max-w-[200px] md:max-w-[300px] lg:max-w-[400px] h-auto'>
      <QRCode logoImage={"/logo.svg"} logoPadding={10} style={{maxWidth: "200px"}} size={500} logoPaddingStyle='circle' value={props.value} eyeRadius={13} removeQrCodeBehindLogo />
    </div>
  )
}