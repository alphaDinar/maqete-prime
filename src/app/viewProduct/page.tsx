'use client';
import Image from "next/image";
import TopNav from "../components/TopNav/TopNav";
import styles from './viewProduct.module.css';
import { MdOutlineAddShoppingCart, MdOutlineFavoriteBorder } from "react-icons/md";
import { VscDebugBreakpointDataUnverified } from "react-icons/vsc";
import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbTruckReturn } from "react-icons/tb";
import { GiTakeMyMoney } from "react-icons/gi";
import { addToCart } from "@/External/services";
import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import WishListTag from "../components/WishListTag/WishListTag";

interface defType extends Record<string, any> { };
const ViewProduct = ({ searchParams }: { searchParams: { pid: string } }) => {
  const pid = searchParams.pid;
  const [product, setProduct] = useState<defType>({});
  const [displayMedia, setDisplayMedia] = useState<defType>({});
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProductStream = onSnapshot(doc(fireStoreDB, 'Products/' + pid), (prod) => {
      if (prod.exists()) {
        setProduct({ id: prod.id, ...prod.data() });
        setDisplayMedia(prod.data().image);
      }
      setIsLoading(false);
    });

    updateDoc(doc(fireStoreDB, 'Products/' + pid), {
      views: increment(1)
    })

    return () => getProductStream();
  }, [pid]);

  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708791507/maqete/samp_kqdepy.png';
  const sample2 = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567337/maqete/modern-stationary-collection-arrangement_23-2149309652_hkfbcn.jpg';
  const air = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567577/maqete/MPNY3-removebg-preview_o1rd8i.png'

  return (
    <main className="scroll">
      <TopNav />
      {!isLoading ?
        <>
          <section className={styles.productBox} id="box">
            <section className={styles.left}>
              <div className={styles.imgBox}>
                {displayMedia.type === 'image' ?
                  <div>
                    {displayMedia.format === 'png' ?
                      <Image className="contain" alt="" fill sizes="auto" src={displayMedia.url} />
                      :
                      <Image className="cover" alt="" fill sizes="auto" src={displayMedia.url} />
                    }
                  </div>
                  :
                  <div>
                    <video autoPlay muted controls loop src={displayMedia.url}></video>
                  </div>}
              </div>
              <div className={styles.thumbs}>
                <div className={styles.thumb} onClick={() => setDisplayMedia(product.image)}>
                  {product.image.format === 'jpeg' ?
                    <Image className="cover" alt="" fill sizes="auto" src={product.image.url} />
                    :
                    <Image className="contain" alt="" fill sizes="auto" src={product.image.url} />
                  }
                </div>
                {product.mediaSet.map((item: defType, i: number) => (
                  item.url !== 'empty' ?
                    item.type === 'image' ?
                      <div key={i} className={styles.thumb} onClick={() => setDisplayMedia(item)}>
                        {item.format === 'png' ?
                          <Image className="contain" alt="" fill sizes="auto" src={item.url} />
                          :
                          <Image className="cover" alt="" fill sizes="auto" src={item.url} />
                        }
                      </div>
                      :
                      <div key={i} className={styles.thumb} onClick={() => setDisplayMedia(item)}>
                        <video src={item.url}></video>
                      </div>
                    :
                    <div style={{ display: 'none' }} key={i}></div>
                ))}

              </div>
            </section>

            <section className={styles.right}>
              <h3>{product.name}</h3>
              <small>{product.description}</small>
              <article className={styles.priceBox}>
                {product.storePrice && <span className="big">GHS {product.storePrice.toLocaleString()}</span>}
                <strong className="big">GHS {product.price.toLocaleString()}</strong>
              </article>

              <div className={styles.productControl}>
                <p>
                  <button onClick={() => { addToCart(product, quantity), setQuantity(1) }}>Add To Cart <MdOutlineAddShoppingCart /> </button>
                  <input className="big" type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                </p>

                <sup className={styles.wishList}>
                  <WishListTag pid={product.id} />
                </sup>
              </div>

              <p className={styles.stars}>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                (60)
              </p>

              <legend>
                <CiDeliveryTruck />
                <span>Product Will arrive in 2 days.</span>
              </legend>

              <legend>
                <TbTruckReturn />
                {product.returnPolicy > 0 ?
                  <span>This product can be returned after {product.returnPolicy} days under right conditions.</span>
                  :
                  <span>This product has no return policy</span>
                }
              </legend>

              <legend>
                <GiTakeMyMoney />
                <span>Free Delivery</span>
              </legend>
            </section>
          </section>

          <section className={styles.extraBox} id="box">
            <div className={styles.ratingBox}>
              <h4>Product Reviews</h4>

              <section>
                <div className={styles.review}>
                  <article>
                    <Image className="cover" style={{ borderRadius: 10 }} src={sample} alt="" width={70} height={70} />
                    <p>
                      <span>James Arthur</span>
                      <legend>
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </legend>
                      <small>Great item, really loved it 5 stars from me</small>
                    </p>
                  </article>
                  <article>
                    <Image className="cover" style={{ borderRadius: 10 }} src={sample2} alt="" width={40} height={40} />
                    <Image className="cover" style={{ borderRadius: 10 }} src={sample2} alt="" width={40} height={40} />
                    <Image className="cover" style={{ borderRadius: 10 }} src={sample2} alt="" width={40} height={40} />
                  </article>
                </div>
                <div className={styles.review}>
                  <article>
                    <Image className="cover" style={{ borderRadius: 10 }} src={sample} alt="" width={70} height={70} />
                    <p>
                      <span>James Arthur</span>
                      <legend>
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </legend>
                      <small>Great item, really loved it 5 stars from me</small>
                    </p>
                  </article>
                  <article>
                    <Image className="cover" style={{ borderRadius: 10 }} src={sample2} alt="" width={40} height={40} />
                    <Image className="cover" style={{ borderRadius: 10 }} src={sample2} alt="" width={40} height={40} />
                    <Image className="cover" style={{ borderRadius: 10 }} src={sample2} alt="" width={40} height={40} />
                  </article>
                </div>
              </section>
            </div>
            <div className={styles.specBox}>
              <h2>Specifications</h2>
              <section>
                {product.specList.map((spec: defType, i: number) => (
                  <article key={i}>
                    <h4>{spec.title}</h4>
                    <ul>
                      {spec.con.split(',').map((con: string, ii: number) => (
                        <small key={ii}><VscDebugBreakpointDataUnverified /> {con}</small>
                      ))}
                    </ul>
                  </article>
                ))}
              </section>
            </div>
          </section>

          <section>Related Box</section>
        </> :
        <span>loading...</span>
      }

    </main>
  );
}

export default ViewProduct;