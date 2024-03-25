import Lottie from 'lottie-react';
import itemLoaderRef from '../../public/itemLoader.json';
import { MdArrowBack, MdOutlineAssignment, MdOutlineNotifications, MdOutlinePayment, MdOutlineSupportAgent } from 'react-icons/md';
import { CiWallet } from 'react-icons/ci';
import { RiCoupon3Line } from 'react-icons/ri';
import { GoReport } from 'react-icons/go';
import { RxDashboard } from 'react-icons/rx';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';

export const sampleImg = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707928017/pixel_oweiao.png';

export const place = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708045670/maqete/place_qlf6zd.jpg';

export const itemLoader = <Lottie animationData={itemLoaderRef} />;

export const userList = [
  // { tag: 'My Dashboard', iconEl: <RxDashboard />, target : '' },
  { tag: 'My Orders', iconEl: <MdOutlineAssignment />, target: '/orders' },
  { tag: 'My Profile', iconEl: <CgProfile />, target: '/profile' },
  { tag: 'Notifications', iconEl: <MdOutlineNotifications />, target: '/notifications' },
  { tag: 'My Wallet', iconEl: <CiWallet />, target: '' },
  { tag: 'Payment', iconEl: <MdOutlinePayment />, target: '' },
  { tag: 'My Coupons', iconEl: <RiCoupon3Line />, target: '' },
  { tag: 'Help Center', iconEl: <MdOutlineSupportAgent />, target: '' },
  { tag: 'Disputes & Reports', iconEl: <GoReport />, target: '' }
]

export const paymentMethodList = [
  { tag: 'Paystack', img: 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707772904/Agrivestafrica/paystack_elrs9j.png' },
  { tag: 'MTN', img: 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773080/Agrivestafrica/mtn_tlljga.png' },
  { tag: 'Vodafone', img: 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773155/Agrivestafrica/voda-removebg-preview_1_c8njum.png' },
  { tag: 'AirtelTigo', img: 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773220/Agrivestafrica/airtel-removebg-preview_1_possew.png' },
  { tag: 'Visa', img: 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773591/Agrivestafrica/visa-removebg-preview_1_gvzm2h.png' },
  { tag: 'Master', img: 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773592/Agrivestafrica/master_mhgszl.webp' }
]


export const pageHeader = (title: string, target: string) => {
  return <section className='pageHeader'>
    <Link href={target} className='back'>
      <MdArrowBack />
      <strong>{title}</strong>
    </Link>
  </section>
}

export const countryList = [
  { country: 'Ghana', countryCode: 'GH', phoneCode: '233' },
  { country: 'Benin', countryCode: 'BJ', phoneCode: '229' },
  { country: 'Burkina Faso', countryCode: 'BF', phoneCode: '226' },
  { country: 'Cape Verde', countryCode: 'CV', phoneCode: '238' },
  { country: 'Côte d\'Ivoire', countryCode: 'CI', phoneCode: '225' },
  { country: 'Gambia', countryCode: 'GM', phoneCode: '220' },
  { country: 'Guinea', countryCode: 'GN', phoneCode: '224' },
  { country: 'Guinea-Bissau', countryCode: 'GW', phoneCode: '245' },
  { country: 'Liberia', countryCode: 'LR', phoneCode: '231' },
  { country: 'Mali', countryCode: 'ML', phoneCode: '223' },
  { country: 'Mauritania', countryCode: 'MR', phoneCode: '222' },
  { country: 'Niger', countryCode: 'NE', phoneCode: '227' },
  { country: 'Nigeria', countryCode: 'NG', phoneCode: '234' },
  { country: 'Senegal', countryCode: 'SN', phoneCode: '221' },
  { country: 'Sierra Leone', countryCode: 'SL', phoneCode: '232' },
  { country: 'Togo', countryCode: 'TG', phoneCode: '228' }
];