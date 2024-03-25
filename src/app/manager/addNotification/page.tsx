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
import { getUnixStamp } from "@/External/services";

interface defType extends Record<string, any> { };
const AddProduct = () => {
  const icon = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1711331864/maqete/Maqete_Icon_r4r1ks.png';
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [deadline, setDeadline] = useState(0);
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [categoryList, setCategoryList] = useState<defType[]>([]);
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(icon);
  const [image, setImage] = useState<defType>({});
  const [url, setUrl] = useState('');

  useEffect(() => {
    getDocs(collection(fireStoreDB, 'Categories/'))
      .then((res) => {
        const categoryTemp: defType[] = res.docs.map((el) => ({ id: el.id, ...el.data() }))
        setCategoryList(categoryTemp);
      })
  }, [])


  // const handleCategory = (val: string) => {
  //   setCategory(val);
  // }

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

  const resetForm = () => {
    setTitle('');
    setDescription('');
  }

  const createNote = async () => {
    setIsLoading(true);
    const imageUrl = await uploadObj(image);
    if (imageUrl) {
      const stamp = new Date().getTime();
      await setDoc(doc(fireStoreDB, 'Notifications/' + title), {
        title: title,
        body: description,
        type: type,
        deadline: deadline,
        // priority: priority,
        // category: category,
        image: image,
        timestamp: stamp
      })
        .then(() => {
          alert("Notification added Successfully")
          resetForm();
          setIsLoading(false);
        })
    };
  }

  return (
    <Panel>
      <section className={styles.formBox}>
        <header>
          <h3>
            <strong className="big">Add Notification</strong>
            <sub></sub>
          </h3>
        </header>

        {!isLoading ?
          <form onSubmit={(e) => { e.preventDefault(); createNote() }}>
            <div>
              <span>Title *</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <span>Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <div>
              <span>Type *</span>
              <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option hidden>Select Type</option>
                <option value='regular'>Info</option>
                <option value='promo'>Promo</option>
              </select>
            </div>

            <div>
              <span>Deadline</span>
              <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setDeadline(getUnixStamp(e.target.value)); }} />
            </div>

            {/* <div>
              <span>Priority *</span>
              <input min={1} type="number" value={priority} onChange={(e) => setPriority(parseFloat(e.target.value))} required />
            </div> */}

            {/* <div>
              <span>Category *</span>
              <select value={category} onChange={(e) => handleCategory(e.target.value)} required>
                <option hidden>Select Category</option>
                {categoryList.map((item, i) => (
                  <option value={item.id} key={i}>{item.name}</option>
                ))}
              </select>
            </div> */}

            <section className={styles.specBox}>
              <strong>Icon</strong>
              <Image alt='Add Image' width={180} height={180} src={imagePreview} />
              <label htmlFor="addImage">
                <input className="contain" type="file" id="addImage" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImage(e.target.files![0])} required />
                <MdAddAPhoto />
              </label>
            </section>

            <div>
              <span>Url *</span>
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>

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