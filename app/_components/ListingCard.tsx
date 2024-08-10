import { useCountires } from "@/lib/getCountries";
import Image from "next/image";
import Link from "next/link";
import { AddToFavButton, DeleteFromFavoriteButton } from "./SubmitButton";
import { addToFavorite } from "../actions";

interface IAppProps {
    imagePath: string;
    description: string;
    location: string;
    price: number;
    userId: string | undefined;
    isInfavoriteList: boolean;
    favoriteId: string;
    homeId: string;
    pathName: string;
}

export function ListingCard({ description, imagePath, location, price, userId, isInfavoriteList, favoriteId, homeId, pathName }: IAppProps) {
    const { getCountryByValue } = useCountires()
    const country = getCountryByValue(location)

    return (
        <div className="flex flex-col">
            <div className="relative h-72">
                <Image src={imagePath} alt="image" fill className="rounded-lg h-full object-cover mb-3" />
                {userId && (
                    <div className="z-10 absolute top-2 right-2">
                        {/* <Heart /> */}
                        {isInfavoriteList ? (
                            <form action="">
                                <DeleteFromFavoriteButton />
                            </form>
                        ) : (
                            <form action={addToFavorite}>
                                <input type="hidden" name="homeId" value={homeId} />
                                <input type="hidden" name="userId" value={userId} />
                                <input type="hidden" name="pathName" value={pathName} />
                                <AddToFavButton />
                            </form>

                        )}
                    </div>
                )}
            </div>
            <Link href={'/'} className="mt-2">
                <h3 className="font-medium text-base">{country?.flag} {country?.label} / {country?.label}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
                <p className="pt-2 text-muted-foreground">$<span className="font-medium text-black">{price}</span> Night</p>
            </Link>
        </div>
    )
}

// https://utfs.io/f/b730dd81-5974-4851-aa9e-610d89c5c434-izb0uk.PNG'