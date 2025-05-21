// app/rent/house/page.jsx
import ListingMapView from "@/app/_components/ListingMapView";

export default function RentLandPage() {
  return (
    <div className="p-[.01em] pt-[-2rem]">
      <ListingMapView action="Rent" propertyType="Land"/>
    </div>
  );
}