import { useState, useRef, SetStateAction, Dispatch } from "react";
import Image from "../components/Image";
import Button from "../components/Button"
import styles from "./CreateProductPage.module.scss";
import Typography from "../components/Typography"
import Accordion from "../components/Accordion"

export default function CreateProductPage() {
  const [images, setImages] = useState<string[]>(IMAGES);
  const [accordionState, setAccordionState] = useState<boolean>(false);
  const linkTextRef = useRef<string>('');
  const nameRef = useRef<string>("product");
  const descriptionRef = useRef<string>('');
  const batchSizeRef = useRef<number>(0);
  const ownerRef = useRef<string>('');

  return (
      <div className={styles.container}>
        <ProductPreview 
          name={nameRef.current}
          description={descriptionRef.current}
          batchSize={batchSizeRef.current}
          showThumbnail={images.length > 0}
          images={images}
          owner={"You"}
        />

			  <div className={styles.seperator}/>

        <div className={styles.inputs}>

          <Typography className={styles.inputTitle}> Name </Typography>
          <input
            className={styles.inputBasic}
            type="text"
            onChange={value => nameRef.current = String(value)}
          />

          <Typography className={styles.inputTitle}> Description </Typography>
          <textarea
            className={styles.inputDescription}
            onChange={value => descriptionRef.current = String(value)}
          />

          <Typography className={styles.inputTitle}> Batch size </Typography>
          <input
            className={styles.inputBasic}
            type="number"
            onChange={value => batchSizeRef.current = Number(value)}
          />

          <Typography className={styles.inputTitle}> Owner </Typography>
          <input
            className={styles.inputBasic}
            type="text"
            onChange={value => ownerRef.current = String(value)}
          />

          <Typography className={styles.inputTitle}> Image Link </Typography>
          <input
            className={styles.inputBasic}
            type="text"
            onChange={value => linkTextRef.current = String(value)}
          />
          <div className={styles.addImageButton}>
            <Button
              onClick={() => setImages([...images, linkTextRef.current])}
              variant="contained"
            > Add Image </Button>
          </div>

          <Accordion title="Images" open={accordionState} onToggle={setAccordionState}>
            {images.map((url, index) =>
                <AccordionEntry
                  key={url + index}
                  imageUrl={url}
                  name={nameRef.current}
                  setImages={setImages}
                />)}
          </Accordion>
        </div>
      </div>
  );
}

function AccordionEntry({ imageUrl, name, setImages } : { imageUrl: string, name: string, setImages: Dispatch<SetStateAction<string[]>>}) {
  return (
      <div className={styles.card}>
        <Image 
          className={styles.accordionImage}
          src={imageUrl}
          alt={name}
        />
        <Button 
          className={styles.accordionButton}
          onClick={
            () => setImages(entries => entries.filter(url => url != imageUrl))
          }> Remove </Button>
      </div>
  );
}

function ProductPreview (
    { name, description, showThumbnail, batchSize, images, owner}: { name: string, description: string, showThumbnail?: boolean, batchSize?: number, images: string[], owner?: string}
) {
    return (
        <div className={styles.productPreview}>
            <div>
                <Typography heading={1}>{name}</Typography>
                <Typography className={styles.seller}>
                    Seller: {owner? owner : "Seller not found"}
                </Typography>
            </div>

            {batchSize == null ?
                null :
                (
                    <div>
                        <>
                            <hr className={styles.horizontalRule}/>
                            <Typography>Batch size: {batchSize}</Typography>
                        </>
                    </div>
                )}

            <hr className={styles.horizontalRule}/>

            <div>
                <Typography>{description}</Typography>
            </div>

            {images[0] && showThumbnail ?
                (
                    <>
                        <hr className={styles.horizontalRule}/>
                        <Image
                            className={styles.thumbnailImage}
                            src={images[0]}
                            alt={name}
                        />
                    </>
                ) :
                null}

            <div className={styles.extraImageContainer}>
                {images.map((url, index) => (
                    <div key={index}>
                        <a href={url}>
                            <Image
                                className={styles.extraImage}
                                src={url}
                                alt={`Product Image ${index + 1}`}
                            />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

const IMAGES = 
      [
        "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-r47dwj0aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=0f4f8d6b24ec503f45d8a71c48dd2084af492d39"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"
        , "https://preview.redd.it/the-most-random-image-every-seen-in-the-history-of-the-v0-iuzrc59aw2sb1.jpg?width=1024&format=pjpg&auto=webp&s=dd018a25303363415b10f1906c2d4b25fa47043f"

      ];
