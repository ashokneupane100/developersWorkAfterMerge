// app/buy/house/page.jsx
import ListingMapView from "@/app/_components/ListingMapView";

export default function BuyLandPage() {
  return (
    <div className="p-[.01em] pt-[-2rem]">
      <ListingMapView action="Sell" propertyType="Land"/>
    </div>
  );
}