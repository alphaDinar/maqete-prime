import Lottie from 'lottie-react';
import itemLoaderRef from '../../public/itemLoader.json';
import { MdOutlineAssignment, MdOutlineNotifications, MdOutlinePayment, MdOutlineSupportAgent } from 'react-icons/md';
import { CiWallet } from 'react-icons/ci';
import { RiCoupon3Line } from 'react-icons/ri';
import { GoReport } from 'react-icons/go';
import { RxDashboard } from 'react-icons/rx';

export const sampleImg = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707928017/pixel_oweiao.png';

export const place = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708045670/maqete/place_qlf6zd.jpg';

export const itemLoader = <Lottie animationData={itemLoaderRef} />;

export const userList = [
  { tag: 'My Dashboard', iconEl: <RxDashboard /> },
  { tag: 'My Orders', iconEl: <MdOutlineAssignment /> },
  { tag: 'Notifications', iconEl: <MdOutlineNotifications /> },
  { tag: 'My Wallet', iconEl: <CiWallet /> },
  { tag: 'Payment', iconEl: <MdOutlinePayment /> },
  { tag: 'My Coupons', iconEl: <RiCoupon3Line /> },
  { tag: 'Help Center', iconEl: <MdOutlineSupportAgent /> },
  { tag: 'Disputes & Reports', iconEl: <GoReport /> }
]

export const paymentMethodList = [
  {tag : 'Paystack', img : 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707772904/Agrivestafrica/paystack_elrs9j.png'},
  {tag : 'MTN', img : 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773080/Agrivestafrica/mtn_tlljga.png'},
  {tag : 'Vodafone', img : 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773155/Agrivestafrica/voda-removebg-preview_1_c8njum.png'},
  {tag : 'AirtelTigo', img : 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773220/Agrivestafrica/airtel-removebg-preview_1_possew.png'},
  {tag : 'Visa', img : 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773591/Agrivestafrica/visa-removebg-preview_1_gvzm2h.png'},
  {tag : 'Master', img : 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1707773592/Agrivestafrica/master_mhgszl.webp'}
]