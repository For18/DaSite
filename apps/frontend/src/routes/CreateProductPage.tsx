import { useState, SetStateAction, Dispatch } from "react";
import Image from "../components/Image";
import Button from "../components/Button";
import Input from "../components/Input";
import Typography from "../components/Typography";
import Accordion from "../components/Accordion";
import { API_URL, Product, ProductImage, User } from "../lib/api";
import styles from "./CreateProductPage.module.scss";

async function PostProduct(name: string, description: string, ownerName: string, images: string[]) {
  // TODO: replace owner with ownerId and add dropdown menu to select correct user
  const userRes = await fetch(API_URL + "/users/by-name/" + ownerName);
  const userList = await userRes.json() as User[];
  const owner = userList && userList.length > 0 ? userList[0] : null;
  if (!owner) return;

  const productRes = await fetch(API_URL + "/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      description: description,
      ownerId: owner.id,
      thumbnailImageId: null
    })
  });

  const productId = (await productRes.json() as Product).id;
  if (!productId) return;

  // TODO: add thumbnail image correctly to product after rebase on commit with usePromise hook
  let thumbnailImageId: number | null = null;

  if (images.length > 0) {
    const thumbRes = await fetch(API_URL + "/product-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parent: productId,
        url: images[0]
      })
    });
    thumbnailImageId = ((await thumbRes.json()) as ProductImage).id ?? 0;
  }

  for (const url of images) {
    await fetch(API_URL + "/product-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parent: productId,
        url: url
      })
    });
  }

  if (thumbnailImageId) {
    await fetch(API_URL + "/product/" + productId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { op: "replace", path: "/ThumbnailImageId", value: thumbnailImageId }
      ])
    });
  }
}

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
          <Input
            type="textfield"
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

          {/* TODO: add `confirm` button and add product to Db */}
          <div>
            <Button
              variant="contained"
              onClick={() => {
                PostProduct(name, description, owner, images);
                setImages([]);
                setAccordionState(false);
                setLinkText('');
                setName('');
                setDescription('');
                setBatchSize(0);
                setOwner('');
                alert("i did it");
              }}
            > CONFIRM </Button>
          </div>
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
        "https://preview.redd.it/wanted-to-haunt-your-dreams-with-these-abominations-v0-68mqmhoo3a6e1.jpeg?format=pjpg&auto=webp&s=ec4452c1c6dc30e4c8c4dd69202a0bb837ebcda4"
        ,"https://randomchoicegenerator.com/wp-content/uploads/2022/12/randomjet_meme_carp_hat.jpg"
        ,"https://preview.redd.it/wanted-to-haunt-your-dreams-with-these-abominations-v0-68mqmhoo3a6e1.jpeg?format=pjpg&auto=webp&s=ec4452c1c6dc30e4c8c4dd69202a0bb837ebcda4"
        ,"https://randomchoicegenerator.com/wp-content/uploads/2022/12/randomjet_meme_carp_hat.jpg"
        ,"https://preview.redd.it/wanted-to-haunt-your-dreams-with-these-abominations-v0-68mqmhoo3a6e1.jpeg?format=pjpg&auto=webp&s=ec4452c1c6dc30e4c8c4dd69202a0bb837ebcda4"
        ,"https://randomchoicegenerator.com/wp-content/uploads/2022/12/randomjet_meme_carp_hat.jpg"
        ,"https://preview.redd.it/wanted-to-haunt-your-dreams-with-these-abominations-v0-68mqmhoo3a6e1.jpeg?format=pjpg&auto=webp&s=ec4452c1c6dc30e4c8c4dd69202a0bb837ebcda4"
        ,"https://randomchoicegenerator.com/wp-content/uploads/2022/12/randomjet_meme_carp_hat.jpg"
      ];
