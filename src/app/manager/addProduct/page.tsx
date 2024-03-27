'use client'
import { useEffect, useState } from "react";
import Panel from "../Panel/Panel";
import styles from '../forms.module.css';
import { MdAdd, MdAddAPhoto, MdDelete } from "react-icons/md";
import Image from "next/image";
import { place, sampleImg } from "@/External/lists";
import { GrMultimedia } from "react-icons/gr";
import { fireStoreDB, storageDB } from "@/Firebase/base";
import { getDownloadURL, uploadBytes, ref as sRef } from "firebase/storage";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getUnixStamp } from "@/External/time";

interface defType extends Record<string, any> { };
const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [storePrice, setStorePrice] = useState(0);
  const [price, setPrice] = useState(1);
  const [type, setType] = useState('');
  const [deadline, setDeadline] = useState(0);
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [categoryList, setCategoryList] = useState<defType[]>([]);
  const [category, setCategory] = useState('');
  const [brandList, setBrandList] = useState([]);
  const [brand, setBrand] = useState('');
  const [returnPolicy, setReturnPolicy] = useState(0);
  const [stockCount, setStockCount] = useState(1);
  const [specTitle, setSpecTitle] = useState('');
  const [specCon, setSpecCon] = useState('');
  const [specList, setSpecList] = useState<defType[]>([]);
  const [imagePreview, setImagePreview] = useState(place);
  const [image, setImage] = useState<defType>({});
  const [mediaSet, setMediaSet] = useState(Array(3).fill({ type: 'image', format: 'png' }));
  const [mediaPreviewSet, setMediaPreviewSet] = useState<string[]>(Array(3).fill(place));

  useEffect(() => {
    getDocs(collection(fireStoreDB, 'Categories/'))
      .then((res) => {
        const categoryTemp: defType[] = res.docs.map((el) => ({ id: el.id, ...el.data() }))
        setCategoryList(categoryTemp);
      })
  }, [])

  const addSpec = () => {
    if (specTitle.length > 0, specCon.length > 0) {
      const specObj = { title: specTitle, con: specCon };
      const specListTemp = [...specList, specObj];
      setSpecList(specListTemp);
      setSpecTitle('');
      setSpecCon('');
    }
  }

  const removeSpec = (con: string) => {
    const specListTemp = specList.filter((spec) => spec.con != con);
    setSpecList(specListTemp);
  }

  const handleCategory = (val: string) => {
    setCategory(val);
    setBrandList(categoryList.find((el) => el.id === val)!.brandList);
  }

  const handleImage = (media: File) => {
    if (media.type.split('/')[1] !== 'png') {
      alert(`File format must be png`);
    } else {
      if (media.size / 1000 > 200) {
        alert(`${media.size / 1000}kb File size exceeded, max of 200 kb`);
      } else {
        const imageData = {
          name: media.name,
          type: media.type.split('/')[0],
          format: media.type.split('/')[1],
          blob: media
        }
        setImage(imageData);
        setImagePreview(URL.createObjectURL(media));
      }
    }
  }

  const handleMediaSet = (media: File, i: number) => {
    if (media.size / 1000 > 3000) {
      alert(`${media.size / 10000}mb File size exceeded, max of 3 mb`);
    } else {
      const mediaPrevTemp = [...mediaPreviewSet];
      mediaPrevTemp[i] = URL.createObjectURL(media);
      setMediaPreviewSet(mediaPrevTemp);
      const mediaSetTemp = [...mediaSet];
      mediaSetTemp[i] = {
        name: media.name,
        type: media.type.split('/')[0],
        format: media.type.split('/')[1],
        blob: media,
      };
      setMediaSet(mediaSetTemp);
    }
  }

  const uploadObj = async (obj: defType) => {
    let set = null;
    const stamp = new Date().getTime();
    const objName = `${obj.name}${stamp}`;
    await uploadBytes(sRef(storageDB, 'MaqProducts/' + objName), obj.blob)
      .then((res) =>
        getDownloadURL(res.ref)
          .then((urlRes) => {
            image['url'] = urlRes;
            delete image.blob
            set = urlRes
          })
          .catch((error) => console.log(error)))
    return set;
  }

  const uploadSet = (mediaSet: defType[]) => {
    const uploadPromises = mediaSet.map((media) => {
      if (media.blob) {
        return uploadBytes(sRef(storageDB, 'MaqProducts/' + media.name), media.blob)
          .then((res) => getDownloadURL(res.ref))
          .catch((error) => console.log(error))
      } else {
        return Promise.resolve('empty');
      }
    })

    return Promise.all(uploadPromises)
      .then((urls) => {
        urls.forEach((urlRes, i) => {
          if (urlRes) {
            mediaSet[i] = {
              ...mediaSet[i],
              url: urlRes
            }
            delete mediaSet[i].blob;
          }
        });
        return mediaSet;
      });
  }

  const createProduct = async () => {
    setIsLoading(true);
    const imageUrl = await uploadObj(image);
    if (imageUrl) {
      await uploadSet(mediaSet)
        .then(async () => {
          const stamp = new Date().getTime();
          const pid = `pid${stamp}`;
          await setDoc(doc(fireStoreDB, 'Products/' + pid), {
            name: name,
            displayName: displayName,
            description: description,
            storePrice: storePrice,
            price: price,
            type: type,
            deadline: deadline,
            priority: priority,
            category: category,
            brand: brand,
            returnPolicy: returnPolicy,
            stockCount: stockCount,
            specList: specList,
            image: image,
            mediaSet: mediaSet,
            views: 0,
            wishListed: 0,
            ratings: [],
            timestamp: stamp
          })
            .then(() => {
              alert("Product added Successfully")
              resetForm();
              setIsLoading(false);
            })
        });
    }
  }

  const resetForm = () => {
    setName('');
    setDisplayName('');
    setDescription('');
    setPrice(1);
    setReturnPolicy(0);
    setStockCount(1);
    setSpecTitle('');
    setSpecCon('');
    setSpecList([]);
    setImagePreview(place);
    setImage({});
    setMediaSet(Array(3).fill({ type: 'image', format: 'png' }));
    setMediaPreviewSet(Array(3).fill(place));
  }

  return (
    <Panel>
      <section className={styles.formBox}>
        <header>
          <h3>
            <strong className="big">Add Product</strong>
            <sub></sub>
          </h3>
        </header>

        {!isLoading ?
          <form onSubmit={(e) => { e.preventDefault(); createProduct() }}>
            <div>
              <span>Name *</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <span>Display Name *</span>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>

            <div>
              <span>Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <div>
              <span>Store Price</span>
              <input min={0} type="number" value={storePrice} onChange={(e) => setStorePrice(parseFloat(e.target.value))} />
            </div>

            <div>
              <span>Price *</span>
              <input min={1} type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
            </div>

            <div>
              <span>Type *</span>
              <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option hidden>Select Type</option>
                <option value='regular'>Regular</option>
                <option value='promo'>Promo</option>
              </select>
            </div>

            <div>
              <span>Deadline *</span>
              <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setDeadline(getUnixStamp(e.target.value)); }} required />
            </div>

            <div>
              <span>Priority *</span>
              <input min={1} type="number" value={priority} onChange={(e) => setPriority(parseFloat(e.target.value))} required />
            </div>

            <div>
              <span>Category *</span>
              <select value={category} onChange={(e) => handleCategory(e.target.value)} required>
                <option hidden>Select Category</option>
                {categoryList.map((item, i) => (
                  <option value={item.id} key={i}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <span>Brand *</span>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} required>
                <option hidden>Select Brand</option>
                <option value="other">Other</option>
                {brandList.map((item, i) => (
                  <option value={item} key={i}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <span>Return Policy *</span>
              <input type="number" placeholder="Leave 0 if none" value={returnPolicy} onChange={(e) => setReturnPolicy(parseFloat(e.target.value))} required />
            </div>

            <div>
              <span>Stock Count *</span>
              <input min={1} type="number" value={stockCount} onChange={(e) => setStockCount(parseFloat(e.target.value))} required />
            </div>

            <section className={styles.specBox}>
              <strong>Specs</strong>

              <div>
                <input type="text" placeholder="title, eg : Sizes" value={specTitle} onChange={(e) => setSpecTitle(e.target.value)} />
                <input type="text" placeholder="content, eg : Small , Medium i : separate multiple with 'commas' " value={specCon} onChange={(e) => setSpecCon(e.target.value)} />
                <MdAdd onClick={addSpec} />
              </div>

              <div className={styles.specPreview}>
                {specList.map((spec, i) => (
                  <article key={i}>
                    <h4>- {spec.title}</h4>
                    <ul>
                      {spec.con.split(',').map((con: string, ii: number) => (
                        <li key={ii}>{con}</li>
                      ))}
                    </ul>
                    <MdDelete onClick={() => removeSpec(spec.con)} />
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.specBox}>
              <strong>Display Image</strong>
              <Image alt='Add Image' width={180} height={180} src={imagePreview} />
              <label htmlFor="addImage">
                <input className="contain" type="file" id="addImage" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImage(e.target.files![0])} required />
                <MdAddAPhoto />
              </label>
            </section>

            <section className={styles.mediaBox}>
              <strong>Media Set</strong>
              <section className={styles.mediaSet}>
                {mediaSet.map((el, i) => (
                  <article key={i}>
                    {mediaSet[i].type === 'image' ?
                      mediaSet[i].format === 'jpeg' ? <Image className="cover" alt='Add Image' width={250} height={250} src={mediaPreviewSet[i]} />
                        : <Image alt='Add Image' className="contain" width={250} height={250} src={mediaPreviewSet[i]} />
                      :
                      <video muted autoPlay loop src={mediaPreviewSet[i]} width={250} height={250} />
                    }
                    <label htmlFor={`addMedia${i}`}>
                      <input type="file" accept="image/*,video/*" id={`addMedia${i}`} style={{ display: 'none' }} onChange={(e) => handleMediaSet(e.target.files![0], i)} />
                      <GrMultimedia />
                    </label>
                  </article>
                ))}
              </section>
            </section>
            <button>Done</button>
          </form>
          :
          <section>Loading</section>
        }
      </section>
    </Panel>
  );
}

export default AddProduct;