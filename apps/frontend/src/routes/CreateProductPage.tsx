import { useState, SetStateAction, Dispatch } from "react";
import Image from "../components/Image";
import Button from "../components/Button"
import styles from "./CreateProductPage.module.scss";
import Input from "../components/Input"
import Typography from "../components/Typography"
import Accordion from "../components/Accordion"

export default function CreateProductPage() {
  const [images, setImages] = useState<string[]>(IMAGES);
  const [accordionState, setAccordionState] = useState<boolean>(false);
  const [linkText, setLinkText] = useState<string>('');
  const [name, setName] = useState<string>("product");
  const [description, setDescription] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(0);
  const [owner, setOwner] = useState<string>('');

  return (
      <div className={styles.container}>
        <ProductPreview 
          name={name}
          description={description}
          batchSize={batchSize}
          showThumbnail={images.length > 0}
          images={images}
          owner={owner}
        />

			  <div className={styles.seperator}/>

        <div className={styles.inputs}>

          <Typography className={styles.inputTitle}> Name </Typography>
          <Input
            className={styles.inputBasic}
            type="text"
            onChange={value => setName(String(value))}
          />

          <Typography className={styles.inputTitle}> Description </Typography>
          <textarea
            className={styles.inputDescription}
            onChange={value => setDescription(String(value))}
          />

          <Typography className={styles.inputTitle}> Batch size </Typography>
          <Input
            className={styles.inputBasic}
            type="number"
            onChange={value => setBatchSize(Number(value))}
          />

          <Typography className={styles.inputTitle}> Owner </Typography>
          <Input
            className={styles.inputBasic}
            type="text"
            onChange={value => setOwner(String(value))}
          />

          <Typography className={styles.inputTitle}> Image Link </Typography>
          <Input
            className={styles.inputBasic}
            type="text"
            onChange={value => setLinkText(String(value))}
          />
          <div className={styles.addImageButton}>
            <Button
              onClick={() => setImages([...images, linkText])}
              variant="contained"
            > Add Image </Button>
          </div>

          <Accordion title="Images" open={accordionState} onToggle={setAccordionState}>
            {images.map((url, index) =>
                <AccordionEntry
                  index={index}
                  key={url + index}
                  imageUrl={url}
                  name={name}
                  setImages={setImages}
                />)}
          </Accordion>
        </div>
      </div>
  );
}

function AccordionEntry({ index, imageUrl, name, setImages } : { index: number, imageUrl: string, name: string, setImages: Dispatch<SetStateAction<string[]>>}) {
  return (
      <div className={styles.card}>
        <Image 
          className={styles.accordionImage}
          src={imageUrl}
          alt={name}
        />
        <Button 
          className={styles.accordionButton}
          onClick={() => setImages(entries => entries.filter((_, i) => i != index))}
        > Remove </Button>
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
