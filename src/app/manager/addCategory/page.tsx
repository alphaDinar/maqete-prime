'use client'
import { useState } from "react";
import Panel from "../Panel/Panel";
import styles from '../forms.module.css';
import { MdAdd, MdAddAPhoto, MdDelete } from "react-icons/md";
import Image from "next/image";
import { place, sampleImg } from "@/External/lists";
import { fireStoreDB, storageDB } from "@/Firebase/base";
import { getDownloadURL, uploadBytes, ref as sRef } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

interface defType extends Record<string, any> { };
const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [brandList, setBrandList] = useState<string[]>([]);
  const [brand, setBrand] = useState<string>('');
  const [imagePreview, setImagePreview] = useState(place);
  const [image, setImage] = useState<defType>({});

  const addSpec = () => {
    if (brand.length > 0) {
      const brandListTemp = [...brandList, brand];
      setBrandList(brandListTemp);
      setBrand('');
    }
  }

  const removeSpec = (con: string) => {
    const brandListTemp = brandList.filter((item) => item != con);
    setBrandList(brandListTemp);
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


  const uploadObj = async (obj: defType) => {
    let set = null;
    const stamp = new Date().getTime();
    const objName = `${obj.name}${stamp}`;
    await uploadBytes(sRef(storageDB, 'MaqeteStorage/' + objName), obj.blob)
      .then((res) =>
        getDownloadURL(res.ref)
          .then((urlRes) => {
            image['url'] = urlRes;
            delete image.blob;
            set = urlRes
          })
          .catch((error) => console.log(error)))
    return set;
  }

  const createCategory = async () => {
    setIsLoading(true);
    const imageUrl = await uploadObj(image);
    if (imageUrl) {
      await setDoc(doc(fireStoreDB, 'Categories/' + name), {
        name: name,
        brandList: brandList,
        image: image,
        priority: 0
      })
        .then(() => {
          alert("Category added Successfully")
          resetForm();
          setIsLoading(false);
        })
    }
  }

  const resetForm = () => {
    setName('')
    setBrandList([]);
    setBrand('');
    setImagePreview(place);
    setImage({});
  }

  return (
    <Panel>
      <section className={styles.formBox}>
        <header>
          <h3>
            <strong className="big">Add Category</strong>
            <sub></sub>
          </h3>
        </header>

        {!isLoading ?
          <form onSubmit={(e) => { e.preventDefault(); createCategory() }}>
            <div>
              <span>Name *</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <section className={styles.specBox}>
              <strong>Brands</strong>

              <div>
                <input type="text" placeholder="title, eg : Samsung" value={brand} onChange={(e) => setBrand(e.target.value)} />
                <MdAdd onClick={addSpec} />
              </div>

              <div className={styles.specPreview}>
                {brandList.map((spec, i) => (
                  <article key={i}>
                    <h4>- {spec}</h4>
                    <MdDelete onClick={() => removeSpec(spec)} />
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.specBox}>
              <strong>Image</strong>
              <Image alt='Add Image' width={180} height={180} src={imagePreview} />
              <label htmlFor="addImage">
                {
                  image.format === 'jpeg' ?
                    <input className="cover" type="file" id="addImage" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImage(e.target.files![0])} required />
                    :
                    <input className="contain" type="file" id="addImage" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImage(e.target.files![0])} required />
                }
                <MdAddAPhoto />
              </label>
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

export default AddCategory;