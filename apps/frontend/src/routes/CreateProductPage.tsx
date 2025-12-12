import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Accordion from "../components/Accordion";
import Button from "../components/Button";
import Image from "../components/Image";
import Input from "../components/Input";
import { Option, Select } from "../components/Select";
import Typography from "../components/Typography";
import { API_URL, ProductImage, User } from "../lib/api";
import styles from "./CreateProductPage.module.scss";
import { Routes } from "./Routes"

// TODO: add visual status for user
async function PostProduct(name: string, description: string, images: string[], owner: User | null) {
    const productId: number = await fetch(API_URL + Routes.Product.Post, {
		            method: "POST",
		            headers: { "Content-Type": "application/json" },
		            body: JSON.stringify({
		          	name: name,
		          	description: description,
		          	ownerId: owner?.id,
		          	thumbnailImageId: null})
	            })
              .then(response => response.json())
              .then(data => data as number)
              .then(id => id);

    await fetch(API_URL + Routes.ProductImage.BatchPost, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(images.map(url => JSON.stringify({parent: productId, url: url})))
    })

    const imageIds: number[] = await fetch(API_URL + Routes.ProductImage.FromParent(productId), {
		  method: "GET",
		  headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => data as ProductImage[])
    .then(images => images.map(image => image.id));

    if (imageIds.length >= 1) {
      await fetch(API_URL + Routes.Product.Patch(productId), {
		    method: "PATCH",
		    headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          op: "replace",
          path: "thumbnailImage",
          value: imageIds[0]
        })
      }) 
    }
}

export default function CreateProductPage() {
	const [images, setImages] = useState<string[]>([]);
	const [accordionState, setAccordionState] = useState<boolean>(false);
	const [linkText, setLinkText] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [batchSize, setBatchSize] = useState<number>(0);

	const [ownerSearchValue, setOwnerSearchValue] = useState<string>("");
	const foundUsersIndexRef = useRef<number>(0);
	const [owner, setOwner] = useState<User | null>(null);
	const [foundUsers, setFoundUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch(API_URL + Routes.User.GetAllByName(ownerSearchValue))
    .then(response => response.json())
    .then(data => data as User[])
    .then(users => setFoundUsers(users))
  }, [ownerSearchValue]);

	return (
		<div className={styles.container}>
			<ProductPreview
				name={name}
				description={description}
				batchSize={batchSize}
				showThumbnail={images.length > 0}
				images={images}
				owner={owner?.userName}
			/>

			<div className={styles.seperator}/>

			<div className={styles.inputs}>
				<Typography className={styles.inputTitle}>Name</Typography>
				<Input
					className={styles.inputBasic}
					type="text"
					value={name}
					onChange={value => setName(String(value))}
				/>

				<Typography className={styles.inputTitle}>Description</Typography>
				<Input
					type="textfield"
					value={description}
					className={styles.inputDescription}
					onChange={value => setDescription(String(value))}
				/>

				<Typography className={styles.inputTitle}>Batch size</Typography>
				<Input
					className={styles.inputBasic}
					value={String(batchSize)}
					type="number"
					onChange={value => setBatchSize(Number(value))}
				/>

				<Typography className={styles.inputTitle}>Owner</Typography>
				<div>
					<Input
						className={styles.inputBasic}
						placeholder="Search for Users"
						value={ownerSearchValue}
						type="text"
						onChange={value => setOwnerSearchValue(value)}
					/>
					<Select
						value={owner?.userName.length == 0 ? null : owner?.userName ?? null}
						onChange={(value: string) => {
							foundUsersIndexRef.current = Number(value);
							setOwner(foundUsers[foundUsersIndexRef.current]);
						}}
						placeholder="Select a User"
					>
						{foundUsers.map((entry, index) => (
							<Option key={entry.id} value={String(index)}>{entry.userName}</Option>
						))}
					</Select>
				</div>

				<Typography className={styles.inputTitle}>Image Link</Typography>
				<Input
					className={styles.inputBasic}
					value={linkText}
					type="text"
					onChange={value => setLinkText(String(value))}
				/>
				<div className={styles.addImageButton}>
					<Button
						onClick={() => setImages([...images, linkText])}
						variant="contained"
					>
						Add Image
					</Button>
				</div>

				<Accordion title="Images" open={accordionState} onToggle={setAccordionState}>
					{images.map((url, index) => (
						<AccordionEntry
							index={index}
							key={url + index}
							imageUrl={url}
							name={name}
							setImages={setImages}
						/>
					))}
				</Accordion>

				<div>
					<Button
						variant="contained"
						onClick={() => {
							PostProduct(name, description, images, owner);
							setImages([]);
							setAccordionState(false);
							setLinkText("");
							setName("");
							setDescription("");
							setBatchSize(0);
							setOwner(null);
							alert("Product added");
						}}
					>
						CONFIRM
					</Button>
				</div>
			</div>
		</div>
	);
}

function AccordionEntry(
	{ index, imageUrl, name, setImages }: { index: number, imageUrl: string, name: string,
		setImages: Dispatch<SetStateAction<string[]>> }
) {
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
			>
				Remove
			</Button>
		</div>
	);
}

function ProductPreview(
	{ name, description, showThumbnail, batchSize, images, owner }: { name: string, description: string,
		showThumbnail?: boolean, batchSize?: number, images: string[], owner?: string }
) {
	return (
		<div className={styles.productPreview}>
			<div>
				<Typography heading={1}>{name == "" ? "Product Name" : name}</Typography>
				<Typography className={styles.seller}>
					Seller: {owner ? owner : "Seller not found"}
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
				<Typography>{description == "" ? "Description" : description}</Typography>
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
